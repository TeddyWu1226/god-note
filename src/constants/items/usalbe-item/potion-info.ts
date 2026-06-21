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
        icon: '🧪',
        quality: 2,
        heal: 100,
        usable: true
    } as UsableType,
    Heal3: {
        name: '特製生命藥劑',
        description: '經過多次過濾的濃縮液，效果顯著提升。',
        icon: '🧪',
        quality: 3,
        heal: 200,
        usable: true
    } as UsableType,
    Heal4: {
        name: '強效生命精華',
        description: '提煉自荒漠罕見植物，擁有強大的再生能量。',
        icon: '🧪',
        quality: 4,
        heal: 400,
        usable: true
    } as UsableType,
    Heal5: {
        name: '完美生命精華',
        description: '完美的生命藥劑，彷彿斷肢都能瞬間復原。',
        icon: '🧪',
        quality: 5,
        heal: 800,
        usable: true
    } as UsableType,
};


const Magic = {
    Magic0: {
        name: '混濁果汁',
        description: '感覺放了很久，只能稍微提神。',
        icon: '🍷',
        quality: 0,
        magic: 25,
        usable: true
    } as UsableType,
    Magic1: {
        name: '初級法力藥水',
        description: '淡淡的藍色液體。',
        icon: '🍷',
        quality: 1,
        magic: 50,
        usable: true
    } as UsableType,
    Magic2: {
        name: '清澈法力藥水',
        description: '精煉過的魔力液體，恢復感極強。',
        icon: '🍷',
        quality: 2,
        magic: 100,
        usable: true
    } as UsableType,
    Magic3: {
        name: '高純度法力藥水',
        description: '去除了雜質的藍色液體，魔力波動穩定。',
        icon: '🍷',
        quality: 3,
        magic: 200,
        usable: true
    } as UsableType,
    Magic4: {
        name: '強效魔力增幅液',
        description: '內含微小魔力結晶，能快速填補乾涸的氣海。',
        icon: '🍷',
        quality: 4,
        magic: 400,
        usable: true
    } as UsableType,
    Magic5: {
        name: '完美魔力增幅液',
        description: '內含精煉魔力結晶，能快速填補乾涸的氣海。',
        icon: '🍷',
        quality: 5,
        magic: 800,
        usable: true
    } as UsableType,
};



export const Potions = {...Heal, ...Magic}