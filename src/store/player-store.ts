import {defineStore} from 'pinia';
import {ref, computed, nextTick} from 'vue';
import type {UserType, Equipment, EquipmentType, StatusEffect} from '@/types';
import {DEFAULT_USER_INFO} from '@/constants/default-const';
import {create} from "@/utils/create";
import {useLogStore} from "@/store/log-store";

export const usePlayerStore = defineStore('player-info', () => {
    // --- State ---
    const info = ref<UserType>(JSON.parse(JSON.stringify(DEFAULT_USER_INFO)));
    const stopValueChangeAnimation = ref<boolean>(false);
    const statusEffects = ref<StatusEffect[]>([]);

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
        // 合併所有背包並計算名稱相同的物件個數
        const allItems = [
            ...(info.value.items || []),
            ...(info.value.equipments || []),
            ...(info.value.consumeItems || [])
        ];

        const count = allItems.filter(item => item && item.name === itemName).length;
        return [count >= amount, count]
    };
    /**
     * 移除指定名稱的道具 (每次只移除 1 個)
     * @param itemName 道具名稱
     * @param amount 要移除的個數
     */
    const removeItem = (itemName: string, amount: number = 1): boolean => {
        if (!hasItem(itemName, amount)[0]) return false;

        let removedCount = 0;
        // 定義搜尋順序
        const bagKeys: ('consumeItems' | 'items' | 'equipments')[] = ['consumeItems', 'items', 'equipments'];

        for (const key of bagKeys) {
            const bag = info.value[key];
            if (!bag) continue;
            // 從後往前搜尋，方便刪除
            for (let i = bag.length - 1; i >= 0; i--) {
                if (bag[i] && bag[i].name === itemName) {
                    bag.splice(i, 1); // 找到一個，刪除一個
                    removedCount++;
                    if (removedCount >= amount) return true; // 達到目標數量，提前結束
                }
            }
        }
        return removedCount >= amount;
    };
    /**
     * 獲得物品 (存入 items 背包)
     */
    const gainItem = (item: any) => {
        info.value.items = info.value.items || [];
        info.value.equipments = info.value.equipments || [];
        info.value.consumeItems = info.value.consumeItems || [];
        const newItem = create(item);
        // 分類加入
        if (item?.position) {
            info.value.equipments.push(newItem)
        } else if (item?.usable) {
            info.value.consumeItems.push(newItem)
        } else {
            info.value.items.push(newItem)
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

        // 🚩 核心邏輯：判定是「裝備」還是「卸下」
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
    };

    /**
     * 添加或更新狀態
     */
    const addStatus = (effect: StatusEffect) => {
        // 1. 尋找現有狀態
        const existing = statusEffects.value.find(e => e.name === effect.name);

        if (existing) {
            // 刷新持續時間
            existing.duration = effect.duration;
            // 如果你的狀態數值會隨等級變化，建議也更新一下 bonus
            existing.bonus = effect.bonus ? JSON.parse(JSON.stringify(effect.bonus)) : undefined;
        } else {
            // 2. 存入新狀態時進行深拷貝 (避免引用污染)
            // 使用 JSON 方案或是你現有的 create() 工具
            statusEffects.value.push(create(effect));
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
        statusEffects.value = statusEffects.value.filter(effect => effect.isBuff)
    }
    return {
        info,
        stopValueChangeAnimation,
        totalBonus,
        finalStats,
        statusEffects,
        equipItem,
        gainItem,
        hasItem,
        removeItem,
        addGold,
        addStatus,
        nextTurnStatus,
        healFull,
        init
    };
}, {
    persist: {
        key: 'player-data',
        storage: localStorage,
    }
});