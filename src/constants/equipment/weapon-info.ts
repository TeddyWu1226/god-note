// ⚔️ WEAPON (武器) - 主力輸出
import {EquipmentType} from "@/types";
import {EquipmentPosition} from "@/enums/enums";

export const Weapon: Record<string, EquipmentType> = {
    RustyDagger: {
        name: '生鏽匕首',
        description: '雖然破舊，但依舊鋒利。',
        icon: '🔪',
        position: EquipmentPosition.WEAPON,
        quality: 0,
        ad: 5,
        hit: 2
    },
    IronSword: {
        name: '鐵劍',
        description: '標準的士兵配劍。',
        icon: '⚔️',
        position: EquipmentPosition.WEAPON,
        quality: 1,
        ad: 12,
        hit: 5
    },
    HeavyAxe: {
        name: '重型戰斧',
        description: '威力巨大但難以操控。',
        icon: '🪓',
        position: EquipmentPosition.WEAPON,
        quality: 1,
        ad: 25,
        hit: -5
    },
    AssassinBlade: {
        name: '刺客袖劍',
        description: '隱藏在暗處的致命威脅。',
        icon: '🗡️',
        position: EquipmentPosition.WEAPON,
        quality: 2,
        ad: 15,
        critRate: 10
    },
    CompositeBow: {
        name: '複合長弓',
        description: '優異的射程與精準度。',
        icon: '🏹',
        position: EquipmentPosition.WEAPON,
        quality: 2,
        ad: 18,
        hit: 12
    },
    Katana: {
        name: '精煉太刀',
        description: '追求一擊必殺的藝術品。',
        icon: '🎋',
        position: EquipmentPosition.WEAPON,
        quality: 3,
        ad: 20,
        critIncrease: 0.3
    },
    DragonSlayer: {
        name: '屠龍巨劍',
        description: '傳說中曾斬下龍首的重劍。',
        icon: '🐲',
        position: EquipmentPosition.WEAPON,
        quality: 3,
        ad: 50,
        critRate: 5
    },
    HolyExcalibur: {
        name: '聖劍·誓約',
        description: '散發著神聖光芒的神級武器。',
        icon: '✨',
        position: EquipmentPosition.WEAPON,
        quality: 4,
        ad: 80,
        hit: 20,
        critRate: 15
    },
    BloodCursedBlade: {
        name: '嗜血妖刀',
        description: '渴望鮮血，但也侵蝕靈魂。',
        icon: '🧛',
        position: EquipmentPosition.WEAPON,
        quality: 5,
        ad: 100,
        hpLimit: -100,
        critRate: 25
    },
    Muramasa: {
        name: '妖刀村正',
        description: '被詛咒的極致鋒芒。',
        icon: '👹',
        position: EquipmentPosition.WEAPON,
        quality: 5,
        ad: 120,
        critIncrease: 80,
        hit: -10
    }
};