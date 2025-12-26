// 👕 BODY (身體) - 分為「高防禦」與「高閃避」兩大系列
import {EquipmentType} from "@/types";
import {EquipmentPosition} from "@/enums/enums";

export const Armor = {
    Armor0: {
        name: '輕盈布甲',
        description: '輕盈到幾乎沒有重量，便於躲避。',
        icon: '👕',
        position: EquipmentPosition.BODY,
        quality: 0,
        dodge: 2,
        adDefend: 2
    } as EquipmentType,
    Armor1: {
        name: '填充棉甲',
        description: '雖然厚實，但防禦效果有限。',
        icon: '🧥',
        position: EquipmentPosition.BODY,
        quality: 1,
        dodge: 5,
        adDefend: 5
    } as EquipmentType,
    Armor2: {
        name: '鎖子甲',
        description: '基礎的鐵環編織，提供基本防護。',
        icon: '⛓️',
        position: EquipmentPosition.BODY,
        quality: 2,
        adDefend: 10
    } as EquipmentType,
};