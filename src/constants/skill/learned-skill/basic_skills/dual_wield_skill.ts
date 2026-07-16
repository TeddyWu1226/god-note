import {SkillModel} from "src/models/skill-model";
import {PlayerStoreType, SkillTreeNode, UserType} from "src/types";

/**
 * 雙持技巧提升 (Level 1)
 */
export class DualWieldBase extends SkillModel {
    constructor() {
        super({
            id: 'DualWieldBase',
            name: "雙持技巧提升",
            icon: "skills/physical/dual_wield_base.svg",
            type: 'passive',
            rarity: 'common',
            uniqueFields: ['雙持系']
        });
    }

    description(): string {
        return `裝備武器且沒有裝備副手武器時，提升 5% 總輸出。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: Omit<UserType, "skills">): Record<string, number> {
        const weapon = player?.equips?.weapon;
        const offhand = player?.equips?.offhand;
        if (weapon && !offhand) {
            return {
                adIncrease: 5,
                apIncrease: 5
            };
        }
        return {};
    }
}

/**
 * 雙持精通 (Level 2)
 */
export class DualWieldPro extends SkillModel {
    constructor() {
        super({
            id: 'DualWieldPro',
            name: "雙持精通",
            icon: "skills/physical/dual_wield_pro.svg",
            type: 'passive',
            rarity: 'rare',
            uniqueFields: ['雙持系']
        });
    }

    description(): string {
        return `裝備武器且沒有裝備副手武器時，提升 10% 總輸出。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: Omit<UserType, "skills">): Record<string, number> {
        const weapon = player?.equips?.weapon;
        const offhand = player?.equips?.offhand;
        if (weapon && !offhand) {
            return {
                adIncrease: 10,
                apIncrease: 10
            };
        }
        return {};
    }
}

/**
 * 雙持進階精通 (Level 3)
 */
export class DualWieldAdv extends SkillModel {
    constructor() {
        super({
            id: 'DualWieldAdv',
            name: "雙持進階精通",
            icon: "skills/physical/dual_wield_adv.svg",
            type: 'passive',
            rarity: 'perfect',
            uniqueFields: ['雙持系']
        });
    }

    description(): string {
        return `裝備武器且沒有裝備副手武器時，提升 15% 總輸出。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: Omit<UserType, "skills">): Record<string, number> {
        const weapon = player?.equips?.weapon;
        const offhand = player?.equips?.offhand;
        if (weapon && !offhand) {
            return {
                adIncrease: 15,
                apIncrease: 15
            };
        }
        return {};
    }
}

/**
 * 雙持大師精通 (Level 4)
 */
export class DualWieldMaster extends SkillModel {
    constructor() {
        super({
            id: 'DualWieldMaster',
            name: "雙持大師精通",
            icon: "skills/physical/dual_wield_master.svg",
            type: 'passive',
            rarity: 'unique',
            uniqueFields: ['雙持系']
        });
    }

    description(): string {
        return `裝備武器且沒有裝備副手武器時，提升 20% 總輸出。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: Omit<UserType, "skills">): Record<string, number> {
        const weapon = player?.equips?.weapon;
        const offhand = player?.equips?.offhand;
        if (weapon && !offhand) {
            return {
                adIncrease: 20,
                apIncrease: 20
            };
        }
        return {};
    }
}

export const DualWieldSkillTree: Record<string, SkillTreeNode> = {
    DualWieldBase: {
        id: 'DualWieldBase',
        pathId: 'dual_wield',
        tier: 1,
        checkEligible: () => true
    },
    DualWieldPro: {
        id: 'DualWieldPro',
        pathId: 'dual_wield',
        tier: 2,
        evolvesFrom: ['DualWieldBase'],
        checkEligible: (playerStore) => playerStore.hasSkill('DualWieldBase') !== undefined
    },
    DualWieldAdv: {
        id: 'DualWieldAdv',
        pathId: 'dual_wield',
        tier: 3,
        evolvesFrom: ['DualWieldPro'],
        checkEligible: (playerStore) => playerStore.hasSkill('DualWieldPro') !== undefined
    },
    DualWieldMaster: {
        id: 'DualWieldMaster',
        pathId: 'dual_wield',
        tier: 4,
        evolvesFrom: ['DualWieldAdv'],
        checkEligible: (playerStore) => playerStore.hasSkill('DualWieldAdv') !== undefined
    }
};
