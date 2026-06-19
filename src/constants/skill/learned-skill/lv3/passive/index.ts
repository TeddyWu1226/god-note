import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillParams} from "@/types";


export class SwordMaster extends SkillModel {
    constructor() {
        super({
            id: 'SwordMaster',
            name: "劍術大師",
            icon: "skills/sword_expert.svg",
            type: 'passive',
            rarity: 'rare',
        });
    }

    description(playerStore: PlayerStoreType): string {
        return `裝備劍（名稱含有「劍」的武器）時，提升 15% 物理傷害，並增加 20 點命中。`;
    }

    protected execute(params: SkillParams): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        const weaponName = player?.equips?.weapon?.name || '';
        if (weaponName.includes('劍')) {
            return {
                adIncrease: 15,
                hit: 20
            };
        }
        return {};
    }
}

