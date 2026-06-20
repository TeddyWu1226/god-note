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

