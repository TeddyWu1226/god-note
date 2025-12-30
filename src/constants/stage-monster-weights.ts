/**
 * 區域 1-1: 初始之森 (BeginForest)
 */
export const BeginForestWeights: Record<string, number> = {
    Slime: 50,
    ForestSprout: 30,
    WoodTick: 15,
    FierceWolf: 3
};

/**
 * 區域 1-2: 下沉樹叢區 (SunkenGrove)
 */
export const SunkenGroveWeights: Record<string, number> = {
    Slime: 20,
    ForestSprout: 20,
    WoodTick: 30,
    GreenRabbit: 10,
    FierceWolf: 3
};

/**
 * 區域 1-3: 古老樹根地 (AncientRoots)
 */
export const AncientRootsWeights: Record<string, number> = {
    ForestSprout: 20,
    StingerBee: 20,
    GreenRabbit: 30,
    FierceWolf: 5,
    SmallSpider: 5
};

/**
 * 區域 1-4: 妖精結界 (FairyBarrier)
 * 特色：魔力濃厚，出現高階偽裝者與精英怪。
 */
export const FairyBarrierWeights: Record<string, number> = {
    ForestOwl: 20,
    MushroomMan: 10,

};

/**
 * 區域 1-5: 守護者巢穴 (GuardiansDen)
 * 特色：Boss 戰前的最後屏障，充滿強敵。
 */
export const GuardiansDenWeights: Record<string, number> = {
    WoodViper: 20,
    MushroomMan: 30,
    Mandragora: 10      // 稀有的曼陀羅守護著深處
};

/**
 * 無盡區域
 * 特色：Boss 戰前的最後屏障，充滿強敵。
 */
export const EndlessWeights: Record<string, number> = {
    AngelGuard: 20,
    HighPriest: 20,
    DemonInquisitor: 20,
    Monday: 10,
    Error: 1
};