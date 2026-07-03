/**
 * 匕首相關
 */
import {SkillTreeNode} from "@/types";
import {KnifeBaseSkillTree} from "@/constants/skill/learned-skill/knife_skills/knife_base";
import {KnifeRelationSkillTree} from "@/constants/skill/learned-skill/knife_skills/knife_relation_skill";

export * from "@/constants/skill/learned-skill/knife_skills/knife_base"
export * from "@/constants/skill/learned-skill/knife_skills/knife_relation_skill"

export const KnifeSkillTree: Record<string, SkillTreeNode> = {
    ...KnifeBaseSkillTree,
    ...KnifeRelationSkillTree
}
