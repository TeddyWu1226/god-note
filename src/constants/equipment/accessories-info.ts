// 💍 ACCESSORIES (飾品) - 爆擊、增傷與綜合屬性
import {EquipmentType} from "@/types";
import {EquipmentPosition} from "@/enums/enums";

export const Accessories: Record<string, EquipmentType> = {
    WoodenRing: {
        name: '木質指環',
        description: '簡單的裝飾品。',
        icon: '💍',
        position: EquipmentPosition.ACCESSORIES,
        quality: 0,
        spLimit: 5
    },
    ApprenticeRing: {
        name: '學徒之戒',
        description: '幫助聚集魔力。',
        icon: '💎',
        position: EquipmentPosition.ACCESSORIES,
        quality: 1,
        spLimit: 100
    },
    SharpEarring: {
        name: '銳利耳環',
        description: '專注力提升。',
        icon: '👂',
        position: EquipmentPosition.ACCESSORIES,
        quality: 1,
        critRate: 5,
        hit: 5
    },
    HeartAmulet: {
        name: '生命護身符',
        description: '跳動著生命氣息。',
        icon: '❤️',
        position: EquipmentPosition.ACCESSORIES,
        quality: 2,
        hpLimit: 250
    },
    BerserkerRing: {
        name: '狂暴指環',
        description: '增加破壞力。',
        icon: '💢',
        position: EquipmentPosition.ACCESSORIES,
        quality: 3,
        ad: 15,
        critIncrease: 0.2
    },
    LuckPendant: {
        name: '幸運墜飾',
        description: '今天似乎會發生好事。',
        icon: '🍀',
        position: EquipmentPosition.ACCESSORIES,
        quality: 3,
        critRate: 15,
        dodge: 10
    },
    ArchmageStone: {
        name: '大法師之石',
        description: '儲存了龐大的法力。',
        icon: '🔮',
        position: EquipmentPosition.ACCESSORIES,
        quality: 4,
        spLimit: 1000
    },
    EternalEmblem: {
        name: '永恆紋章',
        description: '諸神的祝福。',
        icon: '🔱',
        position: EquipmentPosition.ACCESSORIES,
        quality: 4,
        hpLimit: 500,
        ad: 40
    },
    CursedEye: {
        name: '詛咒之眼',
        description: '看穿一切，也招致不祥。',
        icon: '👁️',
        position: EquipmentPosition.ACCESSORIES,
        quality: 5,
        critRate: 20,
        critIncrease: 0.5,
        dodge: -20
    },
    SoulAnchor: {
        name: '靈魂錨點',
        description: '將存在感固定在虛無中。',
        icon: '⚓',
        position: EquipmentPosition.ACCESSORIES,
        quality: 5,
        hpLimit: 1000,
        hit: -30
    }
};