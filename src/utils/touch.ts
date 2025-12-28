/**
 * 創建一個雙擊/連點處理器
 * @param callback 觸發時要執行的函數
 * @param delay 連點判定的時間門檻 (預設 300ms)
 */
export const createDoubleTapHandler = <T extends any[]>(
    callback: (...args: T) => void,
    delay: number = 350
) => {
    let lastTap = 0;
    let lastTargetKey = '';

    return (...args: T) => {
        const now = Date.now();

        // 🚩 關鍵：只拿第一個參數（通常是物品物件或名稱）來比對，不要把 event 拿來序列化
        const currentTargetKey = typeof args[0] === 'object' ? args[0].name : String(args[0]);

        if (currentTargetKey === lastTargetKey && (now - lastTap) < delay) {
            callback(...args);
            lastTap = 0;
        } else {
            lastTap = now;
            lastTargetKey = currentTargetKey;
        }
    };
};