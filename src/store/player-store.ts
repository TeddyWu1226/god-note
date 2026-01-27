import {defineStore} from 'pinia';
import {ref, computed, nextTick} from 'vue';
import type {UserType, Equipment, EquipmentType, StatusEffect, ItemStackType} from '@/types';
import {DEFAULT_USER_INFO} from '@/constants/default-const';
import {create} from "@/utils/create";
import {useLogStore} from "@/store/log-store";
import {Potions} from "@/constants/items/usalbe-item/potion-info";
import {Warrior1SkillEvolutionMap} from "@/constants/skill/char-skill/warrior-skill";
import {CharEnum} from "@/enums/char-enum";
import {Wizard1SkillEvolutionMap} from "@/constants/skill/char-skill/wizard-skill";
import {UnitStatus} from "@/constants/status/unit-status";
import {checkProbability} from "@/utils/math";
import {ItemStatus} from "@/constants/status/item-status";

const MAX_SKILLS = 5
export const usePlayerStore = defineStore('player-info', () => {
    // --- State ---
    const info = ref<UserType>(JSON.parse(JSON.stringify(DEFAULT_USER_INFO)));
    const pendingLevelUpRewards = ref(0); // 升級獎勵次數
    const remainingLevelUpRewards = ref([]);
    const stopValueChangeAnimation = ref<boolean>(false);
    const statusEffects = ref<StatusEffect[]>([]);
    const skillProficiency = ref<{ [key: string]: number }>({})

    // --- Getters ---
    const totalBonus = computed(() => {
        const bonus: Record<string, number> = {
            ad: 0,
            critIncrease: 0,
            critRate: 0,
            adDefend: 0,
            dodge: 0,
            hit: 0,
            hpLimit: 0,
            spLimit: 0,
            adIncrease: 0,
            apIncrease: 0,
            defendIncrease: 0,
            runIncrease: 0,
            lifeSteal: 0
        };
        // 計算裝備加成
        if (info.value.equips) {
            Object.values(info.value.equips).forEach((item) => {
                if (item) {
                    Object.keys(bonus).forEach(key => {
                        const value = (item as any)[key];
                        if (typeof value === 'number') bonus[key] += value;
                    });
                }
            });
        }
        // 計算狀態 (Buff/Debuff) 加成
        statusEffects.value.forEach(effect => {
            if (effect.bonus) {
                Object.keys(effect.bonus).forEach(key => {
                    const val = effect.bonus[key];
                    if (typeof val === 'number') {
                        bonus[key] += val;
                    }
                });
            }
        });
        return bonus;
    });

    const finalStats = computed(() => {
        const b = totalBonus.value;
        return {
            ...info.value,
            ad: Math.max(0, info.value.ad + b.ad),
            adDefend: Math.max(0, info.value.adDefend + b.adDefend),
            dodge: info.value.dodge + b.dodge,
            critRate: info.value.critRate + b.critRate,
            critIncrease: info.value.critIncrease + b.critIncrease,
            hit: info.value.hit + b.hit,
            hpLimit: info.value.hpLimit + b.hpLimit,
            spLimit: info.value.spLimit + b.spLimit,
            adIncrease: info.value.adIncrease + b.adIncrease,
            apIncrease: info.value.apIncrease + b.apIncrease,
            defendIncrease: info.value.defendIncrease + b.defendIncrease,
            runIncrease: info.value.runIncrease + b.runIncrease,
            lifeSteal: info.value.lifeSteal + b.lifeSteal,
        };
    });

    // --- Actions ---
    /**
     * 檢查背包中是否有指定名稱或 ID 的道具
     * @param itemName 道具名稱
     * @param amount 需要的數量 (預設為 1)
     */
    const hasItem = (itemName: string, amount: number = 1): [boolean, number] => {
        // 裝備依舊是陣列長度
        const equipCount = (info.value.equipments || []).filter(i => i.name === itemName).length;

        // 堆疊物品則加總 count
        const getStackCount = (list: ItemStackType[] = []) =>
            list.filter(i => i.item.name === itemName).reduce((sum, i) => sum + i.count, 0);

        const totalCount = equipCount + getStackCount(info.value.items) + getStackCount(info.value.consumeItems);

        return [totalCount >= amount, totalCount];
    };
    /**
     * 移除指定名稱的道具
     * @param itemName 道具名稱
     * @param amount 要移除的個數，傳入 -1 則移除所有同名道具
     */
    const removeItem = (itemName: string, amount: number = 1): boolean => {
        const isRemoveAll = amount === -1;
        if (!isRemoveAll && !hasItem(itemName, amount)[0]) return false;

        let remainingToRemove = amount;

        // 1. 先從 裝備背包 移除 (非堆疊)
        if (info.value.equipments) {
            for (let i = info.value.equipments.length - 1; i >= 0; i--) {
                if (info.value.equipments[i].name === itemName) {
                    info.value.equipments.splice(i, 1);
                    if (!isRemoveAll) {
                        remainingToRemove--;
                        if (remainingToRemove <= 0) return true;
                    }
                }
            }
        }

        // 2. 從 堆疊背包 (items, consumeItems) 移除
        const stackBags: ('items' | 'consumeItems')[] = ['consumeItems', 'items'];
        for (const key of stackBags) {
            const bag = info.value[key] as ItemStackType[];
            if (!bag) continue;

            for (let i = bag.length - 1; i >= 0; i--) {
                if (bag[i].item.name === itemName) {
                    if (isRemoveAll) {
                        bag.splice(i, 1);
                    } else {
                        const canTake = Math.min(bag[i].count, remainingToRemove);
                        bag[i].count -= canTake;
                        remainingToRemove -= canTake;

                        if (bag[i].count <= 0) bag.splice(i, 1);
                        if (remainingToRemove <= 0) return true;
                    }
                }
            }
        }

        return isRemoveAll || remainingToRemove <= 0;
    };
    /**
     * 獲得物品 (自動分類存入 背包)
     */
    const gainItem = (item: any, amount = 1) => {
        if (!item) return;

        // 裝備處理 (不堆疊，維持原樣)
        if (item.position) {
            info.value.equipments = info.value.equipments || [];
            Array.from({length: amount}).forEach(() => {
                info.value.equipments.push(create(item));
            });
            return;
        }

        // 消耗品或雜項處理 (堆疊)
        const targetBagKey = item.usable ? 'consumeItems' : 'items';
        if (!info.value[targetBagKey]) info.value[targetBagKey] = [];

        const bag = info.value[targetBagKey] as ItemStackType[];
        const existingStack = bag.find(s => s.item.name === item.name);

        if (existingStack) {
            existingStack.count += amount;
        } else {
            bag.push({
                item: create(item),
                count: amount
            });
        }
    };

    /**
     * 通用的移除物品方法
     * @param type 背包類型
     * @param index 索引
     */
    const _removeItemFromBag = (type: 'items' | 'equipments' | 'consumeItems', index: number) => {
        const bag = info.value[type];
        if (bag && bag[index]) {
            bag.splice(index, 1);
        }
    };

    /**
     * 裝備物品
     * @param item 裝備物件，若傳入 null/undefined 則視為卸下該位置裝備
     * @param inventoryIndex 物品在背包中的索引 (卸下時可不傳)
     * @param targetSlot 指定裝備位置
     */
    const equipItem = (
        item: EquipmentType | null | undefined,
        inventoryIndex?: number,
        targetSlot?: keyof Equipment) => {
        if (!info.value.equips) info.value.equips = {};

        // 1. 取得目標位置：如果有傳 item 就用 item.position，否則必須傳入 targetSlot
        let slot: (keyof Equipment) = (targetSlot || (item?.position as keyof Equipment))
        if (!slot) return; // 安全檢查：找不到位置就跳出
        // 2. 紀錄更換前的「血量/魔力比例」
        const oldMaxHp = finalStats.value.hpLimit;
        const oldMaxSp = finalStats.value.spLimit;
        const hpRatio = info.value.hp / (oldMaxHp || 1);
        const spRatio = info.value.sp / (oldMaxSp || 1);

        // 判定是「裝備」還是「卸下」
        if (!item) {
            // 情況 A：傳入空值 -> 卸下裝備
            if (info.value.equips[slot]) {
                _unequipItem(slot);
            }
        } else {
            // 情況 B：穿上裝備
            // 如果該位置已有裝備，先卸下
            if (info.value.equips[slot]) {
                _unequipItem(slot);
            }

            // 穿上新裝備
            info.value.equips[slot] = item;

            // 從背包移除（只有穿上時需要 inventoryIndex）
            if (inventoryIndex !== undefined) {
                _removeItemFromBag('equipments', inventoryIndex);
            }
        }

        // 3. 處理數值同步 (縮放動畫與上限控制)
        stopValueChangeAnimation.value = true;

        // 根據新上限等比縮放現有血量/魔力
        const newMaxHp = finalStats.value.hpLimit;
        const newMaxSp = finalStats.value.spLimit;

        info.value.hp = info.value.hp > 0
            ? Math.min(newMaxHp, Math.max(1, Math.round(newMaxHp * hpRatio)))
            : 0;

        info.value.sp = info.value.sp > 0
            ? Math.min(newMaxSp, Math.max(1, Math.round(newMaxSp * spRatio)))
            : 0;

        // 恢復動畫
        nextTick().then(() => {
            stopValueChangeAnimation.value = false;
        });
    };

    /**
     * 卸下裝備 (從 equips 狀態移動到 equipments 背包)
     */
    const _unequipItem = (slot: keyof Equipment): EquipmentType => {
        if (!info.value.equips || !info.value.equips[slot]) return null;

        const itemToUnequip = info.value.equips[slot];
        // 移除位置上的裝備
        info.value.equips[slot] = undefined;

        if (itemToUnequip) {
            gainItem(itemToUnequip); // 會自動分類到 equipments
        }
        return itemToUnequip;
    };
    /**
     * 檢查是否裝備了指定名稱的裝備
     * @param equipName 裝備名稱
     */
    const hasEquip = (equipName: string): boolean => {
        if (!info.value.equips) return false;
        // 檢查身上 6 個部位是否有任何一個裝備名稱相符
        return Object.values(info.value.equips).some(
            (item) => item && item.name === equipName
        );
    };


    /**
     * 添加金幣
     */
    const addGold = (amount: number) => {
        info.value.gold = (info.value.gold || 0) + amount;
    };

    /**
     * 初始化
     */
    const init = () => {
        info.value = JSON.parse(JSON.stringify(DEFAULT_USER_INFO));
        pendingLevelUpRewards.value = 0; // 增加待領取次數
        statusEffects.value = []
        skillProficiency.value = {}
    };

    /**
     * 添加或更新狀態
     */
    const addStatus = (effect: StatusEffect) => {
        // 特殊邏輯
        // 1. 尋找現有狀態
        const existing = statusEffects.value.find(e => e.name === effect.name);
        if (effect.name === UnitStatus.Cold.name && !hasStatus(ItemStatus.Warming.name)) {
            if (existing) {
                // 更新效果
                existing.bonus.dodge -= 5
                existing.bonus.hit -= 5
                existing.duration = 5
                existing.icon = existing.icon.replace(/\d+/, Math.abs(existing.bonus.dodge).toString())
                existing.description = existing.description.replace(/\d+/, Math.abs(existing.bonus.dodge).toString())
                console.log(existing.bonus.dodge)
                if (existing.bonus.dodge < -30) {
                    addStatus(UnitStatus.Frostbite)
                }
                if (existing.bonus.dodge < -70 && checkProbability(0.8)) {
                    addStatus(UnitStatus.Frozen)
                }
            }
        }

        if (existing) {
            // 刷新持續時間
            existing.duration = effect.duration;
        } else {
            // 2. 存入新狀態時進行深拷貝 (避免引用污染)
            statusEffects.value.push(create(effect));
        }
    };
    /**
     * 檢查當前是否有指定的狀態效果 (Buff/Debuff)
     * @param statusName 狀態名稱
     */
    const hasStatus = (statusName: string): boolean => {
        return statusEffects.value.some(
            (effect) => effect.name === statusName
        );
    };
    /**
     * 移除指定的狀態 (Buff 或 Debuff)
     * @param statusName 狀態名稱
     */
    const removeStatus = (statusName: string) => {
        const index = statusEffects.value.findIndex(e => e.name === statusName);
        if (index !== -1) {
            const removedEffect = statusEffects.value[index];
            statusEffects.value.splice(index, 1);

            // 可選：在日誌中記錄
            const logStore = useLogStore();
            logStore.logger.add(`[${removedEffect.name}] 效果被清除了。`);
        }
    };

    /**
     * 每回合觸發 (在戰鬥回合結束時呼叫)
     */
    const nextTurnStatus = () => {
        const remainingEffects: StatusEffect[] = [];
        const logStore = useLogStore();

        statusEffects.value.forEach(effect => {
            let logMessage = '';

            // 1. 處理每回合觸發的數值效果
            if (effect.type === 'damage' && effect.value) {
                const actualDamage = effect.value;
                info.value.hp = Math.max(0, info.value.hp - actualDamage);
                logMessage = `[${effect.name}] 讓你受到了 ${actualDamage} 點傷害。`;
            } else if (effect.type === 'heal' && effect.value) {
                const actualHeal = effect.value;
                info.value.hp = Math.min(finalStats.value.hpLimit, info.value.hp + actualHeal);
                logMessage = `[${effect.name}] 為你回復了 ${actualHeal} 點生命值。`;
            }

            // 如果有產生數值變動的 Log，則記錄
            if (logMessage) {
                logStore.logger.add(logMessage);
            }

            // 2. 扣減持續時間 (-1 是永久不扣)
            if (effect.duration !== -1) {
                effect.duration--;
            }

            // 3. 判定狀態是否繼續存在
            if (effect.duration !== 0) {
                // 狀態持續中，加入保留清單
                remainingEffects.push(effect);
            } else {
                // 狀態剛好結束 (duration 變為 0)
                logStore.logger.add(`[${effect.name}] 效果消失了。`);
            }
        });

        statusEffects.value = remainingEffects;
    };

    const healFull = () => {
        if (info.value.hp < finalStats.value.hpLimit) {
            info.value.hp = finalStats.value.hpLimit
        }
        if (info.value.sp < finalStats.value.spLimit) {
            info.value.sp = finalStats.value.spLimit
        }
        statusEffects.value = statusEffects.value.filter(effect => effect.isBuff || effect.duration === -1)
    }

    const addSkill = (skillKey: string) => {
        if (info.value.skills.includes(skillKey)) return true
        // 檢查技能欄位是否已滿
        if (info.value.skills.length >= MAX_SKILLS) {
            return false;
        }
        info.value.skills.push(skillKey);
        return true
    }
    const removeSkill = (skillKey: string) => {
        const index = info.value.skills.indexOf(skillKey);
        if (index > -1) {
            info.value.skills.splice(index, 1);
        }
    }

    const replaceSkill = (oldKey: string, newKey: string) => {
        const index = info.value.skills.indexOf(oldKey);
        if (index > -1) {
            info.value.skills[index] = newKey;
        }
    }

    const hasSkill = (skillKey: string): boolean => {
        return info.value.skills.includes(skillKey);
    }

    /**
     * 技能熟練度
     * 技能熟練度最高 100
     */
    const getSkillProficiency = (skillKey: string) => {
        return skillProficiency.value[skillKey] || 0;
    }
    const addSkillProficiency = (skillKey: string, value = 1) => {
        if ((skillProficiency.value[skillKey] || 0) >= 100) {
            return
        }
        skillProficiency.value[skillKey] = Math.min((skillProficiency.value[skillKey] || 0) + value, 100)
        if (skillProficiency.value[skillKey] == 100) {
            let evolutionMap: any
            if (info.value.char === CharEnum.Warrior.value) {
                evolutionMap = Warrior1SkillEvolutionMap
            } else if (info.value.char === CharEnum.Wizard.value) {
                evolutionMap = Wizard1SkillEvolutionMap
            }
            if (!evolutionMap) {
                return;
            }
            const nextSkills = evolutionMap[skillKey] as string[]
            if (!nextSkills) {
                return;
            }
            const logStore = useLogStore();
            logStore.logger.add('[升級]在你熟練技能使用後,獲得新技能!');
            nextSkills.forEach(nextSkill => {

                addSkill(nextSkill)
            })
        }
    }
    /**
     * 等級提升(每階100點)
     * 等差>=1 : 10, >=2 以上 每等額外+10
     */
    const gainExp = (source: { monsterLevel?: number; amount?: number }) => {
        if (source.monsterLevel) {
            const levelDiff = source.monsterLevel - info.value.level;
            // 1. 基礎判斷：如果等級低於自身，不獲得經驗
            if (levelDiff < -1) {
                return;
            }
            let earnedExp: number
            if (levelDiff === -1) {
                earnedExp = 2;
            } else {
                earnedExp = 10 + (levelDiff * 10);
            }
            // 3. 增加經驗
            info.value.currentExp += earnedExp;
        } else {
            info.value.currentExp += (source.amount || 0);
        }


        // 4. 固定 100 經驗升等，使用 while 處理可能跨級的情況
        while (info.value.currentExp >= 100) {
            info.value.currentExp -= 100;
            info.value.level += 1;
            pendingLevelUpRewards.value += 1
        }
    };
    return {
        info, skillProficiency,
        pendingLevelUpRewards, remainingLevelUpRewards,
        stopValueChangeAnimation,
        totalBonus,
        finalStats,
        statusEffects,
        equipItem, hasEquip,
        gainItem, hasItem, removeItem,
        addGold,
        addStatus, hasStatus, removeStatus,
        addSkill, removeSkill, replaceSkill, hasSkill,
        init, nextTurnStatus, healFull,
        addSkillProficiency, getSkillProficiency,
        gainExp
    };
}, {
    persist: {
        key: 'player-data',
        storage: localStorage,
    }
});