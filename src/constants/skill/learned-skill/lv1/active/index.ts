import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillParams} from "@/types";
import {ColorText} from "@/utils/color";
import {applySkillDamage} from "@/constants/fight-func";

export class CommonHeal extends SkillModel {
    constructor() {
        super({
            id: 'CommonHeal',
            name: "初級治療",
            icon: "skills/heal_icon.svg",
            type: 'active',
            rarity: 'common',
            maxCd: 2,
            costSp: 25,
            costAction: 1,
            maxProficiency: 50,
            proficiencyGain: 2
        });
    }

    get healVal(): number {
        return Math.round(30 + this.level * 15 + this.proficiency * 0.7);
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

export class VerticalSlash extends SkillModel {
    constructor() {
        super({
            id: 'VerticalSlash',
            name: "豎擊",
            icon: "skills/vertical_slash_icon.svg",
            type: 'active',
            rarity: 'common',
            maxCd: 0,
            costSp: 5,
            costAction: 1,
            maxProficiency: 50,
            proficiencyGain: 2
        });
    }

    get extraDamage(): number {
        return Math.round(this.proficiency / 5);
    }

    description(playerStore: PlayerStoreType): string {
        const ad = playerStore?.finalStats?.ad ?? 0;
        const total = ad + this.extraDamage;
        return `由上往下攻擊，總計造成 ${ColorText.ad(total)} 。`;
    }

    protected execute(params: SkillParams): boolean {
        const playerStore = params.playerStore;
        const monster = params.monster;
        if (!playerStore || !monster) return false;

        const totalDmg = playerStore.finalStats.ad + this.extraDamage;
        monster.lastDamageResult = applySkillDamage(
            playerStore.finalStats,
            monster,
            totalDmg,
            'ad',
            '豎擊'
        );
        return true;
    }
}

export class HorizontalSlash extends SkillModel {
    constructor() {
        super({
            id: 'HorizontalSlash',
            name: "橫擊",
            icon: "skills/horizontal_slash_icon.svg",
            type: 'active',
            rarity: 'common',
            maxCd: 0,
            costSp: 15,
            costAction: 1,
            maxProficiency: 50,
            proficiencyGain: 2
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        const ad = playerStore?.finalStats?.ad ?? 0;
        return Math.round(((50 + this.proficiency) / 100) * ad);
    }

    description(playerStore: PlayerStoreType): string {
        const dmg = this.getDamage(playerStore);
        return `橫揮手中武器，造成全部敵人 ${ColorText.ad(dmg)} 。`;
    }

    protected execute(params: SkillParams): boolean {
        const playerStore = params.playerStore;
        const gameStateStore = params.gameStateStore;
        if (!playerStore || !gameStateStore) return false;

        const enemies = gameStateStore.currentEnemy || [];
        if (enemies.length === 0) return false;

        const dmg = this.getDamage(playerStore);
        enemies.forEach((enemy) => {
            enemy.lastDamageResult = applySkillDamage(
                playerStore.finalStats,
                enemy,
                dmg,
                'ad',
                '橫擊'
            );
        });
        return true;
    }
}

export class Thrust extends SkillModel {
    constructor() {
        super({
            id: 'Thrust',
            name: "刺擊",
            icon: "skills/thrust_icon.svg",
            type: 'active',
            rarity: 'common',
            maxCd: 0,
            costSp: 10,
            costAction: 1,
            maxProficiency: 50,
            proficiencyGain: 2
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        const ad = playerStore?.finalStats?.ad ?? 0;
        return Math.round(ad + 5 + this.proficiency * 0.6);
    }

    description(playerStore: PlayerStoreType): string {
        const dmg = this.getDamage(playerStore);
        return `蓄力向前刺擊，造成較高的${ColorText.ad(dmg)}，但降低 30% 命中率。`;
    }

    protected execute(params: SkillParams): boolean {
        const playerStore = params.playerStore;
        const monster = params.monster;
        if (!playerStore || !monster) return false;

        const dmg = this.getDamage(playerStore);

        const adjustedAttacker = {
            ...playerStore.finalStats,
            hit: (playerStore.finalStats.hit || 0) - 30
        } as any;

        monster.lastDamageResult = applySkillDamage(
            adjustedAttacker,
            monster,
            dmg,
            'ad',
            '刺擊'
        );
        return true;
    }
}

export class MagicBall extends SkillModel {
    constructor() {
        super({
            id: 'MagicBall',
            name: "法力彈",
            icon: "skills/magic_ball_icon.svg",
            type: 'active',
            rarity: 'common',
            maxCd: 0,
            costSp: 10,
            costAction: 1,
            maxProficiency: 50,
            proficiencyGain: 2
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        const apIncrease = playerStore?.finalStats?.apIncrease ?? 0;
        return Math.round(
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

export class SwordMastery extends SkillModel {
    constructor() {
        super({
            id: 'SwordMastery',
            name: "劍術精通",
            icon: "skills/sword_mastery.svg",
            type: 'passive',
            rarity: 'common',
        });
    }

    description(playerStore: PlayerStoreType): string {
        return `裝備劍（名稱含有「劍」的武器）時，提升 10% 物理傷害。`;
    }

    protected execute(params: SkillParams): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        const weaponName = player?.equips?.weapon?.name || '';
        if (weaponName.includes('劍')) {
            return {
                adIncrease: 10
            };
        }
        return {};
    }
}

