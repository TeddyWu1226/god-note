import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillParams} from "@/types";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {ItemStatus} from "@/constants/status/item-status";
import {useCardImpactEffect} from "@/components/Shared/CardImpactEffect/useCardImpactEffect";
import {SkillStatus} from "@/constants/status/skill-status";
import {playerAddSavePower} from "@/constants/status/advanced-status-utils";
import {showEffect} from "@/components/Shared/FloatingEffect/EffectManager";

export class ShieldBlock extends SkillModel {
    constructor() {
        super({
            id: 'ShieldBlock',
            name: "格擋",
            icon: "skills/physical/shield_block.svg",
            type: 'active',
            rarity: 'common',
            costSp: 10,
            costAction: 1,
            maxCd: 3,
            itemDescription: '舉起盾牌進行防禦，本回合內提升防禦力以抵擋傷害，如果敵方爆擊，則降低該次傷害並額外造成對方暫時暈眩。\n[冷卻: 2 回合]'
        });
    }

    getDefend(playerStore: PlayerStoreType): number {
        const shellDefend = playerStore?.info?.equips?.offhand?.adDefend
        if (!shellDefend) return 0;
        return Math.floor(shellDefend * 1.2) + 5;
    }

    description(playerStore: PlayerStoreType): string {
        const shield = this.getDefend(playerStore);
        return `舉起盾牌進行防禦，本回合內提升 ${shield} 點防禦。\n完美格擋:如果抵擋敵方爆擊傷害，可以額外降低該次傷害，並造成對方暫時暈眩。`;
    }

    protected execute(params: SkillParams): boolean {
        const playerStore = params.playerStore;
        if (!playerStore) return false;

        const shield = this.getDefend(playerStore);
        playerStore.addStatus(
            ItemStatus.Block,
            {
                bonus: {
                    adDefend: shield
                }
            }
        );

        useFullScreenEffect({
            message: '格擋',
            color: 'gray'
        });
        useCardImpactEffect(null, 'buff');
        return true;
    }
}

export class PowerCharge extends SkillModel {
    constructor() {
        super({
            id: 'PowerCharge',
            name: "蓄力",
            icon: "skills/physical/power_charge.svg",
            type: 'active',
            rarity: 'common',
            costSp: 5,
            costAction: 1,
            maxCd: 2,
            itemDescription: '下一回合提升 50% 物理傷害與 20 點命中值。[冷卻: 2 回合]'
        });
    }

    adIncrease = 100

    description(playerStore: PlayerStoreType): string {
        return `蓄積力氣，下一回合提升 ${this.adIncrease}% 物理傷害。`;
    }

    protected execute({playerStore}: SkillParams): boolean {
        playerAddSavePower(playerStore)
        useFullScreenEffect({
            message: '蓄力',
            color: 'orange'
        });
        return true;
    }
}


export class MagicShieldRecover extends SkillModel {
    constructor() {
        super({
            id: 'MagicShieldRecover',
            name: "護盾修復",
            icon: "skills/physical/shield_tech_base.svg",
            type: 'active',
            rarity: 'common',
            costSp: 0,
            costAction: 1,
            maxCd: 10,
            itemDescription: '立即復原護盾值。[冷卻: 10 回合]'
        });
    }


    description(playerStore: PlayerStoreType): string {
        return `立即復原 ${playerStore.finalStats.shieldLimit} 點護盾值。`;
    }

    protected execute({playerStore}: SkillParams): boolean {
        if ((playerStore.finalStats.shieldLimit || 0) <= 0) {
            showEffect({
                text: "沒有護盾值...",
                type: 'debuff'
            });
            return false;
        }

        playerStore.info.shield = playerStore.finalStats.shieldLimit || 0;
        useFullScreenEffect({
            message: '護盾修復',
            color: '#5dade2',
        });
        return true;
    }
}