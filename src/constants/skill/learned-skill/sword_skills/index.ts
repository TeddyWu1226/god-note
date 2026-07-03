/**
 * 劍術相關
 */
import {SkillTreeNode} from "@/types";
import {SwordBaseSkillTree} from "@/constants/skill/learned-skill/sword_skills/sword_base";
import {SwordRelationSkillTree} from "@/constants/skill/learned-skill/sword_skills/sword_relation_skill";

export * from "@/constants/skill/learned-skill/sword_skills/sword_base"
export * from "@/constants/skill/learned-skill/sword_skills/sword_relation_skill"

export const SwordSkillTree: Record<string, SkillTreeNode> = {
    ...SwordBaseSkillTree,
    ...SwordRelationSkillTree
}