// 常數定義
import {BattleOutcome, BonusType, DamageResult, PlayerStoreType, UnitType} from "@/types";
import {useFloatingMessage} from "@/components/Shared/FloatingMessage/useFloatingMessage";
import {useLogStore} from "@/store/log-store";
import {getRandomItemByWeight, notHitPlayer} from "@/utils/create";
import {Monster} from "@/constants/monsters/monster-info";
import {type MonsterModel, MonsterModel as MonsterClass} from "@/models/monster-model";
import {MonsterFactory} from "@/constants/monsters/monster-factory";
import {ItemStatus} from "@/constants/status/item-status";
import {UsualStatus} from "@/constants/status/usual-status";
import {checkAndApplyResistance} from "@/constants/status/advanced-status-utils";
import {WorldDefault} from "@/assets/const";
import EvnStatus from "@/constants/status/evn-status";
import {useGameStateStore} from "@/store/game-state-store";

const MAX_RATE = 100; // 命中率或暴擊率的最大值 (100%)

export function calculateDamage(attacker: UnitType, defender: UnitType): DamageResult {
    const result: DamageResult = {
        totalDamage: 0,
        type: 'ad',
        isHit: false,
        isCrit: false,
        baseDamage: 0,
        healAmount: 0
    };

    // --- 1. 命中判斷 ---
    result.isHit = calculateIsHit(attacker, defender)
    if (!result.isHit) {
        return result;
    }

    // --- 2. 暴擊判斷 ---
    if (Math.random() * MAX_RATE < attacker.critRate) {
        result.isCrit = true;
    }

    // --- 3. 基礎傷害與傷害增幅 ---
    let damage = attacker.ad;

    // 套用 adIncrease (物理傷害增幅 %)
    if (attacker.adIncrease) {
        damage *= (1 + attacker.adIncrease / 100);
    }

    // --- 4. 暴擊增傷應用 ---
    if (result.isCrit) {
        damage *= (attacker.critIncrease / 100);
    }
    result.baseDamage = damage;

    // --- 5. 防禦力減免與減傷比例 (New!) ---
    // 先扣除固定防禦力
    let finalDamage = Math.max(1, damage - defender.adDefend);

    // 套用 defendIncrease (百分比減傷 %)
    if (defender.defendIncrease) {
        // 確保減傷不會超過 100% 導致回血，通常上限設為 90-95%
        const reduction = Math.min(defender.defendIncrease, 95);
        finalDamage *= (1 - reduction / 100);
    }

    // --- 6. 最終傷害取整 ---
    result.totalDamage = Math.floor(finalDamage);

    // --- 7. 生命偷取 ---
    if (attacker.lifeSteal && attacker.lifeSteal > 0) {
        // 只有造成實際傷害才吸血
        result.healAmount = Math.floor(result.totalDamage * (attacker.lifeSteal / 100));
    }

    return result;
}


/**
 * 執行戰鬥：計算傷害，並直接更新被攻擊者的生命值 (HP)。
 *
 * @param attacker 攻擊者單元
 * @param defender 被攻擊者單元 (此物件的 HP 屬性將會被修改)
 * @returns 包含戰鬥結果的 BattleOutcome 物件
 */
export function applyAttackDamage(attacker: PlayerStoreType | MonsterClass, defender: PlayerStoreType | MonsterClass): BattleOutcome {
    const attackerFinalStats = attacker instanceof MonsterClass ? attacker?.getEffectiveStats() : attacker?.finalStats
    const defenderFinalStats = defender instanceof MonsterClass ? defender?.getEffectiveStats() : defender?.finalStats
    if (!attackerFinalStats || !defenderFinalStats) {
        return {
            totalDamage: 0,
            type: 'true',
            isHit: false,
            isCrit: false,
            baseDamage: 0,
            healAmount: 0,
            isKilled: false,
            timestamp: Date.now(),
        };
    }
    const logStore = useLogStore();
    // 1. 執行傷害計算
    const damageOutput: DamageResult = calculateDamage(attackerFinalStats, defenderFinalStats);

    const outcome: BattleOutcome = {
        ...damageOutput,
        isKilled: false,
        timestamp: Date.now(),
    };

    // 觸發攻擊時消失狀態 (untilAttack)
    attacker.handleUntilAttack();

    if (!outcome.isHit) {
        // 未命中，不造成傷害，直接返回
        const log = `${defenderFinalStats.name || '防禦者'} 閃避了攻擊。`
        if (!(defender instanceof MonsterClass)) {
            notHitPlayer()
        }
        logStore.logger.add(log);
        return outcome;
    }

    let damageTaken = damageOutput.totalDamage
    if (!(defender instanceof MonsterClass)) {
        // 額外效果-格檔檢查
        if (outcome.isCrit && !!defender.hasStatus(ItemStatus.Block.name)) {
            let blockMultiplier = 0.50;
            if (defender.hasSkill('BlockAdv')) {
                blockMultiplier = 0.10;
            } else if (defender.hasSkill('BlockPro')) {
                blockMultiplier = 0.25;
            } else if (defender.hasSkill('BlockBase')) {
                blockMultiplier = 0.25;
            }
            damageTaken = Math.round(damageTaken * blockMultiplier);
            (attacker as MonsterClass).status.push(UsualStatus.Stuck);
        }
    }
    // 檢查「抵抗」狀態效果
    if (checkAndApplyResistance(defender)) {
        damageTaken = 0;
        outcome.totalDamage = 0;
    }
    // todo: 待移除
    if (defender instanceof MonsterClass) {
        if (attacker.hasStatus(EvnStatus.HighSanity.name) && defender.hasStatus(EvnStatus.DaytimeEffect.name)) {
            damageTaken = Math.floor(damageTaken * 0.5);
        } else if (attacker.hasStatus(EvnStatus.LowSanity.name) && defender.hasStatus(EvnStatus.NighttimeEffect.name)) {
            damageTaken = Math.floor(damageTaken * 0.5);
        }
    } else {
        if (defender.hasStatus(EvnStatus.HighSanity.name) && attacker.hasStatus(EvnStatus.NighttimeEffect.name)) {
            damageTaken = Math.floor(damageTaken * 1.5);
        } else if (defender.hasStatus(EvnStatus.LowSanity.name) && attacker.hasStatus(EvnStatus.DaytimeEffect.name)) {
            damageTaken = Math.floor(damageTaken * 1.5);
        }
    }

    // 最終計算輸出
    outcome.totalDamage = damageTaken;
    // 當玩家受到傷害前最後根據技能檢查
    if (outcome.isHit) {
        if (!(defender instanceof MonsterClass)) {
            const gameStateStore = useGameStateStore();
            defender.info.skills.forEach((s: any) => {
                if (s && typeof s.onPlayerAttacked === 'function') {
                    s.onPlayerAttacked({
                        playerStore: defender,
                        gameStateStore,
                        logStore,
                        monster: attacker as MonsterModel,
                        attackedOutcome: outcome
                    });
                }
            });
        }
    }
    console.log('outcome', outcome)

    // 更新生命值
    if (defender instanceof MonsterClass) {
        // 普通怪物的邏輯
        // 因為有生命回復/吸血等情況 所以 要給他負數讓後續好計算
        defender.hp = defender.hp - outcome.totalDamage;
    } else {
        defender.takeDamage(outcome.totalDamage)
    }

    // 生命竊取
    if (outcome.healAmount) {
        if (attacker instanceof MonsterClass) {
            attacker.hp = Math.min(attackerFinalStats.hpLimit, attacker.hp + outcome.healAmount);
        } else {
            attacker.info.hp = Math.min(attackerFinalStats.hpLimit, attacker.info.hp + outcome.healAmount);
        }
    }

    // 判斷是否擊敗
    const defendHp = defender instanceof MonsterClass ? defender.hp : defender.info.hp
    if (defendHp <= 0) {
        outcome.isKilled = true;
    }


    // 輸出戰鬥日誌
    const logMessage = [
        `${attackerFinalStats.name || '攻擊者'} 攻擊 ${defenderFinalStats.name || '防禦者'}，`,
        outcome.isCrit ? `💥 暴擊` : `命中`,
        `造成 ${outcome.totalDamage} 點傷害。`
    ].join('');

    logStore.logger.add(logMessage);

    // 觸發受擊時消失狀態 (untilAttacked) 與玩家受擊技能 Hook (onPlayerAttacked)
    if (outcome.isHit) {
        defender.handleUntilAttacked();
    }

    return outcome;
}


export interface ApplySkillDamageParams {
    speller: PlayerStoreType | MonsterClass;
    target: PlayerStoreType | MonsterClass;
    baseValue: number;
    type: 'ad' | 'ap' | 'true';
    skillName?: string;
    sureHit?: boolean;
    canCrit?: boolean;
    canLifeSteal?: boolean;
    modifiers?: BonusType;
}

/**
 * 取得技能輸出傷害最後數值。
 */
export const getSkillFinalDamage = (
    {
        speller,
        baseValue,
        type,
        modifiers
    }: Omit<ApplySkillDamageParams, 'target'>
): {
    spellerStats: UnitType,
    damage: number
} => {
    const spellerFinalStats = speller instanceof MonsterClass ? speller.getEffectiveStats() : speller.finalStats
    const spellerStats = {
        ...spellerFinalStats,
        ...(modifiers || {})
    };
    // --- 基礎傷害與傷害增幅 ---
    let damage = baseValue || 0;
    const increaseAttr = type === 'ad' ? 'adIncrease' : (type === 'ap' ? 'apIncrease' : null);

    if (increaseAttr && spellerStats[increaseAttr]) {
        damage *= (1 + spellerStats[increaseAttr] / 100);
    }

    return {
        spellerStats,
        damage: Math.floor(damage),
    }
}

/**
 * 執行技能傷害：對齊 calculateDamage 邏輯。
 * 計算順序：命中 -> 增幅 -> 暴擊 -> 百分比減傷(敵人) -> 固定防禦 -> 生命偷取(特定)
 */
export function applySkillDamage({
                                     speller,
                                     target,
                                     baseValue,
                                     type,
                                     skillName = '',
                                     sureHit = false,
                                     canCrit = false,
                                     canLifeSteal = false,
                                     modifiers
                                 }: ApplySkillDamageParams): BattleOutcome {
    const logStore = useLogStore();
    const targetFinalStats = target instanceof MonsterClass ? target.getEffectiveStats() : target.finalStats
    let {spellerStats, damage} = getSkillFinalDamage({
        speller,
        baseValue,
        type,
        modifiers
    })
    const outcome: BattleOutcome = {
        totalDamage: 0,
        baseDamage: 0,
        healAmount: 0,
        type: type,
        isHit: false,
        isCrit: false,
        isKilled: false,
        timestamp: Date.now(),
    };

    const spellerName = (spellerStats.name || '未知單位');
    const targetName = (targetFinalStats.name || '未知單位');

    // --- 命中判斷 ---
    if (sureHit) {
        outcome.isHit = true;
    } else {
        const BASE_HIT_RATE = 100;
        let hitRate = Math.max(0, BASE_HIT_RATE + (spellerStats.hit || 0) - (targetFinalStats.dodge || 0));
        if (Math.random() * MAX_RATE >= hitRate) {
            if (skillName) {
                logStore.logger.add(`${targetName} 閃避了 【${skillName}】。`);
            } else {
                logStore.logger.add(`${targetName} 閃避了攻擊。`);
            }
            return outcome;
        }
        outcome.isHit = true;
    }

    // --- 暴擊判斷與增傷 (在防禦前套用) ---
    if (canCrit) {
        const totalCritRate = (spellerStats.critRate || 0);
        if (Math.random() * MAX_RATE < totalCritRate) {
            outcome.isCrit = true;
            damage *= ((spellerStats.critIncrease || WorldDefault.critIncrease) / 100);
        }
        outcome.baseDamage = damage;
    }
    // 施法者素質加成完畢計算
    let finalDamage = damage;

    // --- 抗性減傷 (defendIncrease) ---
    if (type !== 'true' && targetFinalStats.defendIncrease) {
        const reduction = Math.min(targetFinalStats.defendIncrease, 95);
        finalDamage *= (1 - reduction / 100);
    }

    // --- 防禦減免 true 類型直接跳過固定防禦---
    if (type === 'ad' || type === 'ap') {
        // 物理與魔法：皆扣除防禦值 (adDefend)
        finalDamage = Math.max(1, finalDamage - (targetFinalStats.adDefend || 0));
    }

    outcome.totalDamage = Math.floor(finalDamage);

    // --- 檢查「抵抗」狀態效果 ---
    if (checkAndApplyResistance(target)) {
        outcome.totalDamage = 0;
    }
    // todo: 待移除
    if (target instanceof MonsterClass) {
        if (speller.hasStatus(EvnStatus.HighSanity.name) && target.hasStatus(EvnStatus.DaytimeEffect.name)) {
            outcome.totalDamage = Math.floor(outcome.totalDamage * 0.5);
        } else if (speller.hasStatus(EvnStatus.LowSanity.name) && target.hasStatus(EvnStatus.NighttimeEffect.name)) {
            outcome.totalDamage = Math.floor(outcome.totalDamage * 0.5);
        }
    } else {
        if (target.hasStatus(EvnStatus.HighSanity.name) && speller.hasStatus(EvnStatus.NighttimeEffect.name)) {
            outcome.totalDamage = Math.floor(outcome.totalDamage * 1.5);
        } else if (target.hasStatus(EvnStatus.LowSanity.name) && speller.hasStatus(EvnStatus.DaytimeEffect.name)) {
            outcome.totalDamage = Math.floor(outcome.totalDamage * 1.5);
        }
    }

    // 當玩家受到傷害前最後根據技能檢查 玩家受擊技能 Hook (onPlayerAttacked)
    if (outcome.isHit) {
        if (!(target instanceof MonsterClass)) {
            const gameStateStore = useGameStateStore();
            target.info.skills.forEach((s: any) => {
                if (s && typeof s.onPlayerAttacked === 'function') {
                    s.onPlayerAttacked({
                        monster: speller,
                        playerStore: target,
                        gameStateStore,
                        logStore,
                        attackedOutcome: outcome
                    });
                }
            });
        }
    }

    // --- 扣除目標 HP ---
    if (target instanceof MonsterClass) {
        // 普通怪物的邏輯
        target.hp = Math.max(0, target.hp - outcome.totalDamage);
    } else {
        target.takeDamage(outcome.totalDamage)
    }

    // --- 生命竊取 ---
    if (canLifeSteal) {
        if (outcome.healAmount) {
            if (speller instanceof MonsterClass) {
                speller.hp = Math.min(spellerStats.hpLimit, speller.hp + outcome.healAmount);
            } else {
                speller.info.hp = Math.min(spellerStats.hpLimit, speller.info.hp + outcome.healAmount);
            }
        }
    }

    // 判斷是否擊敗
    const defendHp = target instanceof MonsterClass ? target.hp : target.info.hp
    if (defendHp <= 0) {
        outcome.isKilled = true;
    }

    // --- 輸出日誌 ---
    const typeNames = {ad: '物理', ap: '魔法', true: '真實'};
    let logMessage: string;
    if (skillName) {
        logMessage = [
            `${spellerName} 施放 【${skillName}】，`,
            outcome.isCrit ? `💥 暴擊` : `命中`,
            `造成${targetName} ${outcome.totalDamage} 點${typeNames[type]}傷害。`,
            outcome.healAmount > 0 ? `(恢復 ${outcome.healAmount} 點生命)` : ''
        ].join('');
    } else {
        logMessage = `${targetName} 受到 ${outcome.totalDamage} 點${typeNames[type]}傷害。${outcome.isCrit ? ' (💥 暴擊)' : ''}`;
    }
    logStore.logger.add(logMessage);

    // 觸發施放者攻擊時消失狀態 (untilAttack)
    speller.handleUntilAttack();

    // 觸發目標受擊時消失狀態 (untilAttacked)
    if (outcome.isHit) {
        target.handleUntilAttacked();
    }

    return outcome;
}

/**
 * 根據戰鬥結果 (BattleOutcome) 觸發傷害浮動訊息。
 *
 * @param damageOutCome 戰鬥結算物件，包含傷害、是否暴擊/死亡等資訊。
 * @param targetElement 顯示浮動訊息的目標 HTML 元素 (可選)。
 */
export function triggerDamageEffect(damageOutCome: BattleOutcome, targetElement?: HTMLElement) {

    // --- 1. 定義基礎變數 ---
    const isPlayer = !targetElement; // 判斷是否為玩家自身
    const prefixText = '-'

    let messageText: string;
    let messageColor = '#E0E0E0'; // 預設顏色

    // --- 2. 根據結果決定訊息和樣式 ---

    if (damageOutCome.isKilled) {
        // 💀 死亡：顯示總傷害並加上死亡符號
        messageText = `${prefixText} 💀${damageOutCome.totalDamage}`;

    } else if (damageOutCome.isHit) {
        // 命中，且總傷害 > 0
        if (damageOutCome.totalDamage < damageOutCome.baseDamage * 0.5) {
            // 大幅減傷
            messageText = `${prefixText} ⛊${damageOutCome.totalDamage}`;
            messageColor = '#74747c'; // 灰色
        } else if (damageOutCome.isCrit) {
            // 爆擊
            messageText = `${prefixText} 💥${damageOutCome.totalDamage}`;
            messageColor = '#ff0000'; // 金色
        } else {
            // 普通命中
            messageText = `${prefixText} ${damageOutCome.totalDamage}`;
        }
        if (damageOutCome.type === 'ap') {
            messageColor = '#9370DB';
        }
    } else {
        // 處理未命中 (例如：Miss) 或其他未捕捉到的狀態
        messageText = isPlayer ? '閃避' : 'MISS';
        messageColor = '#83d1ea'; // 淺藍色
    }

    // --- 3. 觸發浮動訊息 ---
    useFloatingMessage(
        messageText,
        targetElement,
        {
            duration: 800, // 動畫時間保持不變
            color: messageColor
        }
    );
}

/**
 * 輸入一個基礎數值 (baseValue)，
 * 返回一個在 (baseValue * 0.8) 到 (baseValue * 1.2) 之間隨機浮動後，
 * 再四捨五入取整數的值。
 * @param baseValue 基礎數值 (例如：攻擊力、價格等)。
 * @param minRate
 * @param maxRate
 * @returns 浮動後並四捨五入的整數值。
 */
export function applyRandomFloatAndRound(baseValue: number, minRate = 0.8, maxRate = 1.2): number {

    // 2. 隨機生成一個乘數 (Multiplier)
    // 範圍仍是 [0.8, 1.5) 之間的浮點數
    const randomMultiplier = Math.random() * (maxRate - minRate) + minRate;

    // 3. 計算結果 (仍為浮點數)
    const result = baseValue * randomMultiplier;

    // 4. 【關鍵步驟】使用 Math.round() 進行四捨五入取整
    return Math.round(result);
}


export function escapePercent(runner: UnitType, chasers: MonsterClass[]): number {
    // 確保追擊方陣列非空
    if (!chasers || chasers.length === 0) {
        return 100;
    }

    // --- 參數設定 ---
    const BASE_CHANCE = 25; // 基礎成功率
    const MAX_CHANCE = 100;  // 最高成功率
    const MIN_CHANCE = 0;   // 最低成功率 0%
    const LEVEL_WEIGHT = 5; // 每 1 級差距影響 5% 的機率


    // --- 核心計算 ---

    //  計算追擊方總和等級
    const totalChaserLevel = chasers.reduce((sum, chaser) => sum + chaser.level, 0);
    //  等級差異
    const levelDifference = runner.level - totalChaserLevel;
    //  等級修正值
    const levelModifier = levelDifference * LEVEL_WEIGHT;

    //  計算追擊方總和追擊值
    const totalChaserChasing = chasers.reduce((sum, chaser) => sum + (chaser.chaseIncrease ?? 0), 0);
    // 額外 追擊/逃跑值補正(每點 1%)
    const chaseModifier = (runner.runIncrease || 0) - totalChaserChasing;

    // 最終計算的理論成功率
    let finalChance = BASE_CHANCE + levelModifier + chaseModifier;

    // 套用最大/最小機率限制
    finalChance = Math.max(MIN_CHANCE, Math.min(MAX_CHANCE, Math.round((finalChance) * 100) / 100));

    return finalChance
}


/**
 * 僅依據等級比較，計算逃跑成功率並判斷是否成功逃跑。
 * 追擊方為 UnitType 陣列，取平均等級作為追擊難度。
 * @param runner 逃跑方 (嘗試逃離的單位)
 * @param chasers 追擊方陣列 (嘗試阻止逃跑的單位，敵人陣列)
 * @returns boolean - true 表示逃跑成功
 */
export function canEscape(runner: UnitType, chasers: MonsterClass[]): boolean {
    // 確保追擊方陣列非空
    if (!chasers || chasers.length === 0) {
        console.warn("追擊方陣列為空，逃跑自動成功。");
        return true;
    }
    // 計算成功率
    const finalChance = escapePercent(runner, chasers)
    // --- 隨機判定 ---

    // 生成一個 0 到 100 之間的隨機數
    const roll = Math.random() * 100;
    // 判斷是否成功逃跑
    return roll <= finalChance;
}


/**
 * 核心生成怪物函數
 * @param count 生成數量
 * @param weight 權重表
 * @param strengthening 強化等級
 * @param eliteBoost 是否進行菁英強化
 *
 */
export const spawnMonsters = (
    count: number,
    weight: Record<string, number>,
    strengthening: number = 0,
    eliteBoost = false
): MonsterClass[] => {
    const newMonsters: MonsterClass[] = [];
    let strengtheningLevel = strengthening
    for (let i = 0; i < count; i++) {
        let m = getRandomItemByWeight(weight, Monster);
        let monsterInstance = MonsterFactory.createMonster(m.code, m);
        if (eliteBoost) {
            // 菁英強化
            monsterInstance.name = `【菁英】${monsterInstance.name}`;
            if (!monsterInstance.class?.includes('elite')) {
                if (monsterInstance.class) {
                    monsterInstance.class.push('elite');
                } else {
                    monsterInstance.class = ['elite'];
                }
            }
            strengtheningLevel += 2
        }
        // 基本階段強化
        if (strengtheningLevel) {
            monsterInstance.level += strengtheningLevel
            // 每多一等
            // 多 15% 血量
            monsterInstance.hpLimit = Math.round(monsterInstance.hpLimit * (1 + 0.15 * strengthening));
            monsterInstance.hp = monsterInstance.hpLimit;
            // 多 20% 輸出
            monsterInstance.ad = Math.round(monsterInstance.ad * (1 + 0.2 * strengthening));
            // 多 防禦
            monsterInstance.adDefend += strengtheningLevel
            // 多掉落金幣
            monsterInstance.dropGold = monsterInstance.dropGold * (1 + 0.15 * strengthening);
        }
        newMonsters.push(monsterInstance);
    }
    return newMonsters;
}


/**
 * 根據掉落表判定最終獲得的道具
 * @param dropTable 怪物或事件的掉落配置
 * @returns 判定成功的道具陣列
 */
export const getLootFromTable = (dropTable: { item: any, chance: number }[]): any[] => {
    const loot: any[] = [];

    if (!dropTable || dropTable.length === 0) return loot;

    dropTable.forEach(entry => {
        // 生成 0.0 到 1.0 之間的隨機數
        const roll = Math.random();

        // 如果隨機數小於等於機率，代表獲得該道具
        if (roll <= entry.chance) {
            // 使用深拷貝 (Deep Copy) 確保獲得的是獨立的實例
            const newItem = JSON.parse(JSON.stringify(entry.item));
            loot.push(newItem);
        }
    });

    return loot;
}

/**
 * 計算是否命中
 * @param attacker 施放者
 * @param defender 承受者
 * @returns boolean 是否命中
 */
export function calculateIsHit(attacker: UnitType, defender: UnitType): boolean {
    const BASE_HIT_RATE = 100;
    let hitRate = Math.max(0, BASE_HIT_RATE + attacker.hit - defender.dodge);
    // console.log('命中率', hitRate)
    return Math.random() * MAX_RATE < hitRate
}