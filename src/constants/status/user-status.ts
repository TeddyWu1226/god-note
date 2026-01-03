import {StatusEffect} from "@/types";

export const UserStatus = {
    SmokeBomb: {
        name: '煙霧迷漫',
        icon: '😶‍🌫️',
        duration: 1,
        isBuff: true,
        description: '煙霧迷漫狀態下, 獲得必定逃跑效果(大多數情況下)',
        bonus: {
            runIncrease: 100
        }
    } as StatusEffect,
    CamouflageGrass: {
        name: '草叢掩蔽',
        icon: '🥬',
        duration: 1,
        isBuff: true,
        description: '草叢掩蔽的狀態下, 獲得容易逃跑效果',
        bonus: {
            runIncrease: 30
        }
    } as StatusEffect,
    OnBurn: {
        name: '燃燒',
        icon: '🔥',
        duration: 3,
        description: '這個單位正在燃燒, 每回合失去 5 點生命值',
        type: 'damage',
        value: 5
    } as StatusEffect,
    Poison: {
        name: '中毒',
        icon: '🤢',
        duration: 5,
        description: '每回合失去 5 點生命值',
        type: 'damage',
        value: 5
    } as StatusEffect,
    Weak: {
        name: '虛弱',
        icon: '😵‍💫',
        duration: 5,
        description: '減少 10% 造成的傷害',
        bonus: {
            adIncrease: -10,
            apIncrease: -10
        }
    } as StatusEffect,
    Blind: {
        name: '失明',
        icon: '👁️‍🗨️',
        duration: 5,
        description: '減少 30 點命中值',
        bonus: {
            hit: -30,
        }
    } as StatusEffect,
    Excited: {
        name: '興奮',
        icon: '🤩',
        duration: 5,
        isBuff: true,
        description: '提升 15% 造成的傷害',
        bonus: {
            adIncrease: 15,
            apIncrease: 15,
        }
    } as StatusEffect,
    Focus: {
        name: '專注提高',
        icon: '👀',
        duration: 5,
        isBuff: true,
        description: '提升 20 點命中',
        bonus: {
            hit: 20,
        }
    } as StatusEffect,
}