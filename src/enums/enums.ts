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
	None = 'None',
	JobChange = 'JOB_CHANGE',
	Gamble = 'GAMBLE',
	AngelBlessing = 'ANGEL_BLESSING',
	DemonBlessing = 'DEMON_BLESSING',
	// ... 其他事件
}