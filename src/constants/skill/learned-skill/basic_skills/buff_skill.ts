/**
 * 純BUFF相關
 * Buff類 統一不看熟練度
 * maxProficiency: 0, proficiencyGain: 0
 */
import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillParams, SkillTreeNode} from "@/types";
import {SkillStatus} from "@/constants/status/skill-status";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {useLogStore} from "@/store/log-store";

export class FocusBuff extends SkillModel {
    constructor() {
        super({
            id: 'FocusBuff',
            name: "專注意志",
            icon: "skills/physical/focus_buff.svg",
            type: 'active',
            rarity: 'common',
            maxCd: 4,
            costSp: 10,
            costAction: 1,
            maxProficiency: 0,
            proficiencyGain: 0
        });
    }

    description(): string {
        return `提升自身 10 點命中，持續 4 回合。`;
    }

    protected execute(params: SkillParams): boolean {
        const playerStore = params.playerStore;
        if (!playerStore) return false;

        playerStore.addStatus(SkillStatus.Focus);
        useFullScreenEffect({
            message: this.name,
            color: '#f1c40f',
        });
        return true;
    }
}

export class WillBuff extends SkillModel {
    constructor() {
        super({
            id: 'WillBuff',
            name: "堅定意志",
            icon: "skills/physical/will_buff.svg",
            type: 'active',
            rarity: 'common',
            maxCd: 4,
            costSp: 10,
            costAction: 1,
            maxProficiency: 0,
            proficiencyGain: 0
        });
    }

    description(): string {
        return `獲得 3 點物理防禦，持續 3 回合。`;
    }

    protected execute({playerStore}: SkillParams): boolean {
        if (!playerStore) return false;

        playerStore.addStatus(SkillStatus.Will);
        useFullScreenEffect({
            message: this.name,
            color: '#f1c40f',
        });
        return true;
    }
}

export class FightBuff extends SkillModel {
    constructor() {
        super({
            id: 'FightBuff',
            name: "戰鬥意志",
            icon: "skills/physical/fight_buff.svg",
            type: 'active',
            rarity: 'common',
            maxCd: 4,
            costSp: 10,
            costAction: 1,
            maxProficiency: 0,
            proficiencyGain: 0
        });
    }

    description(): string {
        return `增加 5 點物理與魔法攻擊力，持續 4 回合。`;
    }

    protected execute({playerStore}: SkillParams): boolean {
        if (!playerStore) return false;

        playerStore.addStatus(SkillStatus.Fight);
        useFullScreenEffect({
            message: this.name,
            color: '#f1c40f',
        });
        return true;
    }
}

export class AgilityBuff extends SkillModel {
    constructor() {
        super({
            id: 'AgilityBuff',
            name: "敏捷意志",
            icon: "skills/physical/agility_buff.svg",
            type: 'active',
            rarity: 'common',
            maxCd: 4,
            costSp: 10,
            costAction: 1,
            maxProficiency: 0,
            proficiencyGain: 0
        });
    }

    description(): string {
        return `提升自身 10 點閃避，持續 3 回合。`;
    }

    protected execute({playerStore}: SkillParams): boolean {
        if (!playerStore) return false;

        playerStore.addStatus(SkillStatus.Agility);
        useFullScreenEffect({
            message: this.name,
            color: '#f1c40f',
        });
        return true;
    }
}

export class Breakfall extends SkillModel {
    constructor() {
        super({
            id: 'Breakfall',
            name: "受身技巧",
            icon: "skills/physical/breakfall.svg",
            type: 'active',
            rarity: 'rare',
            uniqueFields: ['受身'],
            maxProficiency: 30,
            proficiencyGain: 1,
            costMaxAction: true,
            costSp: 20,
            maxCd: 5
        });
    }

    currentMaxCd() {
        return 6 - Math.floor(this.proficiency / 10)
    }

    transformRate(playerStore: PlayerStoreType): number {
        const weapon = playerStore.info.equips?.weapon
        const offhand = playerStore.info.equips?.offhand
        let rate = 0.5
        if (!weapon) {
            rate += 0.5
        }
        if (!offhand) {
            rate += 0.5
        }
        return rate;
    }

    transformValue(playerStore: PlayerStoreType): number {
        const currentDodge = playerStore.finalStats?.dodge ?? 0;
        return currentDodge > 0 ? Math.floor(currentDodge * this.transformRate(playerStore)) : 0;
    }

    description(playerStore: PlayerStoreType): string {
        return `獲得「受身」效果。將自身閃避率歸0, 並轉化爲${this.transformValue(playerStore)}(閃避值*${this.transformRate(playerStore)}) 點防禦力\n(如果沒有裝備武器或副手武器,轉化效率會提升)。`;
    }

    protected execute({playerStore}: SkillParams): boolean {
        this.maxCd = this.currentMaxCd()
        const currentDodge = playerStore.finalStats?.dodge ?? 0;
        playerStore.addStatus(SkillStatus.BreakfallStatus, {
            bonus: {
                dodge: currentDodge > 0 ? -currentDodge : 0,
                adDefend: this.transformValue(playerStore),
            }
        });
        useFullScreenEffect({
            message: this.name,
            color: '#ba7346',
        });
        return true;
    }
}

/**
 * 看破 (Level 2)
 */
export class FocusPro extends SkillModel {
    constructor() {
        super({
            id: 'FocusPro',
            name: "看破",
            icon: "skills/physical/focus_pro.svg",
            type: 'active',
            rarity: 'rare',
            maxCd: 1,
            costSp: 5,
            costAction: 0,
            maxProficiency: 0,
            proficiencyGain: 0
        });
    }

    description(): string {
        return `提升自身 20 點命中。指定怪物顯示該怪物現在詳細數值在戰鬥日誌中。`;
    }
    override getPassiveBonus(): Record<string, number> {
        return {
            dodge: 20,
        };
    }

    protected execute({playerStore, monster}: SkillParams): boolean {
        if (!playerStore || !monster) return false;

        const logStore = useLogStore();
        logStore.logger.add(`[看破] 洞悉 ${monster.name} 的狀態：等級 ${monster.level}，HP: ${monster.hp}/${monster.hpLimit}，物理攻擊(AD): ${monster.ad}，物理防禦: ${monster.adDefend}，閃避: ${monster.dodge}，命中: ${monster.hit}`);

        useFullScreenEffect({
            message: this.name,
            color: '#3498db',
        });
        return true;
    }
}

/**
 * 壁壘 (Level 3)
 */
export class WillPro extends SkillModel {
    constructor() {
        super({
            id: 'WillPro',
            name: "壁壘",
            icon: "skills/physical/will_pro.svg",
            type: 'passive',
            rarity: 'perfect',
            uniqueFields: ['堅定意志系']
        });
    }

    description(): string {
        return `獲得 6 點防禦與 5% 抗性。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(): Record<string, number> {
        return {
            adDefend: 6,
            defendIncrease: 5
        };
    }
}

/**
 * 驍勇 (Level 3)
 */
export class FightPro extends SkillModel {
    constructor() {
        super({
            id: 'FightPro',
            name: "驍勇",
            icon: "skills/physical/fight_pro.svg",
            type: 'passive',
            rarity: 'perfect',
            uniqueFields: ['戰鬥意志系']
        });
    }

    description(): string {
        return `增加 10 點物理與魔法攻擊力，且獲得 5% 吸血。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(): Record<string, number> {
        return {
            ad: 10,
            ap: 10,
            lifeSteal: 5
        };
    }
}

/**
 * 靈巧 (Level 2)
 */
export class AgilityPro extends SkillModel {
    constructor() {
        super({
            id: 'AgilityPro',
            name: "靈巧",
            icon: "skills/physical/agility_pro.svg",
            type: 'passive',
            rarity: 'rare',
            uniqueFields: ['敏捷意志系']
        });
    }

    description(): string {
        return `增加 20 點閃避。逃跑失敗後，可暫時獲得 20 點閃避，持續 1 回合。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(): Record<string, number> {
        return {
            dodge: 20
        };
    }
}

/**
 * Buff系列
 * */
export const BuffSkillTree: Record<string, SkillTreeNode> = {
    WillBuff: {id: 'WillBuff', pathId: 'will', tier: 0},
    FocusBuff: {
        id: 'FocusBuff',
        pathId: 'focus',
        tier: 0,
        checkEligible: (playerStore) => {
            const currentHit = playerStore.info.hit
            return currentHit >= 5;
        }
    },
    FightBuff: {id: 'FightBuff', pathId: 'fight', tier: 0},
    AgilityBuff: {
        id: 'AgilityBuff',
        pathId: 'agility',
        tier: 0,
        checkEligible: (playerStore) => {
            const currentDodge = playerStore.finalStats.dodge
            return currentDodge >= 5;
        }
    },
    // 受身
    Breakfall: {
        id: 'Breakfall',
        pathId: 'break_fall',
        tier: 1,
        checkEligible: (playerStore) => {
            const currentDodge = playerStore.finalStats.dodge
            return currentDodge >= 20;
        }
    },
    FocusPro: {
        id: 'FocusPro',
        pathId: 'focus',
        tier: 2,
        evolvesFrom: ['FocusBuff'],
        checkEligible: (playerStore) => playerStore.hasSkill('FocusBuff') !== undefined
    },
    WillPro: {
        id: 'WillPro',
        pathId: 'will',
        tier: 3,
        evolvesFrom: ['WillBuff'],
        checkEligible: (playerStore) => playerStore.hasSkill('WillBuff') !== undefined
    },
    FightPro: {
        id: 'FightPro',
        pathId: 'fight',
        tier: 3,
        evolvesFrom: ['FightBuff'],
        checkEligible: (playerStore) => playerStore.hasSkill('FightBuff') !== undefined
    },
    AgilityPro: {
        id: 'AgilityPro',
        pathId: 'agility',
        tier: 2,
        evolvesFrom: ['AgilityBuff'],
        checkEligible: (playerStore) => playerStore.hasSkill('AgilityBuff') !== undefined
    },
}
