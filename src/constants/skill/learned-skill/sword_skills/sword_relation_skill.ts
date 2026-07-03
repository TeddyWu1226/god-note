/**
 * 劍術相關
 */
import {SkillModel} from "src/models/skill-model";
import {PlayerStoreType, SkillOnPlayerAttackHitParams, SkillTreeNode, SkillParams} from "src/types";
import {applySkillDamage, getSkillFinalDamage} from "src/constants/fight-func";
import {useCardImpactEffect} from "src/components/Shared/CardImpactEffect/useCardImpactEffect";
import {getMonsterElement, Sleep} from "src/utils/create";
import {checkProbability} from "src/utils/math";
import {MonsterModel} from "src/models/monster-model";
import {useLogStore} from "src/store/log-store";
import {UsualStatus} from "src/constants/status/usual-status";
import {ColorText} from "src/utils/color";
import {showEffect} from "src/components/Shared/FloatingEffect/EffectManager";

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
        critIncrease: 15,
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

export class MasterSwordVertical extends SkillModel {
    constructor() {
        super({
            id: 'MasterSwordVertical',
            name: '大師劍技-劈山',
            icon: 'skills/passive/master_vertical.svg',
            type: 'passive',
            rarity: 'perfect',
            uniqueFields: ['進階劍技']
        });
    }

    bonus = {
        critIncrease: 20,
        critRate: 20,
    }

    description(): string {
        return `增加 ${this.bonus.critRate}% 爆擊率, ${this.bonus.critIncrease}% 爆擊傷害。\n(大師級進階劍技，繼承並強化豎之型)`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        return this.bonus;
    }
}

export class MasterSwordHorizontal extends SkillModel {
    constructor() {
        super({
            id: 'MasterSwordHorizontal',
            name: '大師劍技-砍海',
            icon: 'skills/passive/master_horizontal.svg',
            type: 'passive',
            rarity: 'perfect',
            uniqueFields: ['進階劍技']
        });
    }

    diffusionRate = 60

    description(): string {
        return `攻擊時，對其餘敵人造成該次傷害 ${this.diffusionRate}% 的擴散傷害。\n(大師級進階劍技，繼承並強化橫之型)`;
    }

    protected execute(): boolean {
        return true;
    }

    override onPlayerAttackHit({monster, attackOutcome, playerStore, gameStateStore}: SkillOnPlayerAttackHitParams) {
        const rate = (this.diffusionRate / 100);
        if (attackOutcome.baseDamage * rate > 0) {
            const enemies = gameStateStore.currentEnemy || [];
            enemies.forEach((enemy: MonsterModel) => {
                if (enemy && enemy.id !== monster.id && enemy.hp > 0) {
                    enemy.lastDamageResult = applySkillDamage({
                        speller: playerStore,
                        target: enemy,
                        baseValue: attackOutcome.baseDamage * rate,
                        type: 'ad',
                        skillName: '大師劍技-砍海'
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

export class MasterSwordPoint extends SkillModel {
    constructor() {
        super({
            id: 'MasterSwordPoint',
            name: '大師劍技-點墨',
            icon: 'skills/passive/master_point.svg',
            type: 'passive',
            rarity: 'perfect',
            uniqueFields: ['進階劍技']
        });
    }

    chance = 25

    getValue(playerStore: PlayerStoreType): number {
        return 5 + Math.floor(playerStore.info.level * 0.2);
    }

    description(playerStore: PlayerStoreType): string {
        return `攻擊時有 ${this.chance}% 機率使目標陷入「破甲」狀態（防禦力降低 ${this.getValue(playerStore)} 點以及降低 10% 抗性，持續 3 回合）。\n(大師級進階劍技，繼承並強化點之型)`;
    }

    protected execute(): boolean {
        return true;
    }

    override onPlayerAttackHit({monster, playerStore}: SkillOnPlayerAttackHitParams) {
        if (checkProbability((this.chance / 100))) {
            monster.addEffect(UsualStatus.ArmorBreak, {
                bonus: {
                    adDefend: -this.getValue(playerStore),
                    defendIncrease: -10
                }
            });
            useCardImpactEffect(getMonsterElement(monster.id), 'thrust');
        }
    }
}


export class DoubleSlash extends SkillModel {
    constructor() {
        super({
            id: 'DoubleSlash',
            name: "二連斬",
            icon: "skills/active/double_slash.svg",
            type: 'active',
            rarity: 'rare',
            costSp: 15,
            costAction: 1,
            maxCd: 2
        });
    }

    getSingleDamage(playerStore: PlayerStoreType): number {
        const ad = playerStore?.finalStats?.ad ?? 0;
        return Math.round(ad * 0.7);
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getSingleDamage(playerStore),
            type: 'ad'
        });
        return `連續劈砍目標兩次，每次造成 ${ColorText.ad(damage)} (0.7 AD) 物理傷害。`;
    }

    protected async execute({playerStore, monster}: SkillParams): Promise<boolean> {
        if (!playerStore || !monster) return false;

        const dmg = this.getSingleDamage(playerStore);

        for (let i = 0; i < 2; i++) {
            if (monster.hp <= 0) break;
            monster.lastDamageResult = applySkillDamage({
                speller: playerStore,
                target: monster,
                baseValue: dmg,
                type: 'ad',
                skillName: `${this.name} (${i + 1}擊)`
            });
            useCardImpactEffect(getMonsterElement(monster.id), 'physical');
            if (i < 1) await Sleep(200);
        }

        return true;
    }
}

export class TripleSlash extends SkillModel {
    constructor() {
        super({
            id: 'TripleSlash',
            name: "三連斬",
            icon: "skills/active/triple_slash.svg",
            type: 'active',
            rarity: 'perfect',
            costSp: 25,
            costAction: 1,
            maxCd: 2
        });
    }

    getSingleDamage(playerStore: PlayerStoreType): number {
        const ad = playerStore?.finalStats?.ad ?? 0;
        return Math.round(ad * 0.8);
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getSingleDamage(playerStore),
            type: 'ad'
        });
        return `連續揮斬目標三次，每次造成 ${ColorText.ad(damage)} (0.8 AD) 物理傷害。`;
    }

    protected async execute({playerStore, monster}: SkillParams): Promise<boolean> {
        if (!playerStore || !monster) return false;

        const dmg = this.getSingleDamage(playerStore);

        for (let i = 0; i < 3; i++) {
            if (monster.hp <= 0) break;
            monster.lastDamageResult = applySkillDamage({
                speller: playerStore,
                target: monster,
                baseValue: dmg,
                type: 'ad',
                skillName: `${this.name} (${i + 1}擊)`
            });
            useCardImpactEffect(getMonsterElement(monster.id), 'physical');
            if (i < 2) await Sleep(200);
        }

        return true;
    }
}

export class HorizontalSweep extends SkillModel {
    constructor() {
        super({
            id: 'HorizontalSweep',
            name: "水平斬",
            icon: "skills/active/horizontal_sweep.svg",
            type: 'active',
            rarity: 'rare',
            costSp: 20,
            costAction: 1,
            maxCd: 3
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        const ad = playerStore?.finalStats?.ad ?? 0;
        return Math.round(ad * 0.8 + 10);
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'ad'
        });
        return `向前方橫掃打擊所有目標，造成 ${ColorText.ad(damage)} (0.8 AD + 10) 物理範圍傷害。`;
    }

    protected execute({playerStore, gameStateStore}: SkillParams): boolean {
        if (!playerStore || !gameStateStore) return false;

        const dmg = this.getDamage(playerStore);
        const enemies = gameStateStore.currentEnemy || [];

        enemies.forEach(enemy => {
            if (enemy.hp > 0) {
                enemy.lastDamageResult = applySkillDamage({
                    speller: playerStore,
                    target: enemy,
                    baseValue: dmg,
                    type: 'ad',
                    skillName: this.name
                });
                useCardImpactEffect(getMonsterElement(enemy.id), 'horizontal-slash');
            }
        });

        return true;
    }
}

export class WhirlwindSlash extends SkillModel {
    constructor() {
        super({
            id: 'WhirlwindSlash',
            name: "旋風斬",
            icon: "skills/active/whirlwind_slash.svg",
            type: 'active',
            rarity: 'perfect',
            costSp: 30,
            costAction: 1,
            maxCd: 3
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        const ad = playerStore?.finalStats?.ad ?? 0;
        return Math.round(ad * 1.0);
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'ad'
        });
        return `高速旋轉揮劍斬擊所有目標，造成 ${ColorText.ad(damage)} (1.0 AD) 物理範圍傷害。`;
    }

    protected execute({playerStore, gameStateStore}: SkillParams): boolean {
        if (!playerStore || !gameStateStore) return false;

        const dmg = this.getDamage(playerStore);
        const enemies = gameStateStore.currentEnemy || [];

        enemies.forEach(enemy => {
            if (enemy.hp > 0) {
                enemy.lastDamageResult = applySkillDamage({
                    speller: playerStore,
                    target: enemy,
                    baseValue: dmg,
                    type: 'ad',
                    skillName: this.name
                });
                useCardImpactEffect(getMonsterElement(enemy.id), 'horizontal-slash');
            }
        });

        return true;
    }
}

export class ThrustCharge extends SkillModel {
    constructor() {
        super({
            id: 'ThrustCharge',
            name: "突進斬",
            icon: "skills/active/thrust_charge.svg",
            type: 'active',
            rarity: 'rare',
            costSp: 20,
            costAction: 1,
            maxCd: 2
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        const ad = playerStore?.finalStats?.ad ?? 0;
        const hit = playerStore?.finalStats?.hit ?? 0;
        const extraDamage = Math.min(200, Math.round(hit * 0.2));
        return Math.round(10 + ad * 1.2 + extraDamage);
    }

    description(playerStore: PlayerStoreType): string {
        const ad = playerStore?.finalStats?.ad ?? 0;
        const hit = playerStore?.finalStats?.hit ?? 0;
        const extraDamage = Math.min(200, Math.round(hit * 0.2));
        const finalBase = Math.round(10 + ad * 1.2 + extraDamage);

        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: finalBase,
            type: 'ad'
        });
        return `向前突進刺擊，造成 ${ColorText.ad(damage)} 物理傷害。\n(基礎 10 + 1.2 AD，並依據命中值 ${hit} 額外增加 ${extraDamage} 點傷害，最高增加 200)`;
    }

    protected execute({playerStore, monster}: SkillParams): boolean {
        if (!playerStore || !monster) return false;

        const dmg = this.getDamage(playerStore);
        monster.lastDamageResult = applySkillDamage({
            speller: playerStore,
            target: monster,
            baseValue: dmg,
            type: 'ad',
            skillName: this.name
        });

        useCardImpactEffect(getMonsterElement(monster.id), 'thrust');
        return true;
    }
}

export class AssaultCharge extends SkillModel {
    constructor() {
        super({
            id: 'AssaultCharge',
            name: "衝鋒斬",
            icon: "skills/active/assault_charge.svg",
            type: 'active',
            rarity: 'perfect',
            costSp: 30,
            costAction: 1,
            maxCd: 2
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        const ad = playerStore?.finalStats?.ad ?? 0;
        const hit = playerStore?.finalStats?.hit ?? 0;
        const extraDamage = Math.min(400, Math.round(hit * 0.3));
        return Math.round(20 + ad * 1.4 + extraDamage);
    }

    description(playerStore: PlayerStoreType): string {
        const ad = playerStore?.finalStats?.ad ?? 0;
        const hit = playerStore?.finalStats?.hit ?? 0;
        const extraDamage = Math.min(400, Math.round(hit * 0.3));
        const finalBase = Math.round(20 + ad * 1.4 + extraDamage);

        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: finalBase,
            type: 'ad'
        });
        return `帶起衝鋒裂焰突刺，造成 ${ColorText.ad(damage)} 物理傷害。\n(基礎 20 + 1.4 AD，並依據命中值 ${hit} 額外增加 ${extraDamage} 點傷害，最高增加 400)`;
    }

    protected execute({playerStore, monster}: SkillParams): boolean {
        if (!playerStore || !monster) return false;

        const dmg = this.getDamage(playerStore);
        monster.lastDamageResult = applySkillDamage({
            speller: playerStore,
            target: monster,
            baseValue: dmg,
            type: 'ad',
            skillName: this.name
        });

        useCardImpactEffect(getMonsterElement(monster.id), 'thrust');
        return true;
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
    },
    MasterSwordVertical: {
        id: 'MasterSwordVertical',
        pathId: 'continuous_swordplay',
        tier: 3,
        evolvesFrom: ['ContinuousSwordVertical'],
        checkEligible: (playerStore) => {
            return playerStore.hasSkill('ContinuousSwordVertical') && playerStore.checkSkillPath('swordplay');
        }
    },
    MasterSwordHorizontal: {
        id: 'MasterSwordHorizontal',
        pathId: 'continuous_swordplay',
        tier: 3,
        evolvesFrom: ['ContinuousSwordHorizontal'],
        checkEligible: (playerStore) => {
            return playerStore.hasSkill('ContinuousSwordHorizontal') && playerStore.checkSkillPath('swordplay');
        }
    },
    MasterSwordPoint: {
        id: 'MasterSwordPoint',
        pathId: 'continuous_swordplay',
        tier: 3,
        evolvesFrom: ['ContinuousSwordPoint'],
        checkEligible: (playerStore) => {
            return playerStore.hasSkill('ContinuousSwordPoint') && playerStore.checkSkillPath('swordplay');
        }
    },
    DoubleSlash: {
        id: 'DoubleSlash',
        pathId: 'double_slash',
        tier: 2,
        evolvesFrom: ['VerticalSlash'],
        checkEligible: (playerStore) => {
            return playerStore.hasSkill('VerticalSlash') && playerStore.checkSkillPath('swordplay');
        }
    },
    TripleSlash: {
        id: 'TripleSlash',
        pathId: 'double_slash',
        tier: 3,
        evolvesFrom: ['DoubleSlash'],
        checkEligible: (playerStore) => {
            return playerStore.hasSkill('DoubleSlash') && playerStore.checkSkillPath('swordplay');
        }
    },
    HorizontalSweep: {
        id: 'HorizontalSweep',
        pathId: 'horizontal_sweep',
        tier: 2,
        evolvesFrom: ['HorizontalSlash'],
        checkEligible: (playerStore) => {
            return playerStore.hasSkill('HorizontalSlash') && playerStore.checkSkillPath('swordplay');
        }
    },
    WhirlwindSlash: {
        id: 'WhirlwindSlash',
        pathId: 'horizontal_sweep',
        tier: 3,
        evolvesFrom: ['HorizontalSweep'],
        checkEligible: (playerStore) => {
            return playerStore.hasSkill('HorizontalSweep') && playerStore.checkSkillPath('swordplay');
        }
    },
    ThrustCharge: {
        id: 'ThrustCharge',
        pathId: 'thrust_charge',
        tier: 2,
        evolvesFrom: ['Thrust'],
        checkEligible: (playerStore) => {
            return playerStore.hasSkill('Thrust') && playerStore.checkSkillPath('swordplay');
        }
    },
    AssaultCharge: {
        id: 'AssaultCharge',
        pathId: 'thrust_charge',
        tier: 3,
        evolvesFrom: ['ThrustCharge'],
        checkEligible: (playerStore) => {
            return playerStore.hasSkill('ThrustCharge') && playerStore.checkSkillPath('swordplay');
        }
    }
}