import {MonsterType} from "@/types";
import {WorldDefault} from "@/assets/const";
import {Material} from "@/constants/items/material/material-info";
import {Accessory1, Accessory2} from "@/constants/items/equipment/accessories-info";


export const SpecialBoss = {
    EvilWoodMan: {
        icon: '𓆩🌳𓆪',
        name: '邪靈樹妖',
        class: 'boss',
        description: '吸收你的靈氣而茁壯的強大魔物,這次決定奪走你的生命',
        ad: 5,
        critIncrease: WorldDefault.critIncrease,
        critRate: 25,
        adDefend: 3,
        apDefend: 3,
        dodge: 0,
        hit: 50,
        hp: 50,
        hpLimit: 50,
        level: 8,
        dropGold: 0,
        onStart: 'evilWoodManOnStart',
        drop: [
            {item: Accessory1.CursedWoodenRing, chance: 1}
        ],
    } as MonsterType,
    AtreidesMan: {
        icon: '👦🏼',
        name: '神秘男子',
        class: 'boss',
        description: '穿著黑色戰甲的神秘男子,因為你給他喝了奇怪的液體正大發雷霆',
        ad: 28,
        critIncrease: WorldDefault.critIncrease,
        critRate: 35,
        adDefend: 15,
        apDefend: 15,
        dodge: 35,
        hit: 10,
        hp: 100,
        hpLimit: 200,
        lifeSteal: 50,
        level: 10,
        dropGold: 200,
        onStart: 'atreidesManOnStart',
        chaseIncrease: 20,
        drop: [
            {item: Accessory2.AtreidesNecklace, chance: 1}
        ],
    } as MonsterType,
};