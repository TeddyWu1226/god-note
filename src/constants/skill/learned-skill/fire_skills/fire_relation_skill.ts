import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillOnPlayerAttackedHitParams, SkillOnStartParams, SkillParams, SkillTreeNode} from "@/types";
import {applySkillDamage, getSkillFinalDamage} from "@/constants/fight-func";
import {useCardImpactEffect} from "@/components/Shared/CardImpactEffect/useCardImpactEffect";
import {getMonsterElement} from "@/utils/create";
import {ColorText} from "@/utils/color";
import EvnStatus from "@/constants/status/evn-status";
import {SkillStatus} from "@/constants/status/skill-status";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {MonsterModel} from "@/models/monster-model";

/**
 * 烈焰箭
 */
export class FireArrow extends SkillModel {
    constructor() {
        super({
            id: 'FireArrow',
            name: "烈焰箭",
            icon: "skills/magic/fire_arrow.svg",
            type: 'active',
            rarity: 'common',
            maxCd: 0,
            costSp: 15,
            costMaxAction: true,
            maxProficiency: 50,
            proficiencyGain: 2
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        return (playerStore.finalStats?.ap ?? 0) + 5;
    }

    get burnChance(): number {
        return 10 + this.proficiency;
    }

    get burnDuration(): number {
        return Math.max(2, Math.round(this.proficiency / 10))
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'ap'
        })
        return `射出一枚火焰束，對目標造成 ${ColorText.ap(damage)}（魔攻 * 1），且有 ${this.burnChance}% 機率使目標陷入燃燒狀態，持續 ${this.burnDuration} 回合。\n(熟練度影響燃燒成功率以及持續時間)`;
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

        if (Math.random() < (this.burnChance / 100)) {
            monster.addEffect(EvnStatus.OnBurn, {
                duration: this.burnDuration
            });
        }

        useCardImpactEffect(getMonsterElement(monster.id), 'burn');
        useFullScreenEffect({
            message: this.name,
            color: '#fa8231'
        });
        return true;
    }
}

/**
 * 火炎彈
 */
export class FireBurst extends SkillModel {
    constructor() {
        super({
            id: 'FireBurst',
            name: "火炎彈",
            icon: "skills/magic/fire_burst.svg",
            type: 'active',
            rarity: 'rare',
            maxCd: 0,
            costSp: 25,
            costMaxAction: true,
            maxProficiency: 50,
            proficiencyGain: 2
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        return Math.floor((playerStore.finalStats?.ap ?? 0) * 1.1) + Math.round(this.proficiency / 2) + 5;
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'ap'
        })
        return `射出一枚燃燒的火焰球，對目標造成 ${ColorText.ap(damage)}，且使目標陷入燃燒狀態，持續 5 回合。\n(熟練度影響傷害)`;
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

        monster.addEffect(EvnStatus.OnBurn, {
            duration: 5
        });

        useCardImpactEffect(getMonsterElement(monster.id), 'burn');
        useFullScreenEffect({
            message: this.name,
            color: '#eb3b5a'
        });
        return true;
    }
}

/**
 * 火焰結界
 */
export class FireWard extends SkillModel {
    constructor() {
        super({
            id: 'FireWard',
            name: "火焰結界",
            icon: "skills/magic/fire_ward.svg",
            type: 'active',
            rarity: 'rare',
            maxCd: 3,
            costSp: 20,
            costMaxAction: true,
            maxProficiency: 50,
            proficiencyGain: 2
        });
    }

    get burnChance(): number {
        return Math.floor(this.proficiency * 0.8) + 40;
    }

    description(playerStore: PlayerStoreType): string {
        return `在戰場張開火焰結界，使所有敵方目標各有 ${this.burnChance}% 機率陷入燃燒狀態，持續 3 回合。`;
    }

    protected execute({playerStore, gameStateStore}: SkillParams): boolean {
        if (!playerStore) return false;

        gameStateStore.currentEnemy.forEach(enemy => {
            useCardImpactEffect(getMonsterElement(enemy.id), 'burn');
            if (enemy.hp > 0 && Math.random() <= (this.burnChance / 100)) {
                enemy.addEffect(EvnStatus.OnBurn);
            }
        });

        useFullScreenEffect({
            message: this.name,
            color: '#fa8231'
        });
        return true;
    }
}

/**
 * 灼熱結界
 */
export class SearingWard extends SkillModel {
    constructor() {
        super({
            id: 'SearingWard',
            name: "灼熱結界",
            icon: "skills/magic/searing_ward.svg",
            type: 'active',
            rarity: 'perfect',
            maxCd: 3,
            costSp: 30,
            costMaxAction: true,
            maxProficiency: 50,
            proficiencyGain: 2
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        return Math.floor((playerStore.finalStats?.ap ?? 0) * 0.8);
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'ap'
        })
        return `召喚熾熱高溫的結界爆裂，對所有敵方目標造成 ${ColorText.ap(damage)} （魔攻 * 0.8），並使全體 100% 陷入燃燒狀態，持續 3 回合。`;
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
                if (enemy.lastDamageResult.isHit) {
                    enemy.addEffect(EvnStatus.OnBurn);
                }
                useCardImpactEffect(getMonsterElement(enemy.id), 'burn');
            }
        });

        useFullScreenEffect({
            message: this.name,
            color: '#ff3f34'
        });
        return true;
    }
}

/**
 * 火焰裝甲
 */
export class FireArmor extends SkillModel {
    constructor() {
        super({
            id: 'FireArmor',
            name: "火焰裝甲",
            icon: "skills/magic/fire_armor.svg",
            type: 'active',
            rarity: 'rare',
            maxCd: 3,
            costSp: 20,
            costMaxAction: true,
            maxProficiency: 20,
            proficiencyGain: 1
        });
    }

    getDefend(playerStore: PlayerStoreType): number {
        return Math.floor((playerStore.finalStats?.ap ?? 0) * 0.2) + 5;
    }

    get dodgeBonus(): number {
        return 15 + this.proficiency;
    }

    description(playerStore: PlayerStoreType): string {
        return `凝聚火焰化為實體裝甲，使物理防禦力提升 ${this.getDefend(playerStore)} 點（5 + AP*0.2），且提升 ${this.dodgeBonus} 點閃避值，持續 2 回合。\n(熟練度影響閃避值)`;
    }

    protected execute({playerStore}: SkillParams): boolean {
        if (!playerStore) return false;

        playerStore.addStatus(SkillStatus.FireArmorStatus, {
            bonus: {
                adDefend: this.getDefend(playerStore),
                dodge: this.dodgeBonus
            },
            duration: 2
        });

        useFullScreenEffect({
            message: this.name,
            color: '#ff5949',
        });
        return true;
    }
}

/**
 * 火焰附體
 */
export class FireInfusion extends SkillModel {
    constructor() {
        super({
            id: 'FireInfusion',
            name: "火焰附體",
            icon: "skills/magic/fire_infusion.svg",
            type: 'active',
            rarity: 'perfect',
            maxCd: 3,
            costSp: 20,
            costMaxAction: true,
        });
    }

    description(playerStore: PlayerStoreType): string {
        return `凝聚烈焰為實體護盾，使物理防禦力提升 ${this.getDefend(playerStore)} 點（10 + AP*0.2），且提升 ${this.dodgeBonus} 點閃避值，持續 2 回合。在有此狀態下受到攻擊命中時，賦予攻擊者燃燒狀態。`;
    }

    getDefend(playerStore: PlayerStoreType): number {
        return Math.floor((playerStore.finalStats?.ap ?? 0) * 0.2) + 10;
    }

    get dodgeBonus(): number {
        return 40
    }

    onPlayerAttacked({monster, attackedOutcome}: SkillOnPlayerAttackedHitParams): void {
        if (!attackedOutcome.isHit) {
            return;
        }
        if (monster.hp > 0) {
            monster.addEffect(EvnStatus.OnBurn)
            useCardImpactEffect(getMonsterElement(monster.id), 'burn');
        }
    }

    protected execute({playerStore}: SkillParams): boolean {
        if (!playerStore) return false;

        playerStore.addStatus(SkillStatus.FireArmorStatus, {
            bonus: {
                adDefend: this.getDefend(playerStore),
                dodge: this.dodgeBonus
            },
            duration: 2
        });

        useFullScreenEffect({
            message: this.name,
            color: '#ff5949',
        });
        return true;
    }
}

/**
 * 燃爆
 */
export class IgnitionBlast extends SkillModel {
    constructor() {
        super({
            id: 'IgnitionBlast',
            name: "燃爆",
            icon: "skills/magic/ignition_blast.svg",
            type: 'active',
            rarity: 'perfect',
            maxCd: 1,
            costSp: 25,
            costMaxAction: false,
            costAction: 0
        });
    }

    getSingleExploreDamage(playerStore: PlayerStoreType): number {
        return Math.max(5, Math.floor((playerStore.finalStats?.ap ?? 0) * 0.1));
    }

    description(playerStore: PlayerStoreType): string {
        return `啟用後獲得燃爆效果，再次使用就關閉。燃爆效果：回合開始時引爆並移除所有有燃燒效果的敵人，造成 ${this.getSingleExploreDamage(playerStore)} 點(魔攻 * 0.1) * 剩餘燃燒回合 的爆發傷害。`;
    }

    protected execute({playerStore}: SkillParams): boolean {
        if (!playerStore) return false;

        if (playerStore.hasStatus(SkillStatus.IgnitionBlastStatus.name)) {
            playerStore.removeStatus(SkillStatus.IgnitionBlastStatus.name);
        } else {
            playerStore.addStatus(SkillStatus.IgnitionBlastStatus);
            useFullScreenEffect({
                message: this.name,
                color: '#ffb649',
            });
        }
        return true;
    }

    onRoundStart({playerStore, gameStateStore, logStore}: SkillOnStartParams): void {
        if (!playerStore || !gameStateStore || !logStore) return;
        if (!playerStore.hasStatus(SkillStatus.IgnitionBlastStatus.name)) return;

        gameStateStore.currentEnemy.forEach((enemy: MonsterModel) => {
            if (enemy.hp > 0) {
                const exist = enemy.hasStatus(EvnStatus.OnBurn.name)
                if (!exist) return
                const dmg = this.getSingleExploreDamage(playerStore) * exist.duration
                enemy.lastDamageResult = applySkillDamage({
                    speller: playerStore,
                    target: enemy,
                    baseValue: dmg,
                    type: 'ap',
                    skillName: '燃爆',
                    sureHit: true
                });
                enemy.removeStatus(EvnStatus.OnBurn.name);
                useCardImpactEffect(getMonsterElement(enemy.id), 'burn');
            }
        });
    }
}


export const FireRelationSkillTree: Record<string, SkillTreeNode> = {
    FireArrow: {
        id: 'FireArrow',
        pathId: 'fire_spell_active',
        tier: 1,
        checkEligible: (playerStore) => {
            const hasBasePath = !!playerStore.checkSkillPath('fire_mana_adaptability');
            if (!hasBasePath) return false;
            const baseSkill = playerStore.hasSkill('MagicBall');
            return !!baseSkill?.isProficiencyMax;
        }
    },
    FireBurst: {
        id: 'FireBurst',
        pathId: 'fire_spell_active',
        tier: 2,
        evolvesFrom: ['FireArrow'],
        checkEligible: (playerStore) => {
            const hasBasePath = !!playerStore.checkSkillPath('fire_mana_adaptability');
            if (!hasBasePath) return false;
            const baseSkill = playerStore.hasSkill('FireArrow');
            return !!baseSkill?.isProficiencyMax;
        }
    },
    FireWard: {
        id: 'FireWard',
        pathId: 'fire_ward_active',
        tier: 2,
        checkEligible: (playerStore) => {
            const hasBasePath = !!playerStore.checkSkillPath('fire_mana_adaptability');
            if (!hasBasePath) return false;
            const baseSkill = playerStore.hasSkill('Shockwave')
            return !!baseSkill?.isProficiencyMax;
        }
    },
    SearingWard: {
        id: 'SearingWard',
        pathId: 'fire_ward_active',
        tier: 3,
        evolvesFrom: ['FireWard'],
        checkEligible: (playerStore) => {
            const hasBasePath = !!playerStore.checkSkillPath('fire_mana_adaptability');
            if (!hasBasePath) return false;
            const baseSkill = playerStore.hasSkill('FireWard')
            return !!baseSkill?.isProficiencyMax;
        }
    },
    FireArmor: {
        id: 'FireArmor',
        pathId: 'fire_armor_active',
        tier: 2,
        evolvesFrom: ['ManaArmor'],
        checkEligible: (playerStore) => {
            const hasBasePath = !!playerStore.checkSkillPath('fire_mana_adaptability');
            if (!hasBasePath) return false;
            const baseSkill = playerStore.hasSkill('ManaArmor');
            return !!baseSkill?.isProficiencyMax;
        }
    },
    FireInfusion: {
        id: 'FireInfusion',
        pathId: 'fire_armor_active',
        tier: 3,
        evolvesFrom: ['FireArmor'],
        checkEligible: (playerStore) => {
            const hasBasePath = !!playerStore.checkSkillPath('fire_mana_adaptability');
            if (!hasBasePath) return false;
            const baseSkill = playerStore.hasSkill('FireArmor');
            return !!baseSkill?.isProficiencyMax;
        }
    },
    IgnitionBlast: {
        id: 'IgnitionBlast',
        pathId: 'ignition_blast_active',
        tier: 3,
        checkEligible: (playerStore) => {
            return playerStore.checkSkillPath('fire_mana_adaptability');
        }
    }
}