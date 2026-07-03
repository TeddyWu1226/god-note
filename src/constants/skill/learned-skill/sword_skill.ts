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

export class SwordProficiency extends SkillModel {
    constructor() {
        super({
            id: 'SwordProficiency',
            name: "基礎劍術",
            icon: "skills/passive/sword_proficiency.svg",
            type: 'passive',
            rarity: 'common',
            uniqueFields: ['SwordProficiency'],
            maxProficiency: 100,
            proficiencyGain: 1
        });
    }

    addBonus() {
        // 提升 5
        return {
            hit: 5 + (Math.ceil(this.proficiency * 0.05)),
            adDefend: 1 + (Math.ceil(this.proficiency * 0.04)),
        }
    }

    description(): string {
        const bonus = this.addBonus()
        return `裝備名稱含有「${WeaponSkillMapping.SwordProficiency.join(', ')}」的武器時，提升 ${bonus.hit} 點命中, ${bonus.adDefend} 點防禦。`
            + `<br/>(裝備對應武器進行攻擊可以提升熟練度)`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        const weaponName = player?.equips?.weapon?.name || '';
        if (isMatchedWeapon('SwordProficiency', weaponName)) {
            return this.addBonus();
        }
        return {};
    }
}

export class SwordExpert extends SkillModel {
    constructor() {
        super({
            id: 'SwordExpert',
            name: "進階劍術",
            icon: "skills/passive/sword_expert.svg",
            type: 'passive',
            rarity: 'rare',
            uniqueFields: ['SwordProficiency'],
            maxProficiency: 100,
            proficiencyGain: 1
        });
    }

    addBonus() {
        return {
            hit: 25,
            ad: 1 + (Math.ceil(this.proficiency * 0.04)),
            adDefend: 5,
        }
    }

    description(): string {
        const bonus = this.addBonus()
        return `裝備名稱含有「${WeaponSkillMapping.SwordProficiency.join(', ')}」的武器時，提升 ${bonus.ad} 點物理攻擊力, ${bonus.hit} 點命中, ${bonus.adDefend} 點防禦。`
            + `<br/>(裝備對應武器進行攻擊可以提升熟練度)`
            ;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        const weaponName = player?.equips?.weapon?.name || '';
        if (isMatchedWeapon('SwordProficiency', weaponName)) {
            return this.addBonus();
        }
        return {};
    }
}

export class SwordMaster extends SkillModel {
    constructor() {
        super({
            id: 'SwordMaster',
            name: "大師劍術",
            icon: "skills/passive/sword_master.svg",
            type: 'passive',
            rarity: 'perfect',
            uniqueFields: ['SwordProficiency'],
        });
    }


    addBonus() {
        return {
            hit: 50,
            ad: 20,
            adDefend: 10,
        }
    }

    description(): string {
        const bonus = this.addBonus()
        return `裝備名稱含有「${WeaponSkillMapping.SwordProficiency.join(', ')}」的武器時，提升 ${bonus.ad} 點物理攻擊力, ${bonus.hit} 點命中, ${bonus.adDefend} 點防禦。`
            ;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        const weaponName = player?.equips?.weapon?.name || '';
        if (isMatchedWeapon('SwordProficiency', weaponName)) {
            return this.addBonus();
        }
        return {};
    }
}

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

export const SwordSkillTree: Record<string, SkillTreeNode> = {
    // 1. 劍術精通
    SwordProficiency: {
        id: 'SwordProficiency',
        pathId: 'swordplay',
        tier: 1,
        checkEligible: (playerStore, trackerStore) => {
            return trackerStore.getKillCount('USE_SWORD') >= 3;
        }
    },
    SwordExpert: {
        id: 'SwordExpert',
        pathId: 'swordplay',
        tier: 2,
        evolvesFrom: ['SwordProficiency'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('SwordProficiency');
            return !!baseSkill?.isProficiencyMax;
        }
    },
    SwordMaster: {
        id: 'SwordMaster',
        pathId: 'swordplay',
        tier: 3,
        evolvesFrom: ['SwordExpert'],
        checkEligible: (playerStore) => {
            const baseSkill = playerStore.hasSkill('SwordExpert');
            return !!baseSkill?.isProficiencyMax;
        }
    },

    // 進階劍技三招 (只能三選一)
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