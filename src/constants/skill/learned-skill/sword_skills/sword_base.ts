/**
 * 劍術熟練度
 */
import {SkillModel} from "@/models/skill-model";
import {SkillTreeNode} from "@/types";
import {WeaponCnNameMapping} from "@/constants/default-const";
import {isEquip} from "@/constants/skill/utils";
import {EquipmentPosition} from "@/enums/enums";

export class SwordBase extends SkillModel {
    constructor() {
        super({
            id: 'SwordBase',
            name: "劍術技巧",
            icon: "skills/physical/sword_base.svg",
            type: 'passive',
            rarity: 'common',
            uniqueFields: ['SwordBase'],
            maxProficiency: 100,
            proficiencyGain: 1
        });
    }

    addBonus() {
        // 提升 5
        return {
            hit: 5 + (Math.ceil(this.proficiency * 0.05)),// 10
            adDefend: 1 + (Math.ceil(this.proficiency * 0.04)),// 5
        }
    }

    description(): string {
        const bonus = this.addBonus()
        return `裝備名稱含有「${WeaponCnNameMapping.Sword.join(', ')}」的武器時，提升 ${bonus.hit} 點命中, ${bonus.adDefend} 點防禦。`
            + `<br/>(裝備對應武器進行攻擊可以提升熟練度)`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        if (isEquip('Sword', EquipmentPosition.WEAPON, player)) {
            return this.addBonus();
        }
        return {};
    }
}

export class SwordPro extends SkillModel {
    constructor() {
        super({
            id: 'SwordPro',
            name: "劍術精通",
            icon: "skills/physical/sword_pro.svg",
            type: 'passive',
            rarity: 'rare',
            uniqueFields: ['SwordBase'],
            maxProficiency: 100,
            proficiencyGain: 1
        });
    }

    addBonus() {
        return {
            hit: 15 + (Math.ceil(this.proficiency * 0.05)), // 20
            adDefend: 4 + (Math.ceil(this.proficiency * 0.04)), // 8
            ad: 3 + (Math.ceil(this.proficiency * 0.02)), // 5
        }
    }

    description(): string {
        const bonus = this.addBonus()
        return `裝備名稱含有「${WeaponCnNameMapping.Sword.join(', ')}」的武器時，提升 ${bonus.ad} 點物理攻擊力, ${bonus.hit} 點命中, ${bonus.adDefend} 點防禦。`
            + `<br/>(裝備對應武器進行攻擊可以提升熟練度)`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        if (isEquip('Sword', EquipmentPosition.WEAPON, player)) {
            return this.addBonus();
        }
        return {};
    }
}

export class SwordAdv extends SkillModel {
    constructor() {
        super({
            id: 'SwordAdv',
            name: "劍術進階精通",
            icon: "skills/physical/sword_adv.svg",
            type: 'passive',
            rarity: 'perfect',
            uniqueFields: ['SwordBase'],
            maxProficiency: 100,
            proficiencyGain: 1
        });
    }

    addBonus() {
        return {
            hit: 25 + (Math.ceil(this.proficiency * 0.1)), // 35
            adDefend: 8 + (Math.ceil(this.proficiency * 0.06)), // 14
            ad: 8 + (Math.ceil(this.proficiency * 0.06)), // 14
        }
    }

    description(): string {
        const bonus = this.addBonus()
        return `裝備名稱含有「${WeaponCnNameMapping.Sword.join(', ')}」的武器時，提升 ${bonus.ad} 點物理攻擊力, ${bonus.hit} 點命中, ${bonus.adDefend} 點防禦。`
            + `<br/>(裝備對應武器進行攻擊可以提升熟練度)`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        if (isEquip('Sword', EquipmentPosition.WEAPON, player)) {
            return this.addBonus();
        }
        return {};
    }
}

export class SwordMaster extends SkillModel {
    constructor() {
        super({
            id: 'SwordMaster',
            name: "劍術大師精通",
            icon: "skills/physical/sword_master.svg",
            type: 'passive',
            rarity: 'perfect',
            uniqueFields: ['SwordBase'],
        });
    }


    addBonus() {
        return {
            hit: 50,
            adDefend: 20,
            ad: 20,
        }
    }

    description(): string {
        const bonus = this.addBonus()
        return `裝備名稱含有「${WeaponCnNameMapping.Sword.join(', ')}」的武器時，提升 ${bonus.ad} 點物理攻擊力, ${bonus.hit} 點命中, ${bonus.adDefend} 點防禦。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        if (isEquip('Sword', EquipmentPosition.WEAPON, player)) {
            return this.addBonus();
        }
        return {};
    }
}


export const SwordBaseSkillTree: Record<string, SkillTreeNode> = {
    SwordBase: {
        id: 'SwordBase',
        pathId: 'swordplay',
        tier: 0,
        checkEligible: (playerStore, trackerStore) => {
            return trackerStore.getKillCount('Sword') >= 3;
        }
    },
    SwordPro: {
        id: 'SwordPro',
        pathId: 'swordplay',
        tier: 1,
        evolvesFrom: ['SwordBase'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('SwordBase');
            return !!baseSkill?.isProficiencyMax;
        }
    },
    SwordAdv: {
        id: 'SwordAdv',
        pathId: 'swordplay',
        tier: 2,
        evolvesFrom: ['SwordPro'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('SwordPro');
            return !!baseSkill?.isProficiencyMax;
        }
    },
    SwordMaster: {
        id: 'SwordMaster',
        pathId: 'swordplay',
        tier: 3,
        evolvesFrom: ['SwordAdv'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('SwordAdv');
            return !!baseSkill?.isProficiencyMax;
        }
    },
}