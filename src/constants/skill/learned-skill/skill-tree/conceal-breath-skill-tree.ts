import {SkillTreeNode} from "@/types";


/**
 * 隱蔽技能
 * */
export const CONCEAL_BREATH_SKILL_TREE: Record<string, SkillTreeNode> = {
    ConcealBreath: {
        id: 'ConcealBreath',
        pathId: 'conceal_breath',
        tier: 2,
        evolvesFrom: ['AgilityBuff'],
        checkEligible: (playerStore) => {
            const hasBase = playerStore.hasSkill('AgilityBuff');
            if (!hasBase) {
                return false;
            }
            const currentDodge = playerStore.finalStats.dodge
            return currentDodge >= 20;
        }
    },
    ConcealBreathInstinct: {
        id: 'ConcealBreathInstinct',
        pathId: 'conceal_breath',
        tier: 3,
        evolvesFrom: ['ConcealBreath'],
        checkEligible: (playerStore) => {
            if (!playerStore.hasSkill('ConcealBreath')) {
                return false;
            }
            const currentLevel = playerStore.info.level
            return currentLevel >= 20;
        }
    },

}

