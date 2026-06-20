import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillParams} from "@/types";


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

    addAd = 30
    addHit = 60

    description(): string {
        return `增加 ${this.addHit} 點命中。裝備名稱含有「劍」的武器時，提升 ${this.addAd} 物理攻擊。`;
    }

    protected execute(params: SkillParams): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        const weaponName = player?.equips?.weapon?.name || '';
        const bonus = {
            hit: this.addAd
        };
        if (weaponName.includes('劍')) {
            bonus['ad'] = this.addHit
        }
        return bonus;
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


