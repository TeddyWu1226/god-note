import {SkillType} from "@/types";
import {applySkillDamage} from "@/constants/fight-func";
import {ColorText} from "@/utils/color";

export const WizardSkill = {
    FireBall: {
        id: 'FireBall',
        name: "火球術",
        icon: "⚔️",
        description: (prop) => {
            const dmg = 10
            return `對目標丟出一顆火球,造成 ${ColorText.ap(dmg)},有機率造成「燃燒」效果。`;
        },
        costSp: 20,
        use: async ({monster, playerStore}) => {
            if (!monster) return false
            const dmg = 10
            monster.lastDamageResult = applySkillDamage(playerStore.finalStats, monster, dmg, 'ap', '火球術')
            return true
        }
    } as SkillType
};