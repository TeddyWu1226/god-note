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
     * @param monsterName 怪物名稱
     * @param amount 增加數量 (預設 1)
     */
    function recordKill(monsterName: string, amount: number = 1) {
        // 圖鑑解鎖
        const encyclopediaStore = useEncyclopediaStore();
        const name = monsterName.replace(/^【菁英】/, "")
        encyclopediaStore.unlockMonster(name);
        // 紀錄擊殺
        // if (monsterName.startsWith('【菁英】')) {
        //     currentKills.value['ELITE'] = (currentKills.value['ELITE'] || 0) + amount
        // }

        currentKills.value[name] = (currentKills.value[name] || 0) + amount
        currentKills.value['TOTAL'] = (currentKills.value['TOTAL'] || 0) + amount
        // 和平重新計算
        achievementsCount.value.peaceDay = 0
        // 武器分類計算
        const playerStore = usePlayerStore();
        if (playerStore.info.equips?.weapon) {
            const weaponName = playerStore.info.equips.weapon.name || '';
            if (isMatchedWeapon('SwordProficiency', weaponName)) {
                currentKills.value['USE_SWORD'] = (currentKills.value['USE_SWORD'] || 0) + amount;
            }
            if (isMatchedWeapon('KnifeBase', weaponName)) {
                currentKills.value['USE_KNIFE'] = (currentKills.value['USE_KNIFE'] || 0) + amount;
            }
            if (isMatchedWeapon('SpellProficiency', weaponName)) {
                currentKills.value['USE_SPELL'] = (currentKills.value['USE_SPELL'] || 0) + amount;
            }
        }
    }


    /**
     * 獲取特定目標的進度
     * @param monsterName 全部 TOTAL,菁英 ElITE
     */
    function getKillCount(monsterName: string = 'TOTAL'): number {
        return currentKills.value[monsterName] || 0
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
        init
    }
}, {
    persist: {
        key: 'tracker',
        storage: localStorage,
    }
})