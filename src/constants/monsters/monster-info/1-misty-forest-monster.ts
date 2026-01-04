import {MonsterType} from "@/types";
import {WorldDefault} from "@/assets/const";
import {MATERIAL} from "@/constants/items/material/material-info";

export const MistyForestMonster = {
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
        dropGold: 3,
        drop: [
            {item: MATERIAL.SlimeGoo, chance: 0.5}
        ],
        onAttack: 'slimeOnAttack'
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
        dropGold: 5,
        drop: [
            {item: MATERIAL.ForestWood, chance: 0.5}
        ]
    } as MonsterType,
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
        hp: 20,
        hpLimit: 20,
        level: 2,
        dropGold: 5,
        drop: [
            {item: MATERIAL.AntShell, chance: 0.5}
        ]
    } as MonsterType,
    StingerBee: {
        icon: '🐝',
        name: '森林虎頭蜂',
        description: '擁有致命的毒刺，一旦被刺中傷口劇痛不已',
        ad: 2,
        critIncrease: 100,
        critRate: 0,
        adDefend: 0,
        dodge: 25,
        hit: 20,
        hp: 25,
        hpLimit: 25,
        level: 3,
        dropGold: 12,
        drop: [
            {item: MATERIAL.BeeStinger, chance: 0.1}
        ],
        onAttack: 'beeOnAttack'
    } as MonsterType,
    GreenRabbit: {
        icon: '🐇',
        name: '綠兔',
        description: '額頭長有小角的兔子，衝撞力驚人',
        ad: 12,
        critIncrease: WorldDefault.critIncrease,
        critRate: WorldDefault.critRate,
        adDefend: 5,
        dodge: 10,
        hit: 4,
        hp: 30,
        hpLimit: 30,
        level: 3,
        dropGold: 12,
        drop: [
            {item: MATERIAL.RabbitHorn, chance: 0.3}
        ]
    } as MonsterType,
    ForestOwl: {
        icon: '🦉',
        name: '夜行梟',
        description: '在樹蔭間穿梭的獵食者，眼神銳利',
        ad: 13,
        critIncrease: WorldDefault.critIncrease,
        critRate: WorldDefault.critRate,
        adDefend: 0,
        dodge: 30,
        hit: 10,
        hp: 25,
        hpLimit: 25,
        level: 3,
        dropGold: 12,
        drop: [
            {item: MATERIAL.OwlFeather, chance: 0.5}
        ]
    } as MonsterType,
    FairyGuard: {
        icon: '🧚',
        name: '妖精守衛',
        description: '守衛著迷霧森林核心區域的靈體，動作輕盈且攻擊精準，手中的靈光長矛不容小覷',
        ad: 15,
        critIncrease: 150,
        critRate: 10,
        adDefend: 4,
        dodge: 15,
        hit: 15,
        hp: 50,
        hpLimit: 50,
        level: 4,
        dropGold: 30,
        onStart: 'fairyGuardOnStart'
    } as MonsterType,

    MushroomMan: {
        icon: '🍄',
        name: '毒粉蕈人',
        description: '行走緩慢的蕈類，厚實的菌蓋提供了極佳防護,而且攻擊他都會飄逸神秘粉末',
        ad: 10,
        critIncrease: 0,
        critRate: 0,
        adDefend: 20,
        dodge: -10,
        hit: 5,
        hp: 10,
        hpLimit: 10,
        level: 5,
        dropGold: 25,
        onAttacked: 'mushroomManOnAttacked'
    } as MonsterType,
    Mandragora: {
        icon: '🌺',
        name: '尖叫蔓陀羅',
        class: 'elite',
        description: '森林的恐怖傳聞，其尖叫聲能震懾所有入侵者',
        ad: 15,
        critIncrease: 200,
        critRate: 25,
        adDefend: 5,
        dodge: 0,
        hit: 20,
        hp: 65,
        hpLimit: 65,
        level: 6,
        dropGold: 40,
        drop: [
            {item: MATERIAL.MandrakeRoot, chance: 0.1}
        ],
        onDead: 'mandragoraOnDead'
    } as MonsterType,
    FierceWolf: {
        icon: '🐺',
        name: '森林之狼',
        class: 'elite',
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
        dropGold: 50,
        drop: [
            {
                item: MATERIAL.WolfSkin,
                chance: 1
            }
        ],
        onStart: 'wolfOnStart'
    } as MonsterType,
    SmallSpider: {
        icon: '🕷️',
        name: '古蜘蛛的眷屬',
        description: '古蜘蛛的眷屬,強大的狩獵能力,攻擊時有機率綑綁敵人',
        class: 'elite',
        ad: 15,
        critIncrease: 200,
        critRate: 5,
        adDefend: 5,
        dodge: 0,
        hit: 70,
        hp: 80,
        hpLimit: 80,
        level: 5,
        dropGold: 250,
        onAttack: 'smallSpiderOnAttack'
    } as MonsterType,
}
