import { SkillModel } from "@/models/skill-model";
import { PlayerStoreType, SkillParams } from "@/types";
import { ColorText } from "@/utils/color";
import { applySkillDamage } from "@/constants/fight-func";

export class CommonHeal extends SkillModel {
    constructor() {
        super({
            id: 'CommonHeal',
            name: "治療術",
            icon: "💕",
            type: 'active',
            rarity: 'common',
            maxCd: 2,
            costSp: 25,
            costAction: 1
        });
    }

    get healVal(): number {
        return Math.floor(30 + this.level * 15 + this.proficiency * 0.7);
    }

    description(playerStore: PlayerStoreType): string {
        return `自身 ${ColorText.heal(this.healVal)}。 [冷卻: ${this.maxCd} 回合]`;
    }

    protected execute(params: SkillParams): boolean {
        const playerStore = params.playerStore;
        if (!playerStore) return false;

        playerStore.info.hp = Math.min(
            playerStore.finalStats.hpLimit,
            playerStore.info.hp + this.healVal
        );
        return true;
    }
}

export class MagicBall extends SkillModel {
    constructor() {
        super({
            id: 'MagicBall',
            name: "法力彈",
            icon: "🔵",
            type: 'active',
            rarity: 'common',
            maxCd: 0,
            costSp: 10,
            costAction: 1
        });
    }

    // 💡 統一的數值公式
    getDamage(playerStore: PlayerStoreType): number {
        const apIncrease = playerStore?.finalStats?.apIncrease ?? 0;
        return Math.floor(
            (5 + this.level * 5 + this.proficiency * 0.15) *
            (1 + apIncrease / 100)
        );
    }

    description(playerStore: PlayerStoreType): string {
        const dmg = this.getDamage(playerStore);
        return `對目標丟出一法力凝聚的光彈,造成 ${ColorText.ap(dmg)}。`;
    }

    protected execute(params: SkillParams): boolean {
        const playerStore = params.playerStore;
        const monster = params.monster;
        if (!playerStore || !monster) return false;

        const dmg = this.getDamage(playerStore);
        monster.lastDamageResult = applySkillDamage(
            playerStore.finalStats,
            monster,
            dmg,
            'ap',
            '法力彈'
        );
        return true;
    }
}

export class PhysiqueBoost extends SkillModel {
    constructor() {
        super({
            id: 'PhysiqueBoost',
            name: "強健體魄",
            icon: "🏋️",
            type: 'passive',
            rarity: 'common',
            maxCd: 0,
            costSp: 0,
            costHp: 0,
            costAction: 0
        });
    }

    // 💡 統一的數值公式
    get hpBonus(): number {
        return 20 * this.level;
    }

    description(playerStore: PlayerStoreType): string {
        return `【被動】最大生命值增加 ${this.hpBonus} 點。`;
    }

    protected execute(params: SkillParams): boolean {
        return true;
    }

    override getPassiveBonus(): Record<string, number> {
        return {
            hpLimit: this.hpBonus
        };
    }
}
