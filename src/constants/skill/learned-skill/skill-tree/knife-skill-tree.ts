import {SkillTreeNode} from "@/types";


/**
 * 刺殺系列
 * */
export const KNIFE_SKILL_TREE: Record<string, SkillTreeNode> = {
    KnifeProficiency: {
        id: 'KnifeProficiency',
        pathId: 'knifeplay',
        tier: 1,
        checkEligible: (playerStore, trackerStore) => {
            return trackerStore.getKillCount('USE_KNIFE') >= 3;
        }
    },
    KnifeExpert: {
        id: 'KnifeExpert',
        pathId: 'knifeplay',
        tier: 2,
        evolvesFrom: ['KnifeProficiency'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('KnifeProficiency');
            return !!baseSkill?.isProficiencyMax;
        }
    },
    KnifeMaster: {
        id: 'KnifeMaster',
        pathId: 'knifeplay',
        tier: 3,
        evolvesFrom: ['KnifeExpert'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('KnifeExpert');
            return !!baseSkill?.isProficiencyMax;
        }
    },
    SwiftStrike: {
        id: 'SwiftStrike',
        pathId: 'swift_strike',
        tier: 2,
        evolvesFrom: ['VerticalSlash'],
        checkEligible: (playerStore) => {
            const hasKnifePath = playerStore.checkSkillPath('knifeplay');
            const hasVertical = playerStore.hasSkill('VerticalSlash');
            return !!hasKnifePath && !!hasVertical;
        }
    },
    Assassinate: {
        id: 'Assassinate',
        pathId: 'assassinate',
        tier: 2,
        evolvesFrom: ['Thrust'],
        checkEligible: (playerStore) => {
            const hasKnifePath = playerStore.checkSkillPath('knifeplay');
            const hasThrust = playerStore.hasSkill('Thrust');
            const currentLevel = playerStore.info.level
            return !!hasKnifePath && !!hasThrust && (currentLevel >= 15);
        }
    }
}

