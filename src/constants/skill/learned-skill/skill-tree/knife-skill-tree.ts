import {SkillTreeNode} from "@/types";


/**
 * 刺殺系列
 * */
export const KNIFE_SKILL_TREE: Record<string, SkillTreeNode> = {
    KnifeProficiency: {
        id: 'KnifeProficiency',
        pathId: 'knifeplay',
        tier: 1,
        isStarter: true,
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
            return !!hasKnifePath && !!hasThrust;
        }
    },
    ConcealBreath: {
        id: 'ConcealBreath',
        pathId: 'conceal_breath',
        tier: 2,
        evolvesFrom: ['AgilityBuff'],
        checkEligible: (playerStore) => {
            const hasKnifePath = playerStore.checkSkillPath('knifeplay');
            const hasAgility = playerStore.hasSkill('AgilityBuff');
            return !!hasKnifePath && !!hasAgility;
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
}

