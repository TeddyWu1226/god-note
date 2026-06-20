import {PoisonSlime} from "@/constants/monsters/monster-info/1-misty-forest-monster";

/**
 * 第一階段
 */
export const MistyForestWeights1: Record<string, number> = {
    Slime: 50,
    ForestSprout: 30,
    WoodTick: 10,
    FierceWolf: 3
};

export const MistyForestWeights2: Record<string, number> = {
    Slime: 20,
    ForestSprout: 20,
    WoodTick: 30,
    FierceWolf: 3
};

export const MistyForestWeights3: Record<string, number> = {
    Slime: 5,
    WoodTick: 30,
    StingerBee: 20,
    FierceWolf: 5,
    SmallSpider: 5,
    PoisonSlime: 5
};

export const MistyForestWeights4: Record<string, number> = {
    PoisonSlime: 10,
    WoodTick: 30,
    StingerBee: 30,
    SmallSpider: 5
};

/**
 * 無盡區域
 */
export const EndlessWeights: Record<string, number> = {
    AngelGuard: 20,
    HighPriest: 20,
    DemonInquisitor: 20,
    Monday: 10,
    Error: 1
};