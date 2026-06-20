import {
    MistyForestWeights1,
    MistyForestWeights2,
    MistyForestWeights3, MistyForestWeights4
} from "@/constants/stage-monster-weights";

export const stageMonsterWeightsMap: Record<number, Record<string, number>> = {
    // 第一階段
    1: MistyForestWeights1,
    2: MistyForestWeights2,
    3: MistyForestWeights3,
    4: MistyForestWeights4
}
