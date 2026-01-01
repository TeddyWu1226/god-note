// 定義所有怪物的特殊行為
import {UnitStatus} from "@/constants/status/unit-status";
import {MonsterActionParams} from "@/types";
import {checkProbability} from "@/utils/math";
import {showEffect} from "@/components/Shared/FloatingEffect/EffectManager";


export const MonsterOnDead: Record<string, (params: MonsterActionParams) => void> = {
    mandragoraOnDead: ({playerStore, targetElement, logStore}) => {
        playerStore.addStatus(UnitStatus.MandragoraScared)
        logStore.logger.add(`你受到驚嚇了。`);
        showEffect(targetElement, "阿!~~~~", "debuff");
    },
};