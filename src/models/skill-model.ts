import {SkillParams} from "@/types";

export type SkillRarity = 'common' | 'rare' | 'legendary' | 'unique';
export type SkillTypeCategory = 'active' | 'passive';

export abstract class SkillModel {
    id: string;              // 技能唯一的識別碼 (ID)
    name: string;            // 技能的中文顯示名稱
    icon: string;            // 技能的圖示 (例如 Emoji 字元或圖片路徑)
    type: SkillTypeCategory;  // 技能的分類類型：'active' (主動技能) 或 'passive' (被動技能)
    rarity: SkillRarity;     // 技能的稀有度分類：'common' (普通) | 'rare' (稀有) | 'legendary' (傳奇) | 'unique' (唯一)
    level: number;           // 技能的當前等級
    proficiency: number;     // 技能的當前熟練度 (通常為 0 ~ maxProficiency)
    maxProficiency: number;  // 技能的熟練度上限 (預設為 100)
    proficiencyGain: number; // 每次使用技能時提升的熟練度 (預設為 0,如果有才會顯示)
    currentCd: number;       // 當前剩餘的冷卻回合數 (0 代表可立即施展)
    maxCd: number;           // 技能的最大冷卻回合數 (0 代表無 CD)
    costSp: number;          // 施放技能所消耗的魔法值 (SP)
    costHp: number;          // 施放技能所消耗的生命值 (HP)
    costAction: number;      // 施放技能所消耗的行動點數 (AP)
    itemDescription?: string;// 技能的靜態說明描述 (用於背包/商店 Tooltips)
    uniqueFields: string[];  // 唯一字段列表 (用於學習衝突檢查)

    constructor(data: {
        id: string;              // 技能唯一的識別碼 (ID)
        name: string;            // 技能的中文顯示名稱
        icon: string;            // 技能的圖示
        type: SkillTypeCategory;  // 技能的分類類型
        rarity: SkillRarity;     // 技能的稀有度分類
        level?: number;          // 技能的當前等級 (選填，預設為 1)
        proficiency?: number;    // 技能的當前熟練度 (選填，預設為 0)
        maxProficiency?: number; // 技能的熟練度上限 (選填，預設為 100)
        proficiencyGain?: number;// 每次使用技能時提升的熟練度 (選填，預設為 1)
        currentCd?: number;      // 當前剩餘 of 冷卻回合數 (選填，預設為 0)
        maxCd?: number;          // 技能的最大冷卻回合數 (選填，預設為 0)
        costSp?: number;         // 施放技能所消耗的魔法值 (選填，預設為 0)
        costHp?: number;         // 施放技能所消耗的生命值 (選填，預設為 0)
        costAction?: number;     // 施放技能所消耗的行動點數 (選填，預設為 1)
        itemDescription?: string;// 技能的靜態說明描述 (選填)
        uniqueFields?: string[]; // 唯一字段 (選填)
    }) {
        this.id = data.id;
        this.name = data.name;
        this.icon = data.icon;
        this.type = data.type;
        this.rarity = data.rarity;
        this.level = data.level ?? 1;
        this.proficiency = data.proficiency ?? 0;
        this.maxProficiency = data.maxProficiency ?? 100;
        this.proficiencyGain = data.proficiencyGain ?? 0;
        this.currentCd = data.currentCd ?? 0;
        this.maxCd = data.maxCd ?? 0;
        this.costSp = data.costSp ?? 0;
        this.costHp = data.costHp ?? 0;
        this.costAction = data.costAction ?? 1;
        this.itemDescription = data.itemDescription;
        this.uniqueFields = data.uniqueFields ?? [];
    }

    // 💡 獲取描述 (由子類別實作)
    abstract description(playerStore: any): string;

    // 💡 施放技能核心流程 (範本方法)
    async use(params: SkillParams): Promise<boolean> {
        if (this.currentCd > 0) {
            return false;
        }
        const success = await this.execute(params);
        if (success) {
            this.currentCd = this.maxCd;
        }
        return success;
    }

    // 💡 實際技能效果邏輯 (由子類別實作)
    protected abstract execute(params: SkillParams): Promise<boolean> | boolean;

    // 💡 獲取被動加成數據 (預設為空，可由被動技能類別覆寫)
    getPassiveBonus(player?: any): Record<string, number> {
        return {};
    }

    // 💡 為了相容於原本 UI 讀取 .cd 的地方
    get cd(): number {
        return this.maxCd;
    }

    // 💡 獲取熟練度顯示字串
    get proficiencyText(): string {
        if (this.proficiency >= this.maxProficiency) {
            return "熟練度 Max";
        }
        return `熟練度: ${this.proficiency}/${this.maxProficiency}`;
    }

}