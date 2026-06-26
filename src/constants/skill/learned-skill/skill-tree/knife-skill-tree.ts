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
}

