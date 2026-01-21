import {genCustomStatus} from "@/utils/create";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {SkillType} from "@/types";
import {UsualStatus} from "@/constants/status/usual-status";

export const OffhandSkill = {
	HeavyDoor: {
		id: 'HeavyDoor',
		name: "舉門",
		icon: "🚪",
		description: ({playerStore}) => {
			return `舉起木門進行防禦,本回合內提升 5 點防禦`;
		},
		costSp: 5,
		use: async ({monster, playerStore}) => {
			playerStore.addStatus(genCustomStatus(
				{
					base: UsualStatus.AdDefendInCrease,
					bonus: {
						adDefend: 5
					},
					duration: 1
				}
			))
			useFullScreenEffect({
				message: '防禦',
				color: 'gray'
			});
			return true
		}
	} as SkillType,
	ShieldBlock: {
		id: 'ShieldBlock',
		name: "格擋",
		icon: "🛡",
		description: ({playerStore}) => {
			const shield = (playerStore.info.equips.offhand.adDefend ?? 0) * 2
			return `舉起盾牌進行防禦,本回合內提升 ${shield} 點防禦`;
		},
		costSp: 5,
		use: async ({monster, playerStore}) => {
			const shield = (playerStore.info.equips.offhand.adDefend ?? 0) * 2
			playerStore.addStatus(genCustomStatus(
				{
					base: UsualStatus.AdDefendInCrease,
					bonus: {
						adDefend: shield
					},
					duration: 1
				}
			))
			useFullScreenEffect({
				message: '格擋',
				color: 'gray'
			});
			return true
		}
	} as SkillType,
}