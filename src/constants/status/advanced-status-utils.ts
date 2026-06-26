import {PlayerStoreType, StatusEffect} from "@/types";
import {UnitStatus} from "@/constants/status/unit-status";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {UsualStatus} from "@/constants/status/usual-status";
import {MonsterModel} from "@/models/monster-model";

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
        existing.duration = 6
        const currentStack = existing.bonus.dodge;
        existing.icon = existing.icon.replace(/\d+/, Math.abs(currentStack).toString())
        existing.description = existing.description.replace(/\d+/, Math.abs(currentStack).toString())
        let returnEffects: StatusEffect[] = [existing]
        // if (currentStack < -30) {
        //     returnEffects.push(UnitStatus.Frostbite)
        //     useFullScreenEffect({
        //         message: '凍傷',
        //         color: '#64b5f6',
        //         duration: 800
        //     });
        // }
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