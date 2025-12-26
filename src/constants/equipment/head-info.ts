// 🪖 HEAD (頭部) - 僅提供生命與法力，無防禦力屬性
import {EquipmentType} from "@/types";
import {EquipmentPosition} from "@/enums/enums";

export const Head = {
    HpHead0: {
        name: '布盔',
        description: '用多層棉布保護,給點溫暖。',
        icon: '🪖',
        position: EquipmentPosition.HEAD,
        quality: 0,
        hpLimit: 50
    } as EquipmentType,
    HpHead1: {
        name: '皮質頭盔',
        description: '簡單加工過的獸皮。',
        icon: '🪖',
        position: EquipmentPosition.HEAD,
        quality: 1,
        hpLimit: 120
    } as EquipmentType,
    HpHead2: {
        name: '強化鐵盔',
        description: '內襯墊了厚棉布的鐵盔。',
        icon: '🪖',
        position: EquipmentPosition.HEAD,
        quality: 2,
        hpLimit: 280
    } as EquipmentType,
    HpHead3: {
        name: '守衛重盔',
        description: '精銳士兵標配，顯著提升生存能力。',
        icon: '🪖',
        position: EquipmentPosition.HEAD,
        quality: 3,
        hpLimit: 550
    } as EquipmentType,
    HpHead4: {
        name: '巨像戰盔',
        description: '模仿遠古巨像打造，賦予頑強的生命力。',
        icon: '🪖',
        position: EquipmentPosition.HEAD,
        quality: 4,
        hpLimit: 1000
    } as EquipmentType,
    HpHead5: {
        name: '古王金冕',
        description: '古老君王留下的頭飾，殘留著生命之火。',
        icon: '🪖',
        position: EquipmentPosition.HEAD,
        quality: 5,
        hpLimit: 1800
    } as EquipmentType,
    HpHead6: {
        name: '龍息戰冠',
        description: '沐浴過龍血的頭盔，肉體將變得強悍。',
        icon: '🪖',
        position: EquipmentPosition.HEAD,
        quality: 6,
        hpLimit: 3200
    } as EquipmentType,
    HpHead7: {
        name: '世界樹之冠',
        description: '由世界樹幼枝編織，源源不絕提供生命精華。',
        icon: '🪖',
        position: EquipmentPosition.HEAD,
        quality: 7,
        hpLimit: 6000
    } as EquipmentType
};