import {StatusEffect} from "@/types";

export const UsualStatus = {
	AdDefendInCrease: {
		name: '防禦提升',
		icon: '🛡️',
		duration: 1,
		isBuff: true,
		description: `短暫的大幅提升自身 %adDefend% 防禦`,
		bonus: {
			adDefend: 5
		}
	} as StatusEffect,
}