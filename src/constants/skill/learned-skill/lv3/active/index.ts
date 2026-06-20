import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillParams} from "@/types";
import {ColorText} from "@/utils/color";
import {applySkillDamage} from "@/constants/fight-func";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {genCustomStatus, getMonsterElement} from "@/utils/create";
import {useCardImpactEffect} from "@/components/Shared/CardImpactEffect/useCardImpactEffect";

/**
 * 垂直斬 (VerticalSlashMaster) - 進化自 劈砍
 * 主動技能，造成高額單體傷害，並在下一回合提升 10% 物理傷害。
 */
export class VerticalSlashMaster extends SkillModel {
    constructor() {
        super({
            id: 'VerticalSlashMaster',
            name: "垂直斬",
            icon: "skills/active/vertical_slash_master.svg",
            type: 'active',
            rarity: 'legendary',
            maxCd: 0,
            costSp: 20,
            costAction: 1,
            maxProficiency: 100,
            proficiencyGain: 1,
            uniqueFields: ['豎擊'],
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        const ad = playerStore?.finalStats?.ad ?? 0;
        return Math.round(ad * 2.2 + this.proficiency * 0.8);
    }

    description(playerStore: PlayerStoreType): string {
        const dmg = this.getDamage(playerStore);
        return `對單體敵人發動致命的垂直斬擊，造成 ${ColorText.ad(dmg)} 物理傷害，並使下一回合提升 10% 物理傷害。`;
    }

    protected execute(params: SkillParams): boolean {
        const playerStore = params.playerStore;
        const monster = params.monster;
        if (!playerStore || !monster) return false;

        const dmg = this.getDamage(playerStore);
        monster.lastDamageResult = applySkillDamage(playerStore.finalStats, monster, dmg, 'ad', this.name);
        useCardImpactEffect(params.targetElement || null, 'vertical-slash');

        // 提升下一回合 10% 物理傷害
        playerStore.addStatus(genCustomStatus({
            base: {
                name: '攻擊強化+',
                icon: '🗡️',
                duration: 2,
                isBuff: true,
                description: '提升 10% 物理傷害',
                bonus: {
                    adIncrease: 10
                }
            },
            duration: 2
        }));

        useFullScreenEffect({
            message: '垂直斬',
            color: 'red'
        });

        return true;
    }
}

/**
 * 水平斬 (HorizontalSlashMaster) - 進化自 劍氣
 * 主動技能，對全體敵人造成高額物理傷害，並在下一回合提升 10% 物理傷害。
 */
export class HorizontalSlashMaster extends SkillModel {
    constructor() {
        super({
            id: 'HorizontalSlashMaster',
            name: "水平斬",
            icon: "skills/active/horizontal_slash_master.svg",
            type: 'active',
            rarity: 'legendary',
            maxCd: 0,
            costSp: 30,
            costAction: 1,
            maxProficiency: 100,
            proficiencyGain: 1,
            uniqueFields: ['橫擊'],
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        const ad = playerStore?.finalStats?.ad ?? 0;
        return Math.round(((140 + this.proficiency) / 100) * ad);
    }

    description(playerStore: PlayerStoreType): string {
        const dmg = this.getDamage(playerStore);
        return `發動毀滅性的水平斬擊，對全體敵人造成 ${ColorText.ad(dmg)} 物理傷害，並使下一回合提升 10% 物理傷害。`;
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
                this.name
            );
            const el = getMonsterElement(enemy.id);
            if (el) {
                useCardImpactEffect(el, 'horizontal-slash');
            }
        });

        // 提升下一回合 10% 物理傷害
        playerStore.addStatus(genCustomStatus({
            base: {
                name: '攻擊強化+',
                icon: '🗡️',
                duration: 2,
                isBuff: true,
                description: '提升 10% 物理傷害',
                bonus: {
                    adIncrease: 10
                }
            },
            duration: 2
        }));

        useFullScreenEffect({
            message: '水平斬',
            color: 'orange'
        });

        return true;
    }
}

