// 定義所有怪物的特殊行為
import {UnitStatus} from "@/constants/status-info";
import {MonsterActionParams} from "@/types";
import {checkProbability} from "@/utils/math";
import {showEffect} from "@/components/Shared/FloatingEffect/EffectManager";


export const MonsterOnAttacked: Record<string, (params: MonsterActionParams) => void> = {
    poisonSlimeOnAttacked: ({monster, playerStore, targetElement, logStore}) => {
        // 使攻擊者中毒
        playerStore.addStatus(UnitStatus.SlimePoison)
        logStore.logger.add(`你中毒了。`);
        // 防禦增加
        showEffect(targetElement, "🛡️⬆️", "buff");
        monster.adDefend += 5
    },
};