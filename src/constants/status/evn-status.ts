import {StatusEffect} from "@/types";

const EvnStatus = {
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
    SongHeal: {
        name: '悠揚:生命回復',
        icon: '💚',
        duration: -1,
        isBuff: true,
        description: '每次行動恢復 2 HP',
        type: 'heal',
        value: 2
    } as StatusEffect,
    SongDefend: {
        name: '悠揚:防禦提升',
        icon: '🛡️',
        duration: -1,
        isBuff: true,
        description: '防禦提升 3 點',
        bonus: {
            adDefend: 3,
        }
    } as StatusEffect,
    SongAgile: {
        name: '悠揚:閃避提升',
        icon: '🏃🏻',
        duration: -1,
        isBuff: true,
        description: '閃避提升 15 點',
        bonus: {
            dodge: 15,
        }
    } as StatusEffect,
    Sandstorm: {
        name: "魔力風暴",
        icon: "🌪️",
        duration: -1,
        description: "受到強烈的魔力風暴襲擊，在戰鬥中每回合損失 %value% 點生命值（受物理防禦力減免）。",
        type: "damage",
        value: 25,
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
        description: '亢奮狀態。攻擊「白晝」魔物時傷害降低 50%；受到「黑夜」魔物攻擊時傷害增加 50%。'
    } as StatusEffect,
    LowSanity: {
        name: '癲狂',
        icon: '🤪',
        duration: -1,
        description: '癲狂狀態。攻擊「黑夜」魔物時傷害降低 50%；受到「白晝」魔物攻擊時傷害增加 50%。'
    } as StatusEffect,
    DaytimeEffect: {
        name: '白晝',
        icon: '☀️',
        duration: -1,
        description: '開局自帶白晝守護。受到「亢奮」狀態下的敵人攻擊時，降低 50% 傷害；受到「癲狂」狀態下的敵人攻擊時，傷害增加 50%。'
    } as StatusEffect,
    NighttimeEffect: {
        name: '黑夜',
        icon: '🌙',
        duration: -1,
        description: '開局自帶黑夜守護。受到「癲狂」狀態下的敵人攻擊時，降低 50% 傷害；受到「亢奮」狀態下的敵人攻擊時，傷害增加 50%。'
    } as StatusEffect,
}
export default EvnStatus