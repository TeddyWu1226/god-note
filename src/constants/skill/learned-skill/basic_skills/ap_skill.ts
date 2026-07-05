/**
 * 法術輸出與輔助相關技能
 */
import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillParams, SkillTreeNode, StatusEffect} from "@/types";
import {ColorText} from "@/utils/color";
import {applySkillDamage, getSkillFinalDamage} from "@/constants/fight-func";
import {useCardImpactEffect} from "@/components/Shared/CardImpactEffect/useCardImpactEffect";
import {getMonsterElement} from "@/utils/create";
import {UsualStatus} from "@/constants/status/usual-status";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {SkillStatus} from "@/constants/status/skill-status";

/**
 * 魔法彈
 */
export class MagicBall extends SkillModel {
    constructor() {
        super({
            id: 'MagicBall',
            name: "魔法彈",
            icon: "skills/magic/magic_ball_icon.svg",
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
        return 5 + (playerStore?.finalStats?.ap ?? 0);
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'ap'
        })
        return `對目標丟出一法力凝聚的光彈,造成 ${ColorText.ap(damage)}。\n(熟練度影響消耗SP)`;
    }

    protected execute(params: SkillParams): boolean {
        const playerStore = params.playerStore;
        const monster = params.monster;
        if (!playerStore || !monster) return false;
        if (playerStore.skillProficiency) {
            this.costSp = 10 - Math.floor((playerStore.getSkillProficiency(this.id)) * 0.1)
        }
        const dmg = this.getDamage(playerStore);
        monster.lastDamageResult = applySkillDamage({
            speller: playerStore,
            target: monster,
            baseValue: dmg,
            type: 'ap',
            skillName: '魔法彈'
        });
        useCardImpactEffect(getMonsterElement(params.monster.id), 'magic');
        return true;
    }
}

/**
 * 震盪波
 */
export class Shockwave extends SkillModel {
    constructor() {
        super({
            id: 'Shockwave',
            name: "震盪波",
            icon: "skills/magic/shockwave.svg",
            type: 'active',
            rarity: 'common',
            maxCd: 3,
            costSp: 15,
            costMaxAction: true,
            maxProficiency: 50,
            proficiencyGain: 2
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        const ap = playerStore?.finalStats?.ap ?? 0;
        return Math.round(ap * 0.6);
    }

    get stunChance() {
        return 20 + this.proficiency * 0.4
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'ap'
        });
        return `釋放震盪法術能量，對全體敵方目標造成 ${ColorText.ap(damage)}，且有 ${this.stunChance}% 機率使目標「暈眩」2 回合。`;
    }

    protected execute(params: SkillParams): boolean {
        const playerStore = params.playerStore;
        const gameStateStore = params.gameStateStore;
        if (!playerStore || !gameStateStore) return false;

        const aliveEnemies = gameStateStore.currentEnemy.filter(enemy => enemy.hp > 0);
        if (aliveEnemies.length === 0) return false;

        const dmg = this.getDamage(playerStore);

        aliveEnemies.forEach(monster => {
            monster.lastDamageResult = applySkillDamage({
                speller: playerStore,
                target: monster,
                baseValue: dmg,
                type: 'ap',
                skillName: this.name
            });
            if (!monster.lastDamageResult.isHit) {
                return
            }
            // 隨機判定暈眩
            if (Math.random() * 100 < this.stunChance) {
                monster.addEffect(UsualStatus.Stuck);
            }

            useCardImpactEffect(getMonsterElement(params.monster.id), 'magic');
        });

        return true;
    }
}


/**
 * 魔力武器
 */
export class ManaWeapon extends SkillModel {
    constructor() {
        super({
            id: 'ManaWeapon',
            name: "魔力武器",
            icon: "skills/magic/mana_weapon.svg",
            type: 'active',
            rarity: 'common',
            maxCd: 3,
            costSp: 15,
            costAction: 1,
            maxProficiency: 50,
            proficiencyGain: 5
        });
    }

    addAdValue(playerStore: PlayerStoreType): number {
        const ap = playerStore?.finalStats?.ap ?? 0;
        return Math.round(ap + this.proficiency * 0.1);
    }

    description(playerStore: PlayerStoreType): string {

        return `將魔力附魔於武器上，使自身的物攻（AD）提升 <span style="color: #FF8C00; font-weight: bold;">${this.addAdValue(playerStore)} 點</span>，持續 3 回合。\n(熟練度影響加成量)`;
    }

    protected execute({playerStore}: SkillParams): boolean {
        if (!playerStore) return false;

        playerStore.addStatus(SkillStatus.ManaWeaponStatus, {
            bonus: {
                ad: this.addAdValue(playerStore)
            },
            duration: 3
        });

        useFullScreenEffect({
            message: this.name,
            color: '#0ff1e9',
        });
        return true;
    }
}

/**
 * 魔力適性
 */
export class ManaAdaptability extends SkillModel {
    constructor() {
        super({
            id: 'ManaAdaptability',
            name: "魔力適性",
            icon: "skills/magic/mana_adaptability.svg",
            type: 'passive',
            rarity: 'common'
        });
    }

    description(playerStore: PlayerStoreType): string {
        return `提升自身 2 點法力回復值。`;
    }

    getPassiveBonus(): Record<string, number> {
        return {
            spRegen: 2
        };
    }

    protected execute(params: SkillParams): boolean {
        return true;
    }
}

/**
 * 法術技能樹
 */
export const ApSkillTree: Record<string, SkillTreeNode> = {
    MagicBall: {
        id: 'MagicBall',
        pathId: 'magic_ball',
        tier: 0,
        checkEligible: (playerStore) => {
            return (playerStore.info?.ap ?? 0) >= 10;
        }
    },
    Shockwave: {
        id: 'Shockwave',
        pathId: 'shockwave',
        tier: 0,
        checkEligible: (playerStore) => {
            return (playerStore.info?.ap ?? 0) >= 10;
        }
    },
    ManaWeapon: {
        id: 'ManaWeapon',
        pathId: 'mana_weapon',
        tier: 0,
        checkEligible: (playerStore) => {
            return (playerStore.info?.ap ?? 0) >= 10;
        }
    },
    ManaAdaptability: {
        id: 'ManaAdaptability',
        pathId: 'mana_adaptability',
        tier: 0,
        checkEligible: (playerStore) => {
            return (playerStore.info?.ap ?? 0) >= 10;
        }
    }
};
