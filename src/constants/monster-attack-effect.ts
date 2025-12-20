// 定義所有怪物的特殊行為
import {usePlayerStore} from "@/store/player-store";
import {UnitStatus} from "@/constants/status-info";
import {BattleOutcome, MonsterType} from "@/types";

// 定義參數型別，未來如果要增加 LogStore 也可以直接加在這裡
interface MonsterActionParams {
    monster?: MonsterType;
    playerStore?: any; // 或是具體的 Store 型別
    logStore?: any;
    damage?: BattleOutcome;
}

export const MonsterActions: Record<string, (params: MonsterActionParams) => void> = {
    onSlimeAttack: ({playerStore, logStore}) => {
        playerStore.addStatus(UnitStatus.SlimeSlow)
        logStore.logger.add(`你沾滿了黏液。`);
    },
    onWolfAttack: () => {
        console.log('狼發動了撕咬！');
    }
};