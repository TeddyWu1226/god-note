import {Enum, EnumItem} from "../enums/enums";

/**
 * 根據輸入的 Role Value (數值) 查找對應的中文 Label (標籤)。
 * * @param value 要查找的角色數值 (e.g., 100)
 * @param Enum
 * @param value
 * @param defaultValue 如果找不到，回傳的預設值 (e.g., '未知角色')
 * @param col
 * @returns 找到的中文標籤字串 (e.g., '管理員')
 */
export function getEnumColumn<T extends Enum>(
	Enum: T,
	value: any,
	defaultValue: string = '未知',
	col: string = 'label' // 直接在這裡使用 keyof EnumItem 限制 col 的類型
): string | number {

	// 1. 取得列舉物件中的所有值
	// 我們將物件值斷言為 EnumItem[] 陣列
	const allItems: EnumItem[] = Object.values(Enum) as EnumItem[];

	// 2. 查找符合輸入 value 的物件
	// 這裡使用寬鬆的 '==' 處理數字與字串的比較
	const foundItem = allItems.find(item => item.value == value);

	// 3. 回傳結果
	if (foundItem && foundItem[col] !== undefined) {
		// 由於 T 包含任意屬性，回傳類型是 string | number 是最安全的。
		return foundItem[col];
	}

	// 4. 如果找不到或目標欄位不存在，回傳預設值
	return defaultValue;
}