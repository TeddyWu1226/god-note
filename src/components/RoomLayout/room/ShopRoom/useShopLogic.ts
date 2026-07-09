// store/useShopLogic.ts


import {QualityEnum} from "@/enums/quality-enum";
import {getRandomItemsByQuality} from "@/utils/create";
import {Armor} from "@/constants/items/equipment/armor-info";
import {Head} from "@/constants/items/equipment/head-info";
import {Offhand} from "@/constants/items/equipment/offhand-info";
import {Weapon} from "@/constants/items/equipment/weapon-info";
import {Potions} from "@/constants/items/usalbe-item/potion-info";
import {Usable} from "@/constants/items/usalbe-item/usable-info";

// 基礎價格表 (0: Tattered ~ 5: Unique)
export const EQUIP_BASE_PRICE = [100, 200, 400, 800, 1600, 3200];
export const POTION_BASE_PRICE = [50, 100, 200, 400, 800, 1600];
const sortByQuality = <T extends { quality?: number; name: string }>(arr: T[]) =>
    arr.sort((a, b) =>
        (a.quality ?? 0) - (b.quality ?? 0) ||
        a.name.localeCompare(b.name, 'zh-Hant', {
            numeric: true,
        })
    );

export function useShopLogic(currentStage: number, days: number) {
    /**
     * 裝備品質機率分佈演算法
     * @returns 回傳品質 Value (0 - 5)
     */
    const getEquipWeightedQuality = (): number => {
        const roll = Math.random() * 100;

        if (currentStage === 1) {
            if (roll <= 3) return QualityEnum.Common.value;    // 5% 普通
            return QualityEnum.Tattered.value;                 // 95% 破爛
        }

        if (currentStage === 2) {
            if (roll <= 3) return QualityEnum.Fine.value;    // 5% 精良
            if (roll < 15) return QualityEnum.Tattered.value;  // 10% 破爛
            return QualityEnum.Common.value;               // 85% 普通
        }

        if (currentStage === 3) {
            if (roll <= 3) return QualityEnum.Rare.value;    // 5% 精良
            if (roll < 15) return QualityEnum.Common.value;  // 10% 普通
            return QualityEnum.Fine.value;               // 85% 精良
        }

        if (currentStage === 4) {
            if (roll <= 3) return QualityEnum.Perfect.value;    // 5% 完美
            if (roll < 15) return QualityEnum.Fine.value;  // 10% 普通
            return QualityEnum.Rare.value;               // 85% 精良
        }

        if (currentStage === 5) {
            if (roll <= 3) return QualityEnum.Unique.value;    // 5% 獨特
            if (roll < 15) return QualityEnum.Rare.value;  // 10% 稀有
            return QualityEnum.Perfect.value;               // 85% 完美
        }

        if (currentStage > 5) {
            return QualityEnum.Unique.value;               // 100% 獨特
        }

        return QualityEnum.Tattered.value;                 // 100% 破爛
    };

    /**
     * 特殊道具品質機率分佈演算法
     * @returns 回傳品質 Value (0 - 5)
     */
    const getUsableWeightedQuality = (): number => {
        const roll = Math.random() * 100;

        if (currentStage === 1) {
            if (roll < 50) return QualityEnum.Common.value;
            return QualityEnum.Tattered.value;
        }

        if (currentStage === 2 || currentStage === 3) {
            if (roll < 33) return QualityEnum.Tattered.value;
            if (roll < 66) return QualityEnum.Common.value;
            return QualityEnum.Fine.value;
        }


        if (currentStage >= 4) {
            if (roll < 25) return QualityEnum.Tattered.value;
            if (roll < 50) return QualityEnum.Common.value;
            if (roll < 75) return QualityEnum.Fine.value;
            return QualityEnum.Rare.value;
        }

        return QualityEnum.Tattered.value;
    };


    /**
     * 藥水品質機率分佈演算法
     * @returns 回傳品質 Value (0 - 5)
     */
    const getPotionWeightedQuality = (): number => {
        const roll = Math.random() * 100;

        if (currentStage === 1) {
            if (roll < 15) return QualityEnum.Common.value;    // 15% 普通
            return QualityEnum.Tattered.value;                 // 85% 破爛
        }

        if (currentStage === 2) {
            if (roll < 5) return QualityEnum.Fine.value;      // 5% 精良
            if (roll < 55) return QualityEnum.Common.value;    // 50% 普通
            return QualityEnum.Tattered.value;                 // 45% 破爛
        }

        if (currentStage === 3) {
            if (roll < 25) return QualityEnum.Rare.value; // 25% 稀有
            if (roll < 60) return QualityEnum.Fine.value;    // 35% 精良
            return QualityEnum.Common.value;                   // 40% 普通
        }

        // --- 極深層 (41 ~ 50層) ---
        if (currentStage >= 4) {
            if (roll < 10) return QualityEnum.Perfect.value; // 10% 完美
            if (roll < 50) return QualityEnum.Rare.value; // 40% 稀有
            if (roll < 90) return QualityEnum.Fine.value; // 40% 精良
            return QualityEnum.Common.value;              // 10% 普通
        }

        return QualityEnum.Tattered.value;                 // 100% 破爛
    };

    /**
     * 價格計算邏輯
     * 隨days進行通膨，且 Unique 品質物品價格呈指數成長
     */
    const calculatePrice = (quality: number, usePrice: number[], stack = false) => {

        const base = usePrice[quality] || 50;

        // 隨days通膨：每10天 + 1%
        const inflationFactor = currentStage > 1 ? Math.floor(days / 10) * 0.01 : 0;
        const stageMultiplier = 1 + inflationFactor;


        if (stack) {
            return Math.floor(base * stageMultiplier)
        }
        // 加入 ±15% 隨機波動
        const randomFlux = 0.85 + Math.random() * 0.3;
        return Math.floor(base * stageMultiplier * randomFlux);
    };

    const generateGoods = () => {
        // 固定生成 5 件裝備
        const equips = Array.from({length: 5}).map(() => {
            const q = getEquipWeightedQuality();
            return getRandomItemsByQuality(1, q, false, Armor, Head, Offhand, Weapon)[0];
        });
        // 固定生成 3 件特殊道具
        const usable = Array.from({length: 3}).map(() => {
            const q = getUsableWeightedQuality();
            return getRandomItemsByQuality(1, q, false, Usable)[0];
        });
        // 固定生成 7 件藥水
        const potions = Array.from({length: 7}).map(() => {
            const q = getPotionWeightedQuality();
            return getRandomItemsByQuality(1, q, false, Potions)[0];
        });

        // 附上價格與僅輸出輕量格式
        const _equips = equips.filter(Boolean).map(item => ({
            name: item.name,
            price: calculatePrice(item.quality ?? 0, EQUIP_BASE_PRICE),
            sold: false,
            quality: item.quality ?? 0
        }));
        let _usable = usable.filter(Boolean).map(item => ({
            name: item.name,
            price: item.quality ? item.quality * item.quality * 50 : 50,
            sold: false,
            quality: item.quality ?? 0
        }));
        const _potions = potions.filter(Boolean).map(item => ({
            name: item.name,
            price: calculatePrice(item.quality ?? 0, POTION_BASE_PRICE, true),
            sold: false,
            quality: item.quality ?? 0
        }));
        sortByQuality(_equips);
        sortByQuality(_usable);
        sortByQuality(_potions);

        // 移除輔助排序屬性，返回最乾淨的輕量規格
        return [..._equips, ..._usable, ..._potions].map(({name, price, sold}) => ({
            name,
            price,
            sold
        }));
    };

    const findItemTemplateByName = (name: string) => {
        const allTemplates = [
            ...Object.values(Armor),
            ...Object.values(Head),
            ...Object.values(Offhand),
            ...Object.values(Weapon),
            ...Object.values(Potions),
            ...Object.values(Usable)
        ];
        return allTemplates.find(item => item.name === name);
    };

    return {getEquipWeightedQuality, generateGoods, findItemTemplateByName};
}