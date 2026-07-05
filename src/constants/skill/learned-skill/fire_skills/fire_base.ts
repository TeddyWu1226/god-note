/**
 * 法術輸出與輔助相關技能
 */
import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillParams, SkillTreeNode} from "@/types";

/**
 * 元素適性: 火
 */
export class FireAdaptability extends SkillModel {
    constructor() {
        super({
            id: 'FireAdaptability',
            name: "元素適性: 火",
            icon: "skills/magic/fire_adaptability.svg",
            type: 'passive',
            rarity: 'rare'
        });
    }

    getSpRegen(): number {
        return 2;
    }

    description(playerStore: PlayerStoreType): string {
        return `提升自身法力回復（回魔）值 ${this.getSpRegen()} 點，並可以開始學習火魔法。`;
    }

    getPassiveBonus(): Record<string, number> {
        return {
            spRegen: this.getSpRegen()
        };
    }

    protected execute(params: SkillParams): boolean {
        return true;
    }
}

/**
 * 元素進階: 火
 */
export class FireAdvancement extends SkillModel {
    constructor() {
        super({
            id: 'FireAdvancement',
            name: "元素進階: 火",
            icon: "skills/magic/fire_advancement.svg",
            type: 'passive',
            rarity: 'perfect'
        });
    }

    getSpRegen(): number {
        return 3;
    }

    getHit(): number {
        return 10;
    }

    getDamageReduction(): number {
        return 0.10;
    }

    description(playerStore: PlayerStoreType): string {
        return `提升自身法力回復（回魔）值 ${this.getSpRegen()} 點，提升命中值 ${this.getHit()} 點。此外，當身上帶有「燃燒」效果的敵方目標攻擊自身時，受到的傷害降低 ${this.getDamageReduction() * 100}%。`;
    }

    getPassiveBonus(): Record<string, number> {
        return {
            spRegen: this.getSpRegen(),
            hit: this.getHit()
        };
    }

    protected execute(params: SkillParams): boolean {
        return true;
    }
}

/**
 * 元素大師: 火
 */
export class FireMaster extends SkillModel {
    constructor() {
        super({
            id: 'FireMaster',
            name: "元素大師: 火",
            icon: "skills/magic/fire_master.svg",
            type: 'passive',
            rarity: 'perfect'
        });
    }

    getSpRegen(): number {
        return 5;
    }

    getHit(): number {
        return 20;
    }

    getDamageReduction(): number {
        return 0.25;
    }

    description(playerStore: PlayerStoreType): string {
        return `提升自身法力回復（回魔）值 ${this.getSpRegen()} 點，提升命中值 ${this.getHit()} 點。此外，當身上帶有「燃燒」效果的敵方目標攻擊自身時，受到的傷害降低 ${this.getDamageReduction() * 100}%。`;
    }

    getPassiveBonus(): Record<string, number> {
        return {
            spRegen: this.getSpRegen(),
            hit: this.getHit()
        };
    }

    protected execute(params: SkillParams): boolean {
        return true;
    }
}

/**
 * 火焰法術技能樹
 */
export const FireSkillTree: Record<string, SkillTreeNode> = {
    FireAdaptability: {
        id: 'FireAdaptability',
        pathId: 'fire_element',
        tier: 1,
        evolvesFrom: ['ManaAdaptability'],
        checkEligible: (playerStore) => {
            return playerStore.hasSkill('ManaAdaptability') !== undefined;
        }
    },
    FireAdvancement: {
        id: 'FireAdvancement',
        pathId: 'fire_element',
        tier: 2,
        evolvesFrom: ['FireAdaptability'],
        checkEligible: (playerStore) => {
            return playerStore.hasSkill('FireAdaptability') !== undefined;
        }
    },
    FireMaster: {
        id: 'FireMaster',
        pathId: 'fire_element',
        tier: 3,
        evolvesFrom: ['FireAdvancement'],
        checkEligible: (playerStore) => {
            return playerStore.hasSkill('FireAdvancement') !== undefined;
        }
    }
};
