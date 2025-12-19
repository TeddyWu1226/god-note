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
    Gamble = 'GAMBLE',
    // // 轉職
    // JobChange = 'JOB_CHANGE',
    // // 天使祝福
    // AngelBlessing = 'ANGEL_BLESSING',
    // // 惡魔祝福
    // DemonBlessing = 'DEMON_BLESSING',
}

/**
 * 裝備位置
 */
export enum EquipmentPosition {
    HEAD = 'head',
    BODY = 'body',
    WEAPON = 'weapon',
    OFFHAND = 'offhand',
    ACCESSORIES = 'accessories',
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