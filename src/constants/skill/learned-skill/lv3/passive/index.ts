import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillParams} from "@/types";
import {isMatchedWeapon, WeaponSkillMapping} from "@/constants/default-const";


export class SwordMaster extends SkillModel {
    constructor() {
        super({
            id: 'SwordMaster',
            name: "劍術大師",
            icon: "skills/passive/sword_master.svg",
            type: 'passive',
            rarity: 'legendary',
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

/**
 * 紫皮膚 (PurpleSkin) - 融合自 藍皮膚 + 紅皮膚
 * 被動技能，無裝備時加強很多能力。
 */
export class PurpleSkin extends SkillModel {
    constructor() {
        super({
            id: 'PurpleSkin',
            name: "紫皮膚",
            icon: "skills/passive/purple_skin.svg",
            type: 'passive',
            rarity: 'legendary',
            uniqueFields: ['藍皮膚', '紅皮膚'],
        });
    }

    regen = 2
    increase = 10

    description(playerStore: PlayerStoreType): string {
        return `當無身體防具時，提升生命與法力回復各 ${this.regen} 點且總輸出提升 ${this.increase}%。`;
    }

    protected execute(params: SkillParams): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        if (!player?.equips?.body) {
            return {
                hpRegen: this.regen,
                spRegen: this.regen,
                adIncrease: this.increase,
                apIncrease: this.increase
            };
        }
        return {};
    }
}


