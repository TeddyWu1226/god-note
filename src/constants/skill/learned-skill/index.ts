import {SkillModel} from "@/models/skill-model";
import * as Lv1SkillActive from "./lv1/active";
import * as Lv1SkillPassive from "./lv1/passive";
import * as Lv2SkillActive from "./lv2/active";
import * as Lv2SkillPassive from "./lv2/passive";
import * as Lv3SkillPassive from "./lv3/passive";
import {PowerCharge, ShieldBlock} from "@/constants/skill/offhand-skill/offhand-skill";
import {usePlayerStore} from "@/store/player-store";


// 💡 技能 ID 與 Subclass 類別對照表
export const SKILL_CLASS_MAP: Record<string, any> = {
    // Level 1
    CommonHeal: Lv1SkillActive.CommonHeal,
    VerticalSlash: Lv1SkillActive.VerticalSlash,
    HorizontalSlash: Lv1SkillActive.HorizontalSlash,
    Thrust: Lv1SkillActive.Thrust,

    WillBuff: Lv1SkillActive.WillBuff,
    FocusBuff: Lv1SkillActive.FocusBuff,
    FightBuff: Lv1SkillActive.FightBuff,

    PhysiqueBoost: Lv1SkillPassive.PhysiqueBoost,
    BrainPowerBoost: Lv1SkillPassive.BrainPowerBoost,
    SwordProficiency: Lv1SkillPassive.SwordProficiency,
    KnifeProficiency: Lv1SkillPassive.KnifeProficiency,
    SpellProficiency: Lv1SkillPassive.SpellProficiency,
    ReadingProficiency: Lv1SkillPassive.ReadingProficiency,
    RedSkin: Lv1SkillPassive.RedSkin,
    BlueSkin: Lv1SkillPassive.BlueSkin,
    BlockBoost: Lv1SkillPassive.BlockBoost,

    Flurry: Lv2SkillActive.Flurry,

    SwordExpert: Lv2SkillPassive.SwordExpert,
    KnightWay: Lv2SkillPassive.KnightWay,
    HeartOfRebellion: Lv2SkillPassive.HeartOfRebellion,
    ContinuousSwordVertical: Lv2SkillPassive.ContinuousSwordVertical,
    ContinuousSwordHorizontal: Lv2SkillPassive.ContinuousSwordHorizontal,
    ContinuousSwordPoint: Lv2SkillPassive.ContinuousSwordPoint,
    BloodManaLoop: Lv2SkillPassive.BloodManaLoop,
    PurpleSkin: Lv2SkillPassive.PurpleSkin,

    // Level 3
    SwordMaster: Lv3SkillPassive.SwordMaster,


    // 副手技能
    ShieldBlock: ShieldBlock,
    PowerCharge: PowerCharge,
};


// 💡 預設實例化地圖，提供給 UI 或是其他模組查詢可學習候選清單或基本屬性
export const SKILL_TEMPLATES: Record<string, SkillModel> = {};

// 動態從 SKILL_CLASS_MAP 生成實例，避免重複設定與遺漏（排除非直接學習的副手技能）
const EXCLUDE_TEMPLATES = ['ShieldBlock', 'PowerCharge'];
Object.entries(SKILL_CLASS_MAP).forEach(([key, ClassConstructor]) => {
    if (!EXCLUDE_TEMPLATES.includes(key)) {
        SKILL_TEMPLATES[key] = new ClassConstructor();
    }
});

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
                } catch (e) {
                }
            }

            // 還原等級、熟練度、CD 等動態數據到 Class 實例中
            Object.assign(instance, {currentCd: cd, ...savedData});
            return instance;
        }
    }
}



