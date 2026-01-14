import {SkillType} from "@/types";
import {applySkillDamage} from "@/constants/fight-func";
import {create, Sleep} from "@/utils/create";
import {ColorText} from "@/utils/color";
import {UserStatus} from "@/constants/status/user-status";
import {CharEnum} from "@/enums/char-enum";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";

export const WarriorSkill = {
	DoubleHit: {
		id: 'DoubleHit',
		name: "二連擊",
		icon: "⚔️",
		description: ({playerStore}) => {
			const base = playerStore.finalStats.ad * (0.5 + playerStore.getSkillProficiency('DoubleHit') * 0.01)
			const dmg = Math.floor(base * (1 + (playerStore.finalStats.adIncrease / 100)))
			return `快速斬出兩擊，各別造成 ${ColorText.ad(dmg)}。`;
		},
		costSp: 15,
		use: async ({monster, playerStore}) => {
			if (!monster) return false
			const base = playerStore.finalStats.ad * (0.5 + playerStore.getSkillProficiency('DoubleHit') * 0.01)
			const dmg = Math.floor(base * (1 + (playerStore.finalStats.adIncrease / 100)))
			// 攻擊兩次
			let damageOutput = applySkillDamage(playerStore.finalStats, monster, dmg, 'ad', '二連擊');
			monster.lastDamageResult = damageOutput
			if (damageOutput.isKilled) {
				return true
			}
			await Sleep(200)
			damageOutput = applySkillDamage(playerStore.finalStats, monster, dmg, 'ad', '二連擊');
			monster.lastDamageResult = damageOutput
			return true
		}
	} as SkillType,
	SwordMind: {
		id: 'SwordMind',
		name: "劍意",
		icon: "🤺",
		description: ({playerStore}) => {
			const remain = 4 + Math.floor(playerStore.getSkillProficiency('SwordMind') * 0.07)
			return `提升自身15%所有增傷以及10%抗性，持續 ${remain} 回合`;
		},
		costSp: 20,
		proficiency: 5,
		use: async ({monster, playerStore}) => {
			const remain = 4 + Math.floor(playerStore.getSkillProficiency('SwordMind') * 0.07)
			const status = create(UserStatus.SwordMind)
			status.duration = remain
			playerStore.addStatus(status)
			useFullScreenEffect({
				message: '輸出以及抗性提升',
			});
			return true
		}
	} as SkillType,
};


export const Warrior1SkillEvolutionMap = {
	[WarriorSkill.DoubleHit.id]: [
		WarriorSkill.SwordMind.id
	]
}