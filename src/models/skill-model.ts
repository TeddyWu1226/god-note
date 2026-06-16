import { SkillParams } from "@/types";

export type SkillRarity = 'common' | 'rare' | 'legendary' | 'unique';
export type SkillTypeCategory = 'active' | 'passive';

export abstract class SkillModel {
    id: string;
    name: string;
    icon: string;
    type: SkillTypeCategory;
    rarity: SkillRarity;
    level: number;
    proficiency: number;
    currentCd: number;
    maxCd: number;
    costSp: number;
    costHp: number;
    costAction: number;

    constructor(data: {
        id: string;
        name: string;
        icon: string;
        type: SkillTypeCategory;
        rarity: SkillRarity;
        level?: number;
        proficiency?: number;
        currentCd?: number;
        maxCd?: number;
        costSp?: number;
        costHp?: number;
        costAction?: number;
    }) {
        this.id = data.id;
        this.name = data.name;
        this.icon = data.icon;
        this.type = data.type;
        this.rarity = data.rarity;
        this.level = data.level ?? 1;
        this.proficiency = data.proficiency ?? 0;
        this.currentCd = data.currentCd ?? 0;
        this.maxCd = data.maxCd ?? 0;
        this.costSp = data.costSp ?? 0;
        this.costHp = data.costHp ?? 0;
        this.costAction = data.costAction ?? 1;
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
    getPassiveBonus(): Record<string, number> {
        return {};
    }

    // 序列化為 JSON，用於 Pinia 儲存
    toJSON() {
        return {
            id: this.id,
            level: this.level,
            proficiency: this.proficiency,
            currentCd: this.currentCd
        };
    }
}

// 💡 舊資料結構 / 臨時動態技能 的相容包裝類別
export class GenericSkill extends SkillModel {
    private _descFn: (playerStore: any, self: SkillModel) => string;
    private _useFn: (params: SkillParams, self: SkillModel) => Promise<boolean> | boolean;
    private _passiveBonusFn?: (self: SkillModel) => Record<string, number>;

    constructor(data: {
        id: string;
        name: string;
        icon: string;
        type: SkillTypeCategory;
        rarity: SkillRarity;
        level?: number;
        proficiency?: number;
        currentCd?: number;
        maxCd?: number;
        costSp?: number;
        costHp?: number;
        costAction?: number;
        description: (playerStore: any, self: SkillModel) => string;
        use: (params: SkillParams, self: SkillModel) => Promise<boolean> | boolean;
        passiveBonus?: (self: SkillModel) => Record<string, number>;
    }) {
        super(data);
        this._descFn = data.description;
        this._useFn = data.use;
        this._passiveBonusFn = data.passiveBonus;
    }

    description(playerStore: any): string {
        return this._descFn(playerStore, this);
    }

    protected execute(params: SkillParams): Promise<boolean> | boolean {
        return this._useFn(params, this);
    }

    override getPassiveBonus(): Record<string, number> {
        return this._passiveBonusFn ? this._passiveBonusFn(this) : {};
    }
}
