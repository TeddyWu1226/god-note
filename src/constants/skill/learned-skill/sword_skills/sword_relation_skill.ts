/**
 * 劍術相關
 */
import {SkillModel} from "src/models/skill-model";
import {PlayerStoreType, SkillOnPlayerAttackHitParams, SkillTreeNode} from "src/types";
import {applySkillDamage} from "src/constants/fight-func";
import {useCardImpactEffect} from "src/components/Shared/CardImpactEffect/useCardImpactEffect";
import {getMonsterElement} from "src/utils/create";
import {isMatchedWeapon, WeaponSkillMapping} from "src/constants/default-const";
import {checkProbability} from "src/utils/math";
import {MonsterModel} from "src/models/monster-model";
import {useLogStore} from "src/store/log-store";
import {UsualStatus} from "src/constants/status/usual-status";
import {SwordBaseSkillTree} from "@/constants/skill/learned-skill/sword_skills/sword_base";

export class ContinuousSwordVertical extends SkillModel {
    constructor() {
        super({
            id: 'ContinuousSwordVertical',
            name: '進階劍技-豎之型',
            icon: 'skills/passive/continuous_vertical.svg',
            type: 'passive',
            rarity: 'rare',
            uniqueFields: ['進階劍技']
        });
    }

    bonus = {
        critIncrease: 20,
        critRate: 10,
    }

    description(): string {
        return `增加 ${this.bonus.critRate}% 爆擊率, ${this.bonus.critIncrease}% 爆擊傷害。\n(進階劍技系列只能習得一招)`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        return this.bonus
    }
}

export class ContinuousSwordHorizontal extends SkillModel {
    constructor() {
        super({
            id: 'ContinuousSwordHorizontal',
            name: '進階劍技-橫之型',
            icon: 'skills/passive/continuous_horizontal.svg',
            type: 'passive',
            rarity: 'rare',
            uniqueFields: ['進階劍技']
        });
    }

    happenRate = 25
    diffusionRate = 50

    description(): string {
        return `攻擊時有 ${this.happenRate}% 機率，對其餘敵人造成該次傷害 ${this.diffusionRate}% 的擴散傷害。\n(進階劍技系列只能習得一招)`;
    }

    protected execute(): boolean {
        return true;
    }

    override onPlayerAttackHit({monster, attackOutcome, playerStore, gameStateStore}: SkillOnPlayerAttackHitParams) {
        if (checkProbability((this.happenRate / 100))) {
            const rate = (this.diffusionRate / 100)
            if (attackOutcome.baseDamage * rate > 0) {
                const enemies = gameStateStore.currentEnemy || [];
                enemies.forEach((enemy: MonsterModel) => {
                    if (enemy && enemy.id !== monster.id && enemy.hp > 0) {
                        enemy.lastDamageResult = applySkillDamage({
                            speller: playerStore,
                            target: enemy,
                            baseValue: attackOutcome.baseDamage * rate,
                            type: 'ad',
                            skillName: '進階劍技-橫之型'
                        });
                        const el = getMonsterElement(enemy.id)
                        if (el) {
                            useCardImpactEffect(el, 'horizontal-slash');
                        }
                    }
                });
            }
        }
    }
}

export class ContinuousSwordPoint extends SkillModel {
    constructor() {
        super({
            id: 'ContinuousSwordPoint',
            name: '進階劍技-點之型',
            icon: 'skills/passive/continuous_point.svg',
            type: 'passive',
            rarity: 'rare',
            uniqueFields: ['進階劍技']
        });
    }

    chance = 25

    getValue(playerStore: PlayerStoreType): number {
        return 5 + Math.floor(playerStore.info.level * 0.2)
    }

    description(playerStore: PlayerStoreType): string {
        return `攻擊時有 ${this.chance}% 機率，使目標陷入「破甲」狀態（防禦力降低 ${this.getValue(playerStore)} (5+0.2*等級) 點，持續 3 回合）。\n(進階劍技系列只能習得一招)`;
    }

    protected execute(): boolean {
        return true;
    }

    override onPlayerAttackHit({monster, playerStore}: SkillOnPlayerAttackHitParams) {
        if (checkProbability((this.chance / 100))) {
            const logStore = useLogStore();
            monster.addEffect(UsualStatus.ArmorBreak, {bonus: {adDefend: -this.getValue(playerStore)}});
            logStore.logger.add(` ${monster.name} 陷入破甲狀態！`);
            useCardImpactEffect(getMonsterElement(monster.id), 'thrust');
        }
    }
}

export const SwordRelationSkillTree: Record<string, SkillTreeNode> = {
    ContinuousSwordVertical: {
        id: 'ContinuousSwordVertical',
        pathId: 'continuous_swordplay',
        tier: 2,
        evolvesFrom: ['VerticalSlash'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('VerticalSlash');
            if (!baseSkill) return false;
            return playerStore.checkSkillPath('swordplay');
        }
    },
    ContinuousSwordHorizontal: {
        id: 'ContinuousSwordHorizontal',
        pathId: 'continuous_swordplay',
        tier: 2,
        evolvesFrom: ['HorizontalSlash'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('HorizontalSlash');
            if (!baseSkill) return false;
            return playerStore.checkSkillPath('swordplay');
        }
    },
    ContinuousSwordPoint: {
        id: 'ContinuousSwordPoint',
        pathId: 'continuous_swordplay',
        tier: 2,
        evolvesFrom: ['Thrust'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('Thrust');
            if (!baseSkill) return false;
            return playerStore.checkSkillPath('swordplay');
        }
    }
}