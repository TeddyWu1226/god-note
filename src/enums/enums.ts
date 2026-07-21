/**
 * 定義遊戲的操作
 */

export enum operationStatusEnum {
    Default = 'Default',
    Skill = 'Skill'
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
    // 長駐事件
    Gamble = 'Gamble',    // 賭博
    Chest = 'Chest',    // 寶箱事件
    Potion = 'Potion', // 藥水事件
    BushSearch = 'BushSearch', // 草叢翻找事件


    // 單次完成事件
    UnknownGrave = 'UnknownGrave', // 不知名的墓
    None = 'None', // 幽靈事件
    GetFruit = 'GetFruit', 	// 魔樹事件
    DragonSkeleton = 'DragonSkeleton', // 龍之骸骨
    AncientWrath = 'AncientWrath', // 遠古的憤怒
    EndlessBetrayal = 'EndlessBetrayal', // 無盡的背叛
    EndBell = 'EndBell', // 末鐘響起
    LostAdventurer = 'LostAdventurer', // 迷路的冒險者
    SupplyTeam1 = 'SupplyTeam1', // 補給隊第一次相遇
    SupplyTeam2 = 'SupplyTeam2', // 補給隊第二次相遇
    SupplyTeam3 = 'SupplyTeam3', // 補給隊第三次相遇
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
    Weapon: {
        value: 'weapon',
        label: '武器',
        icon: '🗡️',
    },
    Head: {
        value: 'head',
        label: '頭部',
        icon: '😑',
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
        label: '物傷',
        icon: '⚔️',
        unit: ''
    },
    ap: {
        value: 'ap',
        label: '法傷',
        icon: '🔮',
        unit: ''
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
    adIncrease: {
        value: 'adIncrease',
        label: '(物)增傷',
        icon: '💪🏻',
        unit: '%'
    },
    apIncrease: {
        value: 'apIncrease',
        label: '(法)增傷',
        icon: '💫',
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
    hpRegen: {
        value: 'hpRegen',
        label: '生命回復',
        icon: '❤️‍🩹',
        unit: ''
    },
    spRegen: {
        value: 'spRegen',
        label: '法力回復',
        icon: '💜',
        unit: ''
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

    lifeSteal: {
        value: 'lifeSteal',
        label: '吸血',
        icon: '🩸',
        unit: '%'
    },
    actionValue: {
        value: 'actionValue',
        label: '行動值',
        icon: '⚡',
        unit: ''
    },
    shieldLimit: {
        value: 'shieldLimit',
        label: '護盾上限',
        icon: '🌐',
        unit: ''
    },
};