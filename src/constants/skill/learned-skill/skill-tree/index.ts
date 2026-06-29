import {SWORD_SKILL_TREE} from "@/constants/skill/learned-skill/skill-tree/sword-skill-tree";
import {SkillTreeNode} from "@/types";
import {
    BODY_SKILL_TREE,
    GENERAL_SKILL_TREE,
    SKIN_SKILL_TREE
} from "@/constants/skill/learned-skill/skill-tree/general-skill-tree";
import {KNIFE_SKILL_TREE} from "@/constants/skill/learned-skill/skill-tree/knife-skill-tree";
import {SPELL_SKILL_TREE} from "@/constants/skill/learned-skill/skill-tree/spell-skill-tree";

export const SKILL_TREE_NODES: Record<string, SkillTreeNode> = {
    ...GENERAL_SKILL_TREE,
    ...SWORD_SKILL_TREE,
    ...KNIFE_SKILL_TREE,
    ...SPELL_SKILL_TREE,
    ...SKIN_SKILL_TREE,
    ...BODY_SKILL_TREE,

    // 狂風刺擊 (融合橫擊與刺擊)
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
    // 魔人體 (融合紫皮膚與血魔循環)
    DemonBody: {
        id: 'DemonBody',
        pathId: 'demon_body',
        tier: 3,
        fusesFrom: ['PurpleSkin', 'BloodManaLoop'],
        checkEligible: (playerStore) => {
            const hasPurple = playerStore.hasSkill('PurpleSkin');
            const hasBloodMana = playerStore.hasSkill('BloodManaLoop');
            return !!hasPurple && !!hasBloodMana;
        }
    },
};
