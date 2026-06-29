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
        duration: 5,
        isBuff: true,
        description: `提升自身 %hit% 點命中，持續 %duration% 回合`,
        bonus: {
            hit: 5
        }
    } as StatusEffect,
    Will: {
        name: '堅定意志',
        icon: '🛡️',
        duration: 5,
        isBuff: true,
        description: `提升自身 %defendIncrease% 點抗性，持續 %duration% 回合`,
        bonus: {
            defendIncrease: 10
        }
    } as StatusEffect,
    Fight: {
        name: '戰鬥意志',
        icon: '✊',
        duration: 5,
        isBuff: true,
        description: `提升自身 %adIncrease%% 總輸出，持續 %duration% 回合`,
        bonus: {
            adIncrease: 20,
            apIncrease: 20
        }
    } as StatusEffect,
    Agility: {
        name: '敏捷意志',
        icon: '💨',
        duration: 5,
        isBuff: true,
        description: `提升自身 %dodge% 點閃避，持續 %duration% 回合`,
        bonus: {
            dodge: 10
        }
    } as StatusEffect
}