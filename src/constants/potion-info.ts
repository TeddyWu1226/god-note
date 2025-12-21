import {PotionType} from "@/types";

export const Potions = {
    // --- 品質 0: 破舊的 (Tattered) ---
    DilutedWater: {
        name: '粗製的草藥水',
        description: '聞起來像雜草，效果微乎其微。',
        icon: '🍶',
        quality: 0,
        heal: 25,
        usable: true
    } as PotionType,
    CloudyJuice: {
        name: '混濁的果汁',
        description: '感覺放了很久，只能稍微提神。',
        icon: '🧃',
        quality: 0,
        magic: 10,
        usable: true
    } as PotionType,

    // --- 品質 1: 普通的 (Common) ---
    SmallHealingPotion: {
        name: '初級生命藥水',
        description: '冒險者的基本必備品。',
        icon: '🧪',
        quality: 1,
        heal: 50,
        usable: true
    } as PotionType,
    SmallManaPotion: {
        name: '初級法力藥水',
        description: '淡淡的藍色液體。',
        icon: '🧪',
        quality: 1,
        magic: 20,
        usable: true
    } as PotionType,

    // --- 品質 2: 精良的 (Fine) ---
    RegularHealthBrew: {
        name: '中級生命萃取液',
        description: '口感苦澀但恢復效果顯著。',
        icon: '🍷',
        quality: 2,
        heal: 100,
        usable: true
    } as PotionType,
    ClearManaPotion: {
        name: '清澈法力藥水',
        description: '精煉過的魔力液體，恢復感極強。',
        icon: '🍹',
        quality: 2,
        magic: 50
    } as PotionType,

    // --- 品質 3: 傳奇的 (Epic) ---
    GreatElixir: {
        name: '高級生命靈藥',
        description: '閃爍著紅寶石般的光芒。',
        icon: '🏺',
        quality: 3,
        heal: 300,
        usable: true
    } as PotionType,
    MysticEther: {
        name: '神秘以太劑',
        description: '彷彿星空凝聚在瓶中。',
        icon: '🔮',
        quality: 3,
        magic: 100,
        usable: true
    } as PotionType,

    // --- 品質 4: 傳說的 (Mythic) ---
    DivineNectar: {
        name: '神聖瓊漿',
        description: '傳說中諸神飲用的液體，能治癒一切痛苦。',
        icon: '✨',
        quality: 4,
        heal: 1000,
        magic: 300,
        usable: true
    } as PotionType,
    YggdrasilSap: {
        name: '世界樹汁液',
        description: '包含著純粹的生命精華。',
        icon: '🍃',
        quality: 4,
        heal: 2000,
        hpLimit: 50,// 附加永久效果 (來自 qualityType),
        usable: true
    } as PotionType,

    // --- 品質 5: 詛咒的 (Cursed) ---
    VampiresBlood: {
        name: '吸血鬼之血',
        description: '恢復大量生命值，但會侵蝕魔力。',
        icon: '🩸',
        quality: 5,
        heal: 500,
        magic: -100,
        usable: true
    } as PotionType,
    ChaosDistillate: {
        name: '混沌蒸餾液',
        description: '極不穩定的藥水，誰知道會發生什麼？',
        icon: '☣️',
        quality: 5,
        heal: -50,
        magic: 500,
        ad: 10, // 暫時或永久提升攻擊力,
        usable: true
    } as PotionType
};