import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillParams} from "@/types";
import {ColorText} from "@/utils/color";
import {applySkillDamage} from "@/constants/fight-func";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {genCustomStatus, Sleep} from "@/utils/create";

/**
 * 1. 劍術大師 (SwordMaster) - 進化自 劍術精通
 * 被動技能，裝備劍時提升 15% 物理傷害，以及 20 點命中值。
 */
export class SwordMaster extends SkillModel {
    constructor() {
        super({
            id: 'SwordMaster',
            name: "劍術大師",
            icon: "skills/sword_master.svg",
            type: 'passive',
            rarity: 'rare',
        });
    }

    description(playerStore: PlayerStoreType): string {
        return `裝備劍（名稱含有「劍」的武器）時，提升 15% 物理傷害，並增加 20 點命中。`;
    }

    protected execute(params: SkillParams): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        const weaponName = player?.equips?.weapon?.name || '';
        if (weaponName.includes('劍')) {
            return {
                adIncrease: 15,
                hit: 20
            };
        }
        return {};
    }
}

/**
 * 2. 劈斬 (Cleave) - 進化自 豎擊
 * 主動技能，造成高額單體傷害，並在下一回合提升 5% 物理傷害。
 */
export class Cleave extends SkillModel {
    constructor() {
        super({
            id: 'Cleave',
            name: "劈斬",
            icon: "skills/cleave.svg",
            type: 'active',
            rarity: 'rare',
            maxCd: 0,
            costSp: 12,
            costAction: 1,
            maxProficiency: 100,
            proficiencyGain: 1
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        const ad = playerStore?.finalStats?.ad ?? 0;
        return Math.round(ad * 1.5 + this.proficiency * 0.5);
    }

    description(playerStore: PlayerStoreType): string {
        const dmg = this.getDamage(playerStore);
        return `重重劈斬單體敵人，造成 ${ColorText.ad(dmg)} 物理傷害，並使下一回合提升 5% 物理傷害。`;
    }

    protected execute(params: SkillParams): boolean {
        const playerStore = params.playerStore;
        const monster = params.monster;
        if (!playerStore || !monster) return false;

        const dmg = this.getDamage(playerStore);
        monster.lastDamageResult = applySkillDamage(playerStore.finalStats, monster, dmg, 'ad', this.name);

        // 提升下一回合 5% 物理傷害 (加持續時間為 2 的 Buff，當前/下回合結束時分別減1，下回合行動時剩下 1 回合且依然生效)
        playerStore.addStatus(genCustomStatus({
            base: {
                name: '攻擊強化',
                icon: '🗡️',
                duration: 2,
                isBuff: true,
                description: '提升 5% 物理傷害',
                bonus: {
                    adIncrease: 5
                }
            },
            duration: 2
        }));

        useFullScreenEffect({
            message: '劈斬',
            color: 'red'
        });

        return true;
    }
}

/**
 * 3. 亂擊 (Flurry) - 融合自 豎擊 + 橫擊 + 刺擊
 * 主動技能，對隨機敵方目標發起 3~4 次攻擊，每次造成小幅傷害。
 */
export class Flurry extends SkillModel {
    constructor() {
        super({
            id: 'Flurry',
            name: "亂擊",
            icon: "skills/flurry.svg",
            type: 'active',
            rarity: 'rare',
            maxCd: 0,
            costSp: 15,
            costAction: 1,
            maxProficiency: 50,
            proficiencyGain: 2
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
        const dmg = this.getSingleDamage(playerStore);
        return `狂亂地連續揮打，對隨機敵方目標發起 2~${this.getMaxHitNum()} 次攻擊，每次造成 ${ColorText.ad(dmg)} 物理傷害。`;
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
            target.lastDamageResult = applySkillDamage(playerStore.finalStats, target, dmg, 'ad', `${this.name} (${i + 1}擊)`);

            // 每次打擊之間延遲 250 毫秒
            if (i < hits - 1) {
                await Sleep(250);
            }
        }

        return true;
    }
}
