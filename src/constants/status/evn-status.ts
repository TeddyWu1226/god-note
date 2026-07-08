import {StatusEffect} from "@/types";

const EvnStatus = {
    Poison: {
        name: '中毒',
        icon: '🤢',
        duration: 5,
        description: '每回合失去 %value% 點生命值',
        type: 'damage',
        value: 10
    } as StatusEffect,
    Weak: {
        name: '虛弱',
        icon: '😵‍💫',
        duration: 5,
        description: '減少 50% 造成的傷害',
        bonus: {
            adIncrease: -50,
            apIncrease: -50
        }
    } as StatusEffect,
    Blind: {
        name: '失明',
        icon: '👁️‍🗨️',
        duration: 5,
        description: '減少 %hit% 點命中值',
        bonus: {
            hit: -50,
        }
    } as StatusEffect,
    Excited: {
        name: '興奮',
        icon: '🤩',
        duration: 5,
        isBuff: true,
        description: '提升 %adIncrease%% 造成的傷害',
        bonus: {
            adIncrease: 20,
            apIncrease: 20,
        }
    } as StatusEffect,
    Focus: {
        name: '專注提高',
        icon: '👀',
        duration: 5,
        isBuff: true,
        description: '提升 %hit% 點命中',
        bonus: {
            hit: 30,
        }
    } as StatusEffect,
    Sandstorm: {
        name: "魔力風暴",
        icon: "🌪️",
        duration: -1,
        description: "受到強烈的魔力風暴襲擊，在戰鬥中每回合損失 %value% 點生命值（受物理防禦力減免）。",
        type: "damage",
        value: 20,
        affectedByDefense: true
    } as StatusEffect,
    Sanity: {
        name: '理智',
        icon: '0🧠',
        duration: -1,
        description: '反映心智的穩定程度。白天上升，黑夜下降。高於 50 會進入「亢奮」狀態，低於 -50 會進入「癲狂」狀態。',
        value: 0
    } as StatusEffect,
    HighSanity: {
        name: '亢奮',
        icon: '🤩',
        duration: -1,
        description: '你陷入亢奮狀態。命中值 %hit% 點，閃避值 %dodge% 點。亢奮狀態下逃跑機率大幅降低。',
        bonus: {
            hit: 30,
            dodge: -30,
            runIncrease: -100
        }
    } as StatusEffect,
    LowSanity: {
        name: '妄想',
        icon: '🤪',
        duration: -1,
        description: '你陷入妄想狀態。命中值 %hit% 點，閃避值 %dodge% 點。妄想狀態下選擇戰鬥會遇到不知名的怪物。',
        bonus: {
            hit: -30,
            dodge: 30
        }
    } as StatusEffect,
    DaytimeEffect: {
        name: '白晝',
        icon: '☀️',
        duration: -1,
        description: '開局自帶白晝守護。受到「亢奮」狀態下的敵人攻擊時，降低 50% 傷害；攻擊「妄想」狀態下的敵人時，增加 50% 傷害。'
    } as StatusEffect,
    NighttimeEffect: {
        name: '黑夜',
        icon: '🌙',
        duration: -1,
        description: '開局自帶黑夜守護。受到「妄想」狀態下的敵人攻擊時，降低 50% 傷害；攻擊「亢奮」狀態下的敵人時，增加 50% 傷害。'
    } as StatusEffect,
    OnBurn: {
        name: '燃燒',
        icon: '🔥',
        duration: 3,
        description: '這個單位正在燃燒, 每回合失去 %value% 點生命值',
        type: 'damage',
        value: 5
    } as StatusEffect,
}
export default EvnStatus