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
}