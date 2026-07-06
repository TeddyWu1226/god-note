import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillTreeNode} from "@/types";

/**
 * 元素適性: 冰
 */
export class IceAdaptability extends SkillModel {
    constructor() {
        super({
            id: 'IceAdaptability',
            name: "元素適性: 冰",
            icon: "skills/magic/ice_adaptability.svg",
            type: 'passive',
            rarity: 'common'
        });
    }

    get spRegen(): number {
        return 2;
    }

    description(): string {
        return `提升自身法力回復值 ${this.spRegen} 點，可以開始學習冰系魔法。`;
    }

    getPassiveBonus(): Record<string, number> {
        return {
            spRegen: this.spRegen
        };
    }

    protected execute(): boolean {
        return true;
    }
}

/**
 * 元素進階: 冰
 */
export class IceAdvancement extends SkillModel {
    constructor() {
        super({
            id: 'IceAdvancement',
            name: "元素進階: 冰",
            icon: "skills/magic/ice_advancement.svg",
            type: 'passive',
            rarity: 'rare'
        });
    }

    get spRegen(): number {
        return 3;
    }

    get hit(): number {
        return 20;
    }

    get defend(): number {
        return 5;
    }

    description(): string {
        return `提升自身法力回復值 ${this.spRegen} 點，提升命中值 ${this.hit} 點，提升物理防禦力 ${this.defend} 點。`;
    }

    getPassiveBonus(): Record<string, number> {
        return {
            spRegen: this.spRegen,
            hit: this.hit,
            adDefend: this.defend
        };
    }

    protected execute(): boolean {
        return true;
    }
}

/**
 * 元素大師: 冰
 */
export class IceMaster extends SkillModel {
    constructor() {
        super({
            id: 'IceMaster',
            name: "元素大師: 冰",
            icon: "skills/magic/ice_master.svg",
            type: 'passive',
            rarity: 'perfect'
        });
    }

    get spRegen(): number {
        return 5;
    }

    get hit(): number {
        return 40;
    }

    get defend(): number {
        return 10;
    }

    description(): string {
        return `提升自身法力回復值 ${this.spRegen} 點，提升命中值 ${this.hit} 點，提升物理防禦力 ${this.defend} 點。`;
    }

    getPassiveBonus(): Record<string, number> {
        return {
            spRegen: this.spRegen,
            hit: this.hit,
            adDefend: this.defend
        };
    }

    protected execute(): boolean {
        return true;
    }
}


/**
 * 寒冰基礎法術技能樹
 */
export const IceBaseSkillTree: Record<string, SkillTreeNode> = {
    IceAdaptability: {
        id: 'IceAdaptability',
        pathId: 'ice_adaptability',
        tier: 1,
        evolvesFrom: ['ManaAdaptability']
    },
    IceAdvancement: {
        id: 'IceAdvancement',
        pathId: 'ice_adaptability',
        tier: 2,
        evolvesFrom: ['IceAdaptability'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('IceArrow');
            const advSkill = playerStore.hasSkill('IceBurst')
            return !!baseSkill?.isProficiencyMax || !!advSkill;
        }
    },
    IceMaster: {
        id: 'IceMaster',
        pathId: 'ice_adaptability',
        tier: 3,
        evolvesFrom: ['IceAdvancement'],
        checkEligible: (playerStore) => {
            const advSkill = playerStore.hasSkill('IceBurst')
            return !!advSkill?.isProficiencyMax
        }
    }
};
