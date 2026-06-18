import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillParams} from "@/types";


export class PhysiqueBoost extends SkillModel {
    constructor() {
        super({
            id: 'PhysiqueBoost',
            name: "強健體魄",
            icon: "skills/physique_icon.svg",
            type: 'passive',
            rarity: 'common',
        });
    }

    get hpBonus(): number {
        return 50
    }

    description(playerStore: PlayerStoreType): string {
        return `最大生命值增加 ${this.hpBonus} 點。`;
    }

    protected execute(params: SkillParams): boolean {
        return true;
    }

    override getPassiveBonus(): Record<string, number> {
        return {
            hpLimit: this.hpBonus
        };
    }
}

export class SwordMastery extends SkillModel {
    constructor() {
        super({
            id: 'SwordMastery',
            name: "劍術精通",
            icon: "skills/sword_mastery.svg",
            type: 'passive',
            rarity: 'common',
        });
    }

    description(playerStore: PlayerStoreType): string {
        return `裝備劍（名稱含有「劍」的武器）時，提升 3 點物理攻擊。`;
    }

    protected execute(params: SkillParams): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        const weaponName = player?.equips?.weapon?.name || '';
        if (weaponName.includes('劍')) {
            return {
                ad: 3
            };
        }
        return {};
    }
}

export class BladeMastery extends SkillModel {
    constructor() {
        super({
            id: 'BladeMastery',
            name: "刀術精通",
            icon: "skills/blade_mastery.svg",
            type: 'passive',
            rarity: 'common',
        });
    }

    description(playerStore: PlayerStoreType): string {
        return `裝備刀（名稱含有「刀」的武器）時，提升 10% 物理傷害。`;
    }

    protected execute(params: SkillParams): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        const weaponName = player?.equips?.weapon?.name || '';
        if (weaponName.includes('刀')) {
            return {
                adIncrease: 10
            };
        }
        return {};
    }
}

export class SpellMastery extends SkillModel {
    constructor() {
        super({
            id: 'SpellMastery',
            name: "法術精通",
            icon: "skills/spell_mastery.svg",
            type: 'passive',
            rarity: 'common',
            maxCd: 0,
            costSp: 0,
            costHp: 0,
            costAction: 0,
            maxProficiency: 50,
            proficiencyGain: 2
        });
    }

    get apBonus(): number {
        return 5
    }

    description(playerStore: PlayerStoreType): string {
        return `裝備名稱含有「杖」的武器時，提升 ${this.apBonus} 點法術攻擊。`;
    }

    protected execute(params: SkillParams): boolean {
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

export class ReadingMastery extends SkillModel {
    constructor() {
        super({
            id: 'ReadingMastery',
            name: "閱讀精通",
            icon: "skills/reading_mastery.svg",
            type: 'passive',
            rarity: 'common',
            maxCd: 0,
            costSp: 0,
            costHp: 0,
            costAction: 0,
            maxProficiency: 50,
            proficiencyGain: 2
        });
    }

    get apBonus(): number {
        return 10
    }

    description(playerStore: PlayerStoreType): string {
        return `裝備名稱含有「書」或「捲」的副手武器時，提升 ${this.apBonus}% 法術增傷。`;
    }

    protected execute(params: SkillParams): boolean {
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
            icon: "skills/red_skin.svg",
            type: 'passive',
            rarity: 'common',
            maxCd: 0,
            costSp: 0,
            costHp: 0,
            costAction: 0,
            maxProficiency: 50,
            proficiencyGain: 2
        });
    }

    description(playerStore: PlayerStoreType): string {
        return `當無身體防具時，提升生命回復 2 點。`;
    }

    protected execute(params: SkillParams): boolean {
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
            icon: "skills/blue_skin.svg",
            type: 'passive',
            rarity: 'common',
            maxCd: 0,
            costSp: 0,
            costHp: 0,
            costAction: 0,
            maxProficiency: 50,
            proficiencyGain: 2
        });
    }

    description(playerStore: PlayerStoreType): string {
        return `當無身體防具時，提升法力回復 2 點。`;
    }

    protected execute(params: SkillParams): boolean {
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


