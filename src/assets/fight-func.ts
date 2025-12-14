// 常數定義
import {BattleOutcome, DamageResult, UnitType} from "@/types";
import {useFloatingMessage} from "@/components/Shared/FloatingMessage/useFloatingMessage";

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

    // 1. 執行傷害計算
    const damageOutput: DamageResult = calculateDamage(attacker, defender);

    const outcome: BattleOutcome = {
        ...damageOutput,
        isKilled: false,
        remainingHP: defender.hp,
    };

    if (!outcome.isHit) {
        // 未命中，不造成傷害，直接返回
        console.log(`${defender.name || '防禦者'} 閃避了攻擊。`);
        return outcome;
    }

    // 2. 更新生命值 (核心邏輯)
    const damageTaken = outcome.totalDamage;
    const newHP = defender.hp - damageTaken;

    // 將被攻擊者的 HP 更新為新的值，確保 HP 不會低於 0
    defender.hp = Math.max(0, newHP);

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
        `造成 ${damageTaken} 點傷害。`,
        outcome.isKilled ? `💥 已擊敗!` : `剩餘 HP: ${outcome.remainingHP}/${defender.hpLimit}`
    ].join('');
    console.log(logMessage);

    return outcome;
}

// 範例：在造成傷害時使用
export function triggerDamageEffect(damageOutCome: BattleOutcome, targetElement?: HTMLElement) {
    let messageText = targetElement ? '受到了 ' : '你受到了'
    if (damageOutCome.isKilled) {
        messageText += `💀${damageOutCome.totalDamage}`
    } else if(damageOutCome.totalDamage === 0){
        messageText = '⚔️格檔⚔️'
    }
    else if (damageOutCome.isHit) {
        messageText += damageOutCome.isCrit ? `💥${damageOutCome.totalDamage}` : `${damageOutCome.totalDamage}`;
    }
    messageText += ' 傷害'
    useFloatingMessage(
        messageText,
        targetElement,
        {
            duration: 800, // 800ms 動畫
            color: damageOutCome.isCrit && !damageOutCome.isKilled ? '#FFD700' : '#E0E0E0', // 暴擊用金色
            messageClass: damageOutCome.isCrit ? 'crit-font' : '' // 額外的暴擊字體樣式
        }
    );
}