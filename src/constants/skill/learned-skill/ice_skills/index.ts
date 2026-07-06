/**
 * 冰霜技能相關
 */
import {SkillTreeNode} from "@/types";
import {IceBaseSkillTree} from "@/constants/skill/learned-skill/ice_skills/ice_base";
import {IceRelationSkillTree} from "@/constants/skill/learned-skill/ice_skills/ice_relation_skill";

export * from "./ice_base";
export * from "./ice_relation_skill";

export const IceSkillTree: Record<string, SkillTreeNode> = {
    ...IceBaseSkillTree,
    ...IceRelationSkillTree
};
