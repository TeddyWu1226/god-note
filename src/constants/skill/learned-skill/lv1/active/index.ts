import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillParams} from "@/types";
import {ColorText} from "@/utils/color";
import {applySkillDamage} from "@/constants/fight-func";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {useCardImpactEffect} from "@/components/Shared/CardImpactEffect/useCardImpactEffect";
import {genCustomStatus, getMonsterElement} from "@/utils/create";
import {SkillStatus} from "@/constants/status/skill-status";


/**
 * 物理輸出相關
 */

export class VerticalSlash extends SkillModel {
    constructor() {
        super({
            id: 'VerticalSlash',
            name: "豎擊",
            icon: "skills/active/vertical_slash_icon.svg",
            type: 'active',
            rarity: 'common',
            maxCd: 2,
            costSp: 5,
            costAction: 1,
            uniqueFields: ['豎擊'],
        });
    }

    extraDamage(playerStore): number {
        const ad = playerStore?.finalStats?.ad ?? 0;
        return Math.max(ad * 0.5 + 8, ad + 3)
    }

    description(playerStore: PlayerStoreType): string {
        const total = this.extraDamage(playerStore);
        return `由上往下攻擊，總計造成 ${ColorText.ad(total)} 。`;
    }

    protected execute(params: SkillParams): boolean {
        const playerStore = params.playerStore;
        const monster = params.monster;
        if (!playerStore || !monster) return false;

        const totalDmg = this.extraDamage(playerStore);
        monster.lastDamageResult = applySkillDamage(
            playerStore.finalStats,
            monster,
            totalDmg,
            'ad',
            '豎擊'
        );
        useCardImpactEffect(params.targetElement || null, 'vertical-slash');
        return true;
    }
}

export class HorizontalSlash extends SkillModel {
    constructor() {
        super({
            id: 'HorizontalSlash',
            name: "橫擊",
            icon: "skills/active/horizontal_slash_icon.svg",
            type: 'active',
            rarity: 'common',
            maxCd: 2,
            costSp: 15,
            costAction: 1,
            uniqueFields: ['橫擊'],
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        const ad = playerStore?.finalStats?.ad ?? 0;
        return Math.round(0.8 * ad)
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
            const el = getMonsterElement(enemy.id)
            if (el) {
                useCardImpactEffect(el, 'horizontal-slash');
            }
        });
        return true;
    }
}

export class Thrust extends SkillModel {
    constructor() {
        super({
            id: 'Thrust',
            name: "刺擊",
            icon: "skills/active/thrust_icon.svg",
            type: 'active',
            rarity: 'common',
            maxCd: 2,
            costSp: 10,
            costAction: 1
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        const ad = playerStore?.finalStats?.ad ?? 0;
        return ad + 5
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
        useCardImpactEffect(params.targetElement || null, 'thrust');
        return true;
    }
}

/**
 * 法術輸出相關
 */
export class MagicBall extends SkillModel {
    constructor() {
        super({
            id: 'MagicBall',
            name: "法力彈",
            icon: "skills/active/magic_ball_icon.svg",
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
        useCardImpactEffect(params.targetElement || null, 'magic');
        return true;
    }
}


/**
 * 純BUFF相關
 * Buff類 統一不看熟練度
 * maxProficiency: 0, proficiencyGain: 0
 *
 */
export class FocusBuff extends SkillModel {
    constructor() {
        super({
            id: 'FocusBuff',
            name: "專注意志",
            icon: "skills/active/focus_buff.svg",
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
        return `提升自身 10 點命中，持續 5 回合。[冷卻: ${this.maxCd} 回合]`;
    }

    protected execute(params: SkillParams): boolean {
        const playerStore = params.playerStore;
        if (!playerStore) return false;

        const buff = genCustomStatus({
            base: SkillStatus.Focus,
        });
        playerStore.addStatus(buff);
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
            icon: "skills/active/will_buff.svg",
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
        return `提升自身 10% 抗性，持續 5 回合。`;
    }

    protected execute({playerStore}: SkillParams): boolean {
        if (!playerStore) return false;

        const buff = genCustomStatus({
            base: SkillStatus.Will,
        });
        playerStore.addStatus(buff);
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
            icon: "skills/active/fight_buff.svg",
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
        return `提升自身 20% 增傷，持續 5 回合。`;
    }

    protected execute({playerStore}: SkillParams): boolean {
        if (!playerStore) return false;

        const buff = genCustomStatus({
            base: SkillStatus.Fight,
        });
        playerStore.addStatus(buff);
        useFullScreenEffect({
            message: this.name,
            color: '#f1c40f',
        });
        return true;
    }
}

/**
 * 其他相關
 */
export class CommonHeal extends SkillModel {
    constructor() {
        super({
            id: 'CommonHeal',
            name: "初級治療",
            icon: "skills/active/heal_icon.svg",
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
        useFullScreenEffect({
            message: this.name,
            color: 'green',
        });
        return true;
    }
}
