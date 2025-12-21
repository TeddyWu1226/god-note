import {MonsterType} from "@/types";
import {WorldDefault} from "@/assets/const";
import {MATERIAL} from "@/constants/material-info";


export const Monster = {
    // 1. 基本新手怪
    Slime: {
        icon: '🟢',
        name: '史萊姆',
        description: '森林中最常見的粘稠生物，帶有淡淡的草本氣味',
        ad: 5,
        critIncrease: WorldDefault.critIncrease,
        critRate: WorldDefault.critRate,
        adDefend: 0,
        dodge: 5,
        hit: 1,
        hp: 20,
        hpLimit: 20,
        level: 1,
        dropGold: 5,
        drop: [
            {item: MATERIAL.SlimeGoo, chance: 0.5}
        ],
        onAttack: 'onSlimeAttack'
    } as MonsterType,

    // 2. 昆蟲類 - 高命中/高閃避
    WoodTick: {
        icon: '🐜',
        name: '木兵蟻',
        description: '體型細小但甲殼堅硬，容易躲開笨重的攻擊',
        ad: 4,
        critIncrease: WorldDefault.critIncrease,
        critRate: WorldDefault.critRate,
        adDefend: 3,
        dodge: 12,
        hit: 5,
        hp: 15,
        hpLimit: 15,
        level: 1,
        dropGold: 4,
        drop: [
            {item: MATERIAL.AntShell, chance: 0.5}
        ]
    } as MonsterType,

    ForestSprout: {
        icon: '🌱',
        name: '小樹人',
        description: '被魔力扭曲的植物，雖然不會移動但生命力頑強',
        ad: 3,
        critIncrease: WorldDefault.critIncrease,
        critRate: WorldDefault.critRate,
        adDefend: 2,
        dodge: -5,
        hit: 10, // 根部攻擊較難躲避
        hp: 30,
        hpLimit: 30,
        level: 1,
        dropGold: 8,
        drop: [
            {item: MATERIAL.ForestWood, chance: 0.3}
        ]
    } as MonsterType,

    // 4. 鳥類 - 敏捷型
    ForestOwl: {
        icon: '🦉',
        name: '夜行梟',
        description: '在樹蔭間穿梭的獵食者，眼神銳利',
        ad: 7,
        critIncrease: WorldDefault.critIncrease,
        critRate: WorldDefault.critRate,
        adDefend: 0,
        dodge: 20,
        hit: 3,
        hp: 20,
        hpLimit: 20,
        level: 1,
        dropGold: 10,
        drop: [
            {item: MATERIAL.OwlFeather, chance: 0.5}
        ]
    } as MonsterType,

    // 5. 獸類 - 均衡型
    GreenRabbit: {
        icon: '🐇',
        name: '綠兔',
        description: '額頭長有小角的兔子，衝撞力驚人',
        ad: 7,
        critIncrease: WorldDefault.critIncrease,
        critRate: WorldDefault.critRate,
        adDefend: 2,
        dodge: 10,
        hit: 4,
        hp: 30,
        hpLimit: 30,
        level: 2,
        dropGold: 12,
        drop: [
            {item: MATERIAL.RabbitHorn, chance: 0.3}
        ]
    } as MonsterType,

    // 6. 昆蟲類 - 毒素/暴擊型
    StingerBee: {
        icon: '🐝',
        name: '森林虎頭蜂',
        description: '擁有致命的毒刺，一旦被刺中傷口劇痛不已',
        ad: 3,
        critIncrease: WorldDefault.critIncrease,
        critRate: WorldDefault.critRate,
        adDefend: 0,
        dodge: 18,
        hit: 12,
        hp: 20,
        hpLimit: 20,
        level: 3,
        dropGold: 15,
        drop: [
            {item: MATERIAL.BeeStinger, chance: 0.1}
        ]
    } as MonsterType,

    // 小 Boss 級別
    MushroomMan: {
        icon: '🍄',
        name: '毒粉蕈人',
        description: '行走緩慢的蕈類，厚實的菌蓋提供了極佳防護',
        ad: 8,
        critIncrease: 0,
        critRate: 0,
        adDefend: 10,
        dodge: -10,
        hit: 5,
        hp: 65,
        hpLimit: 65,
        level: 5,
        dropGold: 100
    } as MonsterType,

    WoodViper: {
        icon: '🐍',
        name: '枯葉蛇',
        description: '完美偽裝在落葉中的毒蛇，發動攻擊時迅猛無比',
        ad: 18,
        critIncrease: WorldDefault.critIncrease,
        critRate: 20,
        adDefend: 1,
        dodge: 8,
        hit: 15,
        hp: 70,
        hpLimit: 70,
        level: 5,
        dropGold: 100,
        drop: [
            {item: MATERIAL.ViperScale, chance: 0.2}
        ]
    } as MonsterType,

    FierceWolf: {
        icon: '🐺',
        name: '森林之狼',
        description: '森林的巡邏者,極具威脅,遇到了建議跑',
        ad: 20,
        critIncrease: WorldDefault.critIncrease,
        critRate: 10,
        adDefend: 6,
        dodge: 12,
        hit: 10,
        hp: 85,
        hpLimit: 85,
        level: 5,
        dropGold: 100,
        drop: [
            {
                item: MATERIAL.WolfSkin,
                chance: 1
            }
        ]
    } as MonsterType,
    Mandragora: {
        icon: '👺',
        name: '尖叫蔓陀羅',
        description: '初始之森的恐怖傳聞，其尖叫聲能震懾所有入侵者',
        ad: 15,
        critIncrease: 200,
        critRate: 25,
        adDefend: 5,
        dodge: 0,
        hit: 20,
        hp: 120,
        hpLimit: 120,
        level: 5,
        dropGold: 100,
        drop: [
            {item: MATERIAL.MandrakeRoot, chance: 0.5}
        ]
    } as MonsterType,
    /**
     * 無限的怪物
     */
    AngelGuard: {
        icon: '👼',
        name: '座天使守衛',
        description: '守護神域邊境的戰士，金屬羽翼能切開一切凡間武裝',
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
        name: '墮落神官',
        description: '曾侍奉神靈，如今卻在廢墟中低語著禁忌的咒文',
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
        name: '惡魔審判者',
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
        name: '七日之一：曼蝶',
        description: '上帝最強大的手下-七日之一',
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
