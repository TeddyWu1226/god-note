import {MonsterType} from "@/types";
import {WorldDefault} from "@/assets/const";
import {MATERIAL} from "@/constants/items/material/material-info";
import {Accessory1} from "@/constants/items/equipment/accessories-info";


export const SpecialBoss = {
	EvilWoodMan: {
		icon: '𓆩🌳𓆪',
		name: '邪靈樹妖',
		class: 'boss',
		description: '吸收你的靈氣而茁壯的強大魔物,這次決定奪走你的生命',
		ad: 5,
		critIncrease: WorldDefault.critIncrease,
		critRate: 25,
		adDefend: 3,
		apDefend: 3,
		dodge: 0,
		hit: 50,
		hp: 50,
		hpLimit: 50,
		level: 8,
		dropGold: 0,
		onStart: 'evilWoodManOnStart',
		drop: [
			{item: Accessory1.CursedWoodenRing, chance: 1}
		],
	} as MonsterType,
};