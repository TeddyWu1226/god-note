import {StatusEffect} from "@/types";

export const SkillStatus = {
    SavePower: {
        name: '蓄力',
        icon: '💪',
        duration: 2,
        isBuff: true,
        description: '提升 %adIncrease%% 物理傷害 與 %hit% 點命中值',
        bonus: {
            adIncrease: 100,
            hit: 20
        }
    },
    Focus: {
        name: '專注意志',
        icon: '🎯',
        duration: 3,
        isBuff: true,
        description: `提升自身 %hit% 點命中，持續 %duration% 回合`,
        bonus: {
            hit: 10
        }
    } as StatusEffect,
    Will: {
        name: '堅定意志',
        icon: '🛡️',
        duration: 3,
        isBuff: true,
        description: `提升自身 %defendIncrease% 點抗性，持續 %duration% 回合`,
        bonus: {
            defendIncrease: 10
        }
    } as StatusEffect,
    Fight: {
        name: '戰鬥意志',
        icon: '✊',
        duration: 3,
        isBuff: true,
        description: `提升自身 %adIncrease%% 總輸出，持續 %duration% 回合`,
        bonus: {
            adIncrease: 10,
            apIncrease: 10
        }
    } as StatusEffect,
    Agility: {
        name: '敏捷意志',
        icon: '💨',
        duration: 3,
        isBuff: true,
        description: `提升自身 %dodge% 點閃避，持續 %duration% 回合`,
        bonus: {
            dodge: 10
        }
    } as StatusEffect,
    HideStatus: {
        name: '藏匿',
        icon: '👤',
        duration: 2,
        isBuff: true,
        untilAttack: true,
        description: `提升 %critRate%% 爆擊率與 %dodge% 點閃避，攻擊或施展技能會提前結束`,
        bonus: {
            critRate: 50,
            dodge: 50
        }
    } as StatusEffect,
    BreakfallStatus: {
        name: '受身',
        icon: '🍂',
        duration: 2,
        isBuff: true,
        untilAttacked: true,
        description: `閃避率歸0,並轉化為 %adDefend% 點防禦，受到攻擊會移除此效果`,
        bonus: {
            dodge: 0,
            adDefend: 0,
        }
    } as StatusEffect,
    SwordPolishStatus: {
        name: '打磨',
        icon: '✨',
        duration: 3,
        isBuff: true,
        description: '提升 %ad% 點物理攻擊力',
        bonus: {
            ad: 0
        }
    } as StatusEffect,
    SwordDanceStatus: {
        name: '劍舞',
        icon: '%value%💃',
        duration: 2,
        isBuff: true,
        description: '提升 %adIncrease%% 輸出',
        value: 1,
        bonus: {
            adIncrease: 10
        }
    } as StatusEffect,
    PlayerMistStatus: {
        name: '迷霧',
        icon: '🌫️',
        duration: 3,
        isBuff: true,
        untilAttack: true,
        description: '提升 %dodge% 點閃避，攻擊後消失',
        bonus: {
            dodge: 40
        }
    } as StatusEffect,
    EnemyMistStatus: {
        name: '迷霧',
        icon: '🌫️',
        duration: 3,
        isBuff: false,
        untilAttacked: true,
        description: '降低 %hit% 點命中，受擊後消失',
        bonus: {
            hit: -40
        }
    } as StatusEffect,
    PlayerAnestheticMistStatus: {
        name: '麻醉迷霧',
        icon: '🌁',
        duration: 3,
        isBuff: true,
        description: '提升 %dodge% 點閃避值',
        bonus: {
            dodge: 60
        }
    } as StatusEffect,
    EnemyAnestheticMistStatus: {
        name: '麻醉迷霧',
        icon: '🌁',
        duration: 3,
        isBuff: false,
        description: '降低 %hit% 點命中值',
        bonus: {
            hit: -60
        }
    } as StatusEffect
}