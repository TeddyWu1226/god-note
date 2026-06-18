import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillParams} from "@/types";
import {genCustomStatus} from "@/utils/create";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {ItemStatus} from "@/constants/status/item-status";

export class ShieldBlock extends SkillModel {
	constructor() {
		super({
			id: 'ShieldBlock',
			name: "格擋",
			icon: "skills/shield_block.svg",
			type: 'active',
			rarity: 'common',
			costSp: 20,
			costAction: 1,
			maxCd: 2,
			itemDescription: '舉起盾牌進行防禦，本回合內提升防禦力以抵擋傷害，如果敵方爆擊，則額外造成對方暫時暈眩。[冷卻: 2 回合]'
		});
	}

	description(playerStore: PlayerStoreType): string {
		const shield = playerStore?.info?.equips?.offhand?.adDefend ?? 0;
		return `舉起盾牌進行防禦，本回合內提升 ${shield} 點防禦。如果敵方爆擊，則額外造成對方暫時暈眩。[冷卻: ${this.maxCd} 回合]`;
	}

	protected execute(params: SkillParams): boolean {
		const playerStore = params.playerStore;
		if (!playerStore) return false;

		const shield = playerStore.info.equips?.offhand?.adDefend ?? 0;
		playerStore.addStatus(genCustomStatus({
			base: ItemStatus.Block,
			bonus: {
				adDefend: shield
			},
			duration: 1
		}));

		useFullScreenEffect({
			message: '格擋',
			color: 'gray'
		});
		return true;
	}
}

export class PowerCharge extends SkillModel {
	constructor() {
		super({
			id: 'PowerCharge',
			name: "蓄力",
			icon: "💪",
			type: 'active',
			rarity: 'common',
			costSp: 0,
			costAction: 1,
			maxCd: 2,
			itemDescription: '下一回合提升 50% 物理傷害。[冷卻: 2 回合]'
		});
	}

	description(playerStore: PlayerStoreType): string {
		return `蓄力以準備致命一擊。下一回合提升 50% 物理傷害。[冷卻: ${this.maxCd} 回合]`;
	}

	protected execute(params: SkillParams): boolean {
		const playerStore = params.playerStore;
		if (!playerStore) return false;

		playerStore.addStatus(genCustomStatus({
			base: {
				name: '蓄力',
				icon: '💪',
				duration: 2,
				isBuff: true,
				description: '提升 50% 物理傷害',
				bonus: {
					adIncrease: 50
				}
			},
			duration: 2
		}));

		useFullScreenEffect({
			message: '蓄力',
			color: 'orange'
		});
		return true;
	}
}