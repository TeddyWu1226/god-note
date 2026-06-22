import {StatusEffect} from "@/types";

export const UnitStatus = {
    SlimeSlow: {
        name: '黏液阻饒',
        icon: '🟢',
        duration: 4,
        description: '降低 20 點閃避值',
        bonus: {
            dodge: -20
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
    PoisonDefend: {
        name: '劇毒裝甲',
        icon: '🛡️',
        duration: 1,
        isBuff: true,
        description: `大幅提升自身 %adDefend% 防禦, 並對攻擊者附加中毒效果`,
        bonus: {
            adDefend: 25
        }
    } as StatusEffect,
    Poison: {
        name: '中毒',
        icon: '🤢',
        duration: 4,
        description: '每回合失去 %value% 點生命值',
        type: 'damage',
        value: 5
    } as StatusEffect,
    Paralysis: {
        name: '麻痹',
        icon: '😩',
        duration: 5,
        description: '降低 %adIncrease%% 輸出',
        bonus: {
            adIncrease: -20,
            apIncrease: -20,
        }
    } as StatusEffect,
    SpiderStuck: {
        name: '蜘蛛綑綁',
        icon: '🕸',
        duration: 5,
        description: '你被堅韌但易燃的蜘蛛絲綑綁了,任何行動都會失效',
        type: 'stuck',
    } as StatusEffect,
    Scared: {
        name: '驚嚇',
        icon: '😱',
        duration: 3,
        description: '所有輸出減少50%',
        bonus: {
            adIncrease: -50,
            apIncrease: -50
        }
    } as StatusEffect,
    Cold: {
        name: '寒冷',
        icon: '🔵3',
        duration: 5,
        description: '降低 %dodge% 點閃避值與命中值，可堆疊。當寒冷達一定程度後會額外造成凍傷效果,最終造成冰凍而無法行動',
        bonus: {
            dodge: -3,
            hit: -3
        }
    } as StatusEffect,
    Frostbite: {
        name: '凍傷',
        icon: '❄️',
        duration: 3,
        description: '每回合扣除 %value% 點生命',
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
    SpeedDance: {
        name: '癲狂之舞',
        icon: '🎶',
        duration: -1,
        isBuff: true,
        description: `半神攻擊如果命中，其舞動會更加凌厲，攻擊與防禦逐漸提升，當狂歡之時攻擊會視為爆擊。(得想辦法打斷...)`,
        bonus: {
            ad: 2,
            adDefend: 2
        }
    } as StatusEffect,
}