import {UsableType} from "@/types";

export const Usable = {
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
	} as UsableType,
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
	} as UsableType,
	DuneBeastBomb:{
		name: '巨獸炸彈',
		quality: 6,
		description: '一個看似強力的合成炸彈，感覺容易引爆造成大量傷害。在上面用肉包裝之下，更能吸引巨獸吃下他而引爆造成大量傷害',
		icon: '💣',
		usable: true,
		unsellable: true,
		skill: 'useDuneBeastBomb'
	} as UsableType,
};