import { SkillModel, GenericSkill } from "@/models/skill-model";
import * as SkillClasses from "@/constants/skill/learned-skill/lv1-skills";
import { ShieldBlock } from "@/constants/skill/offhand-skill/offhand-skill";

// 💡 技能 ID 與 Subclass 類別對照表
export const SKILL_CLASS_MAP: Record<string, any> = {
    CommonHeal: SkillClasses.CommonHeal,
    MagicBall: SkillClasses.MagicBall,
    PhysiqueBoost: SkillClasses.PhysiqueBoost,
    VerticalSlash: SkillClasses.VerticalSlash,
    HorizontalSlash: SkillClasses.HorizontalSlash,
    Thrust: SkillClasses.Thrust,
    SwordMastery: SkillClasses.SwordMastery,
    BladeMastery: SkillClasses.BladeMastery,
    SpellMastery: SkillClasses.SpellMastery,
    ReadingMastery: SkillClasses.ReadingMastery,
    RedSkin: SkillClasses.RedSkin,
    BlueSkin: SkillClasses.BlueSkin,
    ShieldBlock: ShieldBlock,
};

// 💡 預設實例化地圖，提供給 UI 或是其他模組查詢可學習候選清單或基本屬性
export const SKILL_TEMPLATES: Record<string, SkillModel> = {
    // 等級1
    CommonHeal: new SkillClasses.CommonHeal(),
    MagicBall: new SkillClasses.MagicBall(),
    PhysiqueBoost: new SkillClasses.PhysiqueBoost(),
    VerticalSlash: new SkillClasses.VerticalSlash(),
    HorizontalSlash: new SkillClasses.HorizontalSlash(),
    Thrust: new SkillClasses.Thrust(),
    SwordMastery: new SkillClasses.SwordMastery(),
    BladeMastery: new SkillClasses.BladeMastery(),
    SpellMastery: new SkillClasses.SpellMastery(),
    ReadingMastery: new SkillClasses.ReadingMastery(),
    RedSkin: new SkillClasses.RedSkin(),
    BlueSkin: new SkillClasses.BlueSkin(),
    // 副手技能
    ShieldBlock: new ShieldBlock(),
};

export class SkillFactory {
    /**
     * 創建或從快取數據還原技能實例
     * @param id 技能 ID
     * @param savedData 緩存中已有的狀態（如 level, proficiency, currentCd）
     */
    static createSkill(id: string, savedData: Partial<SkillModel> = {}): SkillModel {
        const SkillClass = SKILL_CLASS_MAP[id];
        if (SkillClass) {
            const instance = new SkillClass();
            // 還原等級、熟練度、CD 等動態數據到 Class 實例中
            Object.assign(instance, savedData);
            return instance;
        }

        // 💡 找不到對照 Class 時的相容回溯處理 (GenericSkill)
        return new GenericSkill({
            id,
            name: id,
            icon: "❔",
            type: 'active',
            rarity: 'common',
            description: () => "未知技能",
            use: () => true,
            ...savedData
        });
    }
}
