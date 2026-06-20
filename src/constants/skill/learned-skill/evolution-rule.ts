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
    Cleave: {
        evolvedSkillId: 'Cleave',
        baseSkillId: 'VerticalSlash',
        checkEligible: (playerStore) => {
            const hasBase = playerStore.info.skills?.some((s: any) => s.id === 'VerticalSlash');
            const hasMastery = playerStore.info.skills?.some((s: any) =>
                s.id === 'SwordProficiency' || s.id === 'SwordExpert' || s.id === 'SwordMaster' || s.id === 'KnightWay'
            );
            const baseSkill = playerStore.info.skills?.find((s: any) => s.id === 'VerticalSlash');
            const isMaxProf = baseSkill ? (baseSkill.proficiency >= baseSkill.maxProficiency) : false;
            return hasBase && hasMastery && isMaxProf;
        }
    },
    VerticalSlashMaster: {
        evolvedSkillId: 'VerticalSlashMaster',
        baseSkillId: 'Cleave',
        checkEligible: (playerStore) => {
            const hasBase = playerStore.info.skills?.some((s: any) => s.id === 'Cleave');
            const baseSkill = playerStore.info.skills?.find((s: any) => s.id === 'Cleave');
            const isMaxProf = baseSkill ? (baseSkill.proficiency >= baseSkill.maxProficiency) : false;
            return hasBase && isMaxProf;
        }
    },
    SwordQi: {
        evolvedSkillId: 'SwordQi',
        baseSkillId: 'HorizontalSlash',
        checkEligible: (playerStore) => {
            const hasBase = playerStore.info.skills?.some((s: any) => s.id === 'HorizontalSlash');
            const hasMastery = playerStore.info.skills?.some((s: any) =>
                s.id === 'SwordProficiency' || s.id === 'SwordExpert' || s.id === 'SwordMaster' || s.id === 'KnightWay'
            );
            const baseSkill = playerStore.info.skills?.find((s: any) => s.id === 'HorizontalSlash');
            const isMaxProf = baseSkill ? (baseSkill.proficiency >= baseSkill.maxProficiency) : false;
            return hasBase && hasMastery && isMaxProf;
        }
    },
    HorizontalSlashMaster: {
        evolvedSkillId: 'HorizontalSlashMaster',
        baseSkillId: 'SwordQi',
        checkEligible: (playerStore) => {
            const hasBase = playerStore.info.skills?.some((s: any) => s.id === 'SwordQi');
            const baseSkill = playerStore.info.skills?.find((s: any) => s.id === 'SwordQi');
            const isMaxProf = baseSkill ? (baseSkill.proficiency >= baseSkill.maxProficiency) : false;
            return hasBase && isMaxProf;
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
        baseSkillId: 'BlueSkin',
        fuseSkillIds: ['RedSkin'],
        checkEligible: (playerStore) => {
            const hasBlue = playerStore.info.skills?.some((s: any) => s.id === 'BlueSkin');
            const hasRed = playerStore.info.skills?.some((s: any) => s.id === 'RedSkin');
            return hasBlue && hasRed;
        }
    },
    Flurry: {
        evolvedSkillId: 'Flurry',
        fuseSkillIds: ['HorizontalSlash', 'Thrust'],
        checkEligible: (playerStore) => {
            const hasVertical = playerStore.info.skills?.some((s: any) => s.id === 'VerticalSlash');
            const hasHorizontal = playerStore.info.skills?.some((s: any) => s.id === 'HorizontalSlash');
            const hasThrust = playerStore.info.skills?.some((s: any) => s.id === 'Thrust');
            return hasVertical && hasHorizontal && hasThrust;
        }
    }
};
