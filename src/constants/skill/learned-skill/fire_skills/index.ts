/**
 * 火焰技能相關
 */
import {SkillTreeNode} from "@/types";
import {FireBaseSkillTree} from "@/constants/skill/learned-skill/fire_skills/fire_base";
import {FireRelationSkillTree} from "@/constants/skill/learned-skill/fire_skills/fire_relation_skill";

export * from "@/constants/skill/learned-skill/fire_skills/fire_base"
export * from "@/constants/skill/learned-skill/fire_skills/fire_relation_skill"

export const FireSkillTree: Record<string, SkillTreeNode> = {
    ...FireBaseSkillTree,
    ...FireRelationSkillTree
}
