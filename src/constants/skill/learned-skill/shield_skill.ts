/**
 * 盾牌相關
 */
import {SkillModel} from "src/models/skill-model";
import {PlayerStoreType, SkillParams, SkillTreeNode} from "src/types";
import {ColorText} from "src/utils/color";
import {applySkillDamage, getSkillFinalDamage} from "src/constants/fight-func";
import {useCardImpactEffect} from "src/components/Shared/CardImpactEffect/useCardImpactEffect";
import {getMonsterElement} from "src/utils/create";
import {isMatchedWeapon, WeaponSkillMapping} from "src/constants/default-const";

export class BlockBoost extends SkillModel {
    constructor() {
        super({
            id: 'BlockBoost',
            name: "格檔強化",
            icon: "skills/passive/block_boost.svg",
            type: 'passive',
            rarity: 'common',
            uniqueFields: ['格檔強化'],
        });
    }

    description(): string {
        return `完美格擋（格擋敵方暴擊）的受傷比例減少至25%。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(): Record<string, number> {
        return {};
    }
}

export class BlockExpert extends SkillModel {
    constructor() {
        super({
            id: 'BlockExpert',
            name: "格擋專精",
            icon: "skills/passive/block_expert.svg",
            type: 'passive',
            rarity: 'rare',
            uniqueFields: ['格檔強化'],
        });
    }

    description(): string {
        return `提升格擋效率並完美格擋（格擋敵方暴擊）的受傷比例減少至25%。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(): Record<string, number> {
        return {};
    }
}

export const ShieldSkillTree: Record<string, SkillTreeNode> = {
    BlockBoost: {
        id: 'BlockBoost',
        pathId: 'block_boost',
        tier: 1,
        checkEligible: (playerStore) => {
            const offhand = playerStore.info.equips?.offhand
            return offhand && offhand.name.includes('盾');
        }
    },
    BlockExpert: {
        id: 'BlockExpert',
        pathId: 'block_boost',
        tier: 2,
        evolvesFrom: ['BlockBoost'],
        checkEligible: (playerStore) => {
            const hasBase = playerStore.hasSkill('BlockBoost');
            if (!hasBase) {
                return false;
            }
            const offhand = playerStore.info.equips?.offhand
            const hasShield = offhand && offhand.name.includes('盾')
            return !!hasShield;
        }
    },
}