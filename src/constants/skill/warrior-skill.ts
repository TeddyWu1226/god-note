import {SkillType} from "@/types";
import {applySkillDamage} from "@/constants/fight-func";
import {Sleep} from "@/utils/create";
import {ColorText} from "@/utils/color";

export const WarriorSkill = {
    DoubleHit: {
        id: 'DoubleHit',
        name: "二連擊",
        icon: "⚔️",
        description: ({playerStore}) => {
            const base = playerStore.finalStats.ad * (0.5 + playerStore.getSkillProficiency('DoubleHit') * 0.01)
            const dmg = Math.floor(base * (1 +(playerStore.finalStats.adIncrease / 100)))
            return `快速斬出兩擊，各別造成 ${ColorText.ad(dmg)}。`;
        },
        costSp: 15,
        use: async ({monster, playerStore}) => {
            if (!monster) return false
            const base = playerStore.finalStats.ad * (0.5 + playerStore.getSkillProficiency('DoubleHit') * 0.01)
            const dmg = Math.floor(base * (1 +(playerStore.finalStats.adIncrease / 100)))
            // 攻擊兩次
            let damageOutput = applySkillDamage(playerStore.finalStats, monster, dmg, 'ad', '二連擊');
            monster.lastDamageResult = damageOutput
            if (damageOutput.isKilled) {
                return true
            }
            await Sleep(200)
            damageOutput = applySkillDamage(playerStore.finalStats, monster, dmg, 'ad', '二連擊');
            monster.lastDamageResult = damageOutput
            return true
        }
    } as SkillType
};