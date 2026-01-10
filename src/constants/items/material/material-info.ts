import {MistyForestMaterial} from "@/constants/items/material/1-misty-forest";
import {ItemType} from "@/types";
import {ScorchedSandsMaterial} from "@/constants/items/material/2-scorched-sands";

export const MonsterCrystals = {
	// 下級魔物晶石
	LowerNormal: {
		name: '下級魔物晶石',
		icon: '▲',
		description: '微弱魔力的結晶，隨處可見。',
		quality: 1,
		price: 50
	} as ItemType,
	LowerLarge: {
		name: '大顆下級魔物晶石',
		icon: '◆︎',
		description: '體積較大的下級晶石，魔力存量較多。',
		quality: 1,
		price: 100
	} as ItemType,
	LowerGiant: {
		name: '巨大下級魔物晶石',
		icon: '⬜',
		description: '極為罕見的巨大下級晶石，十分沉重。',
		quality: 2,
		price: 200
	} as ItemType,

	// 中級魔物晶石
	MediumNormal: {
		name: '中級魔物晶石',
		icon: '🔹',
		description: '穩定的魔力來源，是鍊金常用的素材。',
		quality: 3,
		price: 175
	} as ItemType,
	MediumLarge: {
		name: '大顆中級魔物晶石',
		icon: '🔷',
		description: '成色優良的中級晶石。',
		quality: 3,
		price: 350
	} as ItemType,
	MediumGiant: {
		name: '巨大中級魔物晶石',
		icon: '🟦',
		description: '內部流動著顯著魔力光輝的巨大晶石。',
		quality: 4,
		price: 700
	} as ItemType,

	// 上級魔物晶石
	MediumUpperNormal: {
		name: '上級魔物晶石',
		icon: '🔸',
		description: '純度極高，散發著清澈的魔力光芒。',
		quality: 5,
		price: 675
	} as ItemType,
	MediumUpperLarge: {
		name: '大顆上級魔物晶石',
		icon: '🔶',
		description: '僅在強大魔物體內產出的稀有晶石。',
		quality: 5,
		price: 1250
	} as ItemType,
	MediumUpperGiant: {
		name: '巨大上級魔物晶石',
		icon: '🟧',
		description: '足以作為城邦魔力源核心的巨大結晶。',
		quality: 6,
		price: 2500
	} as ItemType,

	// 優級魔物晶石
	MediumSuperiorNormal: {
		name: '優級魔物晶石',
		icon: '🔻',
		description: '近乎完美的結晶，魔力波動極其強大。',
		quality: 7,
		price: 2500
	} as ItemType,
	MediumSuperiorLarge: {
		name: '大顆優級魔物晶石',
		icon: '♦️',
		description: '傳說級別的素材，有價無市。',
		quality: 7,
		price: 5000
	} as ItemType,
	MediumSuperiorGiant: {
		name: '巨大優級魔物晶石',
		icon: '🟥',
		description: '媲美魔王等級的魔物才會掉落的神話級素材。',
		quality: 8,
		price: 10000
	} as ItemType,
};
export const Material = {...MistyForestMaterial, ...ScorchedSandsMaterial, ...MonsterCrystals}