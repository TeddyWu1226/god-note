import {genCustomStatus} from "@/utils/create";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {SkillType} from "@/types";
import {ItemStatus} from "@/constants/status/item-status";

export const OffhandSkill = {
	ShieldBlock: {
		id: 'ShieldBlock',
		name: "格擋",
		icon: "🛡",
		description: ({playerStore}) => {
			const shield = (playerStore.info.equips.offhand.adDefend ?? 0)
			return `舉起盾牌進行防禦,本回合內提升 ${shield} 點防禦,如果敵方爆擊,則額外造成對方暫時暈眩`;
		},
		costSp: 20,
		use: async ({monster, playerStore}) => {
			const shield = (playerStore.info.equips.offhand.adDefend ?? 0)
			playerStore.addStatus(genCustomStatus(
				{
					base: ItemStatus.Block,
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