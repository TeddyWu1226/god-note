import {EquipmentType} from "@/types";
import {EquipmentPosition} from "@/enums/enums";

export const Offhand = {
	Shield0: {
		name: '殘破木門',
		description: '從廢墟拆下來的門板,笨重但聊勝於無。',
		icon: '🚪',
		position: EquipmentPosition.OFFHAND,
		quality: 0,
		dodge: -10,
		adDefend: 2,
		skill: 'ShieldBlock'
	} as EquipmentType,
	Shield1: {
		name: '木盾',
		description: '基礎的防禦裝備。',
		icon: '🛡️',
		position: EquipmentPosition.OFFHAND,
		quality: 1,
		adDefend: 4,
		skill: 'ShieldBlock'
		,
	} as EquipmentType,
	Shield2: {
		name: '鐵製鳶盾',
		description: '標準的防禦裝備。',
		icon: '🛡️',
		position: EquipmentPosition.OFFHAND,
		quality: 2,
		adDefend: 8,
		skill: 'ShieldBlock'
	} as EquipmentType,
	Shield3: {
		name: '合金盾',
		description: '加固過的盾牌,防禦力顯著。',
		icon: '🛡️',
		position: EquipmentPosition.OFFHAND,
		quality: 3,
		adDefend: 12,
		skill: 'ShieldBlock'
	} as EquipmentType,
	Shield4: {
		name: '強化盾',
		description: '優良的防禦裝備,更輕巧外也強化了格擋效果。',
		icon: '🛡️',
		position: EquipmentPosition.OFFHAND,
		quality: 4,
		adDefend: 16,
		skill: 'ShieldBlock'
	} as EquipmentType,
	Shield5: {
		name: '守望者之盾',
		description: '古代衛兵留下的盾牌,充滿韌性。',
		icon: '🛡️',
		position: EquipmentPosition.OFFHAND,
		quality: 5,
		adDefend: 20,
		skill: 'ShieldBlock'
	} as EquipmentType,

	Book0: {
		name: '學徒筆記',
		description: '寫有一些基礎法術文字的筆記,稍微拓寬了魔力的流向。',
		icon: '📝',
		position: EquipmentPosition.OFFHAND,
		quality: 0,
		spLimit: 40,
		skill: 'MagicRegain'
	} as EquipmentType,
	Book1: {
		name: '學徒之書',
		description: '記載了法術施放的竅門,能更有效地儲存精神能量,額外提供持有者保護。',
		icon: '📗',
		position: EquipmentPosition.OFFHAND,
		quality: 1,
		spLimit: 80,
		defendIncrease: 2,
		skill: 'MagicRegain'
	} as EquipmentType,
	Book2: {
		name: '導師典籍',
		description: '書中紀錄著祕法之力的運用,大幅提昇了魔力的容納上限,額外提供持有者保護。',
		icon: '📙',
		position: EquipmentPosition.OFFHAND,
		quality: 2,
		spLimit: 120,
		defendIncrease: 4,
		skill: 'MagicRegain'
	} as EquipmentType,
	Book3: {
		name: '法術篇章',
		description: '紀錄大量祕法的卷軸,散發著幽幽藍光,保護心智並提供龐大的魔力,額外提供持有者保護。',
		icon: '📜',
		position: EquipmentPosition.OFFHAND,
		quality: 3,
		spLimit: 160,
		defendIncrease: 6,
		skill: 'MagicRegain'
	} as EquipmentType,
	Book4: {
		name: '魔力之書',
		description: '唯有意志堅定者方能閱讀,魔力如潮汐般湧動,額外提供持有者一定保護。',
		icon: '📘',
		position: EquipmentPosition.OFFHAND,
		quality: 4,
		spLimit: 200,
		defendIncrease: 8,
		skill: 'MagicRegain'
	} as EquipmentType,
	Book5: {
		name: '祕法典籍',
		description: '世間法術的詳細記錄,書頁中流淌著純粹的以太,賦予佩戴者大量智慧與保護。',
		icon: '📓',
		position: EquipmentPosition.OFFHAND,
		quality: 5,
		spLimit: 240,
		defendIncrease: 10,
		skill: 'MagicRegain'
	} as EquipmentType,
};