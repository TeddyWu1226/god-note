/**
 * 物理輸出相關
 */
import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillParams, SkillTreeNode} from "@/types";
import {ColorText} from "@/utils/color";
import {applySkillDamage, getSkillFinalDamage} from "@/constants/fight-func";
import {useCardImpactEffect} from "@/components/Shared/CardImpactEffect/useCardImpactEffect";
import {getMonsterElement} from "@/utils/create";

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
        return Math.floor(ad * 1.2)
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.extraDamage(playerStore),
            type: 'ad'
        })
        return `由上往下攻擊，總計造成 ${ColorText.ad(damage)}。`;
    }

    protected execute({playerStore, monster}: SkillParams): boolean {
        if (!playerStore || !monster) return false;

        const totalDmg = this.extraDamage(playerStore);
        monster.lastDamageResult = applySkillDamage({
            speller: playerStore,
            target: monster,
            baseValue: totalDmg,
            type: 'ad',
            skillName: '豎擊'
        });
        useCardImpactEffect(getMonsterElement(monster.id), 'vertical-slash');
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
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'ad'
        })
        return `橫揮手中武器，造成全部敵人 ${ColorText.ad(damage)} 。`;
    }

    protected execute({playerStore, gameStateStore}: SkillParams): boolean {
        if (!playerStore || !gameStateStore) return false;

        const enemies = gameStateStore.currentEnemy || [];
        if (enemies.length === 0) return false;

        const dmg = this.getDamage(playerStore);
        enemies.forEach((enemy) => {
            enemy.lastDamageResult = applySkillDamage({
                speller: playerStore,
                target: enemy,
                baseValue: dmg,
                type: 'ad',
                skillName: '橫擊'
            });
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
        return Math.floor(ad * 1.5)
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'ad'
        })
        return `蓄力向前刺擊，造成較高的${ColorText.ad(damage)}，但降低此招 20 命中值。`;
    }

    protected execute({playerStore, monster}: SkillParams): boolean {
        if (!playerStore || !monster) return false;

        const dmg = this.getDamage(playerStore);

        monster.lastDamageResult = applySkillDamage({
            speller: playerStore,
            target: monster,
            baseValue: dmg,
            type: 'ad',
            skillName: '刺擊',
            modifiers: {hit: -20}
        });
        useCardImpactEffect(getMonsterElement(monster.id), 'thrust');
        return true;
    }
}

export const AdBasicSkillTree: Record<string, SkillTreeNode> = {
    VerticalSlash: {id: 'VerticalSlash', pathId: 'vertical_slash', tier: 0},
    HorizontalSlash: {id: 'HorizontalSlash', pathId: 'horizontal_slash', tier: 0},
    Thrust: {id: 'Thrust', pathId: 'thrust', tier: 0},
}