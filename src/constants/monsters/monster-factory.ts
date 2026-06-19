import {MonsterModel} from "@/models/monster-model";
import {Monster} from "@/constants/monsters/monster-info";

const generateUUID = (): string => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    // 安全備用隨機產生器 (以防在非 HTTPS/localhost 或老舊瀏覽器環境下 crypto.randomUUID 未定義)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

// 💡 怪物 ID 與 Subclass 類別對照表 (從 Monster 模板中動態過濾並提取自訂 Subclass 類別)
export const MONSTER_CLASS_MAP: Record<string, any> = {};

Object.entries(Monster).forEach(([key, instance]) => {
    // 排除沒有自訂類別的普通 JS 物件以及基類 MonsterModel 本身
    if (instance instanceof MonsterModel && instance.constructor !== MonsterModel) {
        MONSTER_CLASS_MAP[key] = instance.constructor;
    }
});


export class MonsterFactory {
    /**
     * 創建或從快取數據還原怪物實例
     * @param code 怪物 Code (如 'Slime')
     * @param savedData 緩存中已有的狀態（如 hp, ad, status 等）
     */
    static createMonster(code: string, savedData: Partial<any> = {}): MonsterModel {
        const MonsterClass = MONSTER_CLASS_MAP[code] ||
            (savedData.code ? MONSTER_CLASS_MAP[savedData.code] : undefined);

        if (MonsterClass) {
            const instance = new MonsterClass();
            // 先還原動態數據到 Class 實例中
            Object.assign(instance, savedData);
            // 若當前實例沒有 ID，才重新生成 (防止 Object.assign 覆蓋為 undefined 或是重複生成新的 ID)
            if (!instance.id) {
                instance.id = generateUUID();
            }
            return instance;
        }

        // 💡 找不到對照 Class 時的相容回溯處理 (讀取原始的 template 或直接用基類)
        const template = (Monster as Record<string, any>)[code];
        if (template) {
            const baseData = JSON.parse(JSON.stringify(template));
            const merged = {
                ...baseData,
                ...savedData
            };
            if (!merged.id) {
                merged.id = generateUUID();
            }
            return new MonsterModel(merged);
        }

        const finalData = { ...savedData };
        if (!finalData.id) {
            finalData.id = generateUUID();
        }
        return new MonsterModel(finalData as any);
    }
}
