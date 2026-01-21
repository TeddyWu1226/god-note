import {StatusEffect} from "@/types";

export const SkillStatus = {
	MagicDefend: {
		name: '法術裝甲',
		icon: '🌐',
		duration: 4,
		isBuff: true,
		description: `提升自身 %adDefend% 點防禦，持續 %duration% 回合`,
		bonus: {
			adDefend: 5
		}
	} as StatusEffect,
	SwordMind: {
		name: '劍意',
		icon: '🤺',
		duration: 3,
		isBuff: true,
		description: '提升自身 15% 所有增傷以及 10% 抗性',
		bonus: {
			adIncrease: 15,
			apIncrease: 15,
			defendIncrease: 10
		}
	} as StatusEffect,
}