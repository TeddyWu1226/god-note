// 💡 技能樹與互斥流派定義表
import {SkillTreeNode} from "@/types";

export const SWORD_SKILL_TREE: Record<string, SkillTreeNode> = {
    // 1. 劍術流派 (互斥，只能學一，二階後進化)
    SwordProficiency: {
        id: 'SwordProficiency',
        pathId: 'swordplay',
        tier: 1,
        isStarter: true,
        checkEligible: (playerStore, trackerStore) => {
            return trackerStore.getKillCount('USE_SWORD') >= 3;
        }
    },
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

    VerticalSlash: {id: 'VerticalSlash', pathId: 'vertical_slash', tier: 1, isStarter: true},
    HorizontalSlash: {id: 'HorizontalSlash', pathId: 'horizontal_slash', tier: 1, isStarter: true},
    Thrust: {id: 'Thrust', pathId: 'thrust', tier: 1, isStarter: true},
    // 進階劍技三招 (只能三選一)
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

    // 格擋強化系列
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
};
