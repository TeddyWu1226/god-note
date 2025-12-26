/**
 * 定義遊戲的操作
 */

export enum operationStatusEnum {
    Default = 'Default',
    Skill = 'Skill',
    Package = 'Package',
    Choose = 'Choose'
}

/**
 * 定義遊戲的兩種主要輪迴狀態
 */
export enum GameState {
    INITIAL = 'INITIAL',            // 遊戲或場景的起始狀態
    EVENT_PHASE = 'EVENT_PHASE',    // 事件狀態 (發生中)
    SELECTION_PHASE = 'SELECTION_PHASE' // 選擇事件狀態 (等待輸入)
}

export interface EnumItem {
    value: string | number;
    label: string;

    [key: string]: any; // 允許有其他任意屬性
}

export interface Enum {
    [key: string]: EnumItem;
}

/**
 * 特殊事件
 */
export enum SpecialEventEnum {
    // 無事件
    None = 'None',
    // 賭博
    Gamble = 'Gamble',
    // 祝福或詛咒
    BlessingOrCurse = 'BlessingOrCurse',
    // 魔樹事件
    GetFruit = 'GetFruit',
}

/**
 * 裝備位置
 */
export enum EquipmentPosition {
    HEAD = 'head',
    BODY = 'body',
    WEAPON = 'weapon',
    OFFHAND = 'offhand',
    ACCESSORY1 = 'accessory1',
    ACCESSORY2 = 'accessory2',
}

export const EquipmentEnum = {
    Head: {
        value: 'head',
        label: '頭部',
        icon: '😑',
    },
    Weapon: {
        value: 'weapon',
        label: '武器',
        icon: '🗡️',
    },
    Body: {
        value: 'body',
        label: '身體',
        icon: '👕',
    },
    Offhand: {
        value: 'offhand',
        label: '副手',
        icon: '🛡️',
    },
    Accessory1: {
        value: 'accessory1',
        label: '飾品 I',
        icon: '💍',
    },
    Accessory2: {
        value: 'accessory2',
        label: '飾品 II',
        icon: '📿',
    },
} as const;

export const StatEnum = {
    hp: {
        value: 'hp',
        maxKey: 'hpLimit',
        label: '生命',
        icon: '❤️',
        unit: ''
    },
    sp: {
        value: 'sp',
        maxKey: 'spLimit',
        label: '法力',
        icon: '✨',
        unit: ''
    },
    ad: {
        value: 'ad',
        label: '攻擊',
        icon: '⚔️',
        unit: ''
    },
    adIncrease: {
        value: 'adIncrease',
        label: '物理增傷',
        icon: '💪🏻',
        unit: '%'
    },
    adDefend: {
        value: 'adDefend',
        label: '防禦',
        icon: '🛡️',
        unit: ''
    },
    defendIncrease: {
        value: 'defendIncrease',
        label: '抗性',
        icon: '🔰',
        unit: '%'
    },
    critRate: {
        value: 'critRate',
        label: '爆擊',
        icon: '💥',
        unit: '%'
    },
    critIncrease: {
        value: 'critIncrease',
        label: '爆傷',
        icon: '💢',
        unit: '%'
    },
    hit: {
        value: 'hit',
        label: '命中',
        icon: '🎯',
        unit: ''
    },
    dodge: {
        value: 'dodge',
        label: '閃避',
        icon: '💨',
        unit: ''
    },

    apIncrease: {
        value: 'apIncrease',
        label: '法術增傷',
        icon: '💫',
        unit: '%'
    },
    lifeSteal: {
        value: 'lifeSteal',
        label: '吸血',
        icon: '🩸',
        unit: '%'
    }
};