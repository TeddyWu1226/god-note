import {UsableType} from "@/types";

const Heal = {
    Heal0: {
        name: '粗製藥水',
        description: '聞起來像雜草，效果微乎其微。',
        icon: '🧪',
        quality: 0,
        heal: 25,
        usable: true
    } as UsableType,

    Heal1: {
        name: '初級生命藥水',
        description: '冒險者的基本必備品。',
        icon: '🧪',
        quality: 1,
        heal: 50,
        usable: true
    } as UsableType,

    Heal2: {
        name: '中級生命萃取液',
        description: '口感苦澀但恢復效果顯著。',
        icon: '',
        quality: 2,
        heal: 100,
        usable: true
    } as UsableType,
};


const Magic = {
    Magic0: {
        name: '混濁果汁',
        description: '感覺放了很久，只能稍微提神。',
        icon: '🍷',
        quality: 0,
        magic: 10,
        usable: true
    } as UsableType,
    Magic1: {
        name: '初級法力藥水',
        description: '淡淡的藍色液體。',
        icon: '🍷',
        quality: 1,
        magic: 20,
        usable: true
    } as UsableType,
    Magic2: {
        name: '清澈法力藥水',
        description: '精煉過的魔力液體，恢復感極強。',
        icon: '🍷',
        quality: 2,
        magic: 50
    } as UsableType,
};

const Special = {
    BurningPotion: {
        name: '燃燒藥水',
        description: '可以使目標燃燒或燒掉某些東西',
        icon: '🔥',
        quality: 0,
        usable: true,
        skill: 'useBurningPotion'
    } as UsableType,
    UnPoisonPotion: {
        name: '解毒劑',
        description: '可以使自身消除「中毒」效果',
        icon: '💉',
        quality: 1,
        usable: true,
        skill: 'useUnPoisonPotion'
    } as UsableType,
}

export const Potions = {...Heal, ...Magic, ...Special}