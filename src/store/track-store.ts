import {defineStore} from 'pinia'
import {ref} from 'vue'
import {usePlayerStore} from "@/store/player-store";
import {useEncyclopediaStore} from "@/store/encyclopedia-store";
import {isMatchedWeapon} from "@/constants/default-const";

export const useTrackerStore = defineStore('tracker', () => {
    // --- State ---
    // 當階段數據紀錄
    const currentKills = ref<Record<string, number>>({})
    // 成就用紀錄
    const achievementsCount = ref({
        // 和平計算
        peaceDay: 0,
        gambleWin: 0,
        gambleLose: 0,
        withOutBless: 0
    })

    // --- Actions ---

    /**
     * 增加擊殺計數
     * @param monsterCode 怪物代碼
     * @param amount 增加數量 (預設 1)
     */
    function recordKill(monsterCode: string, amount: number = 1) {
        // 圖鑑解鎖
        const encyclopediaStore = useEncyclopediaStore();
        encyclopediaStore.unlockMonster(monsterCode);
        // 紀錄擊殺
        currentKills.value[monsterCode] = (currentKills.value[monsterCode] || 0) + amount
        currentKills.value['TOTAL'] = (currentKills.value['TOTAL'] || 0) + amount
        // 和平重新計算
        achievementsCount.value.peaceDay = 0
        // 武器分類計算
        const playerStore = usePlayerStore();
        if (playerStore.info.equips?.weapon) {
            const weaponName = playerStore.info.equips.weapon.name || '';
            if (isMatchedWeapon('Sword', weaponName)) {
                currentKills.value['Sword'] = (currentKills.value['Sword'] || 0) + amount;
            }
            if (isMatchedWeapon('Knife', weaponName)) {
                currentKills.value['Knife'] = (currentKills.value['Knife'] || 0) + amount;
            }
            if (isMatchedWeapon('Stick', weaponName)) {
                currentKills.value['Stick'] = (currentKills.value['Stick'] || 0) + amount;
            }
            if (isMatchedWeapon('Axe', weaponName)) {
                currentKills.value['Axe'] = (currentKills.value['Axe'] || 0) + amount;
            }
        }
    }


    /**
     * 獲取特定目標的進度
     * @param monsterCode 全部 TOTAL
     */
    function getKillCount(monsterCode: string = 'TOTAL'): number {
        return currentKills.value[monsterCode] || 0
    }

    /**
     * 檢查怪物是否被擊敗過
     * @param monsterCode
     */
    function isMonsterDefeated(monsterCode: string): boolean {
        return (currentKills.value[monsterCode] || 0) > 0
    }


    /**
     * 重置
     */
    function init() {
        Object.keys(achievementsCount.value).forEach(key => {
            achievementsCount.value[key] = 0
        })
        currentKills.value = {}
    }


    return {
        currentKills,
        achievementsCount,
        recordKill,
        getKillCount,
        isMonsterDefeated,
        init
    }
}, {
    persist: {
        key: 'tracker',
        storage: localStorage,
    }
})