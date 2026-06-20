import {StatusEffect} from "@/types";

export const SkillStatus = {
    SavePower: {
        name: '蓄力',
        icon: '💪',
        duration: 2,
        isBuff: true,
        description: '提升 %adIncrease%% 物理傷害',
        bonus: {
            adIncrease: 100
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
        icon: '✊',
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
        description: `提升自身 %adIncrease%% 物理輸出，持續 %duration% 回合`,
        bonus: {
            adIncrease: 10
        }
    } as StatusEffect,
    MagicDefend: {
        name: '法術裝甲',
        icon: '🌐',
        duration: 4,
        isBuff: true,
        description: `提升自身 %adDefend% 點防禦，持續 %duration% 回合`,
        bonus: {
            adDefend: 5
        }
    } as StatusEffect,
    SwordMind: {
        name: '劍意',
        icon: '🤺',
        duration: 3,
        isBuff: true,
        description: '提升自身 15% 所有增傷以及 10% 抗性',
        bonus: {
            adIncrease: 15,
            apIncrease: 15,
            defendIncrease: 10
        }
    } as StatusEffect,
}