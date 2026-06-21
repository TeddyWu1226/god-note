import {UsableType} from "@/types";


export const Usable = {
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
    ShabbyTent: {
        name: '破舊帳篷',
        quality: 2,
        description: '讓你可以在「選擇路徑階段」復原當前50%生命',
        icon: '⛺',
        usable: true,
        skill: 'useShabbyTent'
    } as UsableType,
    CamouflageGrass: {
        name: '偽裝草叢',
        quality: 2,
        description: '讓你可以在「戰鬥階段」使用,使用後可以提高1回合逃跑的機率(無法在BOSS房間使用)',
        icon: '🥬',
        usable: true,
        skill: 'useCamouflageGrass'
    } as UsableType,
    Campfire: {
        name: '簡易營火包',
        quality: 3,
        description: '讓你可以在「選擇路徑階段」復原生命以及消除Debuff',
        icon: '🏕️',
        usable: true,
        skill: 'useCampfire'
    } as UsableType,
    SmokeBomb: {
        name: '煙霧彈',
        quality: 3,
        description: '讓你可以在「戰鬥階段」使用,使用後獲得1回合超提高逃跑成功的效果(無法在BOSS房間使用)',
        icon: '💨',
        usable: true,
        skill: 'useSmokeBomb'
    } as UsableType
};

export const GodThings = {
    GodStar: {
        name: '神性星輝',
        quality: 8,
        description: '充滿神性的星狀碎片,若受到致死攻擊後可以滿血復活',
        icon: '🌟',
        usable: false,
        unsellable: true,
    } as UsableType,
    GodNotePage: {
        name: '神祗筆記殘頁',
        quality: 10,
        description: '神用來記錄萬物行徑的筆記殘頁。只能在「選擇路徑階段」使用,使用後可以記錄當下你的狀態,當你死亡後可以有一次依照該紀錄回歸機會',
        icon: '📜',
        usable: true,
        unsellable: true,
        skill: 'useGodNotePage'
    } as UsableType
}