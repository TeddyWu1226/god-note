import {EvolutionRule} from "@/types";


/**
 * 技能進化規則
 */
export const EVOLUTION_RULES: Record<string, EvolutionRule> = {
    SwordExpert: {
        evolvedSkillId: 'SwordExpert',
        baseSkillId: 'SwordProficiency',
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('SwordProficiency')
            if (!baseSkill) {
                return false;
            }
            return baseSkill.isProficiencyMax
        }
    },
    SwordMaster: {
        evolvedSkillId: 'SwordMaster',
        baseSkillId: 'SwordExpert',
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('SwordExpert')
            if (!baseSkill) {
                return false;
            }
            return baseSkill.isProficiencyMax
        }
    },
    KnightWay: {
        evolvedSkillId: 'KnightWay',
        baseSkillId: 'SwordProficiency',
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('SwordProficiency')
            if (!baseSkill) {
                return false;
            }
            const hasWill = playerStore.hasSkill('WillBuff')
            return baseSkill.isProficiencyMax && !!hasWill;
        }
    },

    HeartOfRebellion: {
        evolvedSkillId: 'HeartOfRebellion',
        baseSkillId: 'BlockBoost',
        checkEligible: (playerStore) => {
            const hasBase = playerStore.hasSkill('BlockBoost');
            const hasKnightWay = playerStore.hasSkill('KnightWay');
            return !!hasBase && !!hasKnightWay;
        }
    },
    PurpleSkin: {
        evolvedSkillId: 'PurpleSkin',
        baseSkillId: 'RedSkin',
        fuseSkillIds: ['BlueSkin', 'RedSkin'],
        checkEligible: (playerStore) => {
            const hasBlue = playerStore.hasSkill('BlueSkin');
            const hasRed = playerStore.hasSkill('RedSkin');
            return !!hasBlue && !!hasRed;
        }
    },
    Flurry: {
        evolvedSkillId: 'Flurry',
        fuseSkillIds: ['HorizontalSlash', 'Thrust'],
        checkEligible: (playerStore) => {
            const hasVertical = playerStore.hasSkill('VerticalSlash');
            const hasHorizontal = playerStore.hasSkill('HorizontalSlash');
            const hasThrust = playerStore.hasSkill('Thrust');
            return !!hasVertical && !!hasHorizontal && !!hasThrust;
        }
    },
    ContinuousSwordVertical: {
        evolvedSkillId: 'ContinuousSwordVertical',
        baseSkillId: 'VerticalSlash',
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('VerticalSlash');
            if (!baseSkill) return false
            return playerStore.checkSkillUniqueFields('SwordProficiency');
        }
    },
    ContinuousSwordHorizontal: {
        evolvedSkillId: 'ContinuousSwordHorizontal',
        baseSkillId: 'HorizontalSlash',
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('HorizontalSlash');
            if (!baseSkill) return false
            return playerStore.checkSkillUniqueFields('SwordProficiency');
        }
    },
    ContinuousSwordPoint: {
        evolvedSkillId: 'ContinuousSwordPoint',
        baseSkillId: 'Thrust',
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('Thrust');
            if (!baseSkill) return false
            return playerStore.checkSkillUniqueFields('SwordProficiency');
        }
    }
};
