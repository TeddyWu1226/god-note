import {StatusEffect} from "@/types";

export const UnitStatus = {
	SlimeSlow: {
		name: '黏液阻饒',
		icon: '🟢',
		duration: 4,
		description: '降低 30 點 閃避值',
		bonus: {
			dodge: -30
		}
	} as StatusEffect,
	WolfRoarWarning: {
		name: '狼嚎警告',
		icon: '⚠️',
		duration: 1,
		isBuff: true,
		description: '森林之狼對你怒吼警告,希望你不要做出傻事,要跑趁現在',
		bonus: {
			runIncrease: 150
		}
	} as StatusEffect,
	SlimePoison: {
		name: '中毒',
		icon: '🤢',
		duration: 4,
		description: '每回合失去 5 點生命值',
		type: 'damage',
		value: 5
	} as StatusEffect,
	MushroomManPoison: {
		name: '麻痺',
		icon: '🦠',
		duration: 3,
		description: '降低 50 點命中值',
		bonus: {
			hit: -50
		},
	} as StatusEffect,
	BeePoison: {
		name: '中毒',
		icon: '🤢',
		duration: 10,
		description: '每回合失去 3 點生命值',
		type: 'damage',
		value: 3
	} as StatusEffect,
	SpiderStuck: {
		name: '綑綁',
		icon: '🕸',
		duration: 5,
		description: '你被堅韌但易燃的蜘蛛絲綑綁了,任何行動都會失效',
		type: 'stuck',
	} as StatusEffect,
	SmallSpiderStuck: {
		name: '綑綁',
		icon: '🕸',
		duration: 3,
		description: '你被堅韌但易燃的蜘蛛絲綑綁了,任何行動都會失效',
		type: 'stuck',
	} as StatusEffect,
	SpiderHunter: {
		name: '獵殺者',
		icon: '⚠️',
		duration: 1,
		isBuff: true,
		description: '蜘蛛對於被綑綁的敵人可以造成百分百爆擊',
		bonus: {
			critRate: 100
		}
	} as StatusEffect,
	EvilWoodManCurse: {
		name: '魔樹詛咒',
		icon: '🪵',
		duration: -1,
		description: '被魔樹詛咒的單位無法逃跑以及閃避',
		bonus: {
			dodge: -100000
		}
	} as StatusEffect,
	MandragoraScared: {
		name: '驚嚇',
		icon: '😱',
		duration: 3,
		description: '所有輸出減少50%',
		bonus: {
			adIncrease: -50,
			apIncrease: -50
		}
	} as StatusEffect,
	ScorpionPoison: {
		name: '劇毒',
		icon: '☣︎',
		duration: 10,
		description: '每回合失去 5 點生命值,如果連續中毒,傷害會疊加並刷新效果',
		type: 'damage',
		value: 5
	} as StatusEffect,
	SmallScorpionPoison: {
		name: '劇毒',
		icon: '☣︎',
		duration: 10,
		description: '每回合失去 3 點生命值,如果連續中毒,傷害會疊加並刷新效果',
		type: 'damage',
		value: 3
	} as StatusEffect,
}