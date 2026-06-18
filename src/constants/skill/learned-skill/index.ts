import { SkillModel, GenericSkill } from "@/models/skill-model";
import * as SkillClasses from "@/constants/skill/learned-skill/lv1-skills";
import * as SkillClassesLv2 from "@/constants/skill/learned-skill/lv2-skills";
import { ShieldBlock, PowerCharge } from "@/constants/skill/offhand-skill/offhand-skill";
import { usePlayerStore } from "@/store/player-store";

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
    PowerCharge: PowerCharge,
    // Level 2 進化與融合技能
    SwordMaster: SkillClassesLv2.SwordMaster,
    Cleave: SkillClassesLv2.Cleave,
    Flurry: SkillClassesLv2.Flurry,
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
    PowerCharge: new PowerCharge(),
    // Level 2
    SwordMaster: new SkillClassesLv2.SwordMaster(),
    Cleave: new SkillClassesLv2.Cleave(),
    Flurry: new SkillClassesLv2.Flurry(),
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

            // 讀取當前暫時性/副手技能的冷卻 CD
            let cd = savedData.currentCd;
            if (cd === undefined) {
                try {
                    const playerStore = usePlayerStore();
                    cd = (playerStore.info?.offhandSkillCds as any)?.[id] ?? 0;
                } catch (e) {}
            }

            // 還原等級、熟練度、CD 等動態數據到 Class 實例中
            Object.assign(instance, { currentCd: cd, ...savedData });
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

// 💡 進化與融合規則定義
export interface EvolutionRule {
    evolvedSkillId: string;
    baseSkillId: string; // 進化時替換的基礎技能 ID
    fuseSkillIds?: string[]; // 融合時需要額外移除的其他技能 ID
    checkEligible: (playerStore: any, trackerStore: any) => boolean;
}

export const EVOLUTION_RULES: Record<string, EvolutionRule> = {
    SwordMaster: {
        evolvedSkillId: 'SwordMaster',
        baseSkillId: 'SwordMastery',
        checkEligible: (playerStore, trackerStore) => {
            const hasBase = playerStore.info.skills?.some((s: any) => s.id === 'SwordMastery');
            const kills = trackerStore.getKillCount('USE_SWORD', 'total') || 0;
            return hasBase && kills >= 10;
        }
    },
    Cleave: {
        evolvedSkillId: 'Cleave',
        baseSkillId: 'VerticalSlash',
        checkEligible: (playerStore, trackerStore) => {
            const hasBase = playerStore.info.skills?.some((s: any) => s.id === 'VerticalSlash');
            const hasMastery = playerStore.info.skills?.some((s: any) => s.id === 'SwordMastery' || s.id === 'SwordMaster');
            const baseSkill = playerStore.info.skills?.find((s: any) => s.id === 'VerticalSlash');
            const isMaxProf = baseSkill ? (baseSkill.proficiency >= baseSkill.maxProficiency) : false;
            return hasBase && hasMastery && isMaxProf;
        }
    },
    Flurry: {
        evolvedSkillId: 'Flurry',
        baseSkillId: 'VerticalSlash',
        fuseSkillIds: ['HorizontalSlash', 'Thrust'],
        checkEligible: (playerStore, trackerStore) => {
            const hasVertical = playerStore.info.skills?.some((s: any) => s.id === 'VerticalSlash');
            const hasHorizontal = playerStore.info.skills?.some((s: any) => s.id === 'HorizontalSlash');
            const hasThrust = playerStore.info.skills?.some((s: any) => s.id === 'Thrust');
            return hasVertical && hasHorizontal && hasThrust;
        }
    }
};
