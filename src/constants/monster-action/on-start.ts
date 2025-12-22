// 定義所有怪物的特殊行為
import {UnitStatus} from "@/constants/status-info";
import {MonsterActionParams} from "@/types";
import {checkProbability} from "@/utils/math";
import {useFloatingMessage} from "@/components/Shared/FloatingMessage/useFloatingMessage";


export const MonsterOnStart: Record<string, (params: MonsterActionParams) => void> = {
    wolfOnStart: ({playerStore, targetElement}) => {
        //效果
        playerStore.addStatus(UnitStatus.WolfRoarWarning)
        //動畫
        useFloatingMessage(
            '啊嗚~',
            targetElement,
            {
                duration: 1500, // 動畫時間保持不變
                color: 'red'
            }
        );
    },
};