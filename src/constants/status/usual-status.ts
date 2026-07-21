import {StatusEffect} from "@/types";

export const UsualStatus = {
    Angry: {
        name: '憤怒',
        icon: '💢',
        duration: 1,
        description: `這個單位憤怒中, 下一次攻擊必定爆擊`,
        bonus: {
            critRate: 100
        },
        isBuff: true
    } as StatusEffect,
    Dodge: {
        name: '閃避',
        icon: '💨',
        duration: 1,
        description: `這個單位敏捷提升`,
        bonus: {
            dodge: 100
        },
        isBuff: true
    } as StatusEffect,
    Stuck: {
        name: '暈眩',
        icon: '😵‍💫',
        duration: 2,
        description: `這個單位暈眩中,無法行動`,
        type: 'stuck'
    } as StatusEffect,
    AdDefendInCrease: {
        name: '防禦提升',
        icon: '🛡️',
        duration: 1,
        isBuff: true,
        description: `短暫的大幅提升自身 %adDefend% 防禦`,
        bonus: {
            adDefend: 5
        }
    } as StatusEffect,
    Resistance: {
        name: '抵抗',
        icon: '%value%🤽🏼‍♀️',
        duration: 4,
        isBuff: true,
        description: '使得前 %value% 次受到的傷害歸 0',
        value: 3
    } as StatusEffect,
    DigHoleResistance: {
        name: '抵抗',
        icon: '6🤽🏼‍♀️',
        duration: 5,
        isBuff: true,
        description: '掘地巨獸鑽入了地洞，使得前 %value% 次受到的傷害歸 0，4回合後若仍有抵抗效果，將會造成超大量傷害！',
        value: 6
    } as StatusEffect
}