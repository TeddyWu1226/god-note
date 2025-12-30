import {MonsterType} from "@/types";
import {WorldDefault} from "@/assets/const";


export const SpecialBoss = {
    EvilWoodMan: {
        icon: '𓆩🌳𓆪',
        name: '邪靈魔樹',
        class: 'boss',
        description: '吸收你的靈氣而茁壯的強大魔物,這次決定奪走你的生命',
        ad: 5,
        critIncrease: WorldDefault.critIncrease,
        critRate: 25,
        adDefend: 5,
        dodge: 0,
        hit: 50,
        hp: 50,
        hpLimit: 50,
        level: 10,
        dropGold: 0,
        onStart: 'evilWoodManOnstart'
    } as MonsterType,
};