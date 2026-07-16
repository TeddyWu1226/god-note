import {StatusEffect} from "@/types";

export const SkillStatus = {
    SavePower: {
        name: '蓄力',
        icon: '💪',
        duration: 2,
        isBuff: true,
        untilAttack: true,
        description: '提升 %adIncrease%% 物理傷害 與 %hit% 點命中值',
        bonus: {
            adIncrease: 100,
            hit: 20
        }
    } as StatusEffect,
    SavePower2: {
        name: '蓄力',
        icon: '💪',
        duration: 2,
        isBuff: true,
        untilAttack: true,
        description: '提升 %adIncrease%% 物理傷害，%hit% 點命中值 以及 %defendIncrease%% 抗性',
        bonus: {
            adIncrease: 100,
            hit: 20,
            defendIncrease: 20
        }
    } as StatusEffect,
    EvasiveStrike: {
        name: '迴避攻勢',
        icon: '⚡',
        duration: 2,
        isBuff: true,
        description: '提升 %ad% 物理傷害',
        bonus: {
            ad: 10
        }
    } as StatusEffect,
    Terrified: {
        name: '威嚇',
        icon: '😰',
        description: '輸出 %adIncrease%% ',
        duration: 2,
        bonus: {
            adIncrease: -20
        }
    } as StatusEffect,
    Focus: {
        name: '專注意志',
        icon: '🎯',
        duration: 4,
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
        description: `獲得 %adDefend% 點防禦，持續 %duration% 回合`,
        bonus: {
            adDefend: 3
        }
    } as StatusEffect,
    Fight: {
        name: '戰鬥意志',
        icon: '✊',
        duration: 4,
        isBuff: true,
        description: `增加 %ad% 點物理與 %ap% 點魔法攻擊力，持續 %duration% 回合`,
        bonus: {
            ad: 5,
            ap: 5
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
        duration: 4,
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
    } as StatusEffect,
    ManaWeaponStatus: {
        name: '魔力武器',
        icon: '🪄',
        duration: 3,
        isBuff: true,
        description: '武器附魔了魔力，增加了 %ad% 點物理攻擊力。',
        bonus: {
            ad: 0
        }
    } as StatusEffect,
    ManaArmorStatus: {
        name: '魔力裝甲',
        icon: '🛡️',
        duration: 2,
        isBuff: true,
        description: '魔力匯聚成厚實的裝甲，使物理防禦力提升了 %adDefend% 點。',
        bonus: {
            adDefend: 0
        }
    } as StatusEffect,
    FireArmorStatus: {
        name: '火焰裝甲',
        icon: '🔥',
        duration: 2,
        isBuff: true,
        description: '匯聚火焰形成的魔法裝甲，提升了  %adDefend% 點物理防禦力與  %dodge% 點閃避值。',
        bonus: {
            adDefend: 0,
            dodge: 0,
        }
    } as StatusEffect,
    IgnitionBlastStatus: {
        name: '燃爆模式',
        icon: '🤯',
        duration: -1,
        isBuff: true,
        description: '燃爆狀態已啟用。回合開始時會引爆並移除所有帶有燃燒效果敵人的燃燒狀態，造成爆發傷害。'
    } as StatusEffect,
    IceArmorStatus: {
        name: '寒冰裝甲',
        icon: '🛡️',
        duration: 1,
        isBuff: true,
        description: '凝聚堅冰形成的魔法裝甲，使物理防禦力提升了 %adDefend% 點。',
        bonus: {
            adDefend: 0
        }
    } as StatusEffect,
    Frozen: {
        name: '冰凍',
        icon: '🥶',
        duration: 2,
        description: '被凍住了,無法行動',
        type: 'stuck'
    } as StatusEffect,
    ArmorBreak: {
        name: '破甲',
        icon: '⛓️‍💥',
        duration: 3,
        description: '防禦力 %adDefend% 點',
        bonus: {
            adDefend: -5
        }
    } as StatusEffect,
    Cripple: {
        name: '殘廢',
        icon: '♿',
        duration: 2,
        description: '使輸出 %adIncrease%% ',
        bonus: {
            adIncrease: -20
        }
    } as StatusEffect,
    DexterousBuff: {
        name: '靈巧',
        icon: '💨',
        duration: 1,
        isBuff: true,
        description: '逃跑失敗後獲得額外 20 點閃避',
        bonus: {
            dodge: 20
        }
    } as StatusEffect,
}