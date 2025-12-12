export enum operationStatusEnum {
	Default = 'Default',
	Skill = 'Skill',
	Package = 'Package',
	Choose = 'Choose'
}


export interface EnumItem {
	value: string | number;
	label: string;

	[key: string]: any; // 允許有其他任意屬性
}

export interface Enum {
	[key: string]: EnumItem;
}