import * as StageMonsterWeights from "@/constants/stage-monster-weights";

export const stageMonsterWeightsMap: Record<number, Record<number, Record<string, number>>> = {
    1: {
        1: StageMonsterWeights.MistyForestWeights1,
        2: StageMonsterWeights.MistyForestWeights2,
        3: StageMonsterWeights.MistyForestWeights3,
        4: StageMonsterWeights.MistyForestWeights4,
    },
    2: {
        1: StageMonsterWeights.RedMountainWeights1,
        2: StageMonsterWeights.RedMountainWeights2,
        3: StageMonsterWeights.RedMountainWeights3,
        4: StageMonsterWeights.RedMountainWeights4,
    },
    3: {
        1: StageMonsterWeights.GiantsWastelandWeights1,
        2: StageMonsterWeights.GiantsWastelandWeights2,
        3: StageMonsterWeights.GiantsWastelandWeights3,
        4: StageMonsterWeights.GiantsWastelandWeights4,
    },
    4: {
        1: StageMonsterWeights.SplitCanyonWeights1,
        2: StageMonsterWeights.SplitCanyonWeights2,
        3: StageMonsterWeights.SplitCanyonWeights3,
        4: StageMonsterWeights.SplitCanyonWeights4,
    },
    5: {
        1: StageMonsterWeights.EndAbyssWeights1,
        2: StageMonsterWeights.EndAbyssWeights2,
        3: StageMonsterWeights.EndAbyssWeights3,
        4: StageMonsterWeights.EndAbyssWeights4,
    },
    6: {
        1: StageMonsterWeights.JudgmentStageWeights1,
        2: StageMonsterWeights.JudgmentStageWeights2,
        3: StageMonsterWeights.JudgmentStageWeights3,
        4: StageMonsterWeights.JudgmentStageWeights4,
    }
};
