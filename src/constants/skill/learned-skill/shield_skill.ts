/**
 * 盾牌相關
 */
import {SkillModel} from "@/models/skill-model";
import {SkillTreeNode, PlayerStoreType, SkillParams, SkillOnPlayerAttackedHitParams} from "@/types";
import {isEquip, wrongWeaponEffect} from "@/constants/skill/utils";
import {EquipmentPosition} from "@/enums/enums";
import {UsualStatus} from "@/constants/status/usual-status";
import {useCardImpactEffect} from "@/components/Shared/CardImpactEffect/useCardImpactEffect";
import {getMonsterElement, getPlayerElement} from "@/utils/create";
import {useFloatingMessage} from "@/components/Shared/FloatingMessage/useFloatingMessage";

export class BlockBase extends SkillModel {
    constructor() {
        super({
            id: 'BlockBase',
            name: "格擋技巧",
            icon: "skills/physical/block_base.svg",
            type: 'passive',
            rarity: 'common',
            uniqueFields: ['BlockBase'],
        });
    }

    description(): string {
        return `完美格擋（格擋敵方暴擊）的受傷比例減少至25%。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(): Record<string, number> {
        return {};
    }
}

export class BlockPro extends SkillModel {
    constructor() {
        super({
            id: 'BlockPro',
            name: "格擋精通",
            icon: "skills/physical/block_pro.svg",
            type: 'passive',
            rarity: 'rare',
            uniqueFields: ['BlockBase'],
        });
    }

    description(): string {
        return `完美格擋（格擋敵方暴擊）的受傷比例減少至25%，並提升主動格擋時獲得的防禦值。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(): Record<string, number> {
        return {};
    }
}

export class BlockAdv extends SkillModel {
    constructor() {
        super({
            id: 'BlockAdv',
            name: "格擋進階精通",
            icon: "skills/physical/block_adv.svg",
            type: 'passive',
            rarity: 'perfect',
            uniqueFields: ['BlockBase'],
        });
    }

    description(): string {
        return `完美格擋（格擋敵方暴擊）的受傷比例減少至10%，並大幅提升主動格擋時獲得的防禦值。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(): Record<string, number> {
        return {};
    }
}

export class ShieldBash extends SkillModel {
    constructor() {
        super({
            id: 'ShieldBash',
            name: "盾擊",
            icon: "skills/physical/shield_bash.svg",
            type: 'active',
            rarity: 'rare',
            maxCd: 3,
            costSp: 10,
            costAction: 1,
            maxProficiency: 100,
            proficiencyGain: 5
        });
    }

    description(): string {
        const hitChance = Math.round(10 + (this.proficiency / 100) * 25);
        return `用盾牌猛擊敵方，有 ${hitChance}% 機率使目標陷入「暈眩」狀態，無法行動，持續 2 回合。\n(熟練度影響命中率)`;
    }

    protected execute({playerStore, monster}: SkillParams): boolean {
        if (!playerStore || !monster) return false;

        // 判斷有無裝備指定武器用
        if (!isEquip('Shield', EquipmentPosition.OFFHAND, playerStore.info)) {
            wrongWeaponEffect('Shield');
            return false;
        }

        const hitChance = (10 + (this.proficiency / 100) * 25) / 100;
        if (Math.random() <= hitChance) {
            monster.addEffect(UsualStatus.Stuck);
            useCardImpactEffect(getMonsterElement(monster.id), 'stun');
        } else {
            useFloatingMessage(
                'MISS',
                getMonsterElement(monster.id),
                {
                    duration: 800, // 動畫時間保持不變
                    color: 'white',
                }
            );
        }

        return true;
    }
}

export class CounterShield extends SkillModel {
    constructor() {
        super({
            id: 'CounterShield',
            name: "反擊盾",
            icon: "skills/physical/counter_shield.svg",
            type: 'passive',
            rarity: 'rare',
            uniqueFields: ['反擊盾系']
        });
    }

    description(): string {
        return `裝備「盾牌」時，即使沒有達成完美格擋，當受擊時也有 10% 機率使發動攻擊的怪獸陷入「暈眩」狀態 2 回合。`;
    }

    protected execute(): boolean {
        return true;
    }

    override onPlayerAttacked({playerStore, monster, attackedOutcome}: SkillOnPlayerAttackedHitParams) {
        if (!attackedOutcome.isHit) {
            return;
        }
        if (!isEquip('Shield', EquipmentPosition.OFFHAND, playerStore.info)) {
            return;
        }
        const isPerfectBlock = attackedOutcome.isCrit && !!playerStore.hasStatus('格擋');
        if (!isPerfectBlock) {
            if (Math.random() <= 0.10) {
                monster.addEffect(UsualStatus.Stuck);
                useCardImpactEffect(getMonsterElement(monster.id), 'stun');
            }
        }
    }
}

export class CounterShieldAdv extends SkillModel {
    constructor() {
        super({
            id: 'CounterShieldAdv',
            name: "反擊盾進階",
            icon: "skills/physical/counter_shield_adv.svg",
            type: 'passive',
            rarity: 'perfect',
            uniqueFields: ['反擊盾系']
        });
    }

    description(): string {
        return `裝備「盾牌」時，即使沒有達成完美格擋，當受擊時也有 25% 機率使發動攻擊的怪獸陷入「暈眩」狀態 2 回合。`;
    }

    protected execute(): boolean {
        return true;
    }

    override onPlayerAttacked({playerStore, monster, attackedOutcome}: SkillOnPlayerAttackedHitParams) {
        if (!attackedOutcome.isHit) {
            return;
        }
        if (!isEquip('Shield', EquipmentPosition.OFFHAND, playerStore.info)) {
            return;
        }
        const isPerfectBlock = attackedOutcome.isCrit && !!playerStore.hasStatus('格擋');
        if (!isPerfectBlock) {
            if (Math.random() <= 0.25) {
                monster.addEffect(UsualStatus.Stuck);
                useCardImpactEffect(getMonsterElement(monster.id), 'stun');
            }
        }
    }
}

export const ShieldSkillTree: Record<string, SkillTreeNode> = {
    BlockBase: {
        id: 'BlockBase',
        pathId: 'block_boost',
        tier: 1,
        checkEligible: (playerStore) => {
            const offhand = playerStore.info.equips?.offhand;
            return !!(offhand && offhand.name.includes('盾'));
        }
    },
    BlockPro: {
        id: 'BlockPro',
        pathId: 'block_boost',
        tier: 2,
        evolvesFrom: ['BlockBase'],
        checkEligible: (playerStore) => {
            const hasBase = playerStore.hasSkill('BlockBase');
            if (!hasBase) {
                return false;
            }
            const offhand = playerStore.info.equips?.offhand;
            return !!(offhand && offhand.name.includes('盾'));
        }
    },
    BlockAdv: {
        id: 'BlockAdv',
        pathId: 'block_boost',
        tier: 3,
        evolvesFrom: ['BlockPro'],
        checkEligible: (playerStore) => {
            const hasBase = playerStore.hasSkill('BlockPro');
            if (!hasBase) {
                return false;
            }
            const offhand = playerStore.info.equips?.offhand;
            return !!(offhand && offhand.name.includes('盾'));
        }
    },
    ShieldBash: {
        id: 'ShieldBash',
        pathId: 'shield_bash',
        tier: 0,
        checkEligible: (playerStore) => {
            const offhand = playerStore.info.equips?.offhand;
            const weapon = playerStore.info.equips?.weapon;
            return !!((offhand && offhand.name.includes('盾')) || (weapon && weapon.name.includes('盾')));
        }
    },
    CounterShield: {
        id: 'CounterShield',
        pathId: 'counter_shield',
        tier: 1,
        checkEligible: (playerStore) => {
            const offhand = playerStore.info.equips?.offhand;
            const weapon = playerStore.info.equips?.weapon;
            const hasShield = !!((offhand && offhand.name.includes('盾')) || (weapon && weapon.name.includes('盾')));
            if (!hasShield) return false;

            const shieldBashInstance = playerStore.info.skills.find((s: any) => s.id === 'ShieldBash');
            return !!(shieldBashInstance && shieldBashInstance.proficiency >= 100);
        }
    },
    CounterShieldAdv: {
        id: 'CounterShieldAdv',
        pathId: 'counter_shield',
        tier: 3,
        evolvesFrom: ['CounterShield'],
        checkEligible: (playerStore) => {
            const offhand = playerStore.info.equips?.offhand;
            const weapon = playerStore.info.equips?.weapon;
            const hasShield = !!((offhand && offhand.name.includes('盾')) || (weapon && weapon.name.includes('盾')));
            if (!hasShield) return false;

            return !!playerStore.hasSkill('CounterShield');
        }
    }
};