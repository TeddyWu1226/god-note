import {CrimsonSalamander, GlacierLizard} from "@/constants/monsters/monster-info/2-red-mountain-monster";

/**
 * 第一階段：迷霧森林 (Misty Forest)
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
    FierceWolf: 5,
};

export const MistyForestWeights3: Record<string, number> = {
    Slime: 5,
    WoodTick: 30,
    StingerBee: 20,
    FierceWolf: 5,
    SmallSpider: 5,
    PoisonSlime: 5,
    WoodGuardian: 5
};

export const MistyForestWeights4: Record<string, number> = {
    PoisonSlime: 10,
    WoodTick: 30,
    StingerBee: 30,
    SmallSpider: 10,
    WoodGuardian: 10
};

/**
 * 第二階段：赤之山脈 (Red Mountain)
 * 先冰再火
 */
export const RedMountainWeights1: Record<string, number> = {
    FrostSlime: 40,
    IceBat: 40,
    FrostGolem: 1
};

export const RedMountainWeights2: Record<string, number> = {
    FrostSlime: 33,
    IceBat: 33,
    GlacierLizard: 15,
    FireBat: 5,
    LavaSlime: 5,
    FrostGolem: 5
};

export const RedMountainWeights3: Record<string, number> = {
    FrostSlime: 10,
    IceBat: 10,
    GlacierLizard: 15,
    FireBat: 33,
    LavaSlime: 33,
    CrimsonSalamander: 15,
    FrostGolem: 5,
    ObsidianGolem: 5
};

export const RedMountainWeights4: Record<string, number> = {
    FireBat: 40,
    LavaSlime: 40,
    CrimsonSalamander: 30,
    ObsidianGolem: 10
};

/**
 * 第三階段：大荒地 (Giants Wasteland)
 */
export const GiantsWastelandWeights1: Record<string, number> = {
    SandSlime: 40,
    WastelandVulture: 30,
    RockBull: 10,

};

export const GiantsWastelandWeights2: Record<string, number> = {
    SandSlime: 20,
    WastelandVulture: 20,
    RockBull: 30,
    UnstableExplosiveBee: 10,
    MutatedBloodworm: 5,
};

export const GiantsWastelandWeights3: Record<string, number> = {
    RockBull: 25,
    WastelandScavenger: 25,
    UnstableExplosiveBee: 25,
    MutatedBloodworm: 25
};

export const GiantsWastelandWeights4: Record<string, number> = {

    WastelandScavenger: 30,
    MutatedBloodworm: 50
};

/**
 * 第四階段：分裂之谷 (Split Canyon)
 */
export const SplitCanyonWeights1: Record<string, number> = {
    RiftSlime: 50,
    CanyonHarpy: 30,
    WindCutter: 15
};

export const SplitCanyonWeights2: Record<string, number> = {
    RiftSlime: 20,
    CanyonHarpy: 20,
    WindCutter: 30,
    ThunderLizard: 20
};

export const SplitCanyonWeights3: Record<string, number> = {
    WindCutter: 20,
    ThunderLizard: 30,
    SkySlasher: 10,
    EchoStone: 10,
    CanyonSpecter: 15,
    ShadowLeopard: 15
};

export const SplitCanyonWeights4: Record<string, number> = {
    SkySlasher: 25,
    EchoStone: 25,
    CanyonSpecter: 25,
    ShadowLeopard: 25
};

/**
 * 第五階段：終焉深淵 (End Abyss)
 */
export const EndAbyssWeights1: Record<string, number> = {
    AbyssSlime: 50,
    VoidGazer: 30,
    ShadowGargoyle: 15
};

export const EndAbyssWeights2: Record<string, number> = {
    AbyssSlime: 20,
    VoidGazer: 20,
    ShadowGargoyle: 30,
    ChaosHorror: 20
};

export const EndAbyssWeights3: Record<string, number> = {
    ShadowGargoyle: 20,
    ChaosHorror: 30,
    AbyssReaper: 10,
    VoidBeast: 10,
    DarkCorruptor: 15,
    CursedKnight: 15
};

export const EndAbyssWeights4: Record<string, number> = {
    AbyssReaper: 25,
    VoidBeast: 25,
    DarkCorruptor: 25,
    CursedKnight: 25
};

/**
 * 第六階段：審判之日 (Judgment Stage)
 */
export const JudgmentStageWeights1: Record<string, number> = {
    JudgmentSlime: 40,
    LightInquisitor: 30,
    AngelSentry: 30
};

export const JudgmentStageWeights2: Record<string, number> = {
    JudgmentSlime: 20,
    LightInquisitor: 20,
    AngelSentry: 30,
    HolyArchon: 30
};

export const JudgmentStageWeights3: Record<string, number> = {
    AngelSentry: 20,
    HolyArchon: 30,
    SeraphimGuard: 15,
    DivineExecutioner: 15,
    JudgmentWatcher: 10,
    FaithZealot: 10
};

export const JudgmentStageWeights4: Record<string, number> = {
    SeraphimGuard: 25,
    DivineExecutioner: 25,
    JudgmentWatcher: 25,
    FaithZealot: 25
};

/**
 * 無盡區域 (Endless Area)
 */
export const EndlessWeights: Record<string, number> = {
    AngelGuard: 20,
    HighPriest: 20,
    DemonInquisitor: 20,
    Monday: 10,
    Error: 1
};