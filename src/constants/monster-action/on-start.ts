// 定義所有怪物的特殊行為
import {UnitStatus} from "@/constants/status-info/unit-status";
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
    bearOnstart: ({targetElement}) => {
        // 額外動畫演示
        useFloatingMessage(
            '這裡不是你該闖入的地方!',
            targetElement,
            {
                duration: 2000, // 動畫時間保持不變
                color: 'red'
            }
        );
    },
    spiderOnstart: ({playerStore,targetElement}) => {
        // 額外動畫演示
        useFloatingMessage(
            '絲絲絲!',
            targetElement,
            {
                duration: 2000, // 動畫時間保持不變
                color: 'red'
            }
        );
        //效果
        playerStore.addStatus(UnitStatus.SpiderStuck)
    }
};