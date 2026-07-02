import {defineStore} from 'pinia';
import {computed, nextTick, ref, watch} from 'vue';
import {BonusType, Equipment, EquipmentType, ItemStackType, StatusEffect, UserType} from '@/types';
import {DEFAULT_USER_INFO} from '@/constants/default-const';
import {create, genCustomStatus} from "@/utils/create";
import {useLogStore} from "@/store/log-store";
import {SkillModel} from "@/models/skill-model";
import {SkillFactory} from "@/constants/skill/learned-skill";
import {useGameStateStore} from "@/store/game-state-store";
import {SKILL_TREE_NODES} from "@/constants/skill/learned-skill/skill-tree";

const generateUUID = (): string => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

const MAX_SKILLS = 6;
export const usePlayerStore = defineStore('player-info', () => {
    // --- State ---
    const info = ref<UserType>(JSON.parse(JSON.stringify(DEFAULT_USER_INFO)));

    const stopValueChangeAnimation = ref<boolean>(false);
    const statusEffects = ref<StatusEffect[]>([]);
    const skillProficiency = ref<{ [key: string]: number }>({})
    const isRestoring = ref(false);
    let _onEquipActionCallback: (() => void) | null = null;
    const setEquipActionCallback = (cb: (() => void) | null) => {
        _onEquipActionCallback = cb;
    };

    // 為初始裝備指派唯一 ID
    const assignInitialEquipmentIds = () => {
        if (info.value.equipments) {
            info.value.equipments.forEach(eq => {
                if (eq && !eq.id) eq.id = generateUUID();
            });
        }
        if (info.value.equips) {
            Object.values(info.value.equips).forEach((eq: any) => {
                if (eq && !eq.id) eq.id = generateUUID();
            });
        }
    };
    assignInitialEquipmentIds();


    // --- Getters ---
    const totalBonus = computed(() => {
        const bonus: Record<string, number> = {
            ad: 0,
            ap: 0,
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
            lifeSteal: 0,
            actionValue: 0,
            hpRegen: 0,
            spRegen: 0,
            shieldLimit: 0,
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
        // 💡 計算被動技能加成
        if (info.value.skills) {
            info.value.skills.forEach(s => {
                if (s && s instanceof SkillModel) {
                    const skillBonus = s.getPassiveBonus(info.value);
                    Object.keys(skillBonus).forEach(key => {
                        if (typeof bonus[key] === 'number') {
                            bonus[key] += skillBonus[key];
                        }
                    });
                }
            });
        }
        return bonus;
    });

    const finalStats = computed(() => {
        const b = totalBonus.value;
        return {
            ...info.value,
            ad: Math.max(0, info.value.ad + b.ad),
            ap: Math.max(0, (info.value.ap || 0) + b.ap),
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
            actionValue: Math.max(0, (info.value.actionValue ?? 50) + b.actionValue),
            hpRegen: info.value.hpRegen + b.hpRegen,
            spRegen: info.value.spRegen + b.spRegen,
            shieldLimit: Math.max(0, (info.value.shieldLimit || 0) + b.shieldLimit),
        };
    });
    const setDead = () => {
        const gameStateStore = useGameStateStore();
        gameStateStore.isDead = true
    }

    let isHydrating = true;
    nextTick(() => {
        isHydrating = false;
    });

    // 💡 監看最大生命值與最大法力值的變化，並按比例調整當前生命值與法力值
    watch(
        () => finalStats.value.hpLimit,
        (newMax, oldMax) => {
            if (isHydrating || isRestoring.value) return;
            if (newMax === 0) {
                setDead()
                return;
            }
            if (oldMax && oldMax > 0 && newMax && newMax > 0) {
                const ratio = info.value.hp / oldMax;
                info.value.hp = Math.min(newMax, Math.max(0, Math.round(newMax * ratio)));
            }
        },
        {flush: 'sync'}
    );

    watch(
        () => finalStats.value.spLimit,
        (newMax, oldMax) => {
            if (isHydrating || isRestoring.value) return;
            if (oldMax && oldMax > 0 && newMax && newMax > 0) {
                const ratio = info.value.sp / oldMax;
                info.value.sp = Math.min(newMax, Math.max(0, Math.round(newMax * ratio)));
            }
        },
        {flush: 'sync'}
    );

    const currentExpPercentage = computed(() => {
        const nextExp = getNextLevelExp(info.value.level)
        return Math.min(100, Math.round((info.value.currentExp / nextExp) * 100));
    });

    const nextLevelExp = computed(() => {
        return getNextLevelExp(info.value.level);
    });

    // --- Actions ---
    /**
     * 檢查背包中是否有指定名稱或 ID 的道具
     * @param itemOrName 道具名稱
     * @param amount 需要的數量 (預設為 1)
     */
    const hasItem = (itemOrName: string | any, amount: number = 1): [boolean, number] => {
        const targetId = typeof itemOrName === 'object' && itemOrName !== null ? itemOrName.id : undefined;
        const itemName = typeof itemOrName === 'object' && itemOrName !== null ? itemOrName.name : itemOrName;

        // 裝備長度：如果是物件比對（且有 id），則只比對唯一的 id；否則單純比對名稱
        const equipCount = (info.value.equipments || []).filter(i => {
            if (targetId !== undefined && i.id) {
                return i.id === targetId;
            }
            return i.name === itemName;
        }).length;

        // 堆疊物品則加總 count (如果是物件比對，看該 item 物件本身是否相等)
        const getStackCount = (list: ItemStackType[] = []) =>
            list.filter(i => {
                if (typeof itemOrName === 'object' && itemOrName !== null) {
                    return i.item === itemOrName;
                }
                return i.item.name === itemName;
            }).reduce((sum, i) => sum + i.count, 0);

        const totalCount = equipCount + getStackCount(info.value.items) + getStackCount(info.value.consumeItems);

        return [totalCount >= amount, totalCount];
    };
    /**
     * 移除指定名稱或特定物件的道具
     * @param itemOrName 道具名稱或特定道具物件
     * @param amount 要移除的個數，傳入 -1 則移除所有同名道具
     */
    const removeItem = (itemOrName: string | any, amount: number = 1): boolean => {
        const isRemoveAll = amount === -1;
        const targetId = typeof itemOrName === 'object' && itemOrName !== null ? itemOrName.id : undefined;
        const itemName = typeof itemOrName === 'object' && itemOrName !== null ? itemOrName.name : itemOrName;
        if (!isRemoveAll && !hasItem(itemOrName, amount)[0]) return false;

        let remainingToRemove = amount;

        // 1. 先從 裝備背包 移除 (非堆疊)
        if (info.value.equipments) {
            for (let i = info.value.equipments.length - 1; i >= 0; i--) {
                const eq = info.value.equipments[i];

                // 比對唯一 ID 或 單純比對名稱
                const matchesItem = (targetId !== undefined && eq.id)
                    ? eq.id === targetId
                    : eq.name === itemName;

                if (matchesItem) {
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
                const newEquip = create(item);
                if (!newEquip.id) {
                    newEquip.id = generateUUID();
                }
                info.value.equipments.push(newEquip);
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
                unequipItem(slot);
            }
        } else {
            // 情況 B：穿上裝備
            // 雙手武器與副手互斥邏輯
            if (slot === 'weapon' && item.isTwoHanded) {
                if (info.value.equips.offhand) {
                    unequipItem('offhand');
                }
            } else if (slot === 'offhand') {
                if (info.value.equips.weapon?.isTwoHanded) {
                    unequipItem('weapon');
                }
            }

            // 如果該位置已有裝備，先卸下
            if (info.value.equips[slot]) {
                unequipItem(slot);
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

        // 4. 戰鬥中穿脫裝備跳過回合
        try {
            const gameStateStore = useGameStateStore();
            const inBattle = gameStateStore.currentEnemy.length > 0 &&
                !gameStateStore.isBattleWon &&
                !gameStateStore.isDead;
            if (inBattle && _onEquipActionCallback) {
                _onEquipActionCallback();
            }
        } catch (e) {
            console.error("Failed to trigger combat turn end on equip change", e);
        }
    };

    /**
     * 卸下裝備 (從 equips 狀態移動到 equipments 背包)
     */
    const unequipItem = (slot: keyof Equipment): EquipmentType => {
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
        statusEffects.value = []
        skillProficiency.value = {}
        assignInitialEquipmentIds();
    };

    /**
     * 從外部數據載入並還原狀態 (還原 class 實體與補齊 ID)
     */
    const loadState = (playerData: any) => {
        if (!playerData) return;

        if (playerData.info) {
            info.value = JSON.parse(JSON.stringify(playerData.info));
        }
        if (playerData.skillProficiency) {
            skillProficiency.value = JSON.parse(JSON.stringify(playerData.skillProficiency));
        }
        if (playerData.statusEffects) {
            statusEffects.value = JSON.parse(JSON.stringify(playerData.statusEffects));
        }
        if (playerData.stopValueChangeAnimation !== undefined) {
            stopValueChangeAnimation.value = playerData.stopValueChangeAnimation;
        }

        // 1. 還原技能類別實體
        if (info.value && info.value.skills) {
            info.value.skills = info.value.skills.map((s: any) => {
                if (s && typeof s === 'object' && 'id' in s) {
                    return SkillFactory.createSkill(s.id, s);
                }
                if (typeof s === 'string') {
                    const prof = (skillProficiency.value && skillProficiency.value[s]) || 0;
                    return SkillFactory.createSkill(s, {level: 1, proficiency: prof, currentCd: 0});
                }
                return s;
            });
        }

        // 2. 確保背包中所有載入的裝備都有唯一 ID
        if (info.value && info.value.equipments) {
            info.value.equipments.forEach((eq: any) => {
                if (eq && !eq.id) {
                    eq.id = generateUUID();
                }
            });
        }

        // 3. 確保裝備欄位中所有載入的裝備都有唯一 ID
        if (info.value && info.value.equips) {
            Object.values(info.value.equips).forEach((eq: any) => {
                if (eq && !eq.id) {
                    eq.id = generateUUID();
                }
            });
        }
    };

    /**
     * 添加或更新狀態
     */
    const addStatus = (
        effect: StatusEffect,
        custom?: {
            icon?: string,
            bonus?: BonusType,
            value?: number,
            duration?: number
        }
    ) => {
        // 1. 尋找現有狀態
        const existingIndex = statusEffects.value.findIndex(e => e.name === effect.name);
        const newStat = genCustomStatus({
                base: effect,
                icon: custom?.icon,
                bonus: custom?.bonus,
                value: custom?.value,
                duration: custom?.duration,
            }
        )
        if (existingIndex != -1) {
            // 刷新
            statusEffects.value[existingIndex] = newStat
        } else {
            statusEffects.value.push(
                newStat
            )
        }
    };
    /**
     * 檢查當前是否有指定的狀態效果 (Buff/Debuff)
     * @param statusName 狀態名稱
     */

    const hasStatus = (statusName: string): StatusEffect | undefined => {
        return statusEffects.value.find(
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

    const handleUntilAttack = () => {
        statusEffects.value = statusEffects.value.filter(eff => {
            if (eff.untilAttack) {
                const logStore = useLogStore();
                logStore.logger.add(`[${info.value.name || '玩家'}] 的 [${eff.name}] 效果因發動攻擊而消失。`);
                return false;
            }
            return true;
        });
    };

    const handleUntilAttacked = () => {
        statusEffects.value = statusEffects.value.filter(eff => {
            if (eff.untilAttacked) {
                const logStore = useLogStore();
                logStore.logger.add(`[${info.value.name || '玩家'}] 的 [${eff.name}] 效果因受到攻擊而消失。`);
                return false;
            }
            return true;
        });
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
                let actualDamage = effect.value;
                if (effect.affectedByDefense) {
                    // 先扣除固定物理防禦力
                    actualDamage = Math.max(1, actualDamage - (finalStats.value.adDefend || 0));
                    // 套用 defendIncrease (百分比減傷 %)
                    if (finalStats.value.defendIncrease) {
                        const reduction = Math.min(finalStats.value.defendIncrease, 95);
                        actualDamage *= (1 - reduction / 100);
                    }
                    actualDamage = Math.max(1, Math.floor(actualDamage));
                }
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

        // 處理自動回復 (被動技能或裝備帶來的生命與法力自動回復)
        const hpRegenVal = finalStats.value.hpRegen || 0;
        const spRegenVal = finalStats.value.spRegen || 0;

        if (hpRegenVal > 0 && info.value.hp < finalStats.value.hpLimit) {
            info.value.hp = Math.min(finalStats.value.hpLimit, info.value.hp + hpRegenVal);
        }

        if (spRegenVal > 0 && info.value.sp < finalStats.value.spLimit) {
            info.value.sp = Math.min(finalStats.value.spLimit, info.value.sp + spRegenVal);
        }

        // 💡 減少技能冷卻 CD
        if (info.value.skills) {
            info.value.skills.forEach(skill => {
                if (skill instanceof SkillModel && skill.currentCd > 0) {
                    skill.currentCd--;
                }
            });
        }
        if (info.value.offhandSkillCds) {
            Object.keys(info.value.offhandSkillCds).forEach(key => {
                if ((info.value.offhandSkillCds as any)[key] > 0) {
                    (info.value.offhandSkillCds as any)[key]--;
                }
            });
        }
    };

    const healFull = () => {
        info.value.hp = finalStats.value.hpLimit
        info.value.sp = finalStats.value.spLimit
        statusEffects.value = statusEffects.value.filter(effect => effect.isBuff || effect.duration === -1)

        // 💡 重置技能冷卻 CD
        // if (info.value.skills) {
        //     info.value.skills.forEach(skill => {
        //         if (skill instanceof SkillModel) {
        //             skill.currentCd = 0;
        //         }
        //     });
        // }
        // if (info.value.offhandSkillCds) {
        //     Object.keys(info.value.offhandSkillCds).forEach(key => {
        //         (info.value.offhandSkillCds as any)[key] = 0;
        //     });
        // }
    }

    const addSkill = (skillKey: string) => {
        if (info.value.skills.some(s => s.id === skillKey)) return true;
        // 檢查技能欄位是否已滿
        if (info.value.skills.length >= MAX_SKILLS) {
            return false;
        }
        info.value.skills.push(SkillFactory.createSkill(skillKey));
        return true;
    }
    const removeSkill = (skillKey: string) => {
        const index = info.value.skills.findIndex(s => s.id === skillKey);
        if (index > -1) {
            info.value.skills.splice(index, 1);
        }
    }

    const replaceSkill = (oldKey: string, newKey: string) => {
        const index = info.value.skills.findIndex(s => s.id === oldKey);
        if (index > -1) {
            info.value.skills[index] = SkillFactory.createSkill(newKey);
        }
    }

    const hasSkill = (skillId: string): SkillModel | undefined => {
        // @ts-ignore
        return info.value.skills.find(s => s.id === skillId);
    }


    // 檢查有無該唯一流派的相關技能
    const checkSkillPath = (pathId: string): boolean => {
        return info.value.skills?.some((s: any) => {
            const node = SKILL_TREE_NODES[s.id];
            return node && node.pathId === pathId;
        });
    }
    /**
     * 技能熟練度
     * 技能熟練度最高 100
     */
    const getSkillProficiency = (skillKey: string) => {
        const skill = info.value.skills.find(s => s.id === skillKey);
        return skill ? skill.proficiency : (skillProficiency.value[skillKey] || 0);
    }
    const addSkillProficiency = (skillKey: string, value?: number) => {
        const skill = info.value.skills.find(s => s.id === skillKey);
        if (skill) {
            const gain = value ?? skill.proficiencyGain ?? 1;
            const maxProf = skill.maxProficiency ?? 100;
            if (skill.proficiency >= maxProf) return;

            skill.proficiency = Math.min(skill.proficiency + gain, maxProf);

        } else {
            // fallback
            const fallbackMax = 100;
            const gain = value ?? 1;
            if ((skillProficiency.value[skillKey] || 0) >= fallbackMax) {
                return
            }
            skillProficiency.value[skillKey] = Math.min((skillProficiency.value[skillKey] || 0) + gain, fallbackMax)
        }
    }
    /**
     * 等級提升
     */
    const getNextLevelExp = (level: number) => {
        if (level <= 25) {
            return 10 * level;
        } else if (25 < level && level <= 50) {
            return 20 * level;
        } else if (level <= 50) {
            return 30 * level;
        }
    };

    const gainExp = (source: { monsterLevel?: number; amount?: number, noExp?: boolean }) => {
        if (source.noExp) {
            return
        }
        let earnedExp: number
        if (source.monsterLevel) {
            earnedExp = Math.max(0, -1 + source.monsterLevel * 2);
        } else {
            earnedExp = source.amount || 0;
        }

        info.value.currentExp += earnedExp;

        // 4. 線性經驗需求升等，使用 while 處理可能跨級的情況
        let nextExp = getNextLevelExp(info.value.level);
        let leveledUp = false;
        const startLevel = info.value.level;
        while (info.value.currentExp >= nextExp) {
            info.value.currentExp -= nextExp;
            info.value.level += 1;
            // 每次升級獲得升級點數
            info.value.statPoints = (info.value.statPoints || 0) + 3;
            nextExp = getNextLevelExp(info.value.level);
            leveledUp = true;
        }

        if (leveledUp) {
            info.value.hp = finalStats.value.hpLimit;
            info.value.sp = finalStats.value.spLimit;

            // 💡 核心新增：每 3 等可獲得技能點數
            let skillPointsGained = 0;
            for (let lvl = startLevel + 1; lvl <= info.value.level; lvl++) {
                if (lvl % 3 === 0) {
                    skillPointsGained++;
                }
            }
            if (skillPointsGained > 0) {
                info.value.pendingSkillPoints = (info.value.pendingSkillPoints || 0) + skillPointsGained;
            }

            const logStore = useLogStore();
            let logMsg = `[升級] 恭喜升到 Lv.${info.value.level}！生命值與法力值已完全回復！`;
            if (skillPointsGained > 0) {
                logMsg += ` 獲得了 ${skillPointsGained} 點技能學習機會！`;
            }
            logStore.logger.add(logMsg);
        }
    };

    /**
     * 分配屬性點數
     */
    const allocateStatPoint = (statKey: 'ad' | 'ap' | 'hpLimit' | 'spLimit' | 'hit' | 'dodge') => {
        if (!info.value.statPoints || info.value.statPoints <= 0) return false;

        info.value.statPoints -= 1;
        if (statKey === 'hpLimit' || statKey === 'spLimit') {
            info.value[statKey] = (info.value[statKey] || 0) + 20;
        } else if (statKey === 'hit' || statKey === 'dodge') {
            info.value[statKey] = (info.value[statKey] || 0) + 2;
        } else {
            info.value[statKey] = (info.value[statKey] || 0) + 1;
        }
        return true;
    };

    /**
     * 扣除玩家受到傷害，優先由護盾扣除，若有溢傷才扣除 HP
     * 此 function 是最終實際扣除位置
     */
    const takeDamage = (amount: number) => {
        const currentShield = info.value.shield || 0;
        let damageTaken = amount;
        let shieldAbsorbed = 0;
        if (currentShield > 0) {
            if (currentShield >= damageTaken) {
                shieldAbsorbed = damageTaken;
                info.value.shield = currentShield - damageTaken;
                damageTaken = 0;
            } else {
                shieldAbsorbed = currentShield;
                damageTaken -= currentShield;
                info.value.shield = 0;
            }
        }
        // 因為有生命回復/吸血等情況 所以 要給他負數讓後續好計算
        info.value.hp = info.value.hp - damageTaken;
        return {
            hpDamage: damageTaken,
            shieldAbsorbed: shieldAbsorbed
        };
    };

    return {
        info, skillProficiency,
        stopValueChangeAnimation,
        isRestoring,
        setEquipActionCallback,
        totalBonus,
        finalStats,
        currentExpPercentage,
        nextLevelExp,
        statusEffects,
        equipItem, hasEquip,
        gainItem, hasItem, removeItem, _removeItemFromBag, unequipItem,
        addGold,
        addStatus, hasStatus, removeStatus, handleUntilAttack, handleUntilAttacked,
        addSkill, removeSkill, replaceSkill, hasSkill, checkSkillPath,
        init, loadState, nextTurnStatus, healFull,
        addSkillProficiency, getSkillProficiency,
        gainExp, allocateStatPoint, takeDamage
    };
}, {
    persist: {
        key: 'player-data',
        storage: localStorage,
        serializer: {
            serialize: (state) => JSON.stringify(state),
            deserialize: (value) => {
                const state = JSON.parse(value);

                // 1. 還原技能類別實體
                if (state.info && state.info.skills) {
                    console.log('state.info.skills', state.info.skills)
                    state.info.skills = state.info.skills.map((s: any) => {
                        if (s && typeof s === 'object' && 'id' in s) {
                            return SkillFactory.createSkill(s.id, s);
                        }
                        if (typeof s === 'string') {
                            const prof = (state.skillProficiency && state.skillProficiency[s]) || 0;
                            return SkillFactory.createSkill(s, {level: 1, proficiency: prof, currentCd: 0});
                        }
                        return s;
                    });
                }
                console.log('觸發了', state.info.skills)
                // 2. 確保背包中所有載入的裝備都有唯一 ID
                if (state.info && state.info.equipments) {
                    state.info.equipments.forEach((eq: any) => {
                        if (eq && !eq.id) {
                            eq.id = generateUUID();
                        }
                    });
                }

                // 3. 確保裝備欄位中所有載入的裝備都有唯一 ID
                if (state.info && state.info.equips) {
                    Object.values(state.info.equips).forEach((eq: any) => {
                        if (eq && !eq.id) {
                            eq.id = generateUUID();
                        }
                    });
                }

                return state;
            }
        }
    }
});