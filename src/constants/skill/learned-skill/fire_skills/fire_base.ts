/**
 * 法術輸出與輔助相關技能
 */
import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillOnPlayerAttackedHitParams, SkillParams, SkillTreeNode} from "@/types";
import EvnStatus from "@/constants/status/evn-status";

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

    get spRegen(): number {
        return 3;
    }

    description(playerStore: PlayerStoreType): string {
        return `提升自身法力回復值 ${this.spRegen} 點，並可以開始學習火魔法。`;
    }

    getPassiveBonus(): Record<string, number> {
        return {
            spRegen: this.spRegen
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

    get spRegen(): number {
        return 3;
    }

    get hit(): number {
        return 25;
    }

    get damageReduction(): number {
        return 0.10;
    }

    description(): string {
        return `提升自身法力回復值 ${this.spRegen} 點，提升命中值 ${this.hit} 點。
        \n當身上帶有「燃燒」效果的敵方攻擊自身時，受到的傷害降低 ${this.damageReduction * 100}%。`;
    }

    getPassiveBonus(): Record<string, number> {
        return {
            spRegen: this.spRegen,
            hit: this.hit
        };
    }

    override onPlayerAttacked({monster, attackedOutcome}: SkillOnPlayerAttackedHitParams) {
        if (monster.hasStatus(EvnStatus.OnBurn.name)) {
            attackedOutcome.totalDamage = Math.floor(attackedOutcome.totalDamage * (1 - this.damageReduction));
        }
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

    get spRegen(): number {
        return 5;
    }

    get hit(): number {
        return 40;
    }

    get damageReduction(): number {
        return 0.25;
    }

    description(): string {
        return `提升自身法力回復值 ${this.spRegen} 點，提升命中值 ${this.hit} 點。
        \n當身上帶有「燃燒」效果的敵方攻擊自身時，受到的傷害降低 ${this.damageReduction * 100}%。`;
    }

    getPassiveBonus(): Record<string, number> {
        return {
            spRegen: this.spRegen,
            hit: this.hit
        };
    }

    override onPlayerAttacked({monster, attackedOutcome}: SkillOnPlayerAttackedHitParams) {
        if (monster.hasStatus(EvnStatus.OnBurn.name)) {
            attackedOutcome.totalDamage = Math.floor(attackedOutcome.totalDamage * (1 - this.damageReduction));
        }
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
        pathId: 'mana_adaptability',
        tier: 1,
        evolvesFrom: ['ManaAdaptability'],
        checkEligible: (playerStore) => {
            return playerStore.hasSkill('ManaAdaptability') !== undefined;
        }
    },
    FireAdvancement: {
        id: 'FireAdvancement',
        pathId: 'mana_adaptability',
        tier: 2,
        evolvesFrom: ['FireAdaptability'],
        checkEligible: (playerStore) => {
            return playerStore.hasSkill('FireAdaptability') !== undefined;
        }
    },
    FireMaster: {
        id: 'FireMaster',
        pathId: 'mana_adaptability',
        tier: 3,
        evolvesFrom: ['FireAdvancement'],
        checkEligible: (playerStore) => {
            return playerStore.hasSkill('FireAdvancement') !== undefined;
        }
    }
};
