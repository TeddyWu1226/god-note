/**
 * 相關
 */
import {SkillModel} from "src/models/skill-model";
import {PlayerStoreType, SkillParams, SkillTreeNode} from "src/types";
import {ColorText} from "src/utils/color";
import {applySkillDamage, getSkillFinalDamage} from "src/constants/fight-func";
import {useCardImpactEffect} from "src/components/Shared/CardImpactEffect/useCardImpactEffect";
import {getMonsterElement} from "src/utils/create";
import {isMatchedWeapon, WeaponSkillMapping} from "src/constants/default-const";


export const StickSkillTree: Record<string, SkillTreeNode> = {
}