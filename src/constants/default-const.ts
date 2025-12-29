// 人物初始值
import {CharEnum} from "@/enums/char-enum";
import {RoomWeights, UserType} from "@/types";
import {WorldDefault} from "@/assets/const";

// todo:測試用
// export const DEFAULT_USER_INFO: UserType = {
//     name: '作者',
//     icon: 'TED',
//     ad: 10,
//     adDefend: 10,
//     critIncrease: WorldDefault.critIncrease,
//     critRate: WorldDefault.critRate,
//     dodge: 0,
//     hit: 0,
//     hp: 200,
//     hpLimit: 200,
//     sp: 100,
//     spLimit: 100,
//     level: 1,
//     char: CharEnum.Beginner.value,
//     gold: 0
// }
export const DEFAULT_USER_INFO: UserType = {
    name: '玩家',
    icon: '🌟',
    ad: 10,
    adDefend: 0,
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
    skills: []
}

// 房間類型權重
export const DEFAULT_ROOM_WEIGHTS: RoomWeights = {
    0: 8, // 休息
    1: 60, // 戰鬥
    2: 15, // 菁英戰鬥
    3: 8, // 特殊事件
    4: 9, // 商店
};
