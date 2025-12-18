import {RoomWeights, TrapezoidData} from "@/types";
import {RoomEnum} from "@/enums/room-enum";

/**
 * 根據自定義權重物件，隨機返回一個標記值 (0, 1, 2, 3, 4, ...)
 * * @param weights 標記權重物件，例如 { 0: 1, 1: 5, 2: 2, 3: 1, 4: 1 }
 * @returns 隨機選中的標記值 (number)
 */
function getRandomLabelByWeight(weights: RoomWeights): number {

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
 * 根據自定義權重生成一個梯形資料結構。
 * 最多一層不超過21
 *
 * @param maxLayers 總共的層數 (預設為 19)。
 * @param weights 標記權重物件，例如 { 0: 2, 1: 1, 2: 1, 3: 1, 4: 1 }。
 * @param maxRooms 每層房間數量上限
 * @returns 梯形資料結構 (TrapezoidData)。
 */
export function createTrapezoidDataWithWeights(
    weights: RoomWeights,
    maxLayers: number = 18,
    maxRooms: number = 17,
): TrapezoidData {

    const result: TrapezoidData = [];

    // ⭐️ 移除 customLabelCycle 的建立和打亂，我們不再需要它。

    // --- 建立梯形結構並分配標記 (徹底隨機化) ---
    for (let i = 1; i <= maxLayers; i++) {
        // 第 i 層的元素數量：E_i = 1 + (i - 1) * 2
        let elementsInLayer = 1 + (i - 1) * 2;
        if (elementsInLayer >= maxRooms) {
            elementsInLayer = maxRooms
        }
        const layer: number[] = [];

        for (let j = 0; j < elementsInLayer; j++) {

            // ⭐️ 關鍵修改點：直接呼叫 getRandomLabelByWeight
            // 每次迴圈都會獨立執行一次權重隨機選擇
            const labelValue = getRandomLabelByWeight(weights);
            layer.push(labelValue);
        }

        result.push(layer);
    }
    // 第19層都是休息
    result.push([RoomEnum.Rest.value]);
    // 第20層都是BOSS
    result.push([RoomEnum.Boss.value]);

    return result;
}