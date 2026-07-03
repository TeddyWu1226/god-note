/**
 * 相關
 */
import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillParams, SkillTreeNode} from "@/types";
import {ColorText} from "@/utils/color";
import {applySkillDamage, getSkillFinalDamage} from "@/constants/fight-func";
import {useCardImpactEffect} from "@/components/Shared/CardImpactEffect/useCardImpactEffect";
import {getMonsterElement} from "@/utils/create";
import {isMatchedWeapon, WeaponCnNameMapping} from "@/constants/default-const";


export const StickSkillTree: Record<string, SkillTreeNode> = {
}