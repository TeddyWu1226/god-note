import {SkillModel} from "@/models/skill-model";
import {SkillTreeNode} from "@/types";
import {WeaponCnNameMapping} from "@/constants/default-const";
import {isEquip} from "@/constants/skill/utils";
import {EquipmentPosition} from "@/enums/enums";

export class AxeBase extends SkillModel {
    constructor() {
        super({
            id: 'AxeBase',
            name: "斧術技巧",
            icon: "skills/physical/axe_base.svg",
            type: 'passive',
            rarity: 'common',
            uniqueFields: ['AxeBase'],
            maxProficiency: 100,
            proficiencyGain: 1
        });
    }

    addBonus() {
        return {
            hit: 5 + (Math.ceil(this.proficiency * 0.05)), // 10
            critRate: 5 + (Math.ceil(this.proficiency * 0.05)), // 10
        }
    }

    description(): string {
        const bonus = this.addBonus()
        return `裝備名稱含有「${WeaponCnNameMapping.Axe.join(', ')}」的武器時，提升 ${bonus.hit} 點命中，${bonus.critRate}% 爆擊率。`
            + `<br/>(裝備對應武器進行攻擊可以提升熟練度)`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        if (isEquip('Axe', EquipmentPosition.WEAPON, player)) {
            return this.addBonus();
        }
        return {};
    }
}

export class AxePro extends SkillModel {
    constructor() {
        super({
            id: 'AxePro',
            name: "斧術精通",
            icon: "skills/physical/axe_pro.svg",
            type: 'passive',
            rarity: 'rare',
            uniqueFields: ['AxeBase'],
            maxProficiency: 100,
            proficiencyGain: 1
        });
    }

    addBonus() {
        return {
            hit: 10 + (Math.ceil(this.proficiency * 0.1)), // 20
            critRate: 10 + (Math.ceil(this.proficiency * 0.05)), // 15
        }
    }

    description(): string {
        const bonus = this.addBonus()
        return `裝備名稱含有「${WeaponCnNameMapping.Axe.join(', ')}」的武器時，提升 ${bonus.hit} 點命中，${bonus.critRate}% 爆擊率。`
            + `<br/>(裝備對應武器進行攻擊可以提升熟練度)`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        if (isEquip('Axe', EquipmentPosition.WEAPON, player)) {
            return this.addBonus();
        }
        return {};
    }
}

export class AxeAdv extends SkillModel {
    constructor() {
        super({
            id: 'AxeAdv',
            name: "斧術進階精通",
            icon: "skills/physical/axe_adv.svg",
            type: 'passive',
            rarity: 'perfect',
            uniqueFields: ['AxeBase'],
            maxProficiency: 100,
            proficiencyGain: 1
        });
    }

    addBonus() {
        return {
            hit: 20 + (Math.ceil(this.proficiency * 0.15)), // 35
            critRate: 15 + (Math.ceil(this.proficiency * 0.05)), // 20
        }
    }

    description(): string {
        const bonus = this.addBonus()
        return `裝備名稱含有「${WeaponCnNameMapping.Axe.join(', ')}」的武器時，提升 ${bonus.hit} 點命中，${bonus.critRate}% 爆擊率。`
            + `<br/>(裝備對應武器進行攻擊可以提升熟練度)`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        if (isEquip('Axe', EquipmentPosition.WEAPON, player)) {
            return this.addBonus();
        }
        return {};
    }
}

export class AxeMaster extends SkillModel {
    constructor() {
        super({
            id: 'AxeMaster',
            name: "斧術大師精通",
            icon: "skills/physical/axe_master.svg",
            type: 'passive',
            rarity: 'perfect',
            uniqueFields: ['AxeBase']
        });
    }

    addBonus() {
        return {
            hit: 50,
            critRate: 25,
        }
    }

    description(): string {
        const bonus = this.addBonus()
        return `裝備名稱含有「${WeaponCnNameMapping.Axe.join(', ')}」的武器時，提升 ${bonus.hit} 點命中，${bonus.critRate}% 爆擊率。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        if (isEquip('Axe', EquipmentPosition.WEAPON, player)) {
            return this.addBonus();
        }
        return {};
    }
}

export const AxeBaseSkillTree: Record<string, SkillTreeNode> = {
    AxeBase: {
        id: 'AxeBase',
        pathId: 'axeplay',
        tier: 0,
        checkEligible: (playerStore, trackerStore) => {
            return (trackerStore?.getKillCount('Axe') ?? 0) >= 3;
        }
    },
    AxePro: {
        id: 'AxePro',
        pathId: 'axeplay',
        tier: 1,
        evolvesFrom: ['AxeBase'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('AxeBase');
            return !!baseSkill?.isProficiencyMax;
        }
    },
    AxeAdv: {
        id: 'AxeAdv',
        pathId: 'axeplay',
        tier: 2,
        evolvesFrom: ['AxePro'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('AxePro');
            return !!baseSkill?.isProficiencyMax;
        }
    },
    AxeMaster: {
        id: 'AxeMaster',
        pathId: 'axeplay',
        tier: 3,
        evolvesFrom: ['AxeAdv'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('AxeAdv');
            return !!baseSkill?.isProficiencyMax;
        }
    }
};
