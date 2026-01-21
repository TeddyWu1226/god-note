import {SkillType} from "@/types";
import {applySkillDamage} from "@/constants/fight-func";
import {ColorText} from "@/utils/color";
import {checkProbability, formatPrecision} from "@/utils/math";
import {ItemStatus} from "@/constants/status/item-status";
import {create, genCustomStatus} from "@/utils/create";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {SkillStatus} from "@/constants/status/skill-status";
import {UsualStatus} from "@/constants/status/usual-status";

export const WizardSkill = {
	MagicBall: {
		id: 'MagicBall',
		name: "法力彈",
		icon: "🔵",
		description: ({playerStore}) => {
			const proficiency = playerStore.getSkillProficiency('MagicBall')
			const dmg = Math.floor((5 + proficiency * 0.15) * (1 + playerStore.finalStats.apIncrease / 100))
			return `對目標丟出一法力凝聚的光彈,造成 ${ColorText.ap(dmg)}。`;
		},
		costSp: 10,
		use: async ({monster, monsterIndex, playerStore, gameStateStore}) => {
			if (!monster) return false
			const proficiency = playerStore.getSkillProficiency('MagicBall')
			const dmg = Math.floor((5 + proficiency * 0.15) * (1 + playerStore.finalStats.apIncrease / 100))
			monster.lastDamageResult = applySkillDamage(playerStore.finalStats, monster, dmg, 'ap', '法力彈')
			return true
		}
	} as SkillType,
	FireBall: {
		id: 'FireBall',
		name: "火球術",
		icon: "🔥",
		description: ({playerStore}) => {
			const proficiency = playerStore.getSkillProficiency('FireBall')
			const dmg = Math.floor((5 + proficiency * 0.15) * (1 + playerStore.finalStats.apIncrease / 100))
			const percent = formatPrecision(0.1 + proficiency * 0.007 * 100, 1)
			return `對目標丟出一顆火球,造成 ${ColorText.ap(dmg)},有${percent}%機率造成「燃燒」效果。`;
		},
		costSp: 10,
		use: async ({monster, monsterIndex, playerStore, gameStateStore}) => {
			if (!monster) return false
			const proficiency = playerStore.getSkillProficiency('FireBall')
			const dmg = Math.floor((5 + proficiency * 0.15) * (1 + playerStore.finalStats.apIncrease / 100))
			monster.lastDamageResult = applySkillDamage(playerStore.finalStats, monster, dmg, 'ap', '火球術')
			if (monster.lastDamageResult.isHit) {
				const percent = formatPrecision(0.1 + proficiency * 0.007, 3)
				if (checkProbability(percent)) {
					gameStateStore.addEffectToMonster(monsterIndex, ItemStatus.OnBurn)
				}
			}

			return true
		}
	} as SkillType,
	MagicDefend: {
		id: 'MagicDefend',
		name: "法術裝甲",
		icon: "🌐",
		description: ({playerStore}) => {
			const defend = 5 + Math.floor(playerStore.getSkillProficiency('MagicDefend') * 0.2)
			return `提升自身 ${defend} 點防禦，持續 3 回合`;
		},
		costSp: 25,
		proficiency: 5,
		use: async ({monster, playerStore}) => {
			const defend = 5 + Math.floor(playerStore.getSkillProficiency('MagicDefend') * 0.2)
			playerStore.addStatus(genCustomStatus(
				{
					base: SkillStatus.MagicDefend,
					bonus: {
						adDefend: defend
					},
					duration: 3
				}
			))
			useFullScreenEffect({
				message: '防禦提升',
				color: 'blue'
			});
			return true
		}
	} as SkillType,
};

export const Wizard1SkillEvolutionMap = {
	[WizardSkill.MagicBall.id]: [
		WizardSkill.MagicDefend.id
	]
}