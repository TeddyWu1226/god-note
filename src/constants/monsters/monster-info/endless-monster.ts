import {MonsterType} from "@/types";
import {WorldDefault} from "@/assets/const";
import {MATERIAL} from "@/constants/items/material/material-info";

/**
 * 無限的怪物
 */
export const EndLessMonster = {
    AngelGuard: {
        icon: '👼',
        name: '[無盡的]天使',
        description: '存在於虛無夾縫的天使，金屬羽翼能切開一切凡間武裝',
        ad: 45,
        critIncrease: 100,
        critRate: 15,
        adDefend: 35, // 極高防禦
        dodge: 10,
        hit: 25,
        hp: 450,
        hpLimit: 450,
        level: 15,
        dropGold: 500,
    } as MonsterType,

    HighPriest: {
        icon: '🧙‍♂️',
        name: '[無盡的]墮落神官',
        description: '曾侍奉神靈的神職者，如今卻在無盡的虛空中低語著禁忌的咒文',
        ad: 35,
        critIncrease: 150,
        critRate: 10,
        adDefend: 15,
        dodge: 5,
        hit: 30,
        hp: 320,
        hpLimit: 320,
        level: 12,
        dropGold: 450,
    } as MonsterType,

    // 2. 深淵系 - 高爆發 / 詛咒 / 剝奪
    DemonInquisitor: {
        icon: '⚖️',
        name: '[無盡的]惡魔審判者',
        description: '手中的天平只衡量靈魂的重量，判定為「罪人」者將被業火焚燒',
        ad: 65, // 極高攻擊
        critIncrease: 250,
        critRate: 20,
        adDefend: 20,
        dodge: 15,
        hit: 40,
        hp: 600,
        hpLimit: 600,
        level: 20,
        dropGold: 1200,
    } as MonsterType,

    // 3. 魔王級別 - 全方位壓制
    Monday: {
        icon: '🦋🦋🦋',
        name: '七日：曼蝶',
        description: '神最強大的手下之一',
        ad: 120,
        critIncrease: 300,
        critRate: 35,
        adDefend: 60,
        dodge: 25,
        hit: 100, // 幾乎必中
        hp: 2500,
        hpLimit: 2500,
        level: 40,
        dropGold: 10000,
    } as MonsterType
}
