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
        hpLimit: 100
    } as EquipmentType,
    HpHead2: {
        name: '強化鐵盔',
        description: '內襯墊了厚棉布的鐵盔。',
        icon: '🪖',
        position: EquipmentPosition.HEAD,
        quality: 2,
        hpLimit: 200
    } as EquipmentType,
    HpHead3: {
        name: '守衛重盔',
        description: '守衛標配的裝備，顯著提升生命力。',
        icon: '🪖',
        position: EquipmentPosition.HEAD,
        quality: 3,
        hpLimit: 400
    } as EquipmentType,
    HpHead4: {
        name: '騎士之盔',
        description: '精銳騎士的標準配備，提供不錯的生命力。',
        icon: '🪖',
        position: EquipmentPosition.HEAD,
        quality: 4,
        hpLimit: 700
    } as EquipmentType,
    HpHead5: {
        name: '巨像戰盔',
        description: '模仿遠古巨像打造，賦予頑強的生命力。',
        icon: '🪖',
        position: EquipmentPosition.HEAD,
        quality: 5,
        hpLimit: 1000
    } as EquipmentType
};