// 🛡️ OFFHAND (副手) - 閃避、命中與特殊效果
import {EquipmentType} from "@/types";
import {EquipmentPosition} from "@/enums/enums";

export const Offhand: Record<string, EquipmentType> = {
    WoodShield: {
        name: '木盾',
        description: '勉強能擋住石塊。',
        icon: '🪵',
        position: EquipmentPosition.OFFHAND,
        quality: 0,
        adDefend: 5
    },
    Buckler: {
        name: '圓盾',
        description: '適合反擊的輕便小盾。',
        icon: '⚪',
        position: EquipmentPosition.OFFHAND,
        quality: 1,
        adDefend: 10,
        dodge: 5
    },
    IronKiteShield: {
        name: '鐵製鳶盾',
        description: '標準的騎士防具。',
        icon: '🛡️',
        position: EquipmentPosition.OFFHAND,
        quality: 1,
        adDefend: 25
    },
    WoodenQuiver: {
        name: '木製箭袋',
        description: '裝備弓時增加命中。',
        icon: '🏹',
        position: EquipmentPosition.OFFHAND,
        quality: 1,
        hit: 10
    },
    MagicOrb: {
        name: '魔力法球',
        description: '緩慢補充魔力。',
        icon: '🔮',
        position: EquipmentPosition.OFFHAND,
        quality: 2,
        spLimit: 150
    },
    LanternOfLight: {
        name: '光之燈籠',
        description: '照亮黑暗，增加命中。',
        icon: '🏮',
        position: EquipmentPosition.OFFHAND,
        quality: 2,
        hit: 20
    },
    TowerShield: {
        name: '巨型塔盾',
        description: '極致的物理防禦。',
        icon: '🧱',
        position: EquipmentPosition.OFFHAND,
        quality: 3,
        adDefend: 60,
        dodge: -10
    },
    CursedSkull: {
        name: '咒術頭骨',
        description: '提升爆擊但降低防禦。',
        icon: '💀',
        position: EquipmentPosition.OFFHAND,
        quality: 5,
        critRate: 15,
        adDefend: -15
    },
    DemonsContract: {
        name: '惡魔契約',
        description: '用靈魂換取力量。',
        icon: '📜',
        position: EquipmentPosition.OFFHAND,
        quality: 5,
        ad: 40,
        hpLimit: -150
    },
    AegisOfGods: {
        name: '神聖之盾',
        description: '傳說中不可撼動的防禦。',
        icon: '📀',
        position: EquipmentPosition.OFFHAND,
        quality: 4,
        adDefend: 100,
        dodge: 10
    }
};