/**
 * 盾牌相關
 */
import {SkillModel} from "@/models/skill-model";
import {SkillTreeNode} from "@/types";

export class BlockBase extends SkillModel {
    constructor() {
        super({
            id: 'BlockBase',
            name: "格擋技巧",
            icon: "skills/passive/block_base.svg",
            type: 'passive',
            rarity: 'common',
            uniqueFields: ['BlockBase'],
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

export class BlockPro extends SkillModel {
    constructor() {
        super({
            id: 'BlockPro',
            name: "格擋精通",
            icon: "skills/passive/block_pro.svg",
            type: 'passive',
            rarity: 'rare',
            uniqueFields: ['BlockBase'],
        });
    }

    description(): string {
        return `完美格擋（格擋敵方暴擊）的受傷比例減少至25%，並提升主動格擋時獲得的防禦值。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(): Record<string, number> {
        return {};
    }
}

export class BlockAdv extends SkillModel {
    constructor() {
        super({
            id: 'BlockAdv',
            name: "格擋進階精通",
            icon: "skills/passive/block_adv.svg",
            type: 'passive',
            rarity: 'perfect',
            uniqueFields: ['BlockBase'],
        });
    }

    description(): string {
        return `完美格擋（格擋敵方暴擊）的受傷比例減少至10%，並大幅提升主動格擋時獲得的防禦值。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(): Record<string, number> {
        return {};
    }
}

export const ShieldSkillTree: Record<string, SkillTreeNode> = {
    BlockBase: {
        id: 'BlockBase',
        pathId: 'block_boost',
        tier: 1,
        checkEligible: (playerStore) => {
            const offhand = playerStore.info.equips?.offhand
            return !!(offhand && offhand.name.includes('盾'));
        }
    },
    BlockPro: {
        id: 'BlockPro',
        pathId: 'block_boost',
        tier: 2,
        evolvesFrom: ['BlockBase'],
        checkEligible: (playerStore) => {
            const hasBase = playerStore.hasSkill('BlockBase');
            if (!hasBase) {
                return false;
            }
            const offhand = playerStore.info.equips?.offhand
            return !!(offhand && offhand.name.includes('盾'));
        }
    },
    BlockAdv: {
        id: 'BlockAdv',
        pathId: 'block_boost',
        tier: 3,
        evolvesFrom: ['BlockPro'],
        checkEligible: (playerStore) => {
            const hasBase = playerStore.hasSkill('BlockPro');
            if (!hasBase) {
                return false;
            }
            const offhand = playerStore.info.equips?.offhand
            return !!(offhand && offhand.name.includes('盾'));
        }
    },
}