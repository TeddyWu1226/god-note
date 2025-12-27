import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useTrackerStore = defineStore('tracker', () => {
    // --- State ---
    // 當階段數據紀錄
    const currentKills = ref<Record<string, number>>({})
    const totalKills = ref<Record<string, number>>({})
    // 成就用紀錄
    const achievementsCount = ref({
        // 和平計算
        peaceDay: 0,
        gambleWin: 0,
    })

    // --- Actions ---

    /**
     * 增加擊殺計數
     * @param monsterName 怪物名稱
     * @param amount 增加數量 (預設 1)
     */
    function recordKill(monsterName: string, amount: number = 1) {
        // 紀錄特定怪物
        if (monsterName.startsWith('【菁英】')) {
            currentKills.value['ElITE'] = (currentKills.value['ElITE'] || 0) + amount
            totalKills.value['ElITE'] = (totalKills.value['ElITE'] || 0) + amount
        }
        monsterName = monsterName.replace(/^【菁英】/, "")
        currentKills.value[monsterName] = (currentKills.value[monsterName] || 0) + amount
        currentKills.value['TOTAL'] = (currentKills.value['TOTAL'] || 0) + amount
        totalKills.value[monsterName] = (totalKills.value[monsterName] || 0) + amount
        totalKills.value['TOTAL'] = (totalKills.value['TOTAL'] || 0) + amount
        //和平重新計算
        achievementsCount.value.peaceDay = 0
    }


    /**
     * 獲取特定目標的進度
     * @param monsterName 全部 TOTAL,菁英 ElITE
     * @param type  current:本階段; total: 整場遊戲
     */
    function getKillCount(monsterName: string = 'TOTAL', type: 'current' | 'total'): number {
        if (type === 'current') {
            return currentKills.value[monsterName] || 0
        }
        return totalKills.value[monsterName] || 0
    }


    /**
     * 跨關卡重置 (如果你的任務是每關重新計算)
     */
    function init(all = true) {
        if (all) {
            totalKills.value = {}
            Object.keys(achievementsCount.value).forEach(key => {
                achievementsCount.value[key] = 0
            })
        }
        currentKills.value = {}
    }


    return {
        currentKills,
        totalKills,
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