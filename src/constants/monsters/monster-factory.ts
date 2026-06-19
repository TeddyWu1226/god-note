import {MonsterModel} from "@/models/monster-model";
import {Monster} from "@/constants/monsters/monster-info";

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
        console.log('產生怪物code', code)
        const MonsterClass = MONSTER_CLASS_MAP[code] ||
            (savedData.code ? MONSTER_CLASS_MAP[savedData.code] : undefined);

        if (MonsterClass) {
            console.log('真的有人走到這了', MonsterClass)
            const instance = new MonsterClass();
            instance.id = crypto.randomUUID()
            // 還原動態數據到 Class 實例中
            Object.assign(instance, savedData);
            return instance;
        }

        // 💡 找不到對照 Class 時的相容回溯處理 (讀取原始的 template 或直接用基類)
        const template = (Monster as Record<string, any>)[code];
        if (template) {
            const baseData = JSON.parse(JSON.stringify(template));
            return new MonsterModel({
                ...baseData,
                ...savedData,
                id: crypto.randomUUID()
            });
        }

        return new MonsterModel(savedData as any);
    }
}
