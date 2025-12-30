// 💍 ACCESSORIES (飾品) - 爆擊、增傷與綜合屬性
import {EquipmentType} from "@/types";
import {EquipmentPosition} from "@/enums/enums";

export const Accessory1 = {
    WoodenRing: {
        name: '木質指環',
        description: '簡單的裝飾品。',
        icon: '💍',
        position: EquipmentPosition.ACCESSORY1,
        quality: 0,
        spLimit: 5
    } as EquipmentType,
    ApprenticeRing: {
        name: '學徒之戒',
        description: '幫助聚集魔力。',
        icon: '💎',
        position: EquipmentPosition.ACCESSORY1,
        quality: 1,
        spLimit: 100
    } as EquipmentType,
    SharpEarring: {
        name: '銳利耳環',
        description: '專注力提升。',
        icon: '👂',
        position: EquipmentPosition.ACCESSORY1,
        quality: 1,
        critRate: 5,
        hit: 5
    } as EquipmentType,
    HeartAmulet: {
        name: '生命護身符',
        description: '跳動著生命氣息。',
        icon: '❤️',
        position: EquipmentPosition.ACCESSORY1,
        quality: 2,
        hpLimit: 250
    } as EquipmentType,
    BerserkerRing: {
        name: '狂暴指環',
        description: '增加破壞力。',
        icon: '💢',
        position: EquipmentPosition.ACCESSORY1,
        quality: 3,
        ad: 15,
        critIncrease: 0.2
    } as EquipmentType,
    LuckPendant: {
        name: '幸運墜飾',
        description: '今天似乎會發生好事。',
        icon: '🍀',
        position: EquipmentPosition.ACCESSORY1,
        quality: 3,
        critRate: 15,
        dodge: 10
    } as EquipmentType,
    ArchmageStone: {
        name: '大法師之石',
        description: '儲存了龐大的法力。',
        icon: '🔮',
        position: EquipmentPosition.ACCESSORY1,
        quality: 4,
        spLimit: 1000
    } as EquipmentType,
    EternalEmblem: {
        name: '永恆紋章',
        description: '諸神的祝福。',
        icon: '🔱',
        position: EquipmentPosition.ACCESSORY1,
        quality: 4,
        hpLimit: 500,
        ad: 40
    } as EquipmentType,
    CursedEye: {
        name: '詛咒之眼',
        description: '看穿一切，也招致不祥。',
        icon: '👁️',
        position: EquipmentPosition.ACCESSORY1,
        quality: 5,
        critRate: 20,
        critIncrease: 0.5,
        dodge: -20
    } as EquipmentType,
    SoulAnchor: {
        name: '靈魂錨點',
        description: '將存在感固定在虛無中。',
        icon: '⚓',
        position: EquipmentPosition.ACCESSORY1,
        quality: 5,
        adIncrease: 1000,
        hit: 100
    } as EquipmentType,
    CursedWoodenRing: {
        name: '詛咒的荊棘之戒',
        description: '擊敗邪靈樹妖後掉落的物品,穿戴後會吸收你的靈魂以換取更強大的力量。',
        icon: '💍',
        position: EquipmentPosition.ACCESSORY1,
        quality: 11,
        hpLimit: -25,
        spLimit: -25,
        adIncrease: 10,
        apIncrease: 10,
    } as EquipmentType
};


export const Accessory2 = {
    EvilWoodenHeart: {
        name: '邪靈樹妖之心',
        description: '成長為最終的邪靈樹妖給你的禮物,穿戴後會吸收你的靈魂以換取更強大的力量。',
        icon: '🤎',
        position: EquipmentPosition.ACCESSORY1,
        quality: 11,
        hpLimit: -50,
        spLimit: -50,
        adIncrease: 20,
        apIncrease: 20,
    } as EquipmentType
}