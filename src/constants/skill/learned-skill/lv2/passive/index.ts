import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillParams} from "@/types";

export class SwordExpert extends SkillModel {
    constructor() {
        super({
            id: 'SwordExpert',
            name: "劍術專家",
            icon: "skills/passive/sword_expert.svg",
            type: 'passive',
            rarity: 'rare',
            uniqueFields: ['SwordProficiency'],
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
            hit: this.addHit
        };
        if (weaponName.includes('劍')) {
            bonus['ad'] = this.addAd
        }
        return bonus;
    }
}

/**
 * 反抗之心 (HeartOfRebellion) - 進化自 格擋強化
 * 被動技能，完美格擋成功除了減傷強化外, 還可以獲得一回合增傷。
 */
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


