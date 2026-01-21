import {SkillType} from "@/types";
import {applySkillDamage} from "@/constants/fight-func";
import {ColorText} from "@/utils/color";
import {checkProbability, formatPrecision} from "@/utils/math";
import {ItemStatus} from "@/constants/status/item-status";

export const CommonSkill = {
	CommonHeal: {
		id: 'CommonHeal',
		name: "初級治療",
		icon: "💕",
		description: ({playerStore}) => {
			const proficiency = playerStore.getSkillProficiency('CommonHeal')
			const value = Math.floor((30 + proficiency * 0.7))
			return `自身 ${ColorText.heal(value)}。`;
		},
		costSp: 25,
		use: async ({monster, monsterIndex, playerStore, gameStateStore}) => {
			const proficiency = playerStore.getSkillProficiency('CommonHeal')
			const value = Math.floor((20 + proficiency * 0.5))
			playerStore.info.hp = Math.min(playerStore.finalStats.hpLimit, playerStore.info.hp + value)
			return true
		}
	} as SkillType
};