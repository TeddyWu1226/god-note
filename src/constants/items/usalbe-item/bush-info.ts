import {UsableType} from "@/types";

export const NormalFruits = {
    Berry: {
        name: '野莓',
        description: '小型果實。',
        icon: '🍓',
        quality: 0,
        usable: true,
        heal: 10,
        magic: 10,
    } as UsableType,
    RedApple: {
        name: '鮮紅果',
        description: '香甜可口的果實。',
        icon: '🍎',
        quality: 1,
        heal: 25,
        magic: 25,
        usable: true
    } as UsableType
}
