// 🪖 HEAD (頭部) - 僅提供生命與法力，無防禦力屬性
import {EquipmentType} from "@/types";
import {EquipmentPosition} from "@/enums/enums";

export const Head: Record<string, EquipmentType> = {
    // --- 混合型 (HP + SP，兩者兼顧但量較少) ---
    ClothHood: {
        name: '布質兜帽',
        description: '簡單的遮風避雨工具。',
        icon: '🍮',
        position: EquipmentPosition.HEAD,
        quality: 0,
        hpLimit: 25,
        spLimit: 25
    },
    GoldenCrown: {
        name: '黃金王冠',
        description: '權力的象徵，平衡的王道。',
        icon: '👑',
        position: EquipmentPosition.HEAD,
        quality: 4,
        hpLimit: 300,
        spLimit: 300
    },

    // --- 純 SP 型 (專注於能量儲備) ---
    LeatherCap: {
        name: '法力系帶',
        description: '輕便且增加專注力。',
        icon: '🎀',
        position: EquipmentPosition.HEAD,
        quality: 0,
        spLimit: 50
    },
    SageCirclet: {
        name: '賢者頭飾',
        description: '提升思維的清晰度。',
        icon: '🫂',
        position: EquipmentPosition.HEAD,
        quality: 1,
        spLimit: 100
    },
    PumpkinHead: {
        name: '南瓜頭',
        description: '有益智力發展的食品，戴在頭上也不錯。',
        icon: '🎃',
        position: EquipmentPosition.HEAD,
        quality: 2,
        spLimit: 150
    },
    MagicHat: {
        name: '魔術帽',
        description: '有效提高大量法力，但帽子太高挺顯眼的。',
        icon: '🎩',
        position: EquipmentPosition.HEAD,
        quality: 3,
        spLimit: 200
    },
    ArchmageHood: {
        name: '大法師兜帽',
        description: '編織進了無數咒語的絲綢，法力震盪。',
        icon: '🧙',
        position: EquipmentPosition.HEAD,
        quality: 4,
        spLimit: 300
    },
    // --- 純 HP 型 (專注於生存厚度) ---
    StrawHat: {
        name: '草帽',
        description: '雖然簡陋，但多少能擋住烈日。',
        icon: '👒',
        position: EquipmentPosition.HEAD,
        quality: 0,
        hpLimit: 50
    },
    IronHelmet: {
        name: '鐵製頭盔',
        description: '厚重的金屬外殼。',
        icon: '🪖',
        position: EquipmentPosition.HEAD,
        quality: 1,
        hpLimit: 100
    },
    VikingHelmet: {
        name: '維京頭盔',
        description: '帶有雙角的勇士之冠，強化生命力。',
        icon: '𖤍',
        position: EquipmentPosition.HEAD,
        quality: 2,
        hpLimit: 150
    },
    SkullHelmet: {
        name: '骷髏頭盔',
        description: '用堅硬的骷髏打造的頭盔,掌握死者的生命力。',
        icon: '💀',
        position: EquipmentPosition.HEAD,
        quality: 3,
        hpLimit: 200,
    },
    DragonScaleHelm: {
        name: '龍鱗頭盔',
        description: '由巨龍鱗片打造,彷彿千年的力量都湧現上來。',
        icon: '🐲',
        position: EquipmentPosition.HEAD,
        quality: 4,
        hpLimit: 300
    }
};