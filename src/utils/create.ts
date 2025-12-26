import {reactive, Reactive} from "vue";
import {EquipmentType, PotionType, RoomWeights} from "@/types";

/**
 * 建立物件
 *
 * @param source 要複製的基礎物件定義。
 * @returns 一個新的、深度獨立物件。
 */
export function create<T extends object>(source: T): T {
    let deepCopy: T;
    try {
        deepCopy = JSON.parse(JSON.stringify(source)) as T;
    } catch (e) {
        console.error("深複製失敗，可能存在循環引用或無法序列化的特殊結構。", e);
        // 如果深複製失敗，退回到淺複製（這可能會導致部分屬性仍有引用關聯）
        deepCopy = {...source};
    }
    return deepCopy as T;
}


/**
 * 從多個裝備庫中，根據品質隨機抽取指定數量的道具
 * @param count 想要獲得的道具數量
 * @param quality 目標品質 (0-5)
 * @param dataSources 裝備 Record 對象
 * @returns 包含隨機道具的陣列
 */
export const getRandomItemsByQuality = (
    count: number,
    quality: number,
    ...dataSources: Record<string, EquipmentType | PotionType>[]
): (EquipmentType | PotionType)[] => {
    // 1. 合併並過濾出符合品質的道具池
    const pool: (EquipmentType | PotionType)[] = dataSources
        .flatMap(source => Object.values(source))
        .filter(item => item.quality === quality);

    // 2. 防錯處理：如果完全沒道具，回傳空陣列
    if (pool.length === 0) {
        console.warn(`未找到品質為 ${quality} 的道具。`);
        return [];
    }

    // 3. 隨機洗牌 (Fisher-Yates Shuffle) 並取出前 N 個
    // 這可以確保在道具充足的情況下不會重複抽中同一個
    const shuffled = [...pool].sort(() => Math.random() - 0.5);

    // 4. 如果要求的數量超過現有總數，就回傳現有的全部
    const finalCount = Math.min(count, shuffled.length);

    return shuffled.slice(0, finalCount);
};

/**
 * 從指定的 Enum 陣列中隨機取出一個值，並支援排除清單
 * @param enumArray 想要抽選的 Enum 陣列 (例如 [SpecialEventEnum.Gamble, SpecialEventEnum.MagicTree])
 * @param excludeList 想要排除的 Value 陣列
 * @returns 隨機挑選出的 Enum Value
 */
export function getRandomFromEnumArray<T>(
    enumArray: T[],
    excludeList: T[] = []
): T {
    // 1. 過濾掉排除清單中的值
    const filteredValues = enumArray.filter(value => !excludeList.includes(value));

    // 2. 安全檢查：如果過濾後沒東西了
    if (filteredValues.length === 0) {
        console.warn("getRandomFromEnumArray: 過濾後沒有可選的值，回傳原始陣列首項");
        return enumArray[0];
    }

    // 3. 隨機產生索引並回傳
    const randomIndex = Math.floor(Math.random() * filteredValues.length);
    return filteredValues[randomIndex];
}


/**
 * 根據自定義權重物件，隨機返回一個標記值 (0, 1, 2, 3, 4, ...)
 * * @param weights 標記權重物件，例如 { 0: 1, 1: 5, 2: 2, 3: 1, 4: 1 }
 * @returns 隨機選中的標記值 (number)
 */
export function getRandomLabelByWeight(weights: RoomWeights): number {

    // 1. 建立權重累積數組 (Cumulative Weight Array)
    const weightedChoices: number[] = [];
    let totalWeight = 0;

    // 遍歷權重，為每個標記建立多個條目，數量等於其權重
    for (const [label, weight] of Object.entries(weights)) {
        const labelValue = parseInt(label);
        const weightValue = weight;

        for (let i = 0; i < weightValue; i++) {
            weightedChoices.push(labelValue);
        }
        totalWeight += weightValue;
    }

    if (totalWeight === 0) {
        // 如果沒有定義權重，返回預設值 0 或拋出錯誤
        console.warn("權重總和為零，返回預設值 0。");
        return 0;
    }

    // 2. 隨機選擇
    // 生成一個從 0 到 (totalWeight - 1) 的隨機索引
    const randomIndex = Math.floor(Math.random() * totalWeight);

    // 3. 返回該索引對應的標記值
    return weightedChoices[randomIndex];
}
