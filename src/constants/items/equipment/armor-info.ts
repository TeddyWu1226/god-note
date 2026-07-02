import {EquipmentPosition} from "@/enums/enums";
import {EquipmentType} from "@/types";

export const Armor = {
	DefendArmor0: {
		name: '生鏽板甲',
		description: '生鏽的重裝甲，雖影響閃避但能提供基礎防護。',
		icon: '🦺',
		position: EquipmentPosition.BODY,
		quality: 0,
		dodge: -3,
		adDefend: 2
	} as EquipmentType,
	DefendArmor1: {
		name: '普通板甲',
		description: '常見的板甲，以犧牲機動性換取更穩定的防禦。',
		icon: '🦺',
		position: EquipmentPosition.BODY,
		quality: 1,
		dodge: -6,
		adDefend: 4
	} as EquipmentType,
	DefendArmor2: {
		name: '精良板甲',
		description: '作工精良的金屬板甲，防護性能比一般板甲更好。',
		icon: '🦺',
		position: EquipmentPosition.BODY,
		quality: 2,
		dodge: -12,
		adDefend: 8
	} as EquipmentType,
	DefendArmor3: {
		name: '鋼鐵板甲',
		description: '鋼片鍛造的重裝甲，防護性能顯著提升。',
		icon: '🦺',
		position: EquipmentPosition.BODY,
		quality: 3,
		dodge: -25,
		adDefend: 16
	} as EquipmentType,
	DefendArmor4: {
		name: '合金板甲',
		description: '合金材質全身重裝甲，能抵擋高強度衝擊。',
		icon: '🦺',
		position: EquipmentPosition.BODY,
		quality: 4,
		dodge: -50,
		adDefend: 32
	} as EquipmentType,
	DefendArmor5: {
		name: '精鋼板甲',
		description: '厚重精鋼鍛造的重甲，防護極高，形同移動城牆。',
		icon: '🏰',
		position: EquipmentPosition.BODY,
		quality: 5,
		dodge: -100,
		adDefend: 64
	} as EquipmentType,
	DodgeArmor2: {
		name: '精良皮甲',
		description: '輕便的熟皮護甲，利於閃避與活動。',
		icon: '🧥',
		position: EquipmentPosition.BODY,
		quality: 2,
		dodge: 10,
		adDefend: 5
	} as EquipmentType,
	DodgeArmor3: {
		name: '優質皮甲',
		description: '材質優良的皮甲，兼顧防護與動作靈活性。',
		icon: '🧥',
		position: EquipmentPosition.BODY,
		quality: 3,
		dodge: 20,
		adDefend: 10
	} as EquipmentType,
	DodgeArmor4: {
		name: '合成皮甲',
		description: '複合皮革製成的護甲，使閃避動作更流暢。',
		icon: '🧥',
		position: EquipmentPosition.BODY,
		quality: 4,
		dodge: 40,
		adDefend: 20
	} as EquipmentType,
	DodgeArmor5: {
		name: '精製皮甲',
		description: '頂級皮甲，質地輕盈，讓穿戴者身輕如燕。',
		icon: '🧥',
		position: EquipmentPosition.BODY,
		quality: 5,
		dodge: 80,
		adDefend: 40
	} as EquipmentType,
};