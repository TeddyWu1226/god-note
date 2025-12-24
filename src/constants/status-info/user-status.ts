import {StatusEffect} from "@/types";

export const UserStatus = {
    torchBurn: {
        name: '燃燒',
        icon: '🔥',
        duration: 3,
        description: '火把燃燒效果,使目標受到 2 點傷害',
        type: 'damage',
        value: 2
    } as StatusEffect,
}