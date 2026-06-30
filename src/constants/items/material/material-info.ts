import {ItemType} from "@/types";

export const MonsterCrystals = {
    BadNormal: {
        name: '劣質魔物晶石',
        icon: '🌫️',
        description: '低階魔物掉落的核心，充滿雜質。',
        quality: 0,
        price: 10
    } as ItemType,

    LowerNormal: {
        name: '下級魔物晶石',
        icon: '⬜',
        description: '低階魔物掉落的核心，較為純淨。',
        quality: 1,
        price: 20
    } as ItemType,

    MediumNormal: {
        name: '中級魔物晶石',
        icon: '🟩',
        description: '中階魔物掉落的核心，散發螢綠色光芒。',
        quality: 2,
        price: 40
    } as ItemType,

    MediumUpperNormal: {
        name: '上級魔物晶石',
        icon: '🟦',
        description: '中階強大魔物掉落的核心，散發螢藍色光芒',
        quality: 3,
        price: 80
    } as ItemType,

    MediumSuperiorNormal: {
        name: '優級魔物晶石',
        icon: '🟪',
        description: '受魔界影響可怕魔物掉落的核心，魔力波動極其強大。',
        quality: 4,
        price: 160
    } as ItemType,

    TopNormal: {
        name: '頂級魔物晶石',
        icon: '🟥',
        description: '只存在於神話故事中紀錄的魔石，不敢想像擁有此核心的怪物有多麼可怕。',
        quality: 5,
        price: 320
    } as ItemType,

    DemonJewelry: {
        name: '魔神石',
        icon: '💎',
        description: '神力的來源...',
        quality: 6,
        price: 1000
    } as ItemType,
};
export const SpecialItems = {

}
export const Material = {
    ...MonsterCrystals
}