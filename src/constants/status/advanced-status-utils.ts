import {PlayerStoreType, StatusEffect} from "@/types";
import {UnitStatus} from "@/constants/status/unit-status";

/**
 * 寒冷堆疊邏輯
 * @param playerStore
 * @param stack 疊層數
 */
export const playerGetColdStackEffects = (playerStore: PlayerStoreType, stack = -3) => {
    const existing = playerStore.hasStatus(UnitStatus.Cold.name)
    if (existing) {
        // 更新效果
        existing.bonus.dodge += stack
        existing.bonus.hit += stack
        // 刷新回合
        existing.duration = 6
        const currentStack = existing.bonus.dodge;
        existing.icon = existing.icon.replace(/\d+/, Math.abs(currentStack).toString())
        let returnEffects: StatusEffect[] = [existing]
        if (currentStack < -30) {
            returnEffects.push(UnitStatus.Frostbite)
        }
        if (currentStack < -60) {
            returnEffects.push(UnitStatus.Frozen)
        }
        returnEffects.forEach(effect => {
            playerStore.addStatus(effect);
        })
    } else {
        playerStore.addStatus(UnitStatus.Cold);
    }
}