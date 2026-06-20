import {SkillModel} from "@/models/skill-model";
import {SkillParams} from "@/types";

export class SwordExpert extends SkillModel {
    constructor() {
        super({
            id: 'SwordExpert',
            name: "劍術專家",
            icon: "skills/passive/sword_expert.svg",
            type: 'passive',
            rarity: 'rare',
        });
    }

    addAd = 6
    addHit = 30

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

