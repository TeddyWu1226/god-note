import {SkillModel} from "@/models/skill-model";
import {PowerCharge, ShieldBlock} from "@/constants/skill/offhand-skill/offhand-skill";
import {usePlayerStore} from "@/store/player-store";

import {SkillTreeNode} from "@/types";
import {
    AdBasicSkillTree,
    HorizontalSlash,
    Thrust,
    VerticalSlash
} from "@/constants/skill/learned-skill/basic_skills/ad_skill";
import {
    AgilityBuff, Breakfall,
    BuffSkillTree,
    FightBuff,
    FocusBuff,
    WillBuff
} from "@/constants/skill/learned-skill/basic_skills/buff_skill";
import {
    BloodManaLoop,
    BlueSkin,
    BrainPowerBoost, DemonBody,
    DemonBodySkillTree,
    PhysiqueBoost, PurpleSkin, RedSkin
} from "@/constants/skill/learned-skill/basic_skills/demon_body";
import {
    Assassinate,
    ConcealBreath, ConcealBreathInstinct, Flurry, KnifeMaster,
    KnifeBase, KnifePro, KnifeAdv,
    KnifeSkillTree, SwiftStrike, SpeedStrike,
    SneakAttack, SurpriseAttack,
    MistBase, MistPro
} from "./knife_skills";
import {BlockBase, BlockPro, BlockAdv, ShieldSkillTree} from "./shield_skill";
import {StickSkillTree} from "./stick_skill";
import {ApSkillTree} from "@/constants/skill/learned-skill/basic_skills/ap_skill";
import {
    ContinuousSwordHorizontal, ContinuousSwordPoint,
    ContinuousSwordVertical,
    SwordMaster,
    SwordBase, SwordPro, SwordAdv,
    SwordSkillTree,
    MasterSwordVertical, MasterSwordHorizontal, MasterSwordPoint,
    DoubleSlash, TripleSlash, HorizontalSweep, WhirlwindSlash, ThrustCharge, AssaultCharge,
    SwordPolish, SwordDance
} from "./sword_skills";
import {CommonHeal} from "@/constants/skill/learned-skill/heal_skills/heal_skill";

export const SKILL_TREE_NODES: Record<string, SkillTreeNode> = {
    ...AdBasicSkillTree,
    ...ApSkillTree,
    ...BuffSkillTree,
    ...DemonBodySkillTree,
    ...KnifeSkillTree,
    ...ShieldSkillTree,
    ...StickSkillTree,
    ...SwordSkillTree,
};
// 💡 技能 ID 與 Subclass 類別對照表
const SKILL_CLASS_MAP: Record<string, any> = {
    // Level 1
    CommonHeal: CommonHeal,
    VerticalSlash: VerticalSlash,
    HorizontalSlash: HorizontalSlash,
    Thrust: Thrust,

    WillBuff: WillBuff,
    FocusBuff: FocusBuff,
    FightBuff: FightBuff,
    AgilityBuff: AgilityBuff,

    PhysiqueBoost: PhysiqueBoost,
    BrainPowerBoost: BrainPowerBoost,
    SwordBase: SwordBase,
    KnifeBase: KnifeBase,
    RedSkin: RedSkin,
    BlueSkin: BlueSkin,
    BlockBase: BlockBase,
    // Level 2

    Flurry: Flurry,
    SwiftStrike: SwiftStrike,
    SpeedStrike: SpeedStrike,
    Assassinate: Assassinate,
    ConcealBreath: ConcealBreath,
    Breakfall: Breakfall,

    SwordPro: SwordPro,
    SwordAdv: SwordAdv,
    BlockPro: BlockPro,
    BlockAdv: BlockAdv,
    ContinuousSwordVertical: ContinuousSwordVertical,
    ContinuousSwordHorizontal: ContinuousSwordHorizontal,
    ContinuousSwordPoint: ContinuousSwordPoint,
    DoubleSlash: DoubleSlash,
    HorizontalSweep: HorizontalSweep,
    ThrustCharge: ThrustCharge,
    SwordPolish: SwordPolish,
    BloodManaLoop: BloodManaLoop,
    PurpleSkin: PurpleSkin,

    KnifePro: KnifePro,
    KnifeAdv: KnifeAdv,
    SneakAttack: SneakAttack,
    MistBase: MistBase,

    // Level 3
    ConcealBreathInstinct: ConcealBreathInstinct,

    SwordMaster: SwordMaster,
    DemonBody: DemonBody,
    KnifeMaster: KnifeMaster,
    MasterSwordVertical: MasterSwordVertical,
    MasterSwordHorizontal: MasterSwordHorizontal,
    MasterSwordPoint: MasterSwordPoint,
    TripleSlash: TripleSlash,
    WhirlwindSlash: WhirlwindSlash,
    AssaultCharge: AssaultCharge,
    SwordDance: SwordDance,
    SurpriseAttack: SurpriseAttack,
    MistPro: MistPro,


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

        // 💡 找不到對照 Class 時的相容回溯處理 (使用匿名類別實例繼承 SkillModel，確保不返回 undefined 導致崩潰)
        const fallback = new class extends SkillModel {
            protected execute(): boolean {
                return false;
            }

            description(): string {
                return this.itemDescription || "";
            }
        }({
            id: id,
            name: savedData.name || id,
            icon: savedData.icon || "",
            type: savedData.type || "active",
            rarity: savedData.rarity || "common",
            level: savedData.level || 1,
            proficiency: savedData.proficiency || 0,
            maxProficiency: savedData.maxProficiency || 100,
            proficiencyGain: savedData.proficiencyGain || 0,
            currentCd: savedData.currentCd || 0,
            maxCd: savedData.maxCd || 0,
            costSp: savedData.costSp || 0,
            costHp: savedData.costHp || 0,
            costAction: savedData.costAction || 0,
            costMaxAction: savedData.costMaxAction || false,
            uniqueFields: savedData.uniqueFields || []
        });
        Object.assign(fallback, savedData);
        return fallback;
    }
}



