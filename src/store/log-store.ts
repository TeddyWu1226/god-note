// store/log-store.js (假設您使用 Pinia)

import { defineStore } from 'pinia';
import { ref } from 'vue';

// Log 條目的類型定義
interface LogEntry {
    id: number;
    message: string;
    timestamp: number;
}

export const useLogStore = defineStore('log', () => {
    // 存放所有 Log 訊息的列表
    const logs = ref<LogEntry[]>([]);
    let nextId = 0;

    /**
     * 添加一個新的 Log 訊息
     * @param message 要顯示的文字內容
     */
    const addLog = (message: string) => {
        const newEntry: LogEntry = {
            id: nextId++,
            message: message,
            timestamp: Date.now(),
        };
        // 預設將新的 Log 放在列表底部
        logs.value.push(newEntry);
    };

    /**
     * 清空所有 Log 訊息
     */
    const clearLogs = () => {
        logs.value = [];
    };

    /**
     * 公開的 Log 方法 (供全局調用)
     */
    const logger = {
        add: addLog,
        clear: clearLogs
    };

    return {
        logs,
        logger
    };
});