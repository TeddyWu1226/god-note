import {defineStore} from 'pinia';
import {ref, h} from 'vue';
import {Achievement} from "@/constants/achievement";


export const useAchievementStore = defineStore('achievement', () => {
    // 1. 初始化資料 (合併本地緩存與初始定義)
    const currentAchievement = ref<typeof Achievement>(JSON.parse(JSON.stringify(Achievement)));
    const tryTime = ref(0)

    const init = () => {
        // 取得最新的原始定義
        const latestAchievements = Achievement;
        // 如果 currentAchievement 已經有資料（代表有舊存檔）
        if (Object.keys(currentAchievement.value).length > 0) {

            // 遍歷「最新定義」的每一個 key
            for (const key in latestAchievements) {
                const latest = latestAchievements[key];
                const saved = currentAchievement.value[key];

                if (saved) {
                    // 【核心邏輯】：保留玩家的進度，但更新文字與配置
                    currentAchievement.value[key] = {
                        ...latest,
                        isUnlocked: saved.isUnlocked // 繼承舊存檔的解鎖狀態
                    };
                }
            }
        }
    };
    return {
        currentAchievement,
        tryTime,
        init
    };
}, {
    persist: true // 持久化
});