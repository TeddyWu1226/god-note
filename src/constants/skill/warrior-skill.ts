import {SkillType} from "@/types";
import {applySkillDamage} from "@/constants/fight-func";
import {Sleep} from "@/utils/create";
import {ColorText} from "@/utils/color";

export const WarriorSkill = {
    DoubleHit: {
        id: 'DoubleHit',
        name: "二連擊",
        icon: "⚔️",
        description: (prop) => {
            const atk = Math.floor(prop.playerStore?.finalStats.ad)
            return `快速斬出兩擊，各別造成 ${ColorText.ad(atk)}。`;
        },
        costSp: 15,
        use: async ({monster, playerStore}) => {
            if (!monster) return false
            const stats = playerStore.finalStats;
            const dmg = Math.floor(stats.ad) // 基礎值
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