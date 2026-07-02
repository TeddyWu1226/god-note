import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillParams} from "@/types";
import {ColorText} from "@/utils/color";
import {applySkillDamage, getSkillFinalDamage} from "@/constants/fight-func";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {getMonsterElement, Sleep} from "@/utils/create";
import {useCardImpactEffect} from "@/components/Shared/CardImpactEffect/useCardImpactEffect";
import {showEffect} from "@/components/Shared/FloatingEffect/EffectManager";
import {SkillStatus} from "@/constants/status/skill-status";


/**
 * 亂擊 (Flurry) - 融合自 豎擊 + 橫擊 + 刺擊
 * 主動技能，對隨機敵方目標發起 3~4 次攻擊，每次造成小幅傷害。
 */
export class Flurry extends SkillModel {
    constructor() {
        super({
            id: 'Flurry',
            name: "亂擊",
            icon: "skills/active/flurry.svg",
            type: 'active',
            rarity: 'rare',
            maxCd: 0,
            costSp: 15,
            costAction: 1
        });
    }

    getSingleDamage(playerStore: PlayerStoreType): number {
        const ad = playerStore?.finalStats?.ad ?? 0;
        return Math.round(ad * 0.4);
    }

    getMaxHitNum() {
        return 1 + (Math.ceil(this.proficiency * 0.1))
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getSingleDamage(playerStore),
            type: 'ad'
        })
        return `狂亂地連續揮打，對隨機敵方目標發起 2~${this.getMaxHitNum()} 次攻擊，每次造成 ${ColorText.ad(damage)} 物理傷害。`;
    }

    protected async execute(params: SkillParams): Promise<boolean> {
        const playerStore = params.playerStore;
        const gameStateStore = params.gameStateStore;
        if (!playerStore || !gameStateStore) return false;

        const enemies = gameStateStore.currentEnemy || [];
        if (enemies.length === 0) return false;

        // 隨機決定 3 或 4 次連擊
        const hits = this.getMaxHitNum();
        const dmg = this.getSingleDamage(playerStore);

        useFullScreenEffect({
            message: '亂擊'
        });

        // 執行多段隨機打擊
        for (let i = 0; i < hits; i++) {
            // 每次打擊前過濾出尚存活的目標
            const livingEnemies = enemies.filter(m => m.hp > 0);
            if (livingEnemies.length === 0) break;

            const target = livingEnemies[Math.floor(Math.random() * livingEnemies.length)];
            target.lastDamageResult = applySkillDamage({
                speller: playerStore,
                target: target,
                baseValue: dmg,
                type: 'ad',
                skillName: `${this.name} (${i + 1}擊)`
            });
            const el = getMonsterElement(target.id)
            if (el) {
                useCardImpactEffect(el, 'physical');
            }

            // 每次打擊之間延遲 250 毫秒
            if (i < hits - 1) {
                await Sleep(250);
            }
        }

        return true;
    }
}

export class SwiftStrike extends SkillModel {
    constructor() {
        super({
            id: 'SwiftStrike',
            name: "迅捷一擊",
            icon: "skills/active/swift_strike.svg",
            type: 'active',
            rarity: 'rare',
            maxCd: 2,
            costSp: 10,
            costAction: 1
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        const ad = playerStore?.finalStats?.ad ?? 0;
        return Math.floor(ad);
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'ad'
        })
        return `快速前刺攻擊，造成 ${ColorText.ad(damage)} 物理傷害。若裝備「匕首」類武器，有 50% 機率獲得 1 點行動點。`;
    }

    protected execute({playerStore, monster, gameStateStore}: SkillParams): boolean {
        if (!playerStore || !monster) return false;

        const dmg = this.getDamage(playerStore);
        monster.lastDamageResult = applySkillDamage({
            speller: playerStore,
            target: monster,
            baseValue: dmg,
            type: 'ad',
            skillName: '迅捷一擊'
        });

        // 匕首專屬機率獲得行動點數
        const weaponName = playerStore.info?.equips?.weapon?.name || "";
        const isKnife = weaponName.includes("匕首") || weaponName.includes("小刀");
        if (isKnife && Math.random() <= 0.5) {
            gameStateStore.playerActionPoints += 1;
            showEffect(
                {
                    text: "獲得額外行動點數!",
                    type: "buff"
                }
            )
        }

        useCardImpactEffect(getMonsterElement(monster.id), 'thrust');
        return true;
    }
}

export class Assassinate extends SkillModel {
    constructor() {
        super({
            id: 'Assassinate',
            name: "精準刺殺",
            icon: "skills/active/assassinate.svg",
            type: 'active',
            rarity: 'rare',
            maxCd: 3,
            costSp: 20,
            costAction: 2
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        const ad = playerStore?.finalStats?.ad ?? 0;
        return Math.floor(ad * 2);
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'ad'
        })
        return `對目標要害進行致命刺殺，造成 ${ColorText.ad(damage)} 物理傷害。此技能爆擊傷害提升25%。`;
    }

    protected execute({playerStore, monster}: SkillParams): boolean {
        if (!playerStore || !monster) return false;

        const dmg = this.getDamage(playerStore);
        monster.lastDamageResult = applySkillDamage({
            speller: playerStore,
            target: monster,
            baseValue: dmg,
            type: 'ad',
            skillName: '刺殺',
            canCrit: true,
            modifiers: {
                critIncrease: (playerStore.finalStats?.critIncrease ?? 0) + 25
            }
        });

        useCardImpactEffect(getMonsterElement(monster.id), 'assassinate');
        return true;
    }
}

export class ConcealBreath extends SkillModel {
    constructor() {
        super({
            id: 'ConcealBreath',
            name: "隱蔽氣息",
            icon: "skills/active/conceal_breath.svg",
            type: 'active',
            rarity: 'rare',
            uniqueFields: ['隱蔽氣息'],
            maxProficiency: 0,
            proficiencyGain: 0,
            costAction: 1,
            costSp: 20,
            maxCd: 4
        });
    }

    description(): string {
        return `獲得「藏匿」效果（提升 50% 爆擊與 50 點閃避，最多持續 2 回合，若攻擊則消失）。`;
    }

    protected execute({playerStore}: SkillParams): boolean {
        playerStore.addStatus(SkillStatus.HideStatus);
        useFullScreenEffect({
            message: this.name,
            color: '#ffffff',
        });
        return true;
    }
}

