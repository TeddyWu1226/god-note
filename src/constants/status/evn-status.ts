import {StatusEffect} from "@/types";

const EvnStatus = {
    	Poison: {
		name: '中毒',
		icon: '🤢',
		duration: 5,
		description: '每回合失去 5 點生命值',
		type: 'damage',
		value: 5
	} as StatusEffect,
	Weak: {
		name: '虛弱',
		icon: '😵‍💫',
		duration: 5,
		description: '減少 10% 造成的傷害',
		bonus: {
			adIncrease: -10,
			apIncrease: -10
		}
	} as StatusEffect,
	Blind: {
		name: '失明',
		icon: '👁️‍🗨️',
		duration: 5,
		description: '減少 30 點命中值',
		bonus: {
			hit: -30,
		}
	} as StatusEffect,
	Excited: {
		name: '興奮',
		icon: '🤩',
		duration: 5,
		isBuff: true,
		description: '提升 15% 造成的傷害',
		bonus: {
			adIncrease: 15,
			apIncrease: 15,
		}
	} as StatusEffect,
	Focus: {
		name: '專注提高',
		icon: '👀',
		duration: 5,
		isBuff: true,
		description: '提升 20 點命中',
		bonus: {
			hit: 20,
		}
	} as StatusEffect,
	SongHeal: {
		name: '悠揚:生命回復',
		icon: '💚',
		duration: -1,
		isBuff: true,
		description: '每次行動恢復 2 HP',
		type: 'heal',
		value: 2
	} as StatusEffect,
	SongDefend: {
		name: '悠揚:防禦提升',
		icon: '🛡️',
		duration: -1,
		isBuff: true,
		description: '防禦提升 3 點',
		bonus: {
			adDefend: 3,
		}
	} as StatusEffect,
	SongAgile: {
		name: '悠揚:閃避提升',
		icon: '🏃🏻',
		duration: -1,
		isBuff: true,
		description: '閃避提升 15 點',
		bonus: {
			dodge: 15,
		}
	} as StatusEffect
}
export default EvnStatus