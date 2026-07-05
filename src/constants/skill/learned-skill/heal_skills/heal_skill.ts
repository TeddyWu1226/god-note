import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillParams} from "@/types";
import {ColorText} from "@/utils/color";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";


/**
 * 其他相關
 */
export class CommonHeal extends SkillModel {
    constructor() {
        super({
            id: 'CommonHeal',
            name: "初級治療",
            icon: "skills/magic/heal_icon.svg",
            type: 'active',
            rarity: 'common',
            maxCd: 2,
            costSp: 25,
            costMaxAction: true,
            maxProficiency: 25,
            proficiencyGain: 1
        });
    }

    get healVal(): number {
        return Math.round(20 + this.proficiency);
    }

    description(playerStore: PlayerStoreType): string {
        return `自身 ${ColorText.heal(this.healVal)}。`;
    }

    protected execute(params: SkillParams): boolean {
        const playerStore = params.playerStore;
        if (!playerStore) return false;

        playerStore.info.hp = Math.min(
            playerStore.finalStats.hpLimit,
            playerStore.info.hp + this.healVal
        );
        useFullScreenEffect({
            message: this.name,
            color: 'green',
        });
        return true;
    }
}
