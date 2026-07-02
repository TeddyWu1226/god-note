import {SkillModel} from "@/models/skill-model";
import {isMatchedWeapon, WeaponSkillMapping} from "@/constants/default-const";
import {PlayerStoreType, SkillParams} from "@/types";


export class SwordMaster extends SkillModel {
    constructor() {
        super({
            id: 'SwordMaster',
            name: "大師劍術",
            icon: "skills/passive/sword_master.svg",
            type: 'passive',
            rarity: 'perfect',
            uniqueFields: ['SwordProficiency'],
        });
    }


    addBonus() {
        return {
            hit: 50,
            ad: 20,
            adDefend: 10,
        }
    }

    description(): string {
        const bonus = this.addBonus()
        return `裝備名稱含有「${WeaponSkillMapping.SwordProficiency.join(', ')}」的武器時，提升 ${bonus.ad} 點物理攻擊力, ${bonus.hit} 點命中, ${bonus.adDefend} 點防禦。`
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

export class DemonBody extends SkillModel {
    constructor() {
        super({
            id: 'DemonBody',
            name: "魔人之體",
            icon: "skills/passive/demon_body.svg",
            type: 'passive',
            rarity: 'perfect',
        });
    }

    hpBonus = 50
    spBonus = 50
    hpRegenBonus = 5
    spRegenBonus = 5
    damageIncrease = 10
    hit = 25

    description(): string {
        return `最大生命值與最大法力值皆增加 ${this.hpBonus} 點。在戰鬥中，每回合回復 ${this.hpRegenBonus} 點 HP 與 ${this.spRegenBonus} 點 SP，且物理與法術增傷提升 ${this.damageIncrease}%, ${this.hit} 點命中值。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(): Record<string, number> {
        return {
            hpLimit: this.hpBonus,
            spLimit: this.spBonus,
            hpRegen: this.hpRegenBonus,
            spRegen: this.spRegenBonus,
            adIncrease: this.damageIncrease,
            apIncrease: this.damageIncrease,
            hit: this.hit,
        };
    }
}

export class KnifeMaster extends SkillModel {
    constructor() {
        super({
            id: 'KnifeMaster',
            name: "大師刺殺",
            icon: "skills/passive/knife_master.svg",
            type: 'passive',
            rarity: 'perfect',
            uniqueFields: ['KnifeProficiency'],
        });
    }

    addBonus() {
        return {
            hit: 50,
            ad: 20,
            dodge: 20,
        }
    }

    description(): string {
        const bonus = this.addBonus()
        return `裝備名稱含有「${WeaponSkillMapping.KnifeProficiency.join(', ')}」的武器時，提升 ${bonus.ad} 點物理攻擊力, ${bonus.hit} 點命中, ${bonus.dodge} 點閃避。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        const weaponName = player?.equips?.weapon?.name || '';
        if (isMatchedWeapon('KnifeProficiency', weaponName)) {
            return this.addBonus();
        }
        return {};
    }
}

export class HeartOfRebellion extends SkillModel {
    constructor() {
        super({
            id: 'HeartOfRebellion',
            name: "反抗鬥志",
            icon: "skills/passive/heart_of_rebellion.svg",
            type: 'passive',
            rarity: 'perfect',
            uniqueFields: ['格檔強化'],
        });
    }

    description(playerStore: PlayerStoreType): string {
        return `提升格擋效率並完美格擋（格擋敵方暴擊）的受傷比例減少至25%。且完美格擋成功時，獲得下一回合 20% 物理與法術增傷。`;
    }

    protected execute(params: SkillParams): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        return {};
    }
}



