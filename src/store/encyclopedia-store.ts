import {defineStore} from 'pinia';
import {ref} from 'vue';

/**
 * 圖鑑儲存庫 - 永久性紀錄
 * 記錄玩家曾擊敗過的怪物與曾擁有過的裝備，即使新開一局也會保留。
 */
export const useEncyclopediaStore = defineStore('encyclopedia', () => {

    /** 已解鎖的怪物名稱集合 (擊敗後解鎖) */
    const unlockedMonsters = ref<string[]>([]);

    /** 已解鎖的裝備名稱集合 (擁有過即解鎖) */
    const unlockedEquipments = ref<string[]>([]);

    /**
     * 解鎖怪物圖鑑
     * @param monsterName 怪物原始名稱（去除菁英前綴後的名稱）
     */
    function unlockMonster(monsterName: string) {
        const name = monsterName.replace(/^【菁英】/, '');
        if (!unlockedMonsters.value.includes(name)) {
            unlockedMonsters.value.push(name);
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

    /** 檢查怪物是否已解鎖 */
    function isMonsterUnlocked(monsterName: string): boolean {
        return unlockedMonsters.value.includes(monsterName);
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
