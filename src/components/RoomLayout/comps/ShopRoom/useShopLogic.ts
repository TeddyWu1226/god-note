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
export const MATERIAL_BASE_PRICE = [10, 30, 100, 200, 500, 1000];

export function useShopLogic(currentStage: number) {

    /**
     * 品質機率分佈演算法
     * @returns 回傳品質 Value (0 - 5)
     */
    const getWeightedQuality = (): number => {
        const roll = Math.random() * 100;

        // --- 極深層 (41 ~ 50層) ---
        // 目標：獨特與完美成為中堅力量
        if (currentStage > 40) {
            if (roll < 20) return QualityEnum.Unique.value;  // 20% 獨特
            if (roll < 50) return QualityEnum.Perfect.value; // 30% 完美
            if (roll < 85) return QualityEnum.Rare.value;    // 35% 稀有
            return QualityEnum.Fine.value;                   // 15% 精良
        }

        // --- 深層區域 (31 ~ 40層) ---
        // 目標：開始穩定出現完美，稀有成為常客
        if (currentStage > 30) {
            if (roll < 8) return QualityEnum.Unique.value;  // 8% 獨特
            if (roll < 25) return QualityEnum.Perfect.value; // 17% 完美
            if (roll < 65) return QualityEnum.Rare.value;    // 40% 稀有
            return QualityEnum.Fine.value;                   // 35% 精良
        }

        // --- 中層區域 (16 ~ 30層) ---
        // 目標：稀有開始普及，完美極低機率出現
        if (currentStage > 15) {
            if (roll < 5) return QualityEnum.Perfect.value; // 5% 完美 (稀有機遇)
            if (roll < 25) return QualityEnum.Rare.value;    // 20% 稀有
            if (roll < 65) return QualityEnum.Fine.value;    // 40% 精良
            return QualityEnum.Common.value;                 // 35% 普通
        }

        // --- 緩衝區域 (6 ~ 15層) ---
        // 目標：普通(Common)開始取代破爛(Tattered)
        if (currentStage > 5) {
            if (roll < 10) return QualityEnum.Rare.value;    // 10% 稀有
            if (roll < 35) return QualityEnum.Fine.value;    // 25% 精良
            if (roll < 75) return QualityEnum.Common.value;  // 40% 普通
            return QualityEnum.Tattered.value;               // 25% 破爛
        }

        if (currentStage > 2) {
            if (roll < 2) return QualityEnum.Fine.value;      // 2% 精良 (歐皇)
            if (roll < 12) return QualityEnum.Common.value;    // 10% 普通 (開始出現)
            return QualityEnum.Tattered.value;                 // 88% 破爛
        }

        return QualityEnum.Tattered.value;                 // 88% 破爛
    };

    /**
     * 價格計算邏輯
     * 隨層數進行通膨，且 Unique 品質物品價格呈指數成長
     */
    const calculatePrice = (quality: number, usePrice: number[], stack = false) => {

        const base = usePrice[quality] || 50;

        // 隨層數通膨：每層增加 3% 的價格，深層後斜率加強
        const inflationFactor = currentStage > 30 ? 1.5 : 1.0;
        const stageMultiplier = 1 + (currentStage * 0.03 * inflationFactor);


        if (stack) {
            return Math.floor(base * stageMultiplier)
        }
        // 加入 ±15% 隨機波動
        const randomFlux = 0.85 + Math.random() * 0.3;
        return Math.floor(base * stageMultiplier * randomFlux);
    };

    const generateGoods = () => {
        // 固定生成 4 件裝備
        const equips = Array.from({length: 4}).map(() => {
            const q = getWeightedQuality();
            return getRandomItemsByQuality(1, q, false, Armor, Head, Offhand, Weapon)[0];
        });

        // 固定生成 1 件特殊道具
        let usable = getRandomItemsByQuality(1, Math.min(3, getWeightedQuality()), false, Usable)[0];
        const potionCount = !usable ? 4 : 3
        // 固定生成 3 件藥水 (品質限制在 Tattered 到 Rare)
        const potions = Array.from({length: potionCount}).map(() => {
            const q = Math.min(3, getWeightedQuality());
            return getRandomItemsByQuality(1, q, true, Potions)[0];
        });
        const _equips = equips.map(item => ({
            ...item,
            price: calculatePrice(item.quality ?? 0, EQUIP_BASE_PRICE),
            sold: false
        }));
        let _usable: object | undefined = undefined;
        if (usable) {
            _usable = {
                ...usable,
                price: 500,
                sold: false
            }
        }
        const _potions = potions.map(item => ({
            ...item,
            price: calculatePrice(item.quality ?? 0, POTION_BASE_PRICE, true),
            sold: false
        }));
        return [..._equips, _usable, ..._potions].filter(Boolean)
    };

    return {generateGoods};
}