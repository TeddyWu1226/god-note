import {EquipmentPosition} from "@/enums/enums";
import {MonsterOnAttack} from "@/constants/monsters/monster-action/on-attack";
import {MonsterOnStart} from "@/constants/monsters/monster-action/on-start";
import {MonsterOnAttacked} from "@/constants/monsters/monster-action/on-attacked";
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {useLogStore} from "@/store/log-store";

/**
 * 物品相關
 */
export interface qualityType {
    ad?: number // 物理攻擊力
    critIncrease?: number // 爆擊增傷(200%)
    critRate?: number // 爆擊率(100%)
    // 有關防禦
    adDefend?: number // 物理防禦值
    // 有關是否命中
    dodge?: number // 閃避值
    hit?: number // 命中值
    // 有關身體素質
    hpLimit?: number; //生命上限
    spLimit?: number; // 法力上限
    // 特殊加成
    adIncrease?: number // 傷害增幅(%)
    apIncrease?: number // 法術增幅(%)
    defendIncrease?: number // 減傷(%)
    // 吸血
    lifeSteal?: number // 生命偷取(%)
}

// 用來動態顯示屬性名稱的字典 (可選，讓顯示更友善)
export const statLabels: Record<keyof qualityType | 'heal' | 'magic', string> = {
    ad: '攻擊',
    critRate: '暴擊率',
    critIncrease: '爆傷',
    adDefend: '防禦',
    dodge: '閃避值',
    hit: '命中值',
    hpLimit: '生命上限',
    spLimit: '法力上限',
    heal: '回復生命',
    magic: '回復法力',
    adIncrease: '物理增傷',
    apIncrease: '法術增傷',
    defendIncrease: '抗性',
    lifeSteal: '吸血'
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

export interface UsableType extends ItemType, qualityType {
    // 立即效果
    heal?: number // 回血
    magic?: number // 回魔
    skill?: string //使用的技能
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
    // 特殊加成
    adIncrease?: number // 傷害增幅(%)
    apIncrease?: number // 法術增幅(%)
    defendIncrease?: number // 減傷(%)
    runIncrease?: number // 額外逃跑值
    // 吸血
    lifeSteal?: number // 生命偷取(%)
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
    consumeItems?: (ItemType | UsableType)[] // 消耗品
    skills: string[] // 技能ID列
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
    status?: StatusEffect[]
    onStart?: MonsterOnStartType // 回合開始時觸發
    onAttack?: MonsterOnAttackType, // 怪物攻擊前觸發
    onAttacked?: MonsterOnAttackedType // 怪物被攻擊後觸發
    onDead?: any
    lastDamageResult?: BattleOutcome; // 新增：存放最後一次受傷資訊
}

/**
 * 房間/階層相關
 */

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
    healAmount: number;   // 生命回復量
}

export interface BattleOutcome extends DamageResult {
    isKilled: boolean;       // 被攻擊者是否被擊敗 (HP <= 0)
    remainingHP: number;     // 被攻擊者剩餘的 HP
    timestamp?: number;
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
    /** 每回合觸發的邏輯類型
     * damage:傷害
     * heal:治療
     * stuck:暈眩(做啥事都失敗)
     * scared: 只能按逃跑
     */
    type?: 'damage' | 'heal' | 'stuck' | 'scared';
    value?: number; // 每回合跳血/回血的數值
}

type GameStateStore = ReturnType<typeof useGameStateStore>;
type PlayerStore = ReturnType<typeof usePlayerStore>;
type logStore = ReturnType<typeof useLogStore>;

//
export interface MonsterActionParams {
    monster?: MonsterType;
    playerStore?: PlayerStore;
    gameStateStore?: GameStateStore
    logStore?: logStore;
    damage?: BattleOutcome; // onAttack 沒有傳這值
    targetElement?: HTMLElement
}

export interface MonsterOnAttackParams {
    monster?: MonsterType;
    monsterIndex?: number;
    playerStore?: PlayerStore;
    gameStateStore?: GameStateStore
    logStore?: logStore;
    damage?: BattleOutcome; // onAttack 沒有傳這值
    targetElement?: HTMLElement
}


// 物品使用觸發
export interface NoneMonsterItemSkillParams {
    playerStore?: PlayerStore;
    gameStateStore?: GameStateStore
    callback: (result: boolean) => void
    targetElement?: HTMLElement
}

export interface SpecifyMonsterItemSkillParams {
    monster?: MonsterType;
    monsterIndex?: number;
    playerStore?: PlayerStore;
    gameStateStore?: GameStateStore
    callback: (result: boolean) => void
    targetElement?: HTMLElement
}


/**
 * 成就
 */
export interface AchievementType {
    name: string;
    icon: string;
    quality: number; // 顏色用
    description: string;
    reward?: { item: string; amount: number; exp?: number };
    isUnlocked?: boolean; // 是否達成
    isHide: boolean; // 是否為隱藏成就
    hindHint?: string // 隱藏成就提示
}


/**
 * 技能
 */
export interface SkillParams {
    monster?: MonsterType;
    monsterIndex?: number;
    targetElement?: HTMLElement // 怪物的 html元素
    playerStore?: PlayerStore;
    gameStateStore?: GameStateStore
}

export interface SkillDescriptionParams {
    playerStore?: PlayerStore;
}

export interface SkillType {
    id: string;
    name: string;
    icon: string;
    description: (prop: SkillDescriptionParams) => string; // 敘述
    costSp?: number;
    costHp?: number;
    use: (prop: SkillParams) => Promise<boolean> | boolean; // 回傳技能是否施展成功
}

