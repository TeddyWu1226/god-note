import {EquipmentType} from "@/types";
import {EquipmentPosition} from "@/enums/enums";

export const Offhand = {
    Shield0: {
        name: '殘破木門',
        description: '從廢墟拆下來的門板，聊勝於無。',
        icon: '🚪',
        position: EquipmentPosition.OFFHAND,
        quality: 0,
        adDefend: 2
    } as EquipmentType,

    Shield1: {
        name: '鐵製鳶盾',
        description: '標準的軍用防護。',
        icon: '🛡️',
        position: EquipmentPosition.OFFHAND,
        quality: 1,
        adDefend: 6,
        dodge: -5
    } as EquipmentType,

    Shield2: {
        name: '合金圓盾',
        description: '輕便且靈活。',
        icon: '🛡️',
        position: EquipmentPosition.OFFHAND,
        quality: 2,
        adDefend: 12,
        dodge: 5
    } as EquipmentType,

    Shield3: {
        name: '強化重盾',
        description: '加固過的盾牌，防禦力顯著。',
        icon: '🛡️',
        position: EquipmentPosition.OFFHAND,
        quality: 3,
        adDefend: 24,
        dodge: -8,
        defendIncrease: 2
    } as EquipmentType,

    Shield4: {
        name: '鋼鐵巨塔',
        description: '如牆壁般厚重，但也限制了動作。',
        icon: '🛡️',
        position: EquipmentPosition.OFFHAND,
        quality: 4,
        adDefend: 48,
        dodge: -15,
        defendIncrease: 5
    } as EquipmentType,

    Shield5: {
        name: '守望者之盾',
        description: '古代衛兵留下的盾牌，充滿韌性。',
        icon: '🛡️',
        position: EquipmentPosition.OFFHAND,
        quality: 5,
        adDefend: 72,
        dodge: 0,
        defendIncrease: 8
    } as EquipmentType,

    Shield6: {
        name: '埃癸斯神盾',
        description: '刻有神紋的盾牌，震懾敵人。',
        icon: '🛡️',
        position: EquipmentPosition.OFFHAND,
        quality: 6,
        adDefend: 96,
        dodge: 15,
        defendIncrease: 10
    } as EquipmentType,

    Shield7: {
        name: '龍鱗巨盾',
        description: '由遠古龍鱗編織而成。',
        icon: '🛡️',
        position: EquipmentPosition.OFFHAND,
        quality: 7,
        adDefend: 150,
        defendIncrease: 12,
        hpLimit: 200
    } as EquipmentType,

    Shield8: {
        name: '聖騎士的光壁',
        description: '由純粹光芒組成的防線。',
        icon: '🛡️',
        position: EquipmentPosition.OFFHAND,
        quality: 8,
        adDefend: 200,
        hpLimit: 500,
        dodge: 30,
        defendIncrease: 5
    } as EquipmentType,
};