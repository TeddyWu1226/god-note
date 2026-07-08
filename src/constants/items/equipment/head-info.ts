// 🪖 HEAD (頭部) - 僅提供生命與法力，無防禦力屬性
import {EquipmentType} from "@/types";
import {EquipmentPosition} from "@/enums/enums";

export const Head = {
    HpHead0: {
        name: '生鏽頭盔',
        description: '布滿斑駁鐵鏽的舊頭盔，雖然笨重，但能給頭部最基本的保護與安全感。',
        icon: '🪖',
        position: EquipmentPosition.HEAD,
        quality: 0,
        hpLimit: 50
    } as EquipmentType,
    HpHead1: {
        name: '普通頭盔',
        description: '使用鐵片與皮革簡單拼接製成的頭盔，工藝雖普通，但結構結實。',
        icon: '🪖',
        position: EquipmentPosition.HEAD,
        quality: 1,
        hpLimit: 100
    } as EquipmentType,
    HpHead2: {
        name: '精良頭盔',
        description: '精心打造並墊有厚棉內襯的精緻鐵盔，能有效緩衝衝擊，配戴起來十分舒適。',
        icon: '🪖',
        position: EquipmentPosition.HEAD,
        quality: 2,
        hpLimit: 200
    } as EquipmentType,
    HpHead3: {
        name: '鋼鐵頭盔',
        description: '正規軍衛兵標配的厚重鋼盔，優秀的鋼材結構給予人無比的安心感，顯著提升生命力。',
        icon: '🪖',
        position: EquipmentPosition.HEAD,
        quality: 3,
        hpLimit: 350
    } as EquipmentType,
    HpHead4: {
        name: '合金頭盔',
        description: '以稀有金屬混合鍛造的輕量化合金頭盔，防護與舒適兼具，提供極佳的生命力。',
        icon: '🪖',
        position: EquipmentPosition.HEAD,
        quality: 4,
        hpLimit: 550
    } as EquipmentType,
    HpHead5: {
        name: '精鋼頭盔',
        description: '精鋼結構鍛造的頭盔，能與配戴者的生命氣息共鳴，賦予頑強的生命力。',
        icon: '🪖',
        position: EquipmentPosition.HEAD,
        quality: 5,
        hpLimit: 800
    } as EquipmentType
};