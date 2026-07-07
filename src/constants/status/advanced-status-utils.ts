import {PlayerStoreType, StatusEffect} from "@/types";
import {UnitStatus} from "@/constants/status/unit-status";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {UsualStatus} from "@/constants/status/usual-status";
import {MonsterModel} from "@/models/monster-model";
import EvnStatus from "@/constants/status/evn-status";
import {SkillStatus} from "@/constants/status/skill-status";
import {Vanguard} from "@/constants/skill/learned-skill/axe_skills/axe_relation_skill";

/**
 * 寒冷堆疊邏輯
 * @param playerStore
 * @param stack 疊層數
 */
export const playerGetColdStackEffects = (playerStore: PlayerStoreType, stack = -2) => {
    const existing = playerStore.hasStatus(UnitStatus.Cold.name)
    if (existing) {
        // 更新效果
        existing.bonus.dodge += stack
        existing.bonus.hit += stack
        // 刷新回合
        existing.duration = 5
        const currentStack = existing.bonus.dodge;
        existing.icon = existing.icon.replace(/\d+/, Math.abs(currentStack).toString())
        existing.description = existing.description.replace(/\d+/, Math.abs(currentStack).toString())
        let returnEffects: StatusEffect[] = [existing]
        if (currentStack < -60) {
            returnEffects.push(UnitStatus.Frozen)
            useFullScreenEffect({
                message: '冰凍',
                color: '#6964f6',
                duration: 800
            });
        }
        returnEffects.forEach(effect => {
            playerStore.addStatus(effect);
        })
    } else {
        playerStore.addStatus(UnitStatus.Cold);
    }
}


/**
 * 檢查並套用「抵抗」狀態效果。若套用成功（傷害歸 0），返回 true。
 */
export function checkAndApplyResistance(
    defender: PlayerStoreType | MonsterModel,
): boolean {
    const resist = defender.hasStatus(UsualStatus.Resistance.name);
    if (resist && resist.value !== undefined && resist.value > 0) {
        // 更新數值
        resist.value -= 1;
        resist.icon = resist.icon.replace(/\d+/, Math.abs(resist.value).toString())
        resist.description = resist.description.replace(/\d+/, Math.abs(resist.value).toString())
        if (resist.value <= 0) {
            defender.removeStatus(UsualStatus.Resistance.name);
        }
        return true;
    }
    return false;
}

export const playerAdjustSanity = (playerStore: PlayerStoreType, amount: number) => {
    let existing = playerStore.hasStatus(EvnStatus.Sanity.name);
    if (!existing) {
        // 建立初始理智狀態，理智設為 0
        playerStore.addStatus({
            ...EvnStatus.Sanity,
            value: 0
        });
        existing = playerStore.hasStatus(EvnStatus.Sanity.name);
    }

    if (existing) {
        // 增減理智值
        existing.value = Math.max(-100, Math.min(100, (existing.value || 0) + amount));

        // 更新圖示與描述
        existing.icon = existing.icon.replace(/-?\d+/, existing.value.toString())

        // 檢查是否觸發亢奮或癲狂
        if (existing.value >= 50) {
            if (!playerStore.hasStatus(EvnStatus.HighSanity.name)) {
                playerStore.addStatus(EvnStatus.HighSanity);
            }
            playerStore.removeStatus(EvnStatus.LowSanity.name);
        } else if (existing.value <= -50) {
            if (!playerStore.hasStatus(EvnStatus.LowSanity.name)) {
                playerStore.addStatus(EvnStatus.LowSanity);
            }
            playerStore.removeStatus(EvnStatus.HighSanity.name);
        } else {
            playerStore.removeStatus(EvnStatus.HighSanity.name);
            playerStore.removeStatus(EvnStatus.LowSanity.name);
        }
    }
}


export const playerAddSavePower = (playerStore: PlayerStoreType, duration = 2) => {
    if (!!playerStore.hasSkill('Steady') || !!playerStore.hasSkill('Vanguard')) {
        playerStore.addStatus(
            SkillStatus.SavePower2,
            {duration: duration}
        )
    } else {
        playerStore.addStatus(
            SkillStatus.SavePower,
            {duration: duration}
        )
    }
}