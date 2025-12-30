import {StatusEffect} from "@/types";

export const UserStatus = {
    SmokeBomb: {
        name: '煙霧迷漫',
        icon: '💨',
        duration: 1,
        isBuff: true,
        description: '煙霧迷漫狀態下, 獲得必定逃跑效果',
        bonus: {
            dodge: 1000
        }
    } as StatusEffect,
    OnBurn: {
        name: '燃燒',
        icon: '🔥',
        duration: 3,
        description: '這個單位正在燃燒, 每回合失去 3 點生命值',
        type: 'damage',
        value: 3
    } as StatusEffect,
}