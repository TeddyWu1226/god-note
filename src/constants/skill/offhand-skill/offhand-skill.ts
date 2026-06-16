import {genCustomStatus} from "@/utils/create";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {SkillType} from "@/types";
import {ItemStatus} from "@/constants/status/item-status";

export const OffhandSkill = {
	ShieldBlock: {
		id: 'ShieldBlock',
		name: "格擋",
		icon: "skills/shield_block.svg",
		itemDescription:'舉起盾牌進行防禦,本回合內提升防禦力以抵擋傷害,如果敵方爆擊,則額外造成對方暫時暈眩',
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
	MagicRegain: {
		id: 'MagicRegain',
		name: "法力恢復",
		icon: "skills/magic_regain.svg",
		itemDescription:'喚起書中魔力文字,立刻恢復部分點法力',
		description: ({playerStore}) => {
			const value = (playerStore.info.equips.offhand.spLimit ?? 0) / 4
			return `喚起書中魔力文字,立刻恢復 ${value} 點法力`;
		},
		costSp: 0,
		use: async ({monster, playerStore}) => {
			const value = (playerStore.info.equips.offhand.spLimit ?? 0) / 4
			playerStore.info.sp = Math.min(playerStore.info.sp + value, playerStore.finalStats.spLimit)
			useFullScreenEffect({
				message: '法力恢復',
				color: 'blue'
			});
			return true
		}
	} as SkillType,
}