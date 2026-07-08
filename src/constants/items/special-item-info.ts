import {ItemType, UsableType} from "@/types";


export const SpecialItem = {
	DragonBlood: {
		name: '龍之血',
		icon: '🩸',
		description: '從強大龍族身上採集到的血液，蘊含著狂暴的古老魔力與生命力。',
		quality: 5,
		unsellable: true,
	} as ItemType,
	Wrath: {
		name: '憤怒的記憶',
		icon: '℘',
		description: '記錄著遠古龍族的屈辱與憤怒。',
		quality: 7,
		unsellable: true,
	} as ItemType
}