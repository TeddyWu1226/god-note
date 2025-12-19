import {reactive, Reactive} from "vue";
import {EquipmentType, PotionType} from "@/types";
import {Potions} from "@/constants/potion-info";

/**
 * 建立物件
 *
 * @param source 要複製的基礎物件定義。
 * @returns 一個新的、深度獨立、且響應式的物件。
 */
export function create<T extends object>(source: T): Reactive<T> {
    let deepCopy: T;

    // 1. 執行深複製
    try {
        // 使用 structuredClone：現代且最穩健的深複製標準，支持 Date, RegExp, Map, Set 及循環引用。
        if (typeof structuredClone === 'function') {
            deepCopy = structuredClone(source);
        } else {
            // 備用方案：如果環境不支持 structuredClone (例如舊版 Node.js)，退回到 JSON 方法
            // ⚠️ 注意：此方法無法複製函數或 Date/RegExp 等特殊類型。
            deepCopy = JSON.parse(JSON.stringify(source)) as T;
        }
    } catch (e) {
        console.error("深複製失敗，可能存在循環引用或無法序列化的特殊結構。", e);
        // 如果深複製失敗，退回到淺複製（這可能會導致部分屬性仍有引用關聯）
        deepCopy = {...source};
    }

    // 2. 轉換為響應式物件
    return reactive(deepCopy) as Reactive<T>;
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
 * 從指定的 Enum 中隨機取出一個值，並支援排除清單
 * @param enumObj Enum 物件
 * @param excludeList 想要排除的 Value 陣列 (例如 [SpecialEventEnum.None])
 * @returns 隨機挑選出的 Enum Value
 */
export function getRandomEnumValue<T extends object>(
    enumObj: T,
    excludeList?: T[keyof T][]
): T[keyof T] {
    // 1. 取得所有的 Enum Values
    const allValues = Object.values(enumObj) as T[keyof T][];

    // 2. 過濾掉排除清單中的值
    let filteredValues: T[keyof T][] = [];
    if (excludeList && excludeList.length > 0) {
        filteredValues = allValues.filter(value => !excludeList.includes(value));
    } else {
        filteredValues = allValues;
    }
    // 3. 安全檢查：如果過濾後沒東西了，回傳原始列表的第一個或 undefined
    if (filteredValues.length === 0) {
        console.warn("getRandomEnumValue: 過濾後沒有可選的值");
        return allValues[0];
    }

    // 4. 隨機產生索引並回傳
    const randomIndex = Math.floor(Math.random() * filteredValues.length);
    return filteredValues[randomIndex];
}

