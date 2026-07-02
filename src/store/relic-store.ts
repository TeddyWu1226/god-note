import {defineStore} from 'pinia';
import {ref} from 'vue';
import {EquipmentType} from '@/types';

export const useRelicStore = defineStore('relic', () => {
    const lastStage = ref<number | null>(null);
    const lastLevel = ref<number | null>(null);
    const savedEquipment = ref<EquipmentType | null>(null);

    /**
     * 紀錄當前玩家資料與隨機一件裝備
     */
    const recordRelic = (stage: number, level: number, equips: any) => {
        lastStage.value = stage;
        lastLevel.value = level;

        // 篩選出目前穿在身上的所有裝備
        const equippedItems = Object.values(equips || {}).filter((item): item is EquipmentType => {
            return !!item && typeof item === 'object' && 'name' in item;
        });

        if (equippedItems.length > 0) {
            const randomIndex = Math.floor(Math.random() * equippedItems.length);
            // 複製一份裝備，避免因隨後重置 playerStore 而被連帶影響
            savedEquipment.value = JSON.parse(JSON.stringify(equippedItems[randomIndex]));
        } else {
            savedEquipment.value = null;
        }
    };

    /**
     * 清空緩存紀錄
     */
    const clearRelic = () => {
        lastStage.value = null;
        lastLevel.value = null;
        savedEquipment.value = null;
    };

    return {
        lastStage,
        lastLevel,
        savedEquipment,
        recordRelic,
        clearRelic
    };
}, {
    persist: true
});
