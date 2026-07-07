/**
 * 劍術相關
 */
import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillOnPlayerAttackHitParams, SkillParams, SkillTreeNode, UserType} from "@/types";
import {applySkillDamage, getSkillFinalDamage} from "@/constants/fight-func";
import {useCardImpactEffect} from "@/components/Shared/CardImpactEffect/useCardImpactEffect";
import {getMonsterElement, Sleep} from "@/utils/create";
import {checkProbability} from "@/utils/math";
import {MonsterModel} from "@/models/monster-model";
import {ColorText} from "@/utils/color";
import {SkillStatus} from "@/constants/status/skill-status";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {isEquip, wrongWeaponEffect} from "@/constants/skill/utils";
import {EquipmentPosition} from "@/enums/enums";
import {showEffect} from "@/components/Shared/FloatingEffect/EffectManager";

export class ContinuousSwordVertical extends SkillModel {
    constructor() {
        super({
            id: 'ContinuousSwordVertical',
            name: '進階劍技-豎之型',
            icon: 'skills/physical/continuous_vertical.svg',
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
        if (isEquip('Sword', EquipmentPosition.WEAPON, player)) {
            return this.bonus
        }
        return {}
    }
}

export class ContinuousSwordHorizontal extends SkillModel {
    constructor() {
        super({
            id: 'ContinuousSwordHorizontal',
            name: '進階劍技-橫之型',
            icon: 'skills/physical/continuous_horizontal.svg',
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
        if (!isEquip('Sword', EquipmentPosition.WEAPON, playerStore.info)) {
            showEffect()
            return
        }
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
            icon: 'skills/physical/continuous_point.svg',
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
        if (!isEquip('Sword', EquipmentPosition.WEAPON, playerStore.info)) {
            return
        }
        if (checkProbability((this.chance / 100))) {
            monster.addEffect(SkillStatus.ArmorBreak, {bonus: {adDefend: -this.getValue(playerStore)}});
            useCardImpactEffect(getMonsterElement(monster.id), 'thrust');
        }
    }
}

export class MasterSwordVertical extends SkillModel {
    constructor() {
        super({
            id: 'MasterSwordVertical',
            name: '大師劍技-劈山',
            icon: 'skills/physical/master_vertical.svg',
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

    override getPassiveBonus(player: UserType): Record<string, number> {
        if (isEquip('Sword', EquipmentPosition.WEAPON, player)) {
            return this.bonus
        }
        return {}
    }
}

export class MasterSwordHorizontal extends SkillModel {
    constructor() {
        super({
            id: 'MasterSwordHorizontal',
            name: '大師劍技-砍海',
            icon: 'skills/physical/master_horizontal.svg',
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
        if (!isEquip('Sword', EquipmentPosition.WEAPON, playerStore.info)) {
            return
        }
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
            icon: 'skills/physical/master_point.svg',
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
        if (!isEquip('Sword', EquipmentPosition.WEAPON, playerStore.info)) {
            return
        }
        if (checkProbability((this.chance / 100))) {
            monster.addEffect(SkillStatus.ArmorBreak, {
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
            icon: "skills/physical/double_slash.svg",
            type: 'active',
            rarity: 'rare',
            costSp: 15,
            costAction: 1,
            maxCd: 3
        });
    }

    getSingleDamage(playerStore: PlayerStoreType): number {
        const ad = playerStore?.finalStats?.ad ?? 0;
        return Math.round(15 + ad * 0.7);
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getSingleDamage(playerStore),
            type: 'ad'
        });
        return `連續劈砍目標兩次，每次造成 ${ColorText.ad(damage)} (0.7 AD)。`;
    }

    protected async execute({playerStore, monster}: SkillParams): Promise<boolean> {
        if (!playerStore || !monster) return false;
        if (!isEquip('Sword', EquipmentPosition.WEAPON, playerStore.info)) {
            wrongWeaponEffect('Sword')
            return false
        }

        const dmg = this.getSingleDamage(playerStore);

        for (let i = 0; i < 2; i++) {
            if (monster.hp <= 0) break;
            monster.lastDamageResult = applySkillDamage({
                speller: playerStore,
                target: monster,
                baseValue: dmg,
                canCrit: true,
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
            icon: "skills/physical/triple_slash.svg",
            type: 'active',
            rarity: 'perfect',
            costSp: 25,
            costAction: 1,
            maxCd: 3
        });
    }

    getSingleDamage(playerStore: PlayerStoreType): number {
        const ad = playerStore?.finalStats?.ad ?? 0;
        return Math.round(25 + ad * 0.8);
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getSingleDamage(playerStore),
            type: 'ad'
        });
        return `連續揮斬目標三次，每次造成 ${ColorText.ad(damage)} (0.8 AD)。`;
    }

    protected async execute({playerStore, monster}: SkillParams): Promise<boolean> {
        if (!playerStore || !monster) return false;
        if (!isEquip('Sword', EquipmentPosition.WEAPON, playerStore.info)) {
            wrongWeaponEffect('Sword')
            return false
        }
        const dmg = this.getSingleDamage(playerStore);

        for (let i = 0; i < 3; i++) {
            if (monster.hp <= 0) break;
            monster.lastDamageResult = applySkillDamage({
                speller: playerStore,
                target: monster,
                baseValue: dmg,
                type: 'ad',
                canCrit: true,
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
            icon: "skills/physical/horizontal_sweep.svg",
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
        if (!isEquip('Sword', EquipmentPosition.WEAPON, playerStore.info)) {
            wrongWeaponEffect('Sword')
            return false
        }
        const dmg = this.getDamage(playerStore);
        const enemies = gameStateStore.currentEnemy || [];

        enemies.forEach(enemy => {
            if (enemy.hp > 0) {
                enemy.lastDamageResult = applySkillDamage({
                    speller: playerStore,
                    target: enemy,
                    baseValue: dmg,
                    type: 'ad',
                    canCrit: true,
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
            icon: "skills/physical/whirlwind_slash.svg",
            type: 'active',
            rarity: 'perfect',
            costSp: 30,
            costAction: 1,
            maxCd: 3
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        const ad = playerStore?.finalStats?.ad ?? 0;
        return Math.round(ad);
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
        if (!isEquip('Sword', EquipmentPosition.WEAPON, playerStore.info)) {
            wrongWeaponEffect('Sword')
            return false
        }
        const dmg = this.getDamage(playerStore);
        const enemies = gameStateStore.currentEnemy || [];

        enemies.forEach(enemy => {
            if (enemy.hp > 0) {
                enemy.lastDamageResult = applySkillDamage({
                    speller: playerStore,
                    target: enemy,
                    baseValue: dmg,
                    type: 'ad',
                    canCrit: true,
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
            icon: "skills/physical/thrust_charge.svg",
            type: 'active',
            rarity: 'rare',
            costSp: 20,
            costAction: 1,
            maxCd: 2
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        const ad = playerStore?.finalStats?.ad ?? 0;
        return Math.round(ad * 1.2);
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'ad'
        });
        return `向前突進刺擊，造成 ${ColorText.ad(damage)} (1.2 AD)，並使目標陷入「殘廢」狀態（降低 20% 輸出，持續 2 回合）。`;
    }

    protected execute({playerStore, monster}: SkillParams): boolean {
        if (!playerStore || !monster) return false;
        if (!isEquip('Sword', EquipmentPosition.WEAPON, playerStore.info)) {
            wrongWeaponEffect('Sword')
            return false
        }
        const dmg = this.getDamage(playerStore);
        monster.lastDamageResult = applySkillDamage({
            speller: playerStore,
            target: monster,
            baseValue: dmg,
            type: 'ad',
            canCrit: true,
            skillName: this.name
        });
        if (monster.lastDamageResult.isHit) {
            monster.addEffect(SkillStatus.Cripple);
        }

        useCardImpactEffect(getMonsterElement(monster.id), 'thrust');
        return true;
    }
}

export class AssaultCharge extends SkillModel {
    constructor() {
        super({
            id: 'AssaultCharge',
            name: "衝鋒斬",
            icon: "skills/physical/assault_charge.svg",
            type: 'active',
            rarity: 'perfect',
            costSp: 30,
            costAction: 1,
            maxCd: 2
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        const ad = playerStore?.finalStats?.ad ?? 0;
        return Math.round(ad * 1.4);
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'ad'
        });
        return `帶起衝鋒向前突刺，造成 ${ColorText.ad(damage)} (1.4 AD)，並使目標陷入「殘廢」狀態（降低 20% 輸出，持續 2 回合）。`;
    }

    protected execute({playerStore, monster}: SkillParams): boolean {
        if (!playerStore || !monster) return false;
        if (!isEquip('Sword', EquipmentPosition.WEAPON, playerStore.info)) {
            wrongWeaponEffect('Sword')
            return false
        }
        const dmg = this.getDamage(playerStore);
        monster.lastDamageResult = applySkillDamage({
            speller: playerStore,
            target: monster,
            baseValue: dmg,
            type: 'ad',
            canCrit: true,
            skillName: this.name
        });

        if (monster.lastDamageResult.isHit) {
            monster.addEffect(SkillStatus.Cripple);
        }

        useCardImpactEffect(getMonsterElement(monster.id), 'thrust');
        return true;
    }
}

export class SwordPolish extends SkillModel {
    constructor() {
        super({
            id: 'SwordPolish',
            name: "打磨",
            icon: "skills/physical/sword_polish.svg",
            type: 'active',
            rarity: 'rare',
            costSp: 15,
            costAction: 1,
            maxCd: 4
        });
    }

    getValue(playerStore: PlayerStoreType): number {
        return Math.floor(playerStore.info.level / 2);
    }

    description(playerStore: PlayerStoreType): string {
        return `在 3 回合內，使自身物理攻擊力 (AD) 提升 ${this.getValue(playerStore)} 點。`;
    }

    protected execute({playerStore}: SkillParams): boolean {
        if (!playerStore) return false;
        if (!isEquip('Sword', EquipmentPosition.WEAPON, playerStore.info)) {
            wrongWeaponEffect('Sword')
            return false
        }
        const adBuff = this.getValue(playerStore);
        playerStore.addStatus(SkillStatus.SwordPolishStatus, {
            bonus: {
                ad: adBuff
            }
        });

        useFullScreenEffect({
            message: this.name,
            color: '#f1c40f',
        });
        return true;
    }
}

export class SwordDance extends SkillModel {
    constructor() {
        super({
            id: 'SwordDance',
            name: "劍舞",
            icon: "skills/physical/sword_dance.svg",
            type: 'passive',
            rarity: 'perfect',
        });
    }

    description(): string {
        return `攻擊時獲得 2 回合「劍舞」效果：提升 5% 物理傷害增幅，最多可疊加 3 層 (最高 +15%)。`;
    }

    protected execute(): boolean {
        return true;
    }

    override onPlayerAttackHit({playerStore}: SkillOnPlayerAttackHitParams) {
        if (!playerStore) return;
        if (!isEquip('Sword', EquipmentPosition.WEAPON, playerStore.info)) {
            wrongWeaponEffect('Sword')
            return false
        }
        const existing = playerStore.hasStatus(SkillStatus.SwordDanceStatus.name);
        let stacks = 1;
        if (existing && existing.value !== undefined) {
            stacks = Math.min(3, existing.value + 1);
        }

        const adIncreaseVal = stacks * 10;
        playerStore.addStatus(SkillStatus.SwordDanceStatus, {
            value: stacks,
            duration: 2,
            bonus: {
                adIncrease: adIncreaseVal
            }
        });

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
    },
    SwordPolish: {
        id: 'SwordPolish',
        pathId: 'sword_polish',
        tier: 2,
        checkEligible: (playerStore) => {
            return playerStore.checkSkillPath('swordplay');
        }
    },
    SwordDance: {
        id: 'SwordDance',
        pathId: 'sword_dance',
        tier: 4,
        checkEligible: (playerStore) => {
            return playerStore.hasSkill('SwordPolish') && playerStore.checkSkillPath('swordplay');
        }
    }
}