import {defineStore} from 'pinia';
import {ref} from 'vue';

/**
 * 圖鑑儲存庫 - 永久性紀錄
 * 記錄玩家曾擊敗過的怪物與曾擁有過的裝備，即使新開一局也會保留。
 */
export const useEncyclopediaStore = defineStore('encyclopedia', () => {

    /** 已解鎖的怪物代碼/名稱集合 (擊敗後解鎖) */
    const unlockedMonsters = ref<string[]>([]);

    /** 已解鎖的裝備名稱集合 (擁有過即解鎖) */
    const unlockedEquipments = ref<string[]>([]);

    /**
     * 解鎖怪物圖鑑
     * @param monsterCode 怪物代碼
     */
    function unlockMonster(monsterCode: string) {
        if (!monsterCode) return;
        const code = monsterCode.replace(/^【菁英】/, '');
        if (!unlockedMonsters.value.includes(code)) {
            unlockedMonsters.value.push(code);
            unlockedMonsters.value = [...new Set(unlockedMonsters.value)]
        }
    }

    /**
     * 解鎖裝備圖鑑
     * @param equipName 裝備名稱
     */
    function unlockEquipment(equipName: string) {
        if (!equipName) return;
        if (!unlockedEquipments.value.includes(equipName)) {
            unlockedEquipments.value.push(equipName);
            unlockedEquipments.value = [...new Set(unlockedEquipments.value)]

        }
    }

    /** 檢查怪物是否已解鎖 (支援 code 與舊有 name 的雙重比對以向下相容) */
    function isMonsterUnlocked(monsterCode: string, monsterName?: string): boolean {
        if (unlockedMonsters.value.includes(monsterCode)) return true;
        if (monsterName && unlockedMonsters.value.includes(monsterName)) return true;
        return false;
    }

    /** 檢查裝備是否已解鎖 */
    function isEquipmentUnlocked(equipName: string): boolean {
        return unlockedEquipments.value.includes(equipName);
    }

    return {
        unlockedMonsters,
        unlockedEquipments,
        unlockMonster,
        unlockEquipment,
        isMonsterUnlocked,
        isEquipmentUnlocked,
    };
}, {
    persist: {
        key: 'encyclopedia',
        storage: localStorage,
    }
});
