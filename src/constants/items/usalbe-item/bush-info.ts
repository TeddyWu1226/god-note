import {UsableType} from "@/types";

export const NormalFruits = {
	RedApple: {
		name: '鮮紅果',
		description: '香甜可口的果實。',
		icon: '🍎',
		quality: 1,
		heal: 25,
		magic: 25,
		usable: true
	} as UsableType
}
export const ColdRegionFruits = {
	WarmFruit: {
		name: '溫暖果',
		description: '食用後可以暫時獲得溫暖,避免寒冷狀態疊加(無法消除當前寒冷狀態)。',
		icon: '🍅',
		quality: 1,
		usable: true,
		skill: 'useWarmFruit'
	} as UsableType,
	HotFruit: {
		name: '刺熱果',
		description: '溫暖果的成熟型態,食用後可以立即解除身上寒冷狀態,但吃了會中毒。',
		icon: '🍓',
		quality: 1,
		usable: true,
		skill: 'useHotFruit'
	} as UsableType,
};
