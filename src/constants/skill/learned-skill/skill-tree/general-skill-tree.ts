import {SkillTreeNode} from "@/types";

/**
 * Buff系列
 * */
export const GENERAL_SKILL_TREE: Record<string, SkillTreeNode> = {
    CommonHeal: {id: 'CommonHeal', pathId: 'heal', tier: 1},
    WillBuff: {id: 'WillBuff', pathId: 'will', tier: 1},
    FocusBuff: {id: 'FocusBuff', pathId: 'focus', tier: 1},
    FightBuff: {id: 'FightBuff', pathId: 'fight', tier: 1},
    AgilityBuff: {id: 'AgilityBuff', pathId: 'agility', tier: 1},
}
/**
 * 皮膚系列
 * */
export const SKIN_SKILL_TREE: Record<string, SkillTreeNode> = {
    BlueSkin: {id: 'BlueSkin', pathId: 'blue_skin', tier: 1},
    RedSkin: {id: 'RedSkin', pathId: 'red_skin', tier: 1},
    PurpleSkin: {
        id: 'PurpleSkin',
        pathId: 'purple_skin',
        tier: 2,
        fusesFrom: ['BlueSkin', 'RedSkin'],
        checkEligible: (playerStore) => {
            const hasBlue = playerStore.hasSkill('BlueSkin');
            const hasRed = playerStore.hasSkill('RedSkin');
            return !!hasBlue && !!hasRed;
        }
    },
}

/**
 * 素質強化
 * */
export const BODY_SKILL_TREE: Record<string, SkillTreeNode> = {
    PhysiqueBoost: {id: 'PhysiqueBoost', pathId: 'PhysiqueBoost', tier: 1},
    BrainPowerBoost: {id: 'BrainPowerBoost', pathId: 'BrainPowerBoost', tier: 1},
    BloodManaLoop: {
        id: 'BloodManaLoop',
        pathId: 'bloodManaLoop',
        tier: 2,
        fusesFrom: ['PhysiqueBoost', 'BrainPowerBoost'],
        checkEligible: (playerStore) => {
            const hasPhysique = playerStore.hasSkill('PhysiqueBoost');
            const hasBrain = playerStore.hasSkill('BrainPowerBoost');
            return !!hasPhysique && !!hasBrain;
        }
    },

}

