import { MonsterModel } from "@/models/monster-model";
import { Monster } from "@/constants/monsters/monster-info";
import * as MistyForestClasses from "@/constants/monsters/monster-info/1-misty-forest-monster";
import * as BossClasses from "@/constants/monsters/boss-info";

// 💡 怪物 ID 與 Subclass 類別對照表
export const MONSTER_CLASS_MAP: Record<string, any> = {
    Slime: MistyForestClasses.Slime,
    ForestSprout: MistyForestClasses.ForestSprout,
    WoodTick: MistyForestClasses.WoodTick,
    StingerBee: MistyForestClasses.StingerBee,
    GreenRabbit: MistyForestClasses.GreenRabbit,
    ForestOwl: MistyForestClasses.ForestOwl,
    FairyGuard: MistyForestClasses.FairyGuard,
    MushroomMan: MistyForestClasses.MushroomMan,
    Mandragora: MistyForestClasses.Mandragora,
    FierceWolf: MistyForestClasses.FierceWolf,
    SmallSpider: MistyForestClasses.SmallSpider,

    // Bosses
    BeginForest: BossClasses.ForestGuardian,
    SunkenGrove: BossClasses.PoisonSlimeBoss,
    AncientRoots: BossClasses.AncientSpider,
    FairyBarrier: BossClasses.FairyElder,
    Twilight: BossClasses.Twilight,
};

// 💡 建立怪物中文名稱對照表以加速查詢
const MONSTER_NAME_MAP: Record<string, any> = {};
Object.entries(MONSTER_CLASS_MAP).forEach(([key, cls]) => {
    const temp = new cls();
    MONSTER_NAME_MAP[temp.name] = cls;
});

export class MonsterFactory {
    /**
     * 創建或從快取數據還原怪物實例
     * @param id 怪物 ID (如 'Slime') 或中文名稱 (如 '史萊姆')
     * @param savedData 緩存中已有的狀態（如 hp, ad, status 等）
     */
    static createMonster(id: string, savedData: Partial<any> = {}): MonsterModel {
        // 先使用 ID、中文名稱，或是 savedData 中的 name 與 id 查找對應的 Class
        const MonsterClass = MONSTER_CLASS_MAP[id] || 
                             MONSTER_NAME_MAP[id] || 
                             (savedData.name ? MONSTER_NAME_MAP[savedData.name] : undefined) ||
                             (savedData.id ? MONSTER_CLASS_MAP[savedData.id] : undefined);

        if (MonsterClass) {
            const instance = new MonsterClass();
            // 還原動態數據到 Class 實例中
            Object.assign(instance, savedData);
            return instance;
        }

        // 💡 找不到對照 Class 時的相容回溯處理 (讀取原始的 template 或直接用基類)
        const template = (Monster as Record<string, any>)[id];
        if (template) {
            const baseData = JSON.parse(JSON.stringify(template));
            return new MonsterModel({
                ...baseData,
                ...savedData
            });
        }

        return new MonsterModel(savedData as any);
    }
}
