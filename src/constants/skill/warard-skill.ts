import {SkillType} from "@/types";
import {applySkillDamage} from "@/constants/fight-func";
import {ColorText} from "@/utils/color";
import {checkProbability} from "@/utils/math";
import {UserStatus} from "@/constants/status/user-status";

export const WizardSkill = {
    FireBall: {
        id: 'FireBall',
        name: "火球術",
        icon: "🔥",
        description: ({playerStore}) => {
            const proficiency = playerStore.getSkillProficiency('FireBall')
            const dmg = 5 + proficiency * 0.2
            const percent = 0.1 + proficiency * 0.07
            return `對目標丟出一顆火球,造成 ${ColorText.ap(dmg)},有${percent * 100}%機率造成「燃燒」效果。`;
        },
        costSp: 10,
        use: async ({monster, monsterIndex, playerStore, gameStateStore}) => {
            if (!monster) return false
            const proficiency = playerStore.getSkillProficiency('FireBall')
            const dmg = 10 + proficiency * 0.2
            monster.lastDamageResult = applySkillDamage(playerStore.finalStats, monster, dmg, 'ap', '火球術')
            const percent = 0.1 + proficiency * 0.07
            if (checkProbability(percent)) {
                gameStateStore.addEffectToMonster(monsterIndex, UserStatus.OnBurn)
            }
            return true
        }
    } as SkillType
};