export interface SkillTreeNode {
    id: string;             // 技能 ID
    pathId: string;         // 所屬唯一流派 ID
    tier: number;           // 技能階級 (Tier 1: 基礎, Tier 2: 進階, Tier 3: 大師)
    isStarter?: boolean;    // 是否為流派的起手技能 (Tier 1)
    evolvesFrom?: string[];  // 可從哪些前置技能進階而來 (學習時替換前置，任一即可)
    fusesFrom?: string[];    // 需要哪些技能融合而成 (學習時消耗全部原料，需全數滿足)
    checkEligible?: (playerStore: any, trackerStore: any) => boolean; // 額外的學習條件
}

// 💡 技能樹與互斥流派定義表
export const SKILL_TREE_NODES: Record<string, SkillTreeNode> = {
    // 1. 劍術流派 (互斥，只能學一，二階後進化)
    SwordProficiency: {id: 'SwordProficiency', pathId: 'swordplay', tier: 1, isStarter: true},
    SwordExpert: {
        id: 'SwordExpert',
        pathId: 'swordplay',
        tier: 2,
        evolvesFrom: ['SwordProficiency'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('SwordProficiency');
            return !!baseSkill?.isProficiencyMax;
        }
    },
    SwordMaster: {
        id: 'SwordMaster',
        pathId: 'swordplay',
        tier: 3,
        evolvesFrom: ['SwordExpert'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('SwordExpert');
            return !!baseSkill?.isProficiencyMax;
        }
    },
    KnightWay: {
        id: 'KnightWay',
        pathId: 'swordplay',
        tier: 2,
        evolvesFrom: ['SwordProficiency'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('SwordProficiency');
            const hasWill = playerStore.hasSkill('WillBuff');
            return !!baseSkill?.isProficiencyMax && !!hasWill;
        }
    },

    // 2. 進階劍技三招 (同屬一個流派，只能三選一)
    ContinuousSwordVertical: {
        id: 'ContinuousSwordVertical',
        pathId: 'continuous_swordplay',
        tier: 2,
        evolvesFrom: ['VerticalSlash'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('VerticalSlash');
            if (!baseSkill) return false;
            return playerStore.checkSkillPath('swordplay');
        }
    },
    ContinuousSwordHorizontal: {
        id: 'ContinuousSwordHorizontal',
        pathId: 'continuous_swordplay',
        tier: 2,
        evolvesFrom: ['HorizontalSlash'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('HorizontalSlash');
            if (!baseSkill) return false;
            return playerStore.checkSkillPath('swordplay');
        }
    },
    ContinuousSwordPoint: {
        id: 'ContinuousSwordPoint',
        pathId: 'continuous_swordplay',
        tier: 2,
        evolvesFrom: ['Thrust'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('Thrust');
            if (!baseSkill) return false;
            return playerStore.checkSkillPath('swordplay');
        }
    },

    // 3. 豎擊系列 (互斥，主動攻擊技能)
    VerticalSlash: {id: 'VerticalSlash', pathId: 'vertical_slash', tier: 1, isStarter: true},
    Cleave: {
        id: 'Cleave',
        pathId: 'vertical_slash',
        tier: 2,
        evolvesFrom: ['VerticalSlash'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('VerticalSlash');
            return !!baseSkill?.isProficiencyMax;
        }
    },
    VerticalSlashMaster: {
        id: 'VerticalSlashMaster',
        pathId: 'vertical_slash',
        tier: 3,
        evolvesFrom: ['Cleave'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('Cleave');
            return !!baseSkill?.isProficiencyMax;
        }
    },

    // 4. 橫擊系列 (互斥，主動攻擊技能)
    HorizontalSlash: {id: 'HorizontalSlash', pathId: 'horizontal_slash', tier: 1, isStarter: true},
    SwordQi: {
        id: 'SwordQi',
        pathId: 'horizontal_slash',
        tier: 2,
        evolvesFrom: ['HorizontalSlash'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('HorizontalSlash');
            return !!baseSkill?.isProficiencyMax;
        }
    },
    HorizontalSlashMaster: {
        id: 'HorizontalSlashMaster',
        pathId: 'horizontal_slash',
        tier: 3,
        evolvesFrom: ['SwordQi'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('SwordQi');
            return !!baseSkill?.isProficiencyMax;
        }
    },

    // 5. 格擋強化系列 (互斥)
    BlockBoost: {id: 'BlockBoost', pathId: 'block_boost', tier: 1, isStarter: true},
    HeartOfRebellion: {
        id: 'HeartOfRebellion',
        pathId: 'block_boost',
        tier: 2,
        evolvesFrom: ['BlockBoost'],
        checkEligible: (playerStore) => {
            const hasKnightWay = playerStore.hasSkill('KnightWay');
            return !!hasKnightWay;
        }
    },

    // 6. 皮膚系列 (因為融合需要同時擁有，所以藍/紅分屬不同流派，紫皮膚代表融合後的新流派)
    BlueSkin: {id: 'BlueSkin', pathId: 'blue_skin', tier: 1, isStarter: true},
    RedSkin: {id: 'RedSkin', pathId: 'red_skin', tier: 1, isStarter: true},
    PurpleSkin: {
        id: 'PurpleSkin',
        pathId: 'purple_skin',
        tier: 2,
        fusesFrom: ['BlueSkin', 'RedSkin'],
        checkEligible: (playerStore) => {
            const hasBlue = playerStore.hasSkill('BlueSkin');
            const hasRed = playerStore.hasSkill('RedSkin');
            return !!hasBlue && !!hasRed;
        }
    },

    // 7. 融合技能：狂風刺擊 (融合橫擊與刺擊)
    Flurry: {
        id: 'Flurry',
        pathId: 'flurry',
        tier: 2,
        fusesFrom: ['HorizontalSlash', 'Thrust'],
        checkEligible: (playerStore) => {
            const hasVertical = playerStore.hasSkill('VerticalSlash');
            const hasHorizontal = playerStore.hasSkill('HorizontalSlash');
            const hasThrust = playerStore.hasSkill('Thrust');
            return !!hasVertical && !!hasHorizontal && !!hasThrust;
        }
    },

    // 8. 其他常規基礎技能 (各自為獨立流派，無互斥與進化關係)
    CommonHeal: {id: 'CommonHeal', pathId: 'heal', tier: 1, isStarter: true},
    Thrust: {id: 'Thrust', pathId: 'thrust', tier: 1, isStarter: true},
    WillBuff: {id: 'WillBuff', pathId: 'will', tier: 1, isStarter: true},
    FocusBuff: {id: 'FocusBuff', pathId: 'focus', tier: 1, isStarter: true},
    FightBuff: {id: 'FightBuff', pathId: 'fight', tier: 1, isStarter: true},
    PhysiqueBoost: {id: 'PhysiqueBoost', pathId: 'physique', tier: 1, isStarter: true},
    KnifeProficiency: {id: 'KnifeProficiency', pathId: 'knifeplay', tier: 1, isStarter: true},
    SpellProficiency: {id: 'SpellProficiency', pathId: 'spellplay', tier: 1, isStarter: true},
    ReadingProficiency: {id: 'ReadingProficiency', pathId: 'reading', tier: 1, isStarter: true},
};
