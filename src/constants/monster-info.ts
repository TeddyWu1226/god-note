import {MonsterType} from "@/types";
import {WorldDefault} from "@/assets/const";

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
        dropGold: 5
    } as MonsterType,

    // 2. 昆蟲類 - 高命中/高閃避
    WoodTick: {
        icon: '🐜',
        name: '硬殼木蝨',
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
        dropGold: 4
    } as MonsterType,

    // 3. 植物類 - 高血量/低閃避
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
        hp: 40,
        hpLimit: 40,
        level: 2,
        dropGold: 8
    } as MonsterType,

    // 4. 鳥類 - 敏捷型
    ForestOwl: {
        icon: '🦉',
        name: '夜行梟',
        description: '在樹蔭間穿梭的獵食者，眼神銳利',
        ad: 7,
        critIncrease: WorldDefault.critIncrease,
        critRate: WorldDefault.critRate,
        adDefend: 1,
        dodge: 15,
        hit: 8,
        hp: 18,
        hpLimit: 18,
        level: 2,
        dropGold: 10
    } as MonsterType,

    // 5. 獸類 - 均衡型
    GreenRabbit: {
        icon: '🐇',
        name: '角兔',
        description: '額頭長有小角的兔子，衝撞力驚人',
        ad: 9,
        critIncrease: WorldDefault.critIncrease,
        critRate: WorldDefault.critRate,
        adDefend: 2,
        dodge: 10,
        hit: 4,
        hp: 30,
        hpLimit: 30,
        level: 3,
        dropGold: 12
    } as MonsterType,

    // 6. 昆蟲類 - 毒素/暴擊型
    StingerBee: {
        icon: '🐝',
        name: '森林虎頭蜂',
        description: '擁有致命的毒刺，一旦被刺中傷口劇痛不已',
        ad: 12,
        critIncrease: WorldDefault.critIncrease,
        critRate: WorldDefault.critRate,
        adDefend: 0,
        dodge: 18,
        hit: 12,
        hp: 12,
        hpLimit: 12,
        level: 3,
        dropGold: 15
    } as MonsterType,

    // 7. 植物類 - 坦克型
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
        level: 4,
        dropGold: 20
    } as MonsterType,

    // 8. 爬蟲類 - 高攻型
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
        hp: 25,
        hpLimit: 25,
        level: 4,
        dropGold: 25
    } as MonsterType,

    // 9. 大型獸類 - 精英怪
    FierceWolf: {
        icon: '🐺',
        name: '森林守衛狼',
        description: '森林的巡邏者,極具威脅,遇到了建議跑',
        ad: 22,
        critIncrease: WorldDefault.critIncrease,
        critRate: 10,
        adDefend: 6,
        dodge: 12,
        hit: 10,
        hp: 85,
        hpLimit: 85,
        level: 5,
        dropGold: 40
    } as MonsterType,

    // 10. 奇幻植物 - 小 Boss 級別
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
        level: 6,
        dropGold: 100
    } as MonsterType,
    Error: {
        icon: '⁴⁰⁴་',
        name: '錯誤',
        description: '當你碰到這個,就是等輸',
        ad: 999999,
        critIncrease: 1000,
        critRate: 100,
        adDefend: 5000,
        dodge: 100,
        hit: 100,
        hp: 9999999999,
        hpLimit: 9999999999,
        level: 99,
        dropGold: 999999999
    } as MonsterType
}
