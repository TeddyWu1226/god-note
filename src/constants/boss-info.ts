import {MonsterType} from "@/types";
import {WorldDefault} from "@/assets/const";


export const Boss = {
    // --- 區域 1: 迷霧森林 (Value 5) ---
    BigBear: {
        icon: '🐻',
        name: '森林巨熊',
        description: '貌似是這片森林的動物之主,有厚重的毛皮以及強大的破壞力,需要小心謹慎',
        ad: 20,
        critIncrease: WorldDefault.critIncrease,
        critRate: 25,
        adDefend: 10,
        dodge: 5,
        hit: 50,
        hp: 100,
        hpLimit: 100,
        level: 10,
        dropGold: 100
    } as MonsterType,
    ForestGuardian: {
        icon: '🐾',
        name: '森林守護者·賽納留斯',
        description: '森林的最終防線，能操縱植物與野獸。',
        ad: 45,
        critIncrease: 1.5,
        critRate: 15,
        adDefend: 20,
        dodge: 10,
        hit: 100,
        hp: 1200,
        hpLimit: 1200,
        level: 10,
        dropGold: 500
    },

    // --- 區域 2: 灼熱沙漠 (Value 10) ---
    AncientPharaoh: {
        icon: '⚰️',
        name: '法老王·阿蒙霍特普',
        description: '從永恆睡眠中甦醒，帶著詛咒砂礫的帝王。',
        ad: 120,
        critIncrease: 1.8,
        critRate: 20,
        adDefend: 50,
        dodge: 5,
        hit: 120,
        hp: 3500,
        hpLimit: 3500,
        level: 20,
        dropGold: 1200
    },

    // --- 區域 3: 冰雪高地 (Value 15) ---
    FrozenThroneKnight: {
        icon: '🏇🏼',
        name: '冰封騎士·霜哀',
        description: '守護冰封王座的亡靈將軍，寒氣逼人。',
        ad: 280,
        critIncrease: 2.0,
        critRate: 10,
        adDefend: 120, // 高防禦
        dodge: 0,
        hit: 150,
        hp: 8000,
        hpLimit: 8000,
        level: 30,
        dropGold: 2500
    },

    // --- 區域 4: 腐爛沼澤 (Value 20) ---
    LichLord: {
        icon: '☠️',
        name: '巫妖領主·薩杜斯',
        description: '掌握生死之力的恐怖存在，呼吸間皆是劇毒。',
        ad: 550,
        critIncrease: 2.2,
        critRate: 25,
        adDefend: 80,
        dodge: 20,
        hit: 200,
        hp: 18000,
        hpLimit: 18000,
        level: 40,
        dropGold: 5000
    },

    // --- 區域 5: 活火山脈 (Value 25) ---
    FireElementLord: {
        icon: '☀️',
        name: '熔岩巨獸·克洛斯',
        description: '誕生於地核的意志，全身流淌著足以毀滅一切的岩漿。',
        ad: 1100,
        critIncrease: 2.5,
        critRate: 30, // 高爆擊
        adDefend: 200,
        dodge: 5,
        hit: 250,
        hp: 45000,
        hpLimit: 45000,
        level: 50,
        dropGold: 10000
    },

    // --- 區域 6: 深海海域 (Value 30) ---
    AtlantisMonarch: {
        icon: '🏰',
        name: '深海君主·波賽頓',
        description: '亞特蘭提斯的統治者，在水中幾乎無法被擊中。',
        ad: 2200,
        critIncrease: 2.0,
        critRate: 20,
        adDefend: 350,
        dodge: 40, // 高閃避
        hit: 350,
        hp: 100000,
        hpLimit: 100000,
        level: 60,
        dropGold: 20000
    },

    // --- 區域 7: 雲上天國 (Value 35) ---
    SeraphimJudge: {
        icon: '⚖️',
        name: '審判大天使',
        description: '神之代言人，以正義之名降下神罰。',
        ad: 4500,
        critIncrease: 3.0,
        critRate: 40,
        adDefend: 600,
        dodge: 15,
        hit: 500, // 高命中
        hp: 250000,
        hpLimit: 250000,
        level: 70,
        dropGold: 45000
    },

    // --- 區域 8: 鏽蝕工廠 (Value 40) ---
    MechaOverlord: {
        icon: '🌐',
        name: '動力核心·零號機',
        description: '工廠的終極產物，擁有完美的自我修復與防禦機制。',
        ad: 8000,
        critIncrease: 2.5,
        critRate: 15,
        adDefend: 1500, // 極高防禦
        dodge: 0,
        hit: 600,
        hp: 600000,
        hpLimit: 600000,
        level: 80,
        dropGold: 100000
    },

    // --- 區域 9: 冥界深淵 (Value 45) ---
    HadesRuler: {
        icon: '👹',
        name: '冥府主宰·哈帝斯',
        description: '統治靈魂的君王，直視其雙眼者將墮入深淵。',
        ad: 15000,
        critIncrease: 3.5,
        critRate: 50, // 極高爆擊
        adDefend: 2000,
        dodge: 25,
        hit: 800,
        hp: 1500000,
        hpLimit: 1500000,
        level: 90,
        dropGold: 250000
    },

    // --- 區域 10: 異界終點 (Value 50) ---
    GenesisCreator: {
        icon: '🏛️',
        name: '創世守護者·塔納托斯',
        description: '時空的守望者，萬物的起點也是終點。',
        ad: 35000,
        critIncrease: 4.0,
        critRate: 60,
        adDefend: 5000,
        dodge: 50,
        hit: 1200,
        hp: 5000000,
        hpLimit: 5000000,
        level: 100,
        dropGold: 1000000
    }
};