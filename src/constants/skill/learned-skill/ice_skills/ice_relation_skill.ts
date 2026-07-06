import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillOnPlayerAttackedHitParams, SkillParams, SkillTreeNode} from "@/types";
import {applySkillDamage, getSkillFinalDamage} from "@/constants/fight-func";
import {useCardImpactEffect} from "@/components/Shared/CardImpactEffect/useCardImpactEffect";
import {getMonsterElement} from "@/utils/create";
import {ColorText} from "@/utils/color";
import {SkillStatus} from "@/constants/status/skill-status";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";

/**
 * 冰錐箭
 */
export class IceArrow extends SkillModel {
    constructor() {
        super({
            id: 'IceArrow',
            name: "冰錐箭",
            icon: "skills/magic/ice_arrow.svg",
            type: 'active',
            rarity: 'common',
            maxCd: 0,
            costSp: 10,
            costMaxAction: true,
            maxProficiency: 50,
            proficiencyGain: 2
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        return (playerStore.finalStats?.ap ?? 0) + 10;
    }

    get extraHit(): number {
        return 10 + Math.floor(this.proficiency / 5);
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'ap'
        })
        return `射出一枚寒冰凝聚的冰錐，對目標造成 ${ColorText.ap(damage)}。此技能額外提升 ${this.extraHit} 點命中值。\n(熟練度影響命中值)`;
    }

    protected execute({playerStore, monster}: SkillParams): boolean {
        if (!playerStore || !monster) return false;


        monster.lastDamageResult = applySkillDamage({
            speller: playerStore,
            target: monster,
            baseValue: this.getDamage(playerStore),
            type: 'ap',
            skillName: this.name,
            sureHit: false,
            canCrit: true,
            modifiers: {
                hit: this.extraHit
            }
        });

        useCardImpactEffect(getMonsterElement(monster.id), 'frozen');
        useFullScreenEffect({
            message: this.name,
            color: '#74b9ff'
        });
        return true;
    }
}

/**
 * 寒冰彈
 */
export class IceBurst extends SkillModel {
    constructor() {
        super({
            id: 'IceBurst',
            name: "寒冰彈",
            icon: "skills/magic/ice_burst.svg",
            type: 'active',
            rarity: 'rare',
            maxCd: 2,
            costSp: 20,
            costMaxAction: true,
            maxProficiency: 50,
            proficiencyGain: 2
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        return Math.floor((playerStore.finalStats?.ap ?? 0) * (0.8 + this.proficiency / 100));
    }

    get freezeChance(): number {
        return 30 + this.proficiency;
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'ap'
        })
        return `發射一顆寒冰彈，對目標造成 ${ColorText.ap(damage)}（魔攻 * 0.8），並有 ${this.freezeChance}% 機率使目標陷入冰凍狀態，持續 2 回合。`;
    }

    protected execute({playerStore, monster}: SkillParams): boolean {
        if (!playerStore || !monster) return false;

        monster.lastDamageResult = applySkillDamage({
            speller: playerStore,
            target: monster,
            baseValue: this.getDamage(playerStore),
            type: 'ap',
            skillName: this.name
        });

        if (Math.random() * 100 < this.freezeChance) {
            monster.addEffect(SkillStatus.Frozen);
        }

        useCardImpactEffect(getMonsterElement(monster.id), 'frozen');
        useFullScreenEffect({
            message: this.name,
            color: '#0984e3'
        });
        return true;
    }
}

/**
 * 寒冰結界
 */
export class IceWard extends SkillModel {
    constructor() {
        super({
            id: 'IceWard',
            name: "寒冰結界",
            icon: "skills/magic/ice_ward.svg",
            type: 'active',
            rarity: 'rare',
            maxCd: 5,
            costSp: 30,
            costMaxAction: true,
            maxProficiency: 50,
            proficiencyGain: 5
        });
    }

    get freezeChance(): number {
        return 30 + this.proficiency;
    }

    description(playerStore: PlayerStoreType): string {
        return `在戰場張開寒冰結界，使所有敵方目標各有 ${this.freezeChance}% 機率陷入冰凍狀態，持續 2 回合。`;
    }

    protected execute({playerStore, gameStateStore}: SkillParams): boolean {
        if (!playerStore) return false;

        gameStateStore.currentEnemy.forEach(enemy => {
            if (enemy.hp > 0 && Math.random() * 100 <= this.freezeChance) {
                enemy.addEffect(SkillStatus.Frozen);
                useCardImpactEffect(getMonsterElement(enemy.id), 'frozen');
            }
        });

        useFullScreenEffect({
            message: this.name,
            color: '#00d2d3'
        });
        return true;
    }
}

/**
 * 冰河結界
 */
export class GlacialWard extends SkillModel {
    constructor() {
        super({
            id: 'GlacialWard',
            name: "冰河結界",
            icon: "skills/magic/glacial_ward.svg",
            type: 'active',
            rarity: 'perfect',
            maxCd: 5,
            costSp: 30,
            costMaxAction: true,
            maxProficiency: 50,
            proficiencyGain: 5
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        return Math.floor((playerStore.finalStats?.ap ?? 0) * 1.5);
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'ap'
        })
        return `召喚極寒冰河暴烈，對所有敵方目標造成 ${ColorText.ap(damage)}（魔攻 * 1.5），並使全體 100% 陷入冰凍狀態，持續 2 回合。`;
    }

    protected execute({playerStore, gameStateStore}: SkillParams): boolean {
        if (!playerStore) return false;

        gameStateStore.currentEnemy.forEach(enemy => {
            if (enemy.hp > 0) {
                enemy.lastDamageResult = applySkillDamage({
                    speller: playerStore,
                    target: enemy,
                    baseValue: this.getDamage(playerStore),
                    type: 'ap',
                    skillName: this.name
                });

                enemy.addEffect(SkillStatus.Frozen);
                useCardImpactEffect(getMonsterElement(enemy.id), 'frozen');
            }
        });

        useFullScreenEffect({
            message: this.name,
            color: '#ffffff'
        });
        return true;
    }
}


/**
 * 寒冰裝甲
 */
export class IceArmor extends SkillModel {
    constructor() {
        super({
            id: 'IceArmor',
            name: "寒冰裝甲",
            icon: "skills/magic/ice_armor.svg",
            type: 'active',
            rarity: 'rare',
            maxCd: 3,
            costSp: 15,
            costMaxAction: true,
            maxProficiency: 50,
            proficiencyGain: 5
        });
    }

    getApDefense(playerStore: PlayerStoreType): number {
        return Math.floor(playerStore.finalStats.ap ?? 0);
    }

    description(playerStore: PlayerStoreType): string {
        return `凝聚堅冰化為厚重裝甲，使自身物理防禦力提升 ${this.getApDefense(playerStore)} 點（魔攻 * 1），持續 1 回合。`;
    }

    protected execute({playerStore}: SkillParams): boolean {
        if (!playerStore) return false;

        playerStore.addStatus(SkillStatus.IceArmorStatus, {
            bonus: {
                adDefend: this.getApDefense(playerStore)
            }
        });

        useFullScreenEffect({
            message: this.name,
            color: '#74b9ff'
        });
        return true;
    }
}


/**
 * 寒冰護體
 */
export class IceInfusion extends SkillModel {
    constructor() {
        super({
            id: 'IceInfusion',
            name: "寒冰護體",
            icon: "skills/magic/ice_infusion.svg",
            type: 'active',
            rarity: 'perfect',
            maxCd: 3,
            costSp: 22,
            costMaxAction: true,
            maxProficiency: 50,
            proficiencyGain: 2
        });
    }

    getApDefense(playerStore: PlayerStoreType): number {
        return Math.floor(playerStore.finalStats.ap ?? 0);
    }

    description(playerStore: PlayerStoreType): string {
        return `使極寒能量守護全身，提升 ${this.getApDefense(playerStore)} 點物理防禦力（魔攻 * 1），持續 1 回合。且受擊時有 100% 機率使攻擊者冰凍 1 回合。`;
    }

    protected execute({playerStore}: SkillParams): boolean {
        if (!playerStore) return false;

        playerStore.addStatus(SkillStatus.IceArmorStatus, {
            bonus: {
                adDefend: this.getApDefense(playerStore)
            }
        });

        useFullScreenEffect({
            message: this.name,
            color: '#00d2d3'
        });
        return true;
    }

    onPlayerAttacked({playerStore, monster, logStore}: SkillOnPlayerAttackedHitParams): void {
        if (!playerStore || !monster || !logStore) return;
        if (!playerStore.hasStatus(SkillStatus.IceArmorStatus.name)) return;
        monster.addEffect(SkillStatus.Frozen);
        logStore.logger.add(`[寒冰護體] 寒氣反彈，使 ${monster.name} 陷入冰凍狀態！`);
        useCardImpactEffect(getMonsterElement(monster.id), 'frozen');
    }
}

/**
 * 寒冰之風
 */
export class IceWind extends SkillModel {
    constructor() {
        super({
            id: 'IceWind',
            name: "寒冰之風",
            icon: "skills/magic/ice_wind.svg",
            type: 'passive',
            rarity: 'perfect'
        });
    }

    get dodge(): number {
        return 30;
    }

    description(): string {
        return `使身軀周圍環繞刺骨寒風，提升自身 ${this.dodge} 點閃避值。`;
    }

    getPassiveBonus(): Record<string, number> {
        return {
            dodge: this.dodge
        };
    }

    protected execute(): boolean {
        return true;
    }
}

/**
 * 寒冰基礎法術技能樹
 */
export const IceRelationSkillTree: Record<string, SkillTreeNode> = {
    IceArrow: {
        id: 'IceArrow',
        pathId: 'ice_spell_active',
        tier: 1,
        checkEligible: (playerStore) => {
            return playerStore.checkSkillPath('ice_adaptability');
        }
    },
    IceBurst: {
        id: 'IceBurst',
        pathId: 'ice_spell_active',
        tier: 2,
        checkEligible: (playerStore) => {
            return playerStore.checkSkillPath('ice_adaptability');
        }
    },
    IceWard: {
        id: 'IceWard',
        pathId: 'ice_ward_active',
        tier: 2,
        checkEligible: (playerStore) => {
            return playerStore.checkSkillPath('ice_adaptability') && playerStore.hasSkill('Shockwave') !== undefined;
        }
    },
    GlacialWard: {
        id: 'GlacialWard',
        pathId: 'ice_ward_active',
        tier: 3,
        evolvesFrom: ['IceWard'],
        checkEligible: (playerStore) => {
            return playerStore.checkSkillPath('ice_adaptability') && playerStore.hasSkill('IceWard') !== undefined;
        }
    },
    IceArmor: {
        id: 'IceArmor',
        pathId: 'ice_armor_active',
        tier: 2,
        checkEligible: (playerStore) => {
            return playerStore.checkSkillPath('ice_adaptability');
        }
    },
    IceInfusion: {
        id: 'IceInfusion',
        pathId: 'ice_armor_active',
        tier: 3,
        evolvesFrom: ['IceArmor'],
        checkEligible: (playerStore) => {
            return playerStore.checkSkillPath('ice_adaptability') && playerStore.hasSkill('IceArmor') !== undefined;
        }
    },
    IceWind: {
        id: 'IceWind',
        pathId: 'ice_wind_passive',
        tier: 3,
        checkEligible: (playerStore) => {
            return playerStore.checkSkillPath('ice_adaptability');
        }
    }
};