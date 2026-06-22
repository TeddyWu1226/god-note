import {SkillModel} from "@/models/skill-model";
import {isMatchedWeapon, WeaponSkillMapping} from "@/constants/default-const";


export class PhysiqueBoost extends SkillModel {
    constructor() {
        super({
            id: 'PhysiqueBoost',
            name: "強健體魄",
            icon: "skills/passive/physique_icon.svg",
            type: 'passive',
            rarity: 'common',
        });
    }

    get hpBonus(): number {
        return 50
    }

    description(): string {
        return `最大生命值增加 ${this.hpBonus} 點。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(): Record<string, number> {
        return {
            hpLimit: this.hpBonus
        };
    }
}

export class SwordProficiency extends SkillModel {
    constructor() {
        super({
            id: 'SwordProficiency',
            name: "基礎劍術",
            icon: "skills/passive/sword_proficiency.svg",
            type: 'passive',
            rarity: 'common',
            uniqueFields: ['SwordProficiency'],
            maxProficiency: 100,
            proficiencyGain: 1
        });
    }

    addBonus() {
        // 提升 5
        return {
            hit: 5 + (Math.ceil(this.proficiency * 0.05)),
            adDefend: 1 + (Math.ceil(this.proficiency * 0.04)),
        }
    }

    description(): string {
        const bonus = this.addBonus()
        return `裝備名稱含有「${WeaponSkillMapping.SwordProficiency.join(', ')}」的武器時，提升 ${bonus.hit} 點命中, ${bonus.adDefend} 點防禦。`
            + `<br/>(裝備對應武器進行攻擊可以提升熟練度)`;
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

export class KnifeProficiency extends SkillModel {
    constructor() {
        super({
            id: 'KnifeProficiency',
            name: "短刀精通",
            icon: "skills/passive/knife_proficiency.svg",
            type: 'passive',
            rarity: 'common',
        });
    }

    description(): string {
        return `裝備名稱含有「小刀」或「匕首」的武器時，提升 3 點物理攻擊。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        const weaponName = player?.equips?.weapon?.name || '';
        if (weaponName.includes('小刀') || weaponName.includes('匕首')) {
            return {
                ad: 3
            };
        }
        return {};
    }
}

export class SpellProficiency extends SkillModel {
    constructor() {
        super({
            id: 'SpellProficiency',
            name: "法杖精通",
            icon: "skills/passive/spell_proficiency.svg",
            type: 'passive',
            rarity: 'common'
        });
    }

    get apBonus(): number {
        return 5
    }

    description(): string {
        return `裝備名稱含有「杖」的武器時，提升 ${this.apBonus} 點法術攻擊。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        const weaponName = player?.equips?.weapon?.name || '';
        if (weaponName.includes('杖')) {
            return {
                ap: this.apBonus
            };
        }
        return {};
    }
}

export class ReadingProficiency extends SkillModel {
    constructor() {
        super({
            id: 'ReadingProficiency',
            name: "閱讀精通",
            icon: "skills/passive/reading_proficiency.svg",
            type: 'passive',
            rarity: 'common'
        });
    }

    get apBonus(): number {
        return 10
    }

    description(): string {
        return `裝備名稱含有「書」或「捲」的副手武器時，提升 ${this.apBonus}% 法術增傷。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        const offhandName = player?.equips?.offhand?.name || '';
        if (offhandName.includes('書') || offhandName.includes('捲')) {
            return {
                apIncrease: this.apBonus
            };
        }
        return {};
    }
}

export class RedSkin extends SkillModel {
    constructor() {
        super({
            id: 'RedSkin',
            name: "紅皮膚",
            icon: "skills/passive/red_skin.svg",
            type: 'passive',
            rarity: 'common',
            uniqueFields: ['紅皮膚'],
        });
    }

    description(): string {
        return `當無身體防具時，提升生命回復 2 點。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        if (!player?.equips?.body) {
            return {
                hpRegen: 2
            };
        }
        return {};
    }
}

export class BlueSkin extends SkillModel {
    constructor() {
        super({
            id: 'BlueSkin',
            name: "藍皮膚",
            icon: "skills/passive/blue_skin.svg",
            type: 'passive',
            rarity: 'common',
            uniqueFields: ['藍皮膚'],
        });
    }

    description(): string {
        return `當無身體防具時，提升法力回復 2 點。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        if (!player?.equips?.body) {
            return {
                spRegen: 2
            };
        }
        return {};
    }
}

export class BlockBoost extends SkillModel {
    constructor() {
        super({
            id: 'BlockBoost',
            name: "格檔強化",
            icon: "skills/passive/block_boost.svg",
            type: 'passive',
            rarity: 'common',
            uniqueFields: ['格檔強化'],
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



