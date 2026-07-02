// 💡 技能樹與互斥流派定義表
import {SkillTreeNode} from "@/types";

export const BLOCK_SKILL_TREE: Record<string, SkillTreeNode> = {
    // 格擋強化系列
    BlockBoost: {
        id: 'BlockBoost',
        pathId: 'block_boost',
        tier: 1,
        checkEligible: (playerStore) => {
            const offhand = playerStore.info.equips?.offhand
            return offhand && offhand.name.includes('盾');
        }
    },
    BlockExpert: {
        id: 'BlockExpert',
        pathId: 'block_boost',
        tier: 2,
        evolvesFrom: ['BlockBoost'],
        checkEligible: (playerStore) => {
            const offhand = playerStore.info.equips?.offhand
            const hasShield = offhand && offhand.name.includes('盾')
            const currentLevel = playerStore.info.level
            return hasShield && (currentLevel >= 10)
        }
    },
    HeartOfRebellion: {
        id: 'HeartOfRebellion',
        pathId: 'block_boost',
        tier: 3,
        evolvesFrom: ['BlockExpert'],
        checkEligible: (playerStore) => {
            const hasBase = playerStore.hasSkill('BlockExpert');
            if (!hasBase) {
                return false;
            }
            const hasKnightWay = playerStore.hasSkill('KnightWay');
            if (!hasKnightWay) {
                return false;
            }
            const offhand = playerStore.info.equips?.offhand
            const hasShield = offhand && offhand.name.includes('盾')
            const currentLevel = playerStore.info.level
            return hasShield && (currentLevel >= 20)
        }
    },
};
