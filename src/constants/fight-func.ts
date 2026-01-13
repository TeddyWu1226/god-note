// 常數定義
import {BattleOutcome, DamageResult, MonsterType, UnitType} from "@/types";
import {useFloatingMessage} from "@/components/Shared/FloatingMessage/useFloatingMessage";
import {useLogStore} from "@/store/log-store";
import {usePlayerStore} from "@/store/player-store";
import {getRandomItemByWeight} from "@/utils/create";
import {Monster} from "@/constants/monsters/monster-info";

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
    const BASE_HIT_RATE = 100;
    let hitRate = Math.max(0, BASE_HIT_RATE + attacker.hit - defender.dodge);
    if (Math.random() * MAX_RATE >= hitRate) return result;
    result.isHit = true;
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
 * @param monster 怪物原本的物件(用於更新血量)
 * @returns 包含戰鬥結果的 BattleOutcome 物件
 */
export function applyAttackDamage(attacker: UnitType, defender: UnitType, monster: MonsterType): BattleOutcome {
    const logStore = useLogStore();
    const playerStore = usePlayerStore();
    // 1. 執行傷害計算
    const damageOutput: DamageResult = calculateDamage(attacker, defender);

    const outcome: BattleOutcome = {
        ...damageOutput,
        isKilled: false,
        remainingHP: defender.hp,
    };

    if (!outcome.isHit) {
        // 未命中，不造成傷害，直接返回
        const log = `${defender.name || '防禦者'} 閃避了攻擊。`
        logStore.logger.add(log);
        return outcome;
    }

    // 2. 更新生命值
    const damageTaken = damageOutput.totalDamage
    if (defender.name === playerStore.info.name || defender.name === playerStore.info.name) {
        // 直接修改 Store 裡的原始數據 info.hp
        playerStore.info.hp = playerStore.info.hp - damageTaken;

        // 更新同步 (讓 defender 變數也拿到最新值用於回傳 outcome)
        defender.hp = playerStore.info.hp;
    } else {
        // 普通怪物的邏輯 (假設怪物是普通的 reactive 物件)
        monster.hp = Math.max(0, monster.hp - damageTaken);
    }

    // 3. 判斷是否擊敗
    if (defender.hp <= 0) {
        outcome.isKilled = true;
    }

    // 記錄剩餘生命值
    outcome.remainingHP = defender.hp;

    // 鞥生命回復
    if (outcome.healAmount) {
        if (attacker.name === monster.name) {
            monster.hp = Math.min(attacker.hpLimit, attacker.hp + outcome.healAmount);
        } else {
            playerStore.info.hp = Math.min(attacker.hpLimit, playerStore.info.hp + outcome.healAmount);
        }
    }

    // 輸出戰鬥日誌
    const logMessage = [
        `${attacker.name || '攻擊者'} 攻擊 ${defender.name || '防禦者'}，`,
        outcome.isCrit ? `💥 暴擊` : `命中`,
        `造成 ${damageTaken} 點傷害。`
    ].join('');

    logStore.logger.add(logMessage);

    return outcome;
}


/**
 * 執行技能傷害：對齊 calculateDamage 邏輯。
 * 計算順序：命中 -> 增幅 -> 暴擊 -> 固定防禦 -> 百分比減傷 -> 生命偷取
 */
export function applySkillDamage(
    attacker: UnitType,
    defender: UnitType,
    baseValue: number, // 技能的基礎倍率傷害 (例如 stats.ad * 0.7)
    type: 'ad' | 'ap' | 'true',
    skillName: string,
    extraCritRate: number = 0 // 技能額外提供的爆擊率
): BattleOutcome {
    const logStore = useLogStore();
    const playerStore = usePlayerStore();
    const MAX_RATE = 100;

    const outcome: BattleOutcome = {
        totalDamage: 0,
        baseDamage: 0,
        healAmount: 0,
        type: type,
        isHit: false,
        isCrit: false,
        isKilled: false,
        remainingHP: defender.hp,
        timestamp: Date.now(),
    };

    // --- 1. 命中判斷 (比照原邏輯) ---
    const BASE_HIT_RATE = 100;
    let hitRate = Math.max(0, BASE_HIT_RATE + (attacker.hit || 0) - (defender.dodge || 0));
    if (Math.random() * MAX_RATE >= hitRate) {
        logStore.logger.add(`${defender.name} 閃避了 【${skillName}】。`);
        return outcome;
    }
    outcome.isHit = true;
    if (!outcome.isHit) {
        return outcome;
    }

    // --- 2. 基礎傷害與傷害增幅 ---
    let damage = baseValue;
    const increaseAttr = type === 'ad' ? 'adIncrease' : (type === 'ap' ? 'apIncrease' : null);

    if (increaseAttr && attacker[increaseAttr]) {
        damage *= (1 + attacker[increaseAttr] / 100);
    }

    // --- 3. 暴擊判斷與增傷 (在防禦前套用) ---
    const totalCritRate = (attacker.critRate || 0) + extraCritRate;
    if (Math.random() * MAX_RATE < totalCritRate) {
        outcome.isCrit = true;
        // 使用 attacker.critIncrease 作為暴擊倍率
        damage *= ((attacker.critIncrease || 150) / 100);
    }
    outcome.baseDamage = damage;

    // --- 4. 防禦力減免與抗性 ---
    let finalDamage = damage;

    if (type === 'ad') {
        // 物理：扣除固定防禦
        finalDamage = Math.max(1, finalDamage - (defender.adDefend || 0));
    } else if (type === 'ap') {
        finalDamage = Math.max(1, finalDamage - (defender.apDefend || 0));
    }
    // true 類型直接跳過固定防禦

    // --- 5. 百分比減傷 (defendIncrease) ---
    if (type !== 'true' && defender.defendIncrease) {
        const reduction = Math.min(defender.defendIncrease, 95);
        finalDamage *= (1 - reduction / 100);
    }

    // --- 6. 取整與生命偷取 ---
    outcome.totalDamage = Math.floor(finalDamage);
    if (attacker.lifeSteal && outcome.totalDamage > 0) {
        outcome.healAmount = Math.floor(outcome.totalDamage * (attacker.lifeSteal / 100));
    }

    // --- 7. 更新生命值與 Store 同步 ---
    const isTargetPlayer = (defender.name === playerStore.info.name);

    // 扣除目標 HP
    if (isTargetPlayer) {
        playerStore.info.hp = Math.max(0, playerStore.info.hp - outcome.totalDamage);
        defender.hp = playerStore.info.hp;
    } else {
        defender.hp = Math.max(0, defender.hp - outcome.totalDamage);
    }

    // 處理生命偷取 (若有吸血，回復攻擊者 HP)
    if (outcome.healAmount > 0) {
        const isAttackerPlayer = (attacker.name === playerStore.info.name);
        if (isAttackerPlayer) {
            playerStore.info.hp = Math.min(playerStore.finalStats.hpLimit, playerStore.info.hp + outcome.healAmount);
        } else {
            attacker.hp = Math.min(attacker.hpLimit, attacker.hp + outcome.healAmount);
        }
    }

    if (defender.hp <= 0) outcome.isKilled = true;
    outcome.remainingHP = defender.hp;

    // --- 8. 輸出日誌 ---
    const typeNames = {ad: '物理', ap: '魔法', true: '真實'};
    const logMessage = [
        `${attacker.name} 施放 【${skillName}】，`,
        outcome.isCrit ? `💥 暴擊` : `命中`,
        `造成 ${outcome.totalDamage} 點${typeNames[type]}傷害。`,
        outcome.healAmount > 0 ? `(恢復 ${outcome.healAmount} 點生命)` : ''
    ].join('');
    logStore.logger.add(logMessage);

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
 * 返回一個在 (baseValue * 0.8) 到 (baseValue * 1.5) 之間隨機浮動後，
 * 再四捨五入取整數的值。
 * @param baseValue 基礎數值 (例如：攻擊力、價格等)。
 * @param minRate
 * @param maxRate
 * @returns 浮動後並四捨五入的整數值。
 */
export function applyRandomFloatAndRound(baseValue: number, minRate = 0.8, maxRate = 1.5): number {

    // 2. 隨機生成一個乘數 (Multiplier)
    // 範圍仍是 [0.8, 1.5) 之間的浮點數
    const randomMultiplier = Math.random() * (maxRate - minRate) + minRate;

    // 3. 計算結果 (仍為浮點數)
    const result = baseValue * randomMultiplier;

    // 4. 【關鍵步驟】使用 Math.round() 進行四捨五入取整
    return Math.round(result);
}


export function escapePercent(runner: UnitType, chasers: UnitType[]): number {
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

    // 閃避值加強
    let dodgeIncrease = (runner.dodge) * 0.2;

    // 最終計算的理論成功率
    let finalChance = BASE_CHANCE + levelModifier + chaseModifier + dodgeIncrease;

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
export function canEscape(runner: UnitType, chasers: UnitType[]): boolean {
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
    console.log('finalChance', finalChance)
    // 判斷是否成功逃跑
    return roll <= finalChance;
}


/**
 * 核心生成怪物函數
 * @param count 生成數量
 * @param weight 權重表
 * @param strengthening 強化倍率(1.0為基準)
 * @param eliteBoost 是否進行菁英強化
 *
 */
export const spawnMonsters = (
    count: number,
    weight: Record<string, number>,
    strengthening: number = 1,
    eliteBoost = false
): MonsterType[] => {
    const newMonsters: MonsterType[] = [];

    for (let i = 0; i < count; i++) {
        let m = getRandomItemByWeight(weight, Monster);
        // 基本階段強化
        m.hpLimit = Math.round(m.hpLimit * strengthening);
        m.hp = m.hpLimit;
        m.ad = Math.round(m.ad * strengthening);
        // m.adDefend = Math.round(m.adDefend * strengthening);
        if (eliteBoost) {
            // 菁英強化
            m.name = `【菁英】${m.name}`;
            m.class = 'elite';
            m.hpLimit = Math.round(m.hpLimit * 2);
            m.hp = m.hpLimit;
            m.ad = Math.round(m.ad * 1.5);
            m.adDefend = Math.round((m.adDefend + 2) * 1.3);
            m.apDefend = Math.round((m.apDefend + 2) * 1.3);
            m.dropGold = Math.round((m.dropGold || 10) * 3);
            m.level += 2;
            // 掉落必掉
            if (m.drop) {
                m.drop.forEach((item) => {
                    item.chance = 1
                })
            }
        }
        newMonsters.push(m);
    }
    return newMonsters
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
            // 避免修改到原始的靜態資料 (如 MATERIAL 內的定義)
            const newItem = JSON.parse(JSON.stringify(entry.item));
            loot.push(newItem);
        }
    });

    return loot;
}


interface Entity {
    hp: number;
    maxHp: number;
    // 紀錄哪些門檻已經被觸發過
    triggeredThresholds: Set<number>;
}


export const checkHpThresholds = (entity: Entity, thresholds = [75, 50, 25]) => {
    const hpPercent = (entity.hp / entity.maxHp) * 100;
    let isTrigger = false
    thresholds.forEach(threshold => {
        // 如果目前血量低於門檻，且該門檻尚未被觸發
        if (hpPercent <= threshold && !entity.triggeredThresholds.has(threshold)) {
            entity.triggeredThresholds.add(threshold); // 標記為已觸發
            isTrigger = true
        }
    });
    return isTrigger
};
