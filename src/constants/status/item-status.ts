import {StatusEffect} from "@/types";

export const ItemStatus = {
	SmokeBomb: {
		name: '煙霧迷漫',
		icon: '😶‍🌫️',
		duration: 1,
		isBuff: true,
		description: '煙霧迷漫狀態下, 獲得必定逃跑效果(大多數情況下)',
		bonus: {
			runIncrease: 100
		}
	} as StatusEffect,
	CamouflageGrass: {
		name: '草叢掩蔽',
		icon: '🥬',
		duration: 1,
		isBuff: true,
		description: '草叢掩蔽的狀態下, 獲得容易逃跑效果',
		bonus: {
			runIncrease: 30
		}
	} as StatusEffect,
	OnBurn: {
		name: '燃燒',
		icon: '🔥',
		duration: 3,
		description: '這個單位正在燃燒, 每回合失去 5 點生命值',
		type: 'damage',
		value: 5
	} as StatusEffect,
	Warming: {
		name: '溫暖',
		icon: '🤗',
		duration: 5,
		description: '身體感受到溫暖,暫時不會受到寒冷狀態',
	} as StatusEffect
}