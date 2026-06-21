import {EvolutionRule} from "@/types";


/**
 * 技能進化規則
 */
export const EVOLUTION_RULES: Record<string, EvolutionRule> = {
    SwordExpert: {
        evolvedSkillId: 'SwordExpert',
        baseSkillId: 'SwordProficiency',
        checkEligible: (playerStore, trackerStore) => {
            const baseSkill = playerStore.hasSkill('SwordProficiency')
            if (!baseSkill) {
                return false;
            }
            return baseSkill.proficiency >= baseSkill.maxProficiency
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
            return baseSkill.proficiency >= baseSkill.maxProficiency
        }
    },
    KnightWay: {
        evolvedSkillId: 'KnightWay',
        baseSkillId: 'SwordProficiency',
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('SwordProficiency')
            const baseSkillMax = baseSkill ? baseSkill.proficiency >= baseSkill.maxProficiency : false
            const hasWill = playerStore.hasSkill('WillBuff')
            return baseSkillMax && !!hasWill;
        }
    },

    HeartOfRebellion: {
        evolvedSkillId: 'HeartOfRebellion',
        baseSkillId: 'BlockBoost',
        checkEligible: (playerStore) => {
            const hasBase = playerStore.info.skills?.some((s: any) => s.id === 'BlockBoost');
            const hasKnightWay = playerStore.info.skills?.some((s: any) => s.id === 'KnightWay');
            return hasBase && hasKnightWay;
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
    }
};
