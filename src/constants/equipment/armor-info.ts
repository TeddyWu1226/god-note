// 👕 BODY (身體) - 分為「高防禦」與「高閃避」兩大系列
import {EquipmentType} from "@/types";
import {EquipmentPosition} from "@/enums/enums";

export const Armor: Record<string, EquipmentType> = {
    // ==========================================
    // 🛡️ 高防禦系列 (High Defense) - 數值已調低至 33%
    // ==========================================
    PaddedArmor: {
        name: '填充棉甲',
        description: '雖然厚實，但防禦效果有限。',
        icon: '🧥',
        position: EquipmentPosition.BODY,
        quality: 0,
        adDefend: 3
    },
    ChainMail: {
        name: '鎖子甲',
        description: '基礎的鐵環編織，提供基本防護。',
        icon: '⛓️',
        position: EquipmentPosition.BODY,
        quality: 1,
        adDefend: 10
    },
    SilverBreastplate: {
        name: '白銀胸甲',
        description: '經過洗禮的金屬，具備不俗的防禦力。',
        icon: '🛡️',
        position: EquipmentPosition.BODY,
        quality: 2,
        adDefend: 15
    },
    PaladinArmor: {
        name: '聖騎士重鎧',
        description: '為了守護而設計的標準重鎧。',
        icon: '🧱',
        position: EquipmentPosition.BODY,
        quality: 3,
        adDefend: 30
    },
    GuardianPlate: {
        name: '守護者全身甲',
        description: '精良的全身鍛造甲，防禦力達到了物理極限。',
        icon: '🏰',
        position: EquipmentPosition.BODY,
        quality: 4,
        adDefend: 50
    },

    // ==========================================
    // 💨 高閃避系列 (High Evasion)
    // ==========================================
    TatteredRags: {
        name: '破爛衣衫',
        description: '輕盈到幾乎沒有重量，便於躲避。',
        icon: '👕',
        position: EquipmentPosition.BODY,
        quality: 0,
        dodge: 5
    },
    TravellerTunic: {
        name: '旅人長袍',
        description: '通風且修身，適合靈活反應。',
        icon: '🥋',
        position: EquipmentPosition.BODY,
        quality: 1,
        dodge: 10
    },
    RogueLeather: {
        name: '盜賊皮甲',
        description: '暗殺者的標配，提升肢體活動空間。',
        icon: '🍂',
        position: EquipmentPosition.BODY,
        quality: 2,
        dodge: 15
    },
    MistCloak: {
        name: '薄霧斗篷',
        description: '布料在空氣中律動，讓敵人難以捉摸。',
        icon: '🌫️',
        position: EquipmentPosition.BODY,
        quality: 3,
        dodge: 30
    },
    WraithArmor: {
        name: '幽魂鎧甲',
        description: '半透明的虛體狀態，大幅無視物理接觸。',
        icon: '👻',
        position: EquipmentPosition.BODY,
        quality: 4,
        dodge: 60
    }
};