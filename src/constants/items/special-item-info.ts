import {ItemType, UsableType} from "@/types";


export const SpecialItem = {
	TwilightKey: {
		name: '月之鑰',
		icon: '🗝️',
		description: '神秘月亮形狀的鑰匙,可以打開暮光之林深處的大門',
		quality: 5,
		unsellable: true,
	} as ItemType,
	PauseToken: {
		name: '休止符',
		icon: '🎶',
		description: '從激烈舞動的能量中掉落的碎片,貌似因力量不完美而洩漏。使用後可以強制讓半神的攻擊節奏減緩',
		quality: 5,
		usable: true,
		unsellable: true,
		skill: 'usePauseToken'
	} as UsableType,
	ClearMirror: {
		name: '清澈之鏡',
		icon: '🪞',
		description: '清澈透亮的鏡子,可以讓你看穿幻象的迷霧',
		quality: 4,
		unsellable: true,
	} as ItemType,
	ClearMirrorFragment: {
		name: '清澈之鏡碎片',
		icon: '◀',
		description: '一片被打碎的鏡子碎片，可以在休息時合成出「清澈之鏡」',
		quality: 3,
		unsellable: true,
	} as ItemType,
}