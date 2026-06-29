import {SkillTreeNode} from "@/types";

/**
 * Buff系列
 * */
export const GENERAL_SKILL_TREE: Record<string, SkillTreeNode> = {
    CommonHeal: {id: 'CommonHeal', pathId: 'heal', tier: 1, isStarter: true},
    WillBuff: {id: 'WillBuff', pathId: 'will', tier: 1, isStarter: true},
    FocusBuff: {id: 'FocusBuff', pathId: 'focus', tier: 1, isStarter: true},
    FightBuff: {id: 'FightBuff', pathId: 'fight', tier: 1, isStarter: true},

}
/**
 * 皮膚系列
 * */
export const SKIN_SKILL_TREE: Record<string, SkillTreeNode> = {
    BlueSkin: {id: 'BlueSkin', pathId: 'blue_skin', tier: 1, isStarter: true},
    RedSkin: {id: 'RedSkin', pathId: 'red_skin', tier: 1, isStarter: true},
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
    PhysiqueBoost: {id: 'PhysiqueBoost', pathId: 'PhysiqueBoost', tier: 1, isStarter: true},
    BrainPowerBoost: {id: 'BrainPowerBoost', pathId: 'BrainPowerBoost', tier: 1, isStarter: true},
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

