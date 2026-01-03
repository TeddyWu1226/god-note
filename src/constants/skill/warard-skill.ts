import {SkillType} from "@/types";
import {applySkillDamage} from "@/constants/fight-func";
import {ColorText} from "@/utils/color";
import {checkProbability, formatPrecision} from "@/utils/math";
import {UserStatus} from "@/constants/status/user-status";

export const WizardSkill = {
    FireBall: {
        id: 'FireBall',
        name: "火球術",
        icon: "🔥",
        description: ({playerStore}) => {
            const proficiency = playerStore.getSkillProficiency('FireBall')
            const dmg = Math.floor((5 + proficiency * 0.15) * (1 + playerStore.finalStats.apIncrease / 100))
            const percent = formatPrecision(0.1 + proficiency * 0.007 * 100, 1)
            return `對目標丟出一顆火球,造成 ${ColorText.ap(dmg)},有${percent}%機率造成「燃燒」效果。`;
        },
        costSp: 10,
        use: async ({monster, monsterIndex, playerStore, gameStateStore}) => {
            if (!monster) return false
            const proficiency = playerStore.getSkillProficiency('FireBall')
            const dmg = Math.floor((5 + proficiency * 0.15) * (1 + playerStore.finalStats.apIncrease / 100))
            monster.lastDamageResult = applySkillDamage(playerStore.finalStats, monster, dmg, 'ap', '火球術')
            const percent = formatPrecision(0.1 + proficiency * 0.007, 3)
            if (checkProbability(percent)) {
                gameStateStore.addEffectToMonster(monsterIndex, UserStatus.OnBurn)
            }
            return true
        }
    } as SkillType
};