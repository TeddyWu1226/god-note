import {StatusEffect} from "@/types";

export const UnitStatus = {
    SlimeSlow: {
        name: '黏液阻饒',
        icon: '🟢',
        duration: 4,
        description: '降低 30 點 閃避值',
        bonus: {
            dodge: -30
        }
    } as StatusEffect,
    WolfRoarWarning: {
        name: '狼嚎警告',
        icon: '⚠️',
        duration: 1,
        isBuff: true,
        description: '森林之狼對你怒吼警告,希望你不要做出傻事,要跑趁現在',
        bonus: {
            dodge: 1000000000000
        }
    } as StatusEffect,
    SlimePoison: {
        name: '中毒',
        icon: '🤢',
        duration: 2,
        description: '每回合失去 10 點生命值',
        type: 'damage',
        value: 10
    } as StatusEffect,
    BeePoison: {
        name: '中毒',
        icon: '🤢',
        duration: 2,
        description: '每回合失去 5 點生命值',
        type: 'damage',
        value: 5
    } as StatusEffect
}