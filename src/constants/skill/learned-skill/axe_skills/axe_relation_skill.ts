import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillOnPlayerAttackedHitParams, SkillOnStartParams, SkillParams, SkillTreeNode} from "@/types";
import {applyAttackDamage, applySkillDamage, getSkillFinalDamage} from "@/constants/fight-func";
import {useCardImpactEffect} from "@/components/Shared/CardImpactEffect/useCardImpactEffect";
import {getMonsterElement} from "@/utils/create";
import {EquipmentPosition} from "@/enums/enums";
import {isEquip} from "@/constants/skill/utils";
import {SkillStatus} from "@/constants/status/skill-status";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {ColorText} from "@/utils/color";
import {playerAddSavePower} from "@/constants/status/advanced-status-utils";

/**
 * 防禦一擊 (Level 2)
 */
export class DefensiveStrike extends SkillModel {
    constructor() {
        super({
            id: 'DefensiveStrike',
            name: "防禦一擊",
            icon: "skills/physical/defensive_strike.svg",
            type: 'passive',
            rarity: 'rare',
            uniqueFields: ['防禦一擊系']
        });
    }

    description(playerStore: PlayerStoreType): string {
        return `受到攻擊命中後，有 20% 機率使用巨斧反擊攻擊者。`;
    }

    protected execute(): boolean {
        return true;
    }

    override onPlayerAttacked({playerStore, monster, attackedOutcome}: SkillOnPlayerAttackedHitParams) {
        if (!attackedOutcome.isHit) {
            return;
        }
        if (!isEquip('Axe', EquipmentPosition.WEAPON, playerStore.info)) return;
        if (Math.random() <= 0.2) {
            monster.lastDamageResult = applySkillDamage({
                speller: playerStore,
                target: monster,
                baseValue: playerStore.finalStats.ad,
                type: 'ad',
                skillName: this.name,
                sureHit: true
            });
            useCardImpactEffect(getMonsterElement(monster.id), 'vertical-slash');
        }
    }
}

/**
 * 抵抗一擊 (Level 3)
 */
export class ResistStrike extends SkillModel {
    constructor() {
        super({
            id: 'ResistStrike',
            name: "抵抗一擊",
            icon: "skills/physical/resist_strike.svg",
            type: 'passive',
            rarity: 'perfect',
            uniqueFields: ['防禦一擊系']
        });
    }


    description(playerStore: PlayerStoreType): string {
        return `提升自身 10 點物理防禦。受到傷害後，有 25% 機率反擊攻擊者。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        if (isEquip('Axe', EquipmentPosition.WEAPON, player)) {
            return {adDefend: 10};
        }
        return {};
    }

    override onPlayerAttacked({playerStore, monster, attackedOutcome}: SkillOnPlayerAttackedHitParams) {
        if (!attackedOutcome.isHit) {
            return;
        }
        if (!isEquip('Axe', EquipmentPosition.WEAPON, playerStore.info)) return;
        if (Math.random() <= 0.25) {
            monster.lastDamageResult = applySkillDamage({
                speller: playerStore,
                target: monster,
                baseValue: playerStore.finalStats.ad,
                type: 'ad',
                skillName: this.name,
                sureHit: true
            });
            useCardImpactEffect(getMonsterElement(monster.id), 'vertical-slash');
        }
    }
}

/**
 * 迴避一劈 (Level 2)
 */
export class EvasiveStrike extends SkillModel {
    constructor() {
        super({
            id: 'EvasiveStrike',
            name: "迴避一劈",
            icon: "skills/physical/evasive_strike.svg",
            type: 'passive',
            rarity: 'rare',
            uniqueFields: ['迴避一劈系']
        });
    }

    description(): string {
        return `迴避敵人攻擊成功後，獲得「迴避攻勢」效果，使自身物理攻擊力提升 10 點。`;
    }

    protected execute(): boolean {
        return true;
    }

    override onPlayerAttacked({playerStore, attackedOutcome, logStore}: SkillOnPlayerAttackedHitParams) {
        if (attackedOutcome.isHit) {
            return;
        }
        if (!isEquip('Axe', EquipmentPosition.WEAPON, playerStore.info)) return;
        playerStore.addStatus(SkillStatus.EvasiveStrike);
        logStore.logger.add(`[迴避一劈] 成功閃避攻擊，獲得物理攻擊力提升！`);
    }
}

/**
 * 閃身一劈 (Level 3)
 */
export class DodgeStrike extends SkillModel {
    constructor() {
        super({
            id: 'DodgeStrike',
            name: "閃身一劈",
            icon: "skills/physical/dodge_strike.svg",
            type: 'passive',
            rarity: 'perfect',
            uniqueFields: ['迴避一劈系']
        });
    }

    description(): string {
        return `提升自身 25 點閃避。迴避敵人攻擊成功後，獲得 1 回合的「閃身一劈」效果，使自身物理攻擊力提升 20 點。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        if (isEquip('Axe', EquipmentPosition.WEAPON, player)) {
            return {dodge: 25};
        }
        return {};
    }

    override onPlayerAttacked({playerStore, attackedOutcome, logStore}: SkillOnPlayerAttackedHitParams) {
        if (attackedOutcome.isHit) {
            return;
        }
        if (!isEquip('Axe', EquipmentPosition.WEAPON, playerStore.info)) return;
        playerStore.addStatus(SkillStatus.EvasiveStrike);
        logStore.logger.add(`[閃身一劈] 成功閃避攻擊，獲得物理攻擊力提升！`);
    }
}


/**
 * 蠻橫 (Level 2)
 */
export class Barbaric extends SkillModel {
    constructor() {
        super({
            id: 'Barbaric',
            name: "蠻橫",
            icon: "skills/physical/barbaric.svg",
            type: 'active',
            rarity: 'rare',
            maxCd: 4,
            costAction: 1,
            costSp: 15,
            uniqueFields: ['蠻橫系']
        });
    }

    description(): string {
        return `揮舞手中武器驚嚇所有敵人，使其傷害輸出降低 20%，持續 2 回合。`;
    }

    protected execute({playerStore, gameStateStore}: SkillParams): boolean {
        gameStateStore.currentEnemy.forEach(enemy => {
            if (enemy.hp > 0) {
                enemy.addEffect(SkillStatus.Terrified);
                useCardImpactEffect(getMonsterElement(enemy.id), 'stun');
            }
        });
        useFullScreenEffect({
            message: this.name,
            color: '#e1b12c'
        });
        return true;
    }
}

/**
 * 威嚇 (Level 3)
 */
export class Intimidate extends SkillModel {
    constructor() {
        super({
            id: 'Intimidate',
            name: "威嚇",
            icon: "skills/physical/intimidate.svg",
            type: 'active',
            rarity: 'perfect',
            maxCd: 4,
            costAction: 1,
            costSp: 20,
            uniqueFields: ['蠻橫系']
        });
    }

    description(): string {
        return `大力揮舞武器敲擊地板威嚇所有敵人，使其傷害輸出降低 40%，持續 2 回合。`;
    }

    protected execute({playerStore, gameStateStore}: SkillParams): boolean {
        gameStateStore.currentEnemy.forEach(enemy => {
            if (enemy.hp > 0) {
                enemy.addEffect(SkillStatus.Terrified, {bonus: {adIncrease: -40}});
                useCardImpactEffect(getMonsterElement(enemy.id), 'stun');
            }
        });
        useFullScreenEffect({
            message: this.name,
            color: '#e1b12c'
        });
        return true;
    }
}

/**
 * 巨斧旋風 (Level 2)
 */
export class AxeCyclone extends SkillModel {
    constructor() {
        super({
            id: 'AxeCyclone',
            name: "巨斧旋風",
            icon: "skills/physical/axe_cyclone.svg",
            type: 'active',
            rarity: 'rare',
            maxCd: 3,
            costAction: 1,
            costSp: 15,
            uniqueFields: ['巨斧旋風系']
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        const ad = playerStore.finalStats.ad ?? 0;
        const dodge = playerStore.finalStats.dodge ?? 0;
        return Math.round(0.8 * ad + 0.8 * Math.max(0, dodge));
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'ad'
        })
        return `橫掃所有敵人，造成 ${ColorText.ad(damage)}（0.8 AD + 0.8 * 閃避值）。`;
    }

    protected execute({playerStore, gameStateStore}: SkillParams): boolean {
        const dmg = this.getDamage(playerStore);
        gameStateStore.currentEnemy.forEach(enemy => {
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
        useFullScreenEffect({
            message: this.name,
            color: '#e1b12c'
        });
        return true;
    }
}

/**
 * 巨斧颶風 (Level 3)
 */
export class AxeHurricane extends SkillModel {
    constructor() {
        super({
            id: 'AxeHurricane',
            name: "巨斧颶風",
            icon: "skills/physical/axe_hurricane.svg",
            type: 'active',
            rarity: 'perfect',
            maxCd: 3,
            costAction: 1,
            costSp: 25,
            uniqueFields: ['巨斧旋風系']
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        const ad = playerStore.finalStats.ad ?? 0;
        const dodge = playerStore.finalStats.dodge ?? 0;
        return Math.round(1.2 * ad + Math.max(0, dodge));
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'ad'
        })
        return `橫掃所有敵人造成大傷害，造成 ${ColorText.ad(damage)}（1.2 AD + 1 * 閃避值）。`;
    }

    protected execute({playerStore, gameStateStore}: SkillParams): boolean {
        const dmg = this.getDamage(playerStore);
        gameStateStore.currentEnemy.forEach(enemy => {
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
        useFullScreenEffect({
            message: this.name,
            color: '#e1b12c'
        });
        return true;
    }
}

/**
 * 破甲擊 (Level 2)
 */
export class ArmorBreakStrike extends SkillModel {
    constructor() {
        super({
            id: 'ArmorBreakStrike',
            name: "破甲擊",
            icon: "skills/physical/armor_break_strike.svg",
            type: 'active',
            rarity: 'rare',
            maxCd: 2,
            costAction: 1,
            costSp: 15,
            uniqueFields: ['破甲擊系']
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        return Math.round((playerStore.finalStats.ad ?? 0) * 1.5);
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'ad'
        })
        return `劈擊目標造成${ColorText.ad(damage)}（1.5 AD），並有 50% 機率破甲（降低 5 點防禦，持續 2 回合）。若處於「蓄力」狀態，則 100% 必定破甲。`;
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

        const hasCharge = playerStore.hasStatus(SkillStatus.SavePower.name);
        const breakChance = hasCharge ? 1.0 : 0.50;
        if (monster.lastDamageResult.isHit && Math.random() <= breakChance) {
            monster.addEffect(SkillStatus.ArmorBreak);
        }

        useCardImpactEffect(getMonsterElement(monster.id), 'thrust');
        useFullScreenEffect({
            message: this.name,
            color: '#e1b12c'
        });
        return true;
    }
}

/**
 * 碎甲擊 (Level 3)
 */
export class ArmorShatterStrike extends SkillModel {
    constructor() {
        super({
            id: 'ArmorShatterStrike',
            name: "碎甲擊",
            icon: "skills/physical/armor_shatter_strike.svg",
            type: 'active',
            rarity: 'perfect',
            maxCd: 2,
            costAction: 1,
            costSp: 25,
            uniqueFields: ['破甲擊系']
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        return Math.round((playerStore.finalStats.ad ?? 0) * 2);
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'ad'
        })
        return `重劈單體目標造成 ${ColorText.ad(damage)}（2 AD），並有 50% 機率破甲（降低 10 點防禦，持續 2 回合）。若處於「蓄力」狀態，則 100% 必定破甲。`;
    }

    protected execute({playerStore, monster}: SkillParams): boolean {
        const dmg = this.getDamage(playerStore);
        monster.lastDamageResult = applySkillDamage({
            speller: playerStore,
            target: monster,
            baseValue: dmg,
            type: 'ad',
            skillName: this.name
        });

        const hasCharge = playerStore.hasStatus('蓄力');
        const breakChance = hasCharge ? 1.0 : 0.50;
        if (monster.lastDamageResult.isHit && Math.random() <= breakChance) {
            monster.addEffect(SkillStatus.ArmorBreak, {bonus: {adDefend: -10}});
        }

        useCardImpactEffect(getMonsterElement(monster.id), 'thrust');
        useFullScreenEffect({
            message: this.name,
            color: '#e1b12c'
        });
        return true;
    }
}

/**
 * 跳斬 (Level 2)
 */
export class LeapStrike extends SkillModel {
    constructor() {
        super({
            id: 'LeapStrike',
            name: "跳斬",
            icon: "skills/physical/leap_strike.svg",
            type: 'active',
            rarity: 'rare',
            maxCd: 2,
            costAction: 1,
            costSp: 15,
            uniqueFields: ['跳斬系']
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        return Math.round((playerStore.finalStats.ad ?? 0) * 1.5);
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'ad'
        })
        return `躍起劈斬單體目標造成 ${ColorText.ad(damage)}（1.5 AD），並有 50% 機率致殘（降低 20% 輸出，持續 2 回合）。若處於「蓄力」狀態，則 100% 必定致殘。`;
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

        const hasCharge = playerStore.hasStatus('蓄力');
        const crippleChance = hasCharge ? 1.0 : 0.50;
        if (monster.lastDamageResult.isHit && Math.random() <= crippleChance) {
            monster.addEffect(SkillStatus.Cripple);
        }

        useCardImpactEffect(getMonsterElement(monster.id), 'vertical-slash');
        useFullScreenEffect({
            message: this.name,
            color: '#e1b12c'
        });
        return true;
    }
}

/**
 * 劈空斬 (Level 3)
 */
export class SkyCleave extends SkillModel {
    constructor() {
        super({
            id: 'SkyCleave',
            name: "劈空斬",
            icon: "skills/physical/sky_cleave.svg",
            type: 'active',
            rarity: 'perfect',
            maxCd: 2,
            costAction: 1,
            costSp: 25,
            uniqueFields: ['跳斬系']
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        return Math.round((playerStore.finalStats.ad ?? 0) * 2);
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'ad'
        })
        return `裂空劈砍單體目標造成 ${ColorText.ad(damage)}（2 AD），並有 50% 機率致殘（降低 20% 輸出，持續 2 回合）。若處於「蓄力」狀態，則 100% 必定致殘。`;
    }

    protected execute({playerStore, monster}: SkillParams): boolean {
        const dmg = this.getDamage(playerStore);
        monster.lastDamageResult = applySkillDamage({
            speller: playerStore,
            target: monster,
            baseValue: dmg,
            type: 'ad',
            skillName: this.name
        });

        const hasCharge = playerStore.hasStatus('蓄力');
        const crippleChance = hasCharge ? 1.0 : 0.50;
        if (monster.lastDamageResult.isHit && Math.random() <= crippleChance) {
            monster.addEffect(SkillStatus.Cripple);
        }

        useCardImpactEffect(getMonsterElement(monster.id), 'vertical-slash');
        useFullScreenEffect({
            message: this.name,
            color: '#e1b12c'
        });
        return true;
    }
}

/**
 * 先鋒 (Level 2)
 */
export class Vanguard extends SkillModel {
    constructor() {
        super({
            id: 'Vanguard',
            name: "先鋒",
            icon: "skills/physical/vanguard.svg",
            type: 'passive',
            rarity: 'rare',
            uniqueFields: ['先鋒系']
        });
    }

    description(): string {
        return `「蓄力」效果會額外提升 20% 抗性。`;
    }

    protected execute(): boolean {
        return true;
    }
}

/**
 * 沉穩 (Level 4)
 */
export class Steady extends SkillModel {
    constructor() {
        super({
            id: 'Steady',
            name: "沉穩",
            icon: "skills/physical/steady.svg",
            type: 'passive',
            rarity: 'perfect',
            uniqueFields: ['先鋒系']
        });
    }

    description(): string {
        return `戰鬥開始時，獲得「蓄力」效果。「蓄力」效果會額外提升 20% 抗性。`;
    }

    protected execute(): boolean {
        return true;
    }

    override onRoundStart({playerStore, gameStateStore, logStore}: SkillOnStartParams) {
        if (!isEquip('Axe', EquipmentPosition.WEAPON, playerStore.info)) return;
        if (gameStateStore.battleRound === 1) {
            playerAddSavePower(playerStore, 1)
            logStore.logger.add(`[沉穩] 戰鬥開始，獲得「蓄力」效果！`);
        }
    }
}

/**
 * 斧術衍生/主動技能樹
 */
export const AxeRelationSkillTree: Record<string, SkillTreeNode> = {
    DefensiveStrike: {
        id: 'DefensiveStrike',
        pathId: 'axeplay_passive',
        tier: 2,
        evolvesFrom: ['VerticalSlash'],
        checkEligible: (playerStore) => {
            return playerStore.checkSkillPath('axeplay') && playerStore.hasSkill('VerticalSlash') !== undefined;
        }
    },
    ResistStrike: {
        id: 'ResistStrike',
        pathId: 'axeplay_passive',
        tier: 3,
        evolvesFrom: ['DefensiveStrike'],
        checkEligible: (playerStore) => {
            return playerStore.checkSkillPath('axeplay') && playerStore.hasSkill('DefensiveStrike') !== undefined;
        }
    },
    EvasiveStrike: {
        id: 'EvasiveStrike',
        pathId: 'axeplay_dodge',
        tier: 2,
        evolvesFrom: ['VerticalSlash'],
        checkEligible: (playerStore) => {
            return playerStore.checkSkillPath('axeplay') && playerStore.hasSkill('VerticalSlash') !== undefined;
        }
    },
    DodgeStrike: {
        id: 'DodgeStrike',
        pathId: 'axeplay_dodge',
        tier: 3,
        evolvesFrom: ['EvasiveStrike'],
        checkEligible: (playerStore) => {
            return playerStore.checkSkillPath('axeplay') && playerStore.hasSkill('EvasiveStrike') !== undefined;
        }
    },
    Vanguard: {
        id: 'Vanguard',
        pathId: 'axeplay_charge',
        tier: 2,
        checkEligible: (playerStore) => {
            return playerStore.checkSkillPath('axeplay');
        }
    },
    Steady: {
        id: 'Steady',
        pathId: 'axeplay_charge',
        tier: 4,
        evolvesFrom: ['Vanguard'],
        checkEligible: (playerStore) => {
            return playerStore.checkSkillPath('axeplay') && playerStore.hasSkill('Vanguard') !== undefined;
        }
    },
    Barbaric: {
        id: 'Barbaric',
        pathId: 'axeplay_shout',
        tier: 2,
        evolvesFrom: ['HorizontalSlash'],
        checkEligible: (playerStore) => {
            return playerStore.checkSkillPath('axeplay') && playerStore.hasSkill('HorizontalSlash') !== undefined;
        }
    },
    Intimidate: {
        id: 'Intimidate',
        pathId: 'axeplay_shout',
        tier: 3,
        evolvesFrom: ['Barbaric'],
        checkEligible: (playerStore) => {
            return playerStore.checkSkillPath('axeplay') && playerStore.hasSkill('Barbaric') !== undefined;
        }
    },
    AxeCyclone: {
        id: 'AxeCyclone',
        pathId: 'axeplay_spin',
        tier: 2,
        evolvesFrom: ['HorizontalSlash'],
        checkEligible: (playerStore) => {
            return playerStore.checkSkillPath('axeplay') && playerStore.hasSkill('HorizontalSlash') !== undefined;
        }
    },
    AxeHurricane: {
        id: 'AxeHurricane',
        pathId: 'axeplay_spin',
        tier: 3,
        evolvesFrom: ['AxeCyclone'],
        checkEligible: (playerStore) => {
            return playerStore.checkSkillPath('axeplay') && playerStore.hasSkill('AxeCyclone') !== undefined;
        }
    },
    ArmorBreakStrike: {
        id: 'ArmorBreakStrike',
        pathId: 'axeplay_armor',
        tier: 2,
        evolvesFrom: ['Thrust'],
        checkEligible: (playerStore) => {
            return playerStore.checkSkillPath('axeplay') && playerStore.hasSkill('Thrust') !== undefined;
        }
    },
    ArmorShatterStrike: {
        id: 'ArmorShatterStrike',
        pathId: 'axeplay_armor',
        tier: 3,
        evolvesFrom: ['ArmorBreakStrike'],
        checkEligible: (playerStore) => {
            return playerStore.checkSkillPath('axeplay') && playerStore.hasSkill('ArmorBreakStrike') !== undefined;
        }
    },
    LeapStrike: {
        id: 'LeapStrike',
        pathId: 'axeplay_leap',
        tier: 2,
        evolvesFrom: ['Thrust'],
        checkEligible: (playerStore) => {
            return playerStore.checkSkillPath('axeplay') && playerStore.hasSkill('Thrust') !== undefined;
        }
    },
    SkyCleave: {
        id: 'SkyCleave',
        pathId: 'axeplay_leap',
        tier: 3,
        evolvesFrom: ['LeapStrike'],
        checkEligible: (playerStore) => {
            return playerStore.checkSkillPath('axeplay') && playerStore.hasSkill('LeapStrike') !== undefined;
        }
    }
};
