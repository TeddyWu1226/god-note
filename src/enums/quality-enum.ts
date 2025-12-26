/**
 * 物品品質等級表
 */
export const QualityEnum = {
    Tattered: {value: 0, label: '破爛的', color: '#9E9E9E'}, // 灰色
    Common: {value: 1, label: '普通的', color: '#FFFFFF'}, // 白色
    Fine: {value: 2, label: '精良的', color: '#4CAF50'}, // 綠色
    Rare: {value: 3, label: '稀有的', color: '#2196F3'}, // 藍色
    Perfect: {value: 4, label: '完美的', color: '#9C27B0'}, // 紫色
    Unique: {value: 5, label: '獨特的', color: '#E91E63'}, // 玫紅色
    // 以下用抽的
    Mythic: {value: 6, label: '傳說的', color: '#FF9800'}, // 橙色
    Relic: {value: 7, label: '遠古的', color: '#FFEB3B'}, // 亮金色
    Divine: {value: 8, label: '史詩的', color: '#00BCD4'}, // 天藍色
    Supreme: {value: 9, label: '創世的', color: '#FF1100'}, // 亮紅色
    Celestial: {value: 10, label: '神的', color: '#00FFC3'}, // 螢光青 (極高亮度)

    // --- 詛咒的 (LV 11) ---
    Cursed: {
        value: 11,
        label: '詛咒的',
        color: '#390039', // 紫色的
    }
};
