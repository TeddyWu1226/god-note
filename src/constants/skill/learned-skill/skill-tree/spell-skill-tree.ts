import {SkillTreeNode} from "@/types";


/**
 * 法術相關
 * */
export const SPELL_SKILL_TREE: Record<string, SkillTreeNode> = {
    // 法術提升
    SpellProficiency: {
        id: 'SpellProficiency',
        pathId: 'spellplay',
        tier: 1,
        checkEligible: (playerStore, trackerStore) => {
            return trackerStore.getKillCount('USE_SPELL') >= 3;
        }
    },

    // 護盾提升
    ReadingProficiency: {id: 'ReadingProficiency', pathId: 'reading', tier: 1},
}

