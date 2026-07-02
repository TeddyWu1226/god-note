import {EquipmentPosition} from "@/enums/enums";
import type {useGameStateStore} from "@/store/game-state-store";
import type {usePlayerStore} from "@/store/player-store";
import type {useLogStore} from "@/store/log-store";
import type {useTrackerStore} from "@/store/track-store";

import type {SkillModel} from "@/models/skill-model";
import type {MonsterModel} from "@/models/monster-model";

/**
 * 物品相關
 */
export interface qualityType {
    ad?: number // 物理攻擊力
    ap?: number // 魔法攻擊力/法傷
    heal?: number // 回復生命(一次性)
    magic?: number // 回復法力(一次性)
    critIncrease?: number // 爆擊增傷(200%)
    critRate?: number // 爆擊率(100%)
    // 有關防禦
    adDefend?: number // 物理防禦值
    apDefend?: number // 魔法防禦值
    // 有關是否命中
    dodge?: number // 閃避值
    hit?: number // 命中值
    // 有關身體素質
    hpLimit?: number; //生命上限
    hpRegen?: number; // 生命回復
    spLimit?: number; // 法力上限
    spRegen?: number; //法力回復
    // 特殊加成
    adIncrease?: number // 傷害增幅(%)
    apIncrease?: number // 法術增幅(%)
    defendIncrease?: number // 減傷(%)
    runIncrease?: number // 額外逃跑值
    // 吸血
    lifeSteal?: number // 生命偷取(%)
    actionValue?: number // 行動值
    shieldLimit?: number // 護盾上限
}

// 用來動態顯示屬性名稱的字典 (可選，讓顯示更友善)
export const statLabels: Record<keyof qualityType, string> = {
    ad: '物傷',
    ap: '法傷',
    critRate: '暴擊率',
    critIncrease: '爆傷',
    adDefend: '防禦',
    apDefend: '法防',
    dodge: '閃避值',
    hit: '命中值',
    hpLimit: '生命上限',
    hpRegen: '生命回復',
    spLimit: '法力上限',
    spRegen: '法力回復',
    heal: '回復生命',
    magic: '回復法力',
    adIncrease: '(物)增傷',
    apIncrease: '(法)增傷',
    defendIncrease: '抗性',
    lifeSteal: '吸血',
    runIncrease: '逃跑值',
    actionValue: '行動值',
    shieldLimit: '護盾',
};

export interface ItemType {
    name: string;
    description: string;
    icon: string;
    quality?: number
    usable?: boolean // 是否可使用
    unsellable?: boolean // 是否非賣品
    price?: number // 販售價格
}

export interface EquipmentType extends ItemType, qualityType {
    position: EquipmentPosition
    skill?: string
    isTwoHanded?: boolean
    enhanceLevel?: number
    baseStats?: Record<string, number>
    enhancements?: Record<string, number>
    id?: string // 唯一 ID
}

export interface UsableType extends ItemType, qualityType {
    // 立即效果
    heal?: number // 回血
    magic?: number // 回魔
    skill?: string //使用的技能
}

// 集合
export interface ItemStackType {
    item: ItemType;
    count: number
}

export interface UsableItemStackType {
    item: UsableType;
    count: number
}

/**
 * 角色相關
 */
export interface UnitType {
    icon: string // 圖示
    name: string // 名稱
    // 有關輸出
    ad: number // 物理攻擊力
    ap?: number // 魔法攻擊力/法傷
    hpRegen?: number // 生命回復
    spRegen?: number // 法力回復
    critIncrease: number // 爆擊增傷(200%)
    critRate: number // 爆擊率(%)
    // 有關防禦
    adDefend: number // 物理防禦值
    apDefend?: number // 魔法防禦值
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
    runIncrease?: number // 額外逃跑值 (每1點多1%)
    chaseIncrease?: number // 額外追擊值 (每1點降1%)
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
    shield?: number; // 當前護盾值
    shieldLimit?: number; // 護盾上限
    char: string; // 職業
    gold?: number // 持有金錢
    equips?: Equipment // 目前裝備
    items?: ItemStackType[]  // 雜項
    equipments?: EquipmentType[] // 裝備
    consumeItems?: UsableItemStackType[] // 消耗品
    skills: SkillModel[] // 技能實例或 ID 列表
    currentExp?: number
    statPoints?: number // 升級點數
    pendingSkillPoints?: number // 待分配的技能點數
    actionValue?: number
    offhandSkillCds?: Record<string, number> // 臨時/副手技能冷卻狀態
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
export interface MonsterType extends UnitType {
    id?: string // 唯一識別碼
    code: string // 代號
    description?: string //介紹
    class?: string // 卡片的特殊特效
    drop?: DropEntry[]
    dropGold?: number
    status?: StatusEffect[]
    noExp?: boolean // 不給予經驗
    lastDamageResult?: BattleOutcome; // 新增：存放最後一次受傷資訊
    tick?: Record<string, number | any[]> // 行動計數器
    triggerShake?: (time?: number) => void;
    shake?: (time?: number) => void;
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
    type: 'ad' | 'ap' | 'true' // 傷害類型
    isHit: boolean;       // 是否命中
    isCrit: boolean;      // 是否暴擊
    baseDamage: number;   // 減防前的基礎傷害
    healAmount: number;   // 生命回復量
}

export interface BattleOutcome extends DamageResult {
    isKilled: boolean;       // 被攻擊者是否被擊敗 (HP <= 0)
    timestamp?: number;
}

export interface BonusType extends qualityType {
}

export interface StatusEffect {
    name: string;        // 顯示名稱
    icon: string;        // 圖示
    duration: number;    // 剩餘回合數 (-1 代表永久)
    description: string;
    // 屬性加成 (正數為 Buff, 負數為 Debuff)
    bonus?: BonusType
    isBuff?: boolean // 是否為正向BUFF,不填都是負向
    untilAttack?: boolean; // 當擁有效果者攻擊時會移除本效果
    untilAttacked?: boolean; // 當擁有效果者被攻擊命中時會移除本效果
    /** 每回合觸發的邏輯類型
     * damage:傷害
     * heal:治療
     * stuck:暈眩(做啥事都失敗)
     * scared: 只能按逃跑
     */
    type?: 'damage' | 'heal' | 'stuck' | 'scared';
    value?: number; // 每回合跳血/回血的數值
    affectedByDefense?: boolean; // 是否受物理防禦力減免
}

export type GameStateStoreType = ReturnType<typeof useGameStateStore>;
export type PlayerStoreType = ReturnType<typeof usePlayerStore>;
export type LogStoreType = ReturnType<typeof useLogStore>;
export type TrackerStoreType = ReturnType<typeof useTrackerStore>;


export interface MonsterActionParams {
    playerStore?: PlayerStoreType;
    gameStateStore?: GameStateStoreType
    logStore?: LogStoreType;
}

export interface MonsterOnAttackParams {
    playerStore?: PlayerStoreType;
    gameStateStore?: GameStateStoreType
    logStore?: LogStoreType;
}

export interface MonsterOnAttackHitParams extends MonsterOnAttackParams {
    damage: BattleOutcome
}

export interface MonsterRoundBehaviorParams extends MonsterOnAttackParams {
    battleRound: number
}


export interface MonsterOnAttackedParams {
    playerStore?: PlayerStoreType;
    gameStateStore?: GameStateStoreType
    logStore?: LogStoreType;
    damage?: BattleOutcome; // onAttack 沒有傳這值
}

/**
 * 使用物品相關
 */

export interface NoneMonsterItemSkillParams {
    playerStore?: PlayerStoreType;
    gameStateStore?: GameStateStoreType;
    callback: (result: boolean) => void;
}

export interface SpecifyMonsterItemSkillParams extends NoneMonsterItemSkillParams {
    monster?: MonsterModel
}


/**
 * 技能
 */
export interface SkillParams {
    monster?: MonsterModel;
    playerStore?: PlayerStoreType;
    gameStateStore?: GameStateStoreType
}

export interface SkillOnStartParams {
    playerStore?: PlayerStoreType;
    gameStateStore?: GameStateStoreType;
    logStore?: LogStoreType;
}

export interface SkillOnPlayerAttackHitParams extends SkillParams {
    attackOutcome: BattleOutcome
}

export interface SkillOnPlayerAttackedHitParams extends SkillParams {
    logStore?: LogStoreType;
    attackedOutcome: BattleOutcome;
}


export interface SkillTreeNode {
    id: string;             // 技能 ID
    pathId: string;         // 所屬唯一流派 ID (同一流派只能有一個)
    tier: number;           // 技能階級 (Tier 1: 基礎, Tier 2: 進階, Tier 3: 大師)
    isStarter?: boolean;    // 是否為流派的起手技能 (Tier 1)
    evolvesFrom?: string[];  // 可從哪些前置技能進階而來 (學習時替換前置，任一即可)
    fusesFrom?: string[];    // 需要哪些技能融合而成 (學習時消耗全部原料，需全數滿足)
    checkEligible?: (playerStore: PlayerStoreType, trackerStore: TrackerStoreType) => boolean; // 額外的學習條件
}