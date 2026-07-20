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
        description: '中階魔物掉落的核心。',
        quality: 2,
        price: 40
    } as ItemType,

    MediumUpperNormal: {
        name: '上級魔物晶石',
        icon: '🟦',
        description: '中階魔物掉落的核心',
        quality: 3,
        price: 80
    } as ItemType,

    MediumSuperiorNormal: {
        name: '優級魔物晶石',
        icon: '🟪',
        description: '高階魔物掉落的核心。',
        quality: 4,
        price: 160
    } as ItemType,

    TopNormal: {
        name: '頂級魔物晶石',
        icon: '🟥',
        description: '魔族才能擁有的核心。',
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

export const BossCrystals = {
    AncientRoots: {
        name: '古蜘蛛的晶石',
        icon: '♦️',
        description: '古蜘蛛掉落的晶石。',
        quality: 6,
        price: 100
    } as ItemType,
    Twilight: {
        name: '神代者的晶石',
        icon: '♦️',
        description: '神祗代理者掉落的晶石。',
        quality: 6,
        price: 300
    } as ItemType,
    FrostGiant: {
        name: '巨人的晶石',
        icon: '♦️',
        description: '冰凍的巨人掉落的晶石。',
        quality: 6,
        price: 600
    } as ItemType,
    FireWyrmling: {
        name: '幼龍的晶石',
        icon: '♦️',
        description: '炎幼龍掉落的晶石。',
        quality: 6,
        price: 1000
    } as ItemType,
    BurrowingBehemoth: {
        name: '巨獸的晶石',
        icon: '♦️',
        description: '掘地巨獸掉落的晶石。',
        quality: 6,
        price: 1500
    } as ItemType,
    RockGolemGroup: {
        name: '巨像的晶石',
        icon: '♦️',
        description: '魔岩巨像掉落的晶石。',
        quality: 6,
        price: 2100
    } as ItemType,
};

export const SpecialItems = {}
export const Material = {
    ...MonsterCrystals,
    ...BossCrystals
}