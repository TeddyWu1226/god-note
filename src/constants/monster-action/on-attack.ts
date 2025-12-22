// 定義所有怪物的特殊行為
import {UnitStatus} from "@/constants/status-info";
import {MonsterActionParams} from "@/types";
import {checkProbability} from "@/utils/math";
import {showEffect} from "@/components/Shared/FloatingEffect/EffectManager";


export const MonsterOnAttack: Record<string, (params: MonsterActionParams) => void> = {
    slimeOnAttack: ({playerStore, logStore}) => {
        playerStore.addStatus(UnitStatus.SlimeSlow)
        logStore.logger.add(`你沾滿了黏液。`);
    },
    beeOnAttack: ({playerStore, logStore}) => {
        if (checkProbability(0.5)) {
            playerStore.addStatus(UnitStatus.BeePoison)
            logStore.logger.add(`你中毒了。`);
        }
    },
    poisonSlimeOnAttack: ({monster, playerStore, targetElement, logStore}) => {
        // 防禦減少
        showEffect(targetElement, "🛡️⬇️", "debuff");
        if (monster.adDefend >= 5) {
            monster.adDefend -= 5
        }
        if (monster.adDefend < 0) {
            monster.adDefend = 0
        }


    },
};