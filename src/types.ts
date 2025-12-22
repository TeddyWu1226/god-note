import {EquipmentPosition} from "@/enums/enums";
import {MonsterOnAttack} from "@/constants/monster-action/on-attack";
import {MonsterOnStart} from "@/constants/monster-action/on-start";
import {MonsterOnAttacked} from "@/constants/monster-action/on-attacked";

/**
 * 物品相關
 */
export interface qualityType {
    ad?: number // 物理攻擊力
    critIncrease?: number // 爆擊增傷(200%)
    critRate?: number // 爆擊率(%)
    // 有關防禦
    adDefend?: number // 物理防禦值
    // 有關是否命中
    dodge?: number // 閃避值
    hit?: number // 命中值
    // 有關身體素質
    hpLimit?: number; //生命上限
    spLimit?: number; // 法力上限

}

// 用來動態顯示屬性名稱的字典 (可選，讓顯示更友善)
export const statLabels: Record<string, string> = {
    ad: '攻擊',
    critRate: '暴擊率',
    critIncrease: '爆傷',
    adDefend: '防禦',
    dodge: '閃避值',
    hit: '命中值',
    hpLimit: '生命上限',
    spLimit: '法力上限',
    heal: '回復生命',
    magic: '回復法力'
};

export interface ItemType {
    name: string;
    description: string;
    icon: string;
    quality?: number
    usable?: boolean // 是否可使用
}

export interface EquipmentType extends ItemType, qualityType {
    position: EquipmentPosition,
}

export interface PotionType extends ItemType, qualityType {
    // 立即效果
    heal?: number // 回血
    magic?: number // 回魔
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
export interface Equipment {
    head?: EquipmentType
    body?: EquipmentType
    weapon?: EquipmentType
    offhand?: EquipmentType
    accessory1?: EquipmentType
    accessory2?: EquipmentType
}


export interface UserType extends UnitType {
    sp: number; // 當前法力值
    spLimit: number; // 法力上限
    char: string; // 職業
    gold?: number // 持有金錢
    equips?: Equipment // 目前裝備
    items?: ItemType[]  // 雜項
    equipments?: EquipmentType[] // 裝備
    consumeItems?: (ItemType | PotionType)[] // 消耗品
}


/**
 * 掉落項目的封裝
 * T 繼承自 ItemType，這允許我們傳入 PotionType 或 EquipmentType
 */
export interface DropEntry<T extends ItemType = ItemType> {
    item: T;
    chance: number; // 0.0 ~ 1.0
}

/**
 * 怪物相關
 */
type MonsterOnAttackType = keyof typeof MonsterOnAttack;
type MonsterOnStartType = keyof typeof MonsterOnStart;
type MonsterOnAttackedType = keyof typeof MonsterOnAttacked;

export interface MonsterType extends UnitType {
    description?: string //介紹
    class?: string // 卡片的特殊特效
    drop?: DropEntry[]
    dropGold?: number
    onStart?: MonsterOnStartType
    onAttack?: MonsterOnAttackType,
    onAttacked?: MonsterOnAttackedType
    onDead?: any
}

/**
 * 房間/階層相關
 */

// 房間坐標系
export type RoomCoordinateTuple = [number, number];
// 階層房間組
export type TrapezoidData = number[][];


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

export interface BonusType extends qualityType {
    hpChange?: number; // 生命異動
}

export interface StatusEffect {
    name: string;        // 顯示名稱
    icon: string;        // 圖示
    duration: number;    // 剩餘回合數 (-1 代表永久)
    description: string;
    // 屬性加成 (正數為 Buff, 負數為 Debuff)
    bonus?: BonusType
    isBuff?: boolean // 是否為正向BUFF,不填都是負向
    // 每回合觸發的邏輯類型
    type?: 'damage' | 'heal';
    value?: number; // 每回合跳血/回血的數值
}


// 定義參數型別，未來如果要增加 LogStore 也可以直接加在這裡
export interface MonsterActionParams {
    monster?: MonsterType;
    playerStore?: any;
    gameStateStore?: any
    logStore?: any;
    damage?: BattleOutcome;
    targetElement?: HTMLElement
}