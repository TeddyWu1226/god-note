import {defineStore} from 'pinia';
import {ref, computed, nextTick} from 'vue';
import type {UserType, Equipment, EquipmentType} from '@/types';
import {DEFAULT_USER_INFO} from '@/constants/default-const';
import {create} from "@/utils/create";

export const usePlayerStore = defineStore('player-info', () => {
    // --- State ---
    const info = ref<UserType>(JSON.parse(JSON.stringify(DEFAULT_USER_INFO)));
    const stopValueChangeAnimation = ref<boolean>(false);

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
     * 裝備物品 (從 equipments 背包移動到 equips 狀態)
     */
    const equipItem = (item: EquipmentType, inventoryIndex: number, targetSlot?: keyof Equipment) => {
        if (!info.value.equips) info.value.equips = {};
        // 決定位置 (優先使用指定位置，否則使用裝備預設位置)
        const slot = targetSlot || (item.position as keyof Equipment);

        // 紀錄更換前的「血量/魔力比例」
        const oldMaxHp = finalStats.value.hpLimit;
        const oldMaxSp = finalStats.value.spLimit;
        const hpRatio = info.value.hp / oldMaxHp;
        const spRatio = info.value.sp / oldMaxSp;

        // 如果該位置已有裝備，卸下 (unequipItem 會自動呼叫 gainItem 放回正確背包)
        let oldItem: EquipmentType = undefined
        if (info.value.equips[slot]) {
            oldItem = unequipItem(slot);
        }

        // 穿上新裝備
        info.value.equips[slot] = item

        // 從「裝備背包」中移除
        _removeItemFromBag('equipments', inventoryIndex);
        stopValueChangeAnimation.value = true

        // 根據新上限等比縮放現有血量/魔力
        const newMaxHp = finalStats.value.hpLimit;
        const newMaxSp = finalStats.value.spLimit;

        // 套用比例並取整，同時確保不低於 1 (除非原本就是 0)
        info.value.hp = info.value.hp > 0
            ? Math.max(1, Math.round(newMaxHp * hpRatio))
            : 0;

        info.value.sp = info.value.sp > 0
            ? Math.max(1, Math.round(newMaxSp * spRatio))
            : 0;

        // 額外保險：確保不超過新上限
        if (info.value.hp > newMaxHp) info.value.hp = newMaxHp;
        if (info.value.sp > newMaxSp) info.value.sp = newMaxSp;

        nextTick().then(
            () => {
                stopValueChangeAnimation.value = false
            }
        )

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


    const addGold = (amount: number) => {
        info.value.gold = (info.value.gold || 0) + amount;
    };

    const init = () => {
        info.value = JSON.parse(JSON.stringify(DEFAULT_USER_INFO));
    };

    return {
        info,
        stopValueChangeAnimation,
        equipBonus,
        finalStats,
        equipItem,
        unequipItem,
        addGold,
        gainItem,
        init
    };
}, {
    persist: {
        key: 'player-data',
        storage: localStorage,
    }
});