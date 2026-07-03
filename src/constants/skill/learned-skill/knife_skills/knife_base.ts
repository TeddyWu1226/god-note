/**
 * 匕首熟練度與被動技巧
 */
import {SkillModel} from "src/models/skill-model";
import {SkillTreeNode} from "src/types";
import {isMatchedWeapon, WeaponSkillMapping} from "src/constants/default-const";

export class KnifeBase extends SkillModel {
    constructor() {
        super({
            id: 'KnifeBase',
            name: "匕首技巧",
            icon: "skills/passive/knife_base.svg",
            type: 'passive',
            rarity: 'common',
            uniqueFields: ['KnifeBase'],
            maxProficiency: 150,
            proficiencyGain: 1
        });
    }

    addBonus() {
        return {
            hit: 4 + (Math.ceil(this.proficiency * 0.04)),
            dodge: 4 + (Math.ceil(this.proficiency * 0.04)),
        }
    }

    description(): string {
        const bonus = this.addBonus()
        return `裝備名稱含有「${WeaponSkillMapping.KnifeBase.join(', ')}」的武器時，提升 ${bonus.hit} 點命中, ${bonus.dodge} 點閃避值。`
            + `<br/>(裝備對應武器進行攻擊可以提升熟練度)`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        const weaponName = player?.equips?.weapon?.name || '';
        if (isMatchedWeapon('KnifeBase', weaponName)) {
            return this.addBonus();
        }
        return {};
    }
}

export class KnifePro extends SkillModel {
    constructor() {
        super({
            id: 'KnifePro',
            name: "匕首精通",
            icon: "skills/passive/knife_pro.svg",
            type: 'passive',
            rarity: 'rare',
            uniqueFields: ['KnifeBase'],
            maxProficiency: 150,
            proficiencyGain: 1
        });
    }

    addBonus() {
        return {
            hit: 12 + (Math.ceil(this.proficiency * 0.04)),
            dodge: 8 + (Math.ceil(this.proficiency * 0.04)),
            ad: 3 + (Math.ceil(this.proficiency * 0.02)),
        }
    }

    description(): string {
        const bonus = this.addBonus()
        return `裝備名稱含有「${WeaponSkillMapping.KnifeBase.join(', ')}」的武器時，提升 ${bonus.ad} 點物理攻擊力, ${bonus.hit} 點命中, ${bonus.dodge} 點閃避值。`
            + `<br/>(裝備對應武器進行攻擊可以提升熟練度)`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        const weaponName = player?.equips?.weapon?.name || '';
        if (isMatchedWeapon('KnifeBase', weaponName)) {
            return this.addBonus();
        }
        return {};
    }
}

export class KnifeAdv extends SkillModel {
    constructor() {
        super({
            id: 'KnifeAdv',
            name: "匕首進階精通",
            icon: "skills/passive/knife_adv.svg",
            type: 'passive',
            rarity: 'perfect',
            uniqueFields: ['KnifeBase'],
            maxProficiency: 150,
            proficiencyGain: 1
        });
    }

    addBonus() {
        return {
            hit: 25 + (Math.ceil(this.proficiency * 0.05)),
            dodge: 12 + (Math.ceil(this.proficiency * 0.05)),
            ad: 10 + (Math.ceil(this.proficiency * 0.04)),
        }
    }

    description(): string {
        const bonus = this.addBonus()
        return `裝備名稱含有「${WeaponSkillMapping.KnifeBase.join(', ')}」的武器時，提升 ${bonus.ad} 點物理攻擊力, ${bonus.hit} 點命中, ${bonus.dodge} 點閃避值。`
            + `<br/>(裝備對應武器進行攻擊可以提升熟練度)`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        const weaponName = player?.equips?.weapon?.name || '';
        if (isMatchedWeapon('KnifeBase', weaponName)) {
            return this.addBonus();
        }
        return {};
    }
}

export class KnifeMaster extends SkillModel {
    constructor() {
        super({
            id: 'KnifeMaster',
            name: "匕首大師精通",
            icon: "skills/passive/knife_master.svg",
            type: 'passive',
            rarity: 'perfect',
            uniqueFields: ['KnifeBase'],
        });
    }

    addBonus() {
        return {
            hit: 50,
            ad: 25,
            dodge: 20,
        }
    }

    description(): string {
        const bonus = this.addBonus()
        return `裝備名稱含有「${WeaponSkillMapping.KnifeBase.join(', ')}」的武器時，提升 ${bonus.ad} 點物理攻擊力, ${bonus.hit} 點命中, ${bonus.dodge} 點閃避。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        const weaponName = player?.equips?.weapon?.name || '';
        if (isMatchedWeapon('KnifeBase', weaponName)) {
            return this.addBonus();
        }
        return {};
    }
}

export const KnifeBaseSkillTree: Record<string, SkillTreeNode> = {
    KnifeBase: {
        id: 'KnifeBase',
        pathId: 'knifeplay',
        tier: 0,
        checkEligible: (playerStore, trackerStore) => {
            return trackerStore.getKillCount('USE_KNIFE') >= 3;
        }
    },
    KnifePro: {
        id: 'KnifePro',
        pathId: 'knifeplay',
        tier: 1,
        evolvesFrom: ['KnifeBase'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('KnifeBase');
            return !!baseSkill?.isProficiencyMax;
        }
    },
    KnifeAdv: {
        id: 'KnifeAdv',
        pathId: 'knifeplay',
        tier: 2,
        evolvesFrom: ['KnifePro'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('KnifePro');
            return !!baseSkill?.isProficiencyMax;
        }
    },
    KnifeMaster: {
        id: 'KnifeMaster',
        pathId: 'knifeplay',
        tier: 3,
        evolvesFrom: ['KnifeAdv'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('KnifeAdv');
            return !!baseSkill?.isProficiencyMax;
        }
    },
}
