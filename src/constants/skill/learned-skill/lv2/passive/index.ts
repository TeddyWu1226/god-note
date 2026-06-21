import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillParams} from "@/types";
import {isMatchedWeapon, WeaponSkillMapping} from "@/constants/default-const";

export class SwordExpert extends SkillModel {
    constructor() {
        super({
            id: 'SwordExpert',
            name: "進階劍術",
            icon: "skills/passive/sword_expert.svg",
            type: 'passive',
            rarity: 'rare',
            uniqueFields: ['SwordProficiency'],
            maxProficiency: 100,
            proficiencyGain: 1
        });
    }

    addBonus() {
        return {
            hit: 25,
            ad: 1 + (Math.ceil(this.proficiency * 0.04)),
            adDefend: 5,
        }
    }

    description(): string {
        const bonus = this.addBonus()
        return `裝備名稱含有「${WeaponSkillMapping.SwordProficiency.join(', ')}」的武器時，提升 ${bonus.ad} 點物理攻擊力, ${bonus.hit} 點命中, ${bonus.adDefend} 點防禦。`
            + `<br/>(裝備對應武器進行攻擊可以提升熟練度)`
            ;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        const weaponName = player?.equips?.weapon?.name || '';
        if (isMatchedWeapon('SwordProficiency', weaponName)) {
            return this.addBonus();
        }
        return {};
    }
}

export class KnightWay extends SkillModel {
    constructor() {
        super({
            id: 'KnightWay',
            name: "騎士劍術",
            icon: "skills/active/knight_way.svg",
            type: 'passive',
            rarity: 'rare',
            maxProficiency: 0,
            proficiencyGain: 0,
            uniqueFields: ['SwordProficiency'],
        });
    }

    addSwordBonus() {
        return {
            hit: 25,
            ad: 5,
        }
    }

    addShieldBonus() {
        return {
            defendIncrease: 5,
            adDefend: 5,
        }
    }

    description(): string {
        const swordBonus = this.addSwordBonus()
        const shieldBonus = this.addShieldBonus()
        return `裝備名稱含有「${WeaponSkillMapping.SwordProficiency.join(', ')}」的武器時, 提升 ${swordBonus.ad} 點物理攻擊力, ${swordBonus.hit} 點命中。`
            + `<br/>裝備名稱含有「盾」的副手時, 提升 ${shieldBonus.defendIncrease}% 抗性 以及 ${shieldBonus.adDefend} 點防禦`
            ;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        const weaponName = player?.equips?.weapon?.name || '';
        const offhandName = player?.equips?.offhand?.name || '';
        let bonus = {}
        if (isMatchedWeapon('SwordProficiency', weaponName)) {
            bonus = {...bonus, ...this.addSwordBonus()}
        }
        if (offhandName.includes('盾')) {
            bonus = {...bonus, ...this.addShieldBonus()}
        }
        return bonus;
    }
}

export class HeartOfRebellion extends SkillModel {
    constructor() {
        super({
            id: 'HeartOfRebellion',
            name: "反抗之心",
            icon: "skills/passive/heart_of_rebellion.svg",
            type: 'passive',
            rarity: 'rare',
            uniqueFields: ['格檔強化'],
        });
    }

    description(playerStore: PlayerStoreType): string {
        return `完美格擋（格擋敵方暴擊）的受傷比例減少至 25%。且完美格擋成功時，獲得下一回合 20% 物理與法術增傷。`;
    }

    protected execute(params: SkillParams): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        return {};
    }
}

export class CleaveFencing extends SkillModel {
    constructor() {
        super({
            id: 'CleaveFencing',
            name: "劍技-正擊",
            icon: "skills/passive/cleave_fencing.svg",
            type: 'passive',
            rarity: 'rare',
            uniqueFields: ['豎擊'],
        });
    }

    description(playerStore: PlayerStoreType): string {
        return ``;
    }

    protected execute(params: SkillParams): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        return {};
    }
}



