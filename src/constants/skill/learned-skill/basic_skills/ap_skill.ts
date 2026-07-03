/**
 * 法術輸出相關
 */
import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillParams, SkillTreeNode} from "@/types";
import {ColorText} from "@/utils/color";
import {applySkillDamage, getSkillFinalDamage} from "@/constants/fight-func";
import {useCardImpactEffect} from "@/components/Shared/CardImpactEffect/useCardImpactEffect";
import {getMonsterElement} from "@/utils/create";


export class MagicBall extends SkillModel {
    constructor() {
        super({
            id: 'MagicBall',
            name: "法力彈",
            icon: "skills/active/magic_ball_icon.svg",
            type: 'active',
            rarity: 'common',
            maxCd: 0,
            costSp: 10,
            costAction: 1,
            maxProficiency: 50,
            proficiencyGain: 2
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        const apIncrease = playerStore?.finalStats?.apIncrease ?? 0;
        return Math.round(
            (5 + this.level * 5 + this.proficiency * 0.15) *
            (1 + apIncrease / 100)
        );
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'ap'
        })
        return `對目標丟出一法力凝聚的光彈,造成 ${ColorText.ap(damage)}。`;
    }

    protected execute(params: SkillParams): boolean {
        const playerStore = params.playerStore;
        const monster = params.monster;
        if (!playerStore || !monster) return false;

        const dmg = this.getDamage(playerStore);
        monster.lastDamageResult = applySkillDamage({
            speller: playerStore,
            target: monster,
            baseValue: dmg,
            type: 'ap',
            skillName: '法力彈'
        });
        useCardImpactEffect(getMonsterElement(params.monster.id), 'magic');
        return true;
    }
}



export const ApSkillTree: Record<string, SkillTreeNode> = {
}
