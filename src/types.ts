/**
 * 物品相關
 */
export interface qualityType {
	ad?: number // 影響的攻擊力
}

export interface ItemType {
	name: string;
	description: string;
}

/**
 * 角色相關
 */
export interface UnitType {
	icon: string // 圖示
	name: string // 名稱
	// 有關輸出
	ad: number // 物理攻擊力
	critIncrease: number // 爆擊增傷(200%)
	critRate: number // 爆擊率(%)
	// 有關防禦
	adDefend: number // 物理防禦值
	// 有關是否命中
	dodge: number // 閃避值
	hit: number // 命中值
	// 有關身體素質
	hp: number; // 當前生命值
	hpLimit: number; //生命上限
	// 有關晉升
	level: number; //等級
}

/**
 * 玩家相關
 */
export interface UserType extends UnitType {
	sp: number; // 當前法力值
	spLimit: number; // 法力上限
	char: string; // 職業
	gold?: number // 持有金錢
}


/**
 * 怪物相關
 */
export interface MonsterType extends UnitType {
	description?: string //介紹
	drop?: ItemType[]
	dropGold?: number
}

/**
 * 房間/階層相關
 */

// 房間坐標系
export type RoomCoordinateTuple = [number, number];
// 階層房間組
export type TrapezoidData = number[][];

// Storge用
export interface FloorStorageType {
	currentStage: number; // 第幾階段
	currentRoom: RoomCoordinateTuple; // 當前階段的坐標系
	currentStageRooms: TrapezoidData; // 當前階段所有房間(19層)
}

export interface RoomWeights {
	[labelValue: number]: number;
}

/**
 * 戰鬥相關
 */
export interface DamageResult {
	totalDamage: number;  // 最終造成的傷害
	isHit: boolean;       // 是否命中
	isCrit: boolean;      // 是否暴擊
	baseDamage: number;   // 減防前的基礎傷害
}

export interface BattleOutcome extends DamageResult {
	isKilled: boolean;       // 被攻擊者是否被擊敗 (HP <= 0)
	remainingHP: number;     // 被攻擊者剩餘的 HP
}