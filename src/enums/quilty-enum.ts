/**
 * 物品品質等級表
 */
export const QualityEnum = {
    Tattered: {
        value: 0,
        label: '破舊的',
        color: '#9E9E9E', // 灰色
    },
    Common: {
        value: 1,
        label: '普通的',
        color: '#FFFFFF', // 白色
    },
    Fine: {
        value: 2,
        label: '精良的',
        color: '#2196F3', // 藍色 (或可用 #4CAF50 綠色)
    },
    Epic: {
        value: 3,
        label: '傳奇的',
        color: '#9C27B0', // 紫色
    },
    Mythic: {
        value: 4,
        label: '傳說的',
        color: '#FF9800', // 橙色/金色
    },
    Cursed: {
        value: 5,
        label: '詛咒的',
        color: '#B71C1C', // 深紅色
    }
};
