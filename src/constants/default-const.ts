// 人物初始值
import {CharEnum} from "@/enums/char-enum";
import {RoomWeights, UserType} from "@/types";
import {WorldDefault} from "@/assets/const";

export const DEFAULT_USER_INFO: UserType = {
    name: '玩家',
    icon: '🌟',
    ad: 10,
    adDefend: 0,
    apDefend: 0,
    critIncrease: WorldDefault.critIncrease,
    critRate: WorldDefault.critRate,
    dodge: 0,
    hit: 0,
    hp: 100,
    hpLimit: 100,
    sp: 100,
    spLimit: 100,
    level: 1,
    char: CharEnum.Beginner.value,
    gold: 0,
    adIncrease: 0,
    apIncrease: 0,
    defendIncrease: 0,
    lifeSteal: 0,
    runIncrease: 0,
    chaseIncrease: 0,
    skills: [],
    currentExp: 0
}

// 房間類型權重
export let DEFAULT_ROOM_WEIGHTS: RoomWeights = {
    0: 8, // 休息
    1: 60, // 戰鬥
    2: 15, // 菁英戰鬥
    3: 8, // 特殊事件
    4: 9, // 商店
};

export const NORMAL_ROOM_WEIGHTS: RoomWeights = {
    0: 8, // 休息
    1: 60, // 戰鬥
    2: 15, // 菁英戰鬥
    3: 8, // 特殊事件
    4: 9, // 商店
};

export const EAST_ROOM_WEIGHTS: RoomWeights = {
    0: 15, // 休息
    1: 58, // 戰鬥
    2: 10, // 菁英戰鬥
    3: 8, // 特殊事件
    4: 9, // 商店
};
