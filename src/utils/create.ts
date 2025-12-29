import {reactive, Reactive} from "vue";
import {EquipmentType, UsableType, RoomWeights} from "@/types";

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
 * 從多個裝備庫中，根據品質隨機抽取道具
 * @param count 想要獲得的道具數量
 * @param quality 目標品質
 * @param allowDuplicate 是否允許重複抽取 (預設為 true)
 * @param dataSources 裝備 Record 對象
 * @returns 包含隨機道具的陣列
 */
export const getRandomItemsByQuality = (
    count: number,
    quality: number,
    allowDuplicate: boolean = true,
    ...dataSources: Record<string, EquipmentType | UsableType>[]
): (EquipmentType | UsableType)[] => {
    // 1. 合併並過濾出符合品質的道具池
    const pool = dataSources
        .flatMap(source => Object.values(source))
        .filter(item => item.quality === quality);

    if (pool.length === 0) {
        console.warn(`未找到品質為 ${quality} 的道具。`);
        return [];
    }

    const results: (EquipmentType | UsableType)[] = [];

    if (allowDuplicate) {
        // --- 情況 A: 允許重複 ---
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * pool.length);
            results.push(create(pool[randomIndex]) as EquipmentType | UsableType);
        }
    } else {
        // --- 情況 B: 不允許重複 ---
        // 如果要求的數量超過池子總數，強制下修數量以免死循環
        const finalCount = Math.min(count, pool.length);

        // 拷貝一份池子用來做「抽取後刪除」
        const tempPool = [...pool];
        for (let i = 0; i < finalCount; i++) {
            const randomIndex = Math.floor(Math.random() * tempPool.length);
            // 使用 splice 移除已抽中的項
            const selectedItem = tempPool.splice(randomIndex, 1)[0];
            results.push(create(selectedItem) as EquipmentType | UsableType);
        }
    }

    return results;
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

/**
 * 通用權重隨機選取工具
 * @param weightMap 權重對照表 (例如 { 'Slime': 70, 'Wolf': 30 })
 * @param dataPool 資料來源池 (例如 Monster 物件、Equipment 物件)
 * @param shouldClone 是否需要深拷貝 (預設為 true)
 * @returns 隨機選出的實例
 */
export const getRandomItemByWeight = <T extends object>(
    weightMap: Record<string, number>,
    dataPool: Record<string, T>,
    shouldClone: boolean = true
): T => {
    const keys = Object.keys(weightMap);

    // 1. 過濾掉 dataPool 中不存在的 key，避免 undefined 型別問題
    const validKeys = keys.filter(key => key in dataPool);

    if (validKeys.length === 0) {
        throw new Error("getRandomItemByWeight: No valid keys found in dataPool");
    }

    const totalWeight = validKeys.reduce((sum, key) => sum + weightMap[key], 0);
    let randomNum = Math.random() * totalWeight;

    for (const key of validKeys) {
        if (randomNum < weightMap[key]) {
            const item = dataPool[key]; // 此時 TS 知道 item 必為 T
            return shouldClone ? create<T>(item) : item;
        }
        randomNum -= weightMap[key];
    }

    // 2. 兜底處理
    const fallbackItem = dataPool[validKeys[0]];
    return shouldClone ? create<T>(fallbackItem) : fallbackItem;
};


export const Sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));