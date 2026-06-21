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
    WoodStuck: {
        name: '老樹盤根',
        icon: '🪵',
        duration: 2,
        description: '你被樹根睏綁住了,任何行動都會失效',
        type: 'stuck',
    } as StatusEffect,
    WolfRoarWarning: {
        name: '狼嚎警告',
        icon: '⚠️',
        duration: 1,
        isBuff: true,
        description: '森林之狼對你怒吼警告,希望你不要做出傻事,要跑趁現在',
        bonus: {
            runIncrease: 150
        }
    } as StatusEffect,
    SlimePoison: {
        name: '中毒',
        icon: '🤢',
        duration: 4,
        description: '每回合失去 5 點生命值',
        type: 'damage',
        value: 5
    } as StatusEffect,
    MushroomManPoison: {
        name: '麻痺',
        icon: '🦠',
        duration: 3,
        description: '降低 50 點命中值',
        bonus: {
            hit: -50
        },
    } as StatusEffect,
    BeePoison: {
        name: '中毒',
        icon: '🤢',
        duration: 10,
        description: '每回合失去 3 點生命值',
        type: 'damage',
        value: 3
    } as StatusEffect,
    SpiderStuck: {
        name: '蜘蛛綑綁',
        icon: '🕸',
        duration: 5,
        description: '你被堅韌但易燃的蜘蛛絲綑綁了,任何行動都會失效',
        type: 'stuck',
    } as StatusEffect,
    SmallSpiderStuck: {
        name: '蜘蛛綑綁',
        icon: '🕸',
        duration: 2,
        description: '你被堅韌但易燃的蜘蛛絲綑綁了,任何行動都會失效',
        type: 'stuck',
    } as StatusEffect,
    SpiderHunter: {
        name: '攻擊獵物',
        icon: '⚠️',
        duration: 1,
        isBuff: true,
        description: '蜘蛛對於被綑綁的敵人可以造成百分百爆擊',
        bonus: {
            critRate: 100
        }
    } as StatusEffect,
    EvilWoodManCurse: {
        name: '魔樹詛咒',
        icon: '🪵',
        duration: -1,
        description: '被魔樹詛咒的單位無法逃跑以及閃避',
        bonus: {
            dodge: -100000
        }
    } as StatusEffect,
    MandragoraScared: {
        name: '驚嚇',
        icon: '😱',
        duration: 3,
        description: '所有輸出減少50%',
        bonus: {
            adIncrease: -50,
            apIncrease: -50
        }
    } as StatusEffect,
    ScorpionPoison: {
        name: '劇毒',
        icon: '☣︎',
        duration: 5,
        description: '每回合失去 5 點生命值',
        type: 'damage',
        value: 5
    } as StatusEffect,
    SmallScorpionPoison: {
        name: '劇毒',
        icon: '☣︎',
        duration: 10,
        description: '每回合失去 3 點生命值,如果連續中毒,傷害會疊加並刷新效果',
        type: 'damage',
        value: 3
    } as StatusEffect,
    MummyRancid: {
        name: '腐臭',
        icon: '🤮︎',
        duration: 5,
        description: '降低 5 點防禦',
        bonus: {
            adDefend: -5
        }
    } as StatusEffect,
    EatMummy: {
        name: '力量盛宴',
        icon: '🍽️',
        duration: 8,
        description: '當倒數計時結束時,他會吸收場上所有木乃伊轉化為自身血量',
        isBuff: true,
        bonus: {
            ad: -10,
            adDefend: 20,
            apDefend: 10
        }
    } as StatusEffect,
    Cold: {
        name: '寒冷',
        icon: '🔵5',
        duration: 5,
        description: '降低 5 點閃避值與命中值，可堆疊。當寒冷達一定程度後會額外造成凍傷效果,以及可能造成冰凍而無法行動',
        bonus: {
            dodge: -5,
            hit: -5
        }
    } as StatusEffect,
    Frostbite: {
        name: '凍傷',
        icon: '❄️',
        duration: 3,
        description: '每回合扣除 20 點生命',
        type: 'damage',
        value: 20
    } as StatusEffect,
    Frozen: {
        name: '冰凍',
        icon: '🥶',
        duration: 2,
        description: '被凍住了,無法行動外還會扣除 10 點防禦',
        type: 'stuck',
        bonus: {
            adDefend: -10
        }
    } as StatusEffect,
    WhiteAngry: {
        name: '白色盛怒',
        icon: '🐻‍❄️',
        duration: 5,
        description: '覆蓋了白色魔力外衣,不只防禦提升,攻擊爆擊率大幅提升',
        isBuff: true,
        bonus: {
            critIncrease: 50,
            critRate: 100,
            adDefend: 15,
            apDefend: 10
        }
    } as StatusEffect,
    Flying: {
        name: '飛行',
        icon: '🪽',
        duration: 3,
        description: '這個單位正在飛行,大幅提升閃避機率',
        isBuff: true,
        bonus: {
            dodge: 80
        }
    } as StatusEffect,
    Burn: {
        name: '燒傷',
        icon: '🔥',
        duration: 4,
        description: '每回合失去 10 點生命值',
        type: 'damage',
        value: 10
    } as StatusEffect,
    Bleed: {
        name: '流血',
        icon: '🩸',
        duration: 3,
        description: '每回合失去 15 點生命值',
        type: 'damage',
        value: 15
    } as StatusEffect,
    Shock: {
        name: '感電',
        icon: '⚡',
        duration: 3,
        description: '受到感電影響，降低 20 點閃避與 10 點防禦',
        bonus: {
            dodge: -20,
            adDefend: -10
        }
    } as StatusEffect,
    Blind: {
        name: '失明',
        icon: '🕶️',
        duration: 3,
        description: '眼前一片漆黑，降低 30 點命中值',
        bonus: {
            hit: -30
        }
    } as StatusEffect,
    AbyssCurse: {
        name: '深淵詛咒',
        icon: '☠️',
        duration: 5,
        description: '每回合失去 25 點生命值，抗性降低 20%',
        type: 'damage',
        value: 25,
        bonus: {
            defendIncrease: -20
        }
    } as StatusEffect,
    JudgmentSilence: {
        name: '神聖沉默',
        icon: '🤫',
        duration: 2,
        description: '受到神聖光芒干涉，法術傷害降低 50%',
        bonus: {
            apIncrease: -50
        }
    } as StatusEffect,
    ArmorBreak: {
        name: '破甲',
        icon: '⛓️‍💥',
        duration: 3,
        description: '防禦力降低 5 點',
        bonus: {
            adDefend: -5
        }
    } as StatusEffect,
}