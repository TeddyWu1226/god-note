import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { UserType, Equipment, EquipmentType } from '@/types';
import { DEFAULT_USER_INFO } from '@/constants/default-const';

export const usePlayerStore = defineStore('player-info', () => {
    // --- State ---
    const info = ref<UserType>(JSON.parse(JSON.stringify(DEFAULT_USER_INFO)));

    // --- Getters ---
    const equipBonus = computed(() => {
        const bonus: Record<string, number> = {
            ad: 0, critIncrease: 0, critRate: 0, adDefend: 0,
            dodge: 0, hit: 0, hpLimit: 0, spLimit: 0
        };
        if (!info.value.equips) return bonus;

        Object.values(info.value.equips).forEach((item) => {
            if (item) {
                Object.keys(bonus).forEach(key => {
                    const value = (item as any)[key];
                    if (typeof value === 'number') bonus[key] += value;
                });
            }
        });
        return bonus;
    });

    const finalStats = computed(() => {
        const b = equipBonus.value;
        return {
            ...info.value,
            ad: info.value.ad + b.ad,
            critRate: info.value.critRate + b.critRate,
            critIncrease: info.value.critIncrease + b.critIncrease,
            adDefend: info.value.adDefend + b.adDefend,
            dodge: info.value.dodge + b.dodge,
            hit: info.value.hit + b.hit,
            hpLimit: info.value.hpLimit + b.hpLimit,
            spLimit: info.value.spLimit + b.spLimit,
        };
    });

    // --- Actions ---

    /**
     * 獲得物品 (存入 items 背包)
     */
    const gainItem = (item: any) => {
        if (!info.value.items) info.value.items = [];
        info.value.items.push(JSON.parse(JSON.stringify(item)));
    };

    /**
     * 移除背包中的物品
     */
    const removeItem = (index: number) => {
        if (info.value.items && info.value.items[index]) {
            info.value.items.splice(index, 1);
        }
    };

    /**
     * 卸下裝備
     */
    const unequipItem = (slot: keyof Equipment) => {
        if (!info.value.equips || !info.value.equips[slot]) return null;

        const itemToUnequip = info.value.equips[slot];
        delete info.value.equips[slot];

        if (itemToUnequip) {
            gainItem(itemToUnequip);
        }
        return itemToUnequip;
    };

    /**
     * 裝備物品
     * @param item 裝備物件
     * @param inventoryIndex 背包中的索引 (裝備後需移除)
     * @param targetSlot 強制指定的槽位 (用於飾品1、飾品2的選擇)
     */
    const equipItem = (item: EquipmentType, inventoryIndex?: number, targetSlot?: keyof Equipment) => {
        if (!info.value.equips) info.value.equips = {};

        // 決定要穿在哪個位置
        // 如果有指定 targetSlot (如 accessory1) 就用指定的，否則用裝備預設的 position
        const slot = targetSlot || (item.position as keyof Equipment);

        // 1. 如果該位置已有裝備，先卸下並放回背包
        if (info.value.equips[slot]) {
            unequipItem(slot);
        }

        // 2. 穿上裝備
        info.value.equips[slot] = JSON.parse(JSON.stringify(item));

        // 3. 如果是從背包穿上的，將其從背包移除
        if (inventoryIndex !== undefined) {
            removeItem(inventoryIndex);
        }
    };

    const addGold = (amount: number) => {
        info.value.gold = (info.value.gold || 0) + amount;
    };

    const init = () => {
        info.value = JSON.parse(JSON.stringify(DEFAULT_USER_INFO));
    };

    return {
        info,
        equipBonus,
        finalStats,
        equipItem,
        unequipItem,
        addGold,
        gainItem,
        removeItem,
        init
    };
}, {
    persist: {
        key: 'player-data',
        storage: localStorage,
    }
});