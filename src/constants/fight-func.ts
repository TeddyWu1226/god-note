// 常數定義
import {BattleOutcome, DamageResult, UnitType} from "@/types";
import {useFloatingMessage} from "@/components/Shared/FloatingMessage/useFloatingMessage";
import {useLogStore} from "@/store/log-store";
import {usePlayerStore} from "@/store/player-store";

const MAX_RATE = 100; // 命中率或暴擊率的最大值 (100%)

/**
 * 根據攻擊者和被攻擊者的屬性計算傷害。
 * * 戰鬥公式概覽:
 * 1. 命中率 = 攻擊者.hit - 被攻擊者.dodge + 50 (保證基礎命中，可根據遊戲需求調整)
 * 2. 最終傷害 = MAX(0, 攻擊者.ad - 被攻擊者.adDefend) * (1 + 暴擊增傷)
 *
 * @param attacker 攻擊者單元 (UnitType)
 * @param defender 被攻擊者單元 (UnitType)
 * @returns 包含傷害結果的 DamageResult 物件
 */
export function calculateDamage(attacker: UnitType, defender: UnitType): DamageResult {

    const result: DamageResult = {
        totalDamage: 0,
        isHit: false,
        isCrit: false,
        baseDamage: 0
    };

    // --- 1. 命中判斷 (Hit Check) ---

    // 基礎命中率 (可以根據遊戲機制調整，這裡設為 75% 為基礎)
    const BASE_HIT_RATE = 100;

    // 命中率計算：基礎 + 攻擊者命中值 - 被攻擊者閃避值
    let hitRate = BASE_HIT_RATE + attacker.hit - defender.dodge;
    hitRate = Math.max(0, hitRate);

    // 隨機數 (0 到 100)
    const randomHitRoll = Math.random() * MAX_RATE;

    if (randomHitRoll < hitRate) {
        result.isHit = true;
    } else {
        // 未命中，直接返回
        return result;
    }


    // --- 2. 暴擊判斷 (Critical Hit Check) ---

    // 暴擊率是攻擊者 critRate，通常在 0 到 100 之間
    const critRate = attacker.critRate;
    const randomCritRoll = Math.random() * MAX_RATE;
    if (randomCritRoll < critRate) {
        result.isCrit = true;
    }

    // --- 3. 暴擊增傷應用 (Apply Crit Increase) ---
    let damage = attacker.ad
    if (result.isCrit) {
        // 暴擊增傷倍率：通常 critIncrease 單位是倍數 (ex:150=150%)
        damage *= (attacker.critIncrease / 100);
    }
    // 記錄減防後的基礎傷害
    result.baseDamage = damage;
    // --- 4. 基礎傷害計算 (Base Damage Calculation) ---
    // 物理攻擊減去物理防禦，確保傷害不會低於 0
    // 傷害公式：D = MAX(1, 攻擊力 - 防禦值)
    let totalDamage = Math.max(1, damage - defender.adDefend);


    // --- 5. 最終處理與返回 ---

    // 最終傷害取整
    result.totalDamage = Math.floor(totalDamage);

    return result;
}

/**
 * 執行戰鬥：計算傷害，並直接更新被攻擊者的生命值 (HP)。
 *
 * @param attacker 攻擊者單元
 * @param defender 被攻擊者單元 (此物件的 HP 屬性將會被修改)
 * @returns 包含戰鬥結果的 BattleOutcome 物件
 */
export function applyDamage(attacker: UnitType, defender: UnitType): BattleOutcome {
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
        console.log(log);
        logStore.logger.add(log);
        return outcome;
    }

    // 2. 更新生命值 (核心邏輯)
    const damageTaken = damageOutput.totalDamage
    if (defender.name === playerStore.info.name || defender.name === playerStore.info.name) {
        // 直接修改 Store 裡的原始數據 info.hp
        const newHP = playerStore.info.hp - damageTaken;
        playerStore.info.hp = Math.max(0, newHP);

        // 更新同步 (讓 defender 變數也拿到最新值用於回傳 outcome)
        defender.hp = playerStore.info.hp;
    } else {
        // 普通怪物的邏輯 (假設怪物是普通的 reactive 物件)
        defender.hp = Math.max(0, defender.hp - damageTaken);
    }

    // 3. 判斷是否擊敗
    if (defender.hp <= 0) {
        outcome.isKilled = true;
    }

    // 4. 記錄剩餘生命值
    outcome.remainingHP = defender.hp;

    // 輸出戰鬥日誌 (可選)
    const logMessage = [
        `${attacker.name || '攻擊者'} 攻擊 ${defender.name || '防禦者'}，`,
        outcome.isCrit ? `🔥 暴擊` : `命中`,
        `造成 ${damageTaken} 點傷害。`
    ].join('');
    console.log(logMessage);

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
    const prefixText = isPlayer ? '你受到了' : '受到了';

    let messageText = '';
    let messageColor = '#E0E0E0'; // 預設顏色
    // --- 2. 核心邏輯：根據結果決定訊息和樣式 ---

    if (damageOutCome.isKilled) {
        // 💀 死亡：顯示總傷害並加上死亡符號
        messageText = `${prefixText} 💀${damageOutCome.totalDamage} 傷害`;

    } else if (damageOutCome.totalDamage === 0 && damageOutCome.isHit === true) {
        // 🛡️ 完全格檔或閃避：無傷害
        messageText = '🛡️格檔🛡️';
        messageColor = '#B0C4DE'; // 淺藍色，強調防禦

    } else if (damageOutCome.isHit) {
        // 命中，且總傷害 > 0

        if (damageOutCome.isCrit) {
            // 💥 暴擊：使用金色和暴擊樣式
            messageText = `${prefixText} 💥${damageOutCome.totalDamage} 傷害`;
            messageColor = '#ff0000'; // 金色
        } else {
            // 普通命中
            messageText = `${prefixText} ${damageOutCome.totalDamage} 傷害`;
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

    // --- 參數設定 ---

    const BASE_CHANCE = 20; // 20% 基礎成功率 (居中值)
    const LEVEL_WEIGHT = 3; // 每 1 級差距影響 3% 的機率
    const MAX_CHANCE = 95;  // 最高成功率 95%
    const MIN_CHANCE = 0;   // 最低成功率 0%

    // --- 核心計算 ---

    // 1. 計算追擊方平均等級
    const totalChaserLevel = chasers.reduce((sum, chaser) => sum + chaser.level, 0);
    const averageChaserLevel = totalChaserLevel / chasers.length;

    // 2. 等級差異
    const levelDifference = runner.level - averageChaserLevel;

    // 3. 等級修正值
    const levelModifier = levelDifference * LEVEL_WEIGHT;

    // 4. 最終計算的理論成功率
    let finalChance = BASE_CHANCE + levelModifier;

    // 5. 套用最大/最小機率限制
    finalChance = Math.max(MIN_CHANCE, Math.min(MAX_CHANCE, finalChance));

    // --- 隨機判定 ---

    // 生成一個 0 到 100 之間的隨機數
    const roll = Math.random() * 100;

    // 判斷是否成功逃跑
    const success = roll < finalChance;

    // [可選] 輸出計算過程供除錯
    console.log(`--- 逃跑判定 (僅等級) ---`);
    console.log(`逃跑方等級: ${runner.level}`);
    console.log(`追擊方數量: ${chasers.length}`);
    console.log(`追擊方平均等級: ${averageChaserLevel.toFixed(2)}`);
    console.log(`等級差: ${levelDifference.toFixed(2)}`);
    console.log(`等級修正: ${levelModifier.toFixed(2)}%`);
    console.log(`最終成功率: ${finalChance.toFixed(2)}%`);
    console.log(`隨機擲骰 (Roll): ${roll.toFixed(2)}`);
    console.log(`結果: ${success ? '✅ 成功逃跑' : '❌ 逃跑失敗'}`);

    return success;
}