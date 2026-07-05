/**
 * 純BUFF相關
 * Buff類 統一不看熟練度
 * maxProficiency: 0, proficiencyGain: 0
 */
import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillParams, SkillTreeNode} from "@/types";
import {SkillStatus} from "@/constants/status/skill-status";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";

export class FocusBuff extends SkillModel {
    constructor() {
        super({
            id: 'FocusBuff',
            name: "專注意志",
            icon: "skills/physical/focus_buff.svg",
            type: 'active',
            rarity: 'common',
            maxCd: 5,
            costSp: 10,
            costAction: 0,
            maxProficiency: 0,
            proficiencyGain: 0
        });
    }

    description(): string {
        return `提升自身 10 點命中，持續 3 回合。`;
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
            maxCd: 5,
            costSp: 10,
            costAction: 0,
            maxProficiency: 0,
            proficiencyGain: 0
        });
    }

    description(): string {
        return `提升自身 10% 抗性，持續 3 回合。`;
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
            maxCd: 5,
            costSp: 10,
            costAction: 0,
            maxProficiency: 0,
            proficiencyGain: 0
        });
    }

    description(): string {
        return `提升自身 10% 增傷，持續 3 回合。`;
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
            maxCd: 5,
            costSp: 10,
            costAction: 0,
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
 * Buff系列
 * */
export const BuffSkillTree: Record<string, SkillTreeNode> = {
    WillBuff: {id: 'WillBuff', pathId: 'will', tier: 1},
    FocusBuff: {
        id: 'FocusBuff',
        pathId: 'focus',
        tier: 0,
        checkEligible: (playerStore) => {
            const currentHit = playerStore.info.hit
            return currentHit >= 5;
        }
    },
    FightBuff: {id: 'FightBuff', pathId: 'fight', tier: 1},
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
        tier: 2,
        checkEligible: (playerStore) => {
            const currentDodge = playerStore.finalStats.dodge
            return currentDodge >= 10;
        }
    },
}
