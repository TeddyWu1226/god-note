/**
 * 匕首相關主動與關聯技能
 */
import {SkillModel} from "@/models/skill-model";
import {
    PlayerStoreType,
    SkillOnPlayerAttackHitParams,
    SkillOnStartParams,
    SkillParams,
    SkillTreeNode,
    UserType
} from "@/types";
import {ColorText} from "@/utils/color";
import {applySkillDamage, getSkillFinalDamage} from "@/constants/fight-func";
import {useCardImpactEffect} from "@/components/Shared/CardImpactEffect/useCardImpactEffect";
import {getMonsterElement, Sleep} from "@/utils/create";
import {SkillStatus} from "@/constants/status/skill-status";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {showEffect} from "@/components/Shared/FloatingEffect/EffectManager";
import {isEquip, wrongWeaponEffect} from "@/constants/skill/utils";
import {EquipmentPosition} from "@/enums/enums";
import {UnitStatus} from "@/constants/status/unit-status";


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
        return Math.floor(ad * 0.6);
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'true'
        })
        return `快速前刺突襲，造成 ${ColorText.true(damage)}(0.6AD)。若裝備「匕首」類武器，有 50% 機率獲得 1 點行動點。`;
    }

    protected execute({playerStore, monster, gameStateStore}: SkillParams): boolean {
        if (!playerStore || !monster) return false;
        if (!isEquip('Knife', EquipmentPosition.WEAPON, playerStore.info)) {
            wrongWeaponEffect('Knife')
            return false
        }
        const dmg = this.getDamage(playerStore);
        monster.lastDamageResult = applySkillDamage({
            speller: playerStore,
            target: monster,
            baseValue: dmg,
            type: 'true',
            skillName: this.name
        });
        useCardImpactEffect(getMonsterElement(monster.id), 'physical');
        // 匕首專屬機率獲得行動點數
        if (!isEquip('Knife', EquipmentPosition.WEAPON, playerStore.info)) {
            return true
        }
        if (Math.random() <= 0.5) {
            gameStateStore.playerActionPoints += 1;
            showEffect(
                {
                    text: "獲得額外行動點數!",
                    type: "buff"
                }
            )
        }
        return true;
    }
}

export class SpeedStrike extends SkillModel {
    constructor() {
        super({
            id: 'SpeedStrike',
            name: "神速一擊",
            icon: "skills/active/speed_strike.svg",
            type: 'active',
            rarity: 'perfect',
            maxCd: 1,
            costSp: 5,
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
            type: 'true'
        })
        return `極快前刺攻擊，造成 ${ColorText.true(damage)}(1AD)。若裝備「匕首」類武器，有 50% 機率獲得 1 點行動點。`;
    }

    protected execute({playerStore, monster, gameStateStore}: SkillParams): boolean {
        if (!playerStore || !monster) return false;

        const dmg = this.getDamage(playerStore);
        monster.lastDamageResult = applySkillDamage({
            speller: playerStore,
            target: monster,
            baseValue: dmg,
            type: 'true',
            skillName: this.name
        });
        useCardImpactEffect(getMonsterElement(monster.id), 'physical');
        // 匕首專屬機率獲得行動點數
        if (!isEquip('Knife', EquipmentPosition.WEAPON, playerStore.info)) {
            return true
        }
        if (Math.random() <= 0.5) {
            gameStateStore.playerActionPoints += 1;
            showEffect(
                {
                    text: "獲得額外行動點數!",
                    type: "buff"
                }
            )
        }
        return true;
    }
}

export class SneakAttack extends SkillModel {
    constructor() {
        super({
            id: 'SneakAttack',
            name: "偷襲",
            icon: "skills/passive/sneak_attack.svg",
            type: 'passive',
            rarity: 'rare',
            uniqueFields: ['偷襲系']
        });
    }

    getDodgeIncrease(player: Omit<UserType, 'skills'>): number {
        const baseDodge = player?.dodge ?? 0;
        let equipDodge = 0;
        if (player?.equips) {
            Object.values(player.equips).forEach((item: any) => {
                if (item && typeof item.dodge === 'number') {
                    equipDodge += item.dodge;
                }
            });
        }
        return Math.floor((baseDodge + equipDodge) / 4);
    }

    description(playerStore: PlayerStoreType): string {
        return `裝備「匕首」類武器時，額外增加等同於 ${this.getDodgeIncrease(playerStore.info)}(25%基礎與裝備提供的迴避值)物理攻擊力。`;
    }


    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: UserType): Record<string, number> {
        if (isEquip('Knife', EquipmentPosition.WEAPON, player)) {

            return {
                ad: this.getDodgeIncrease(player)
            }
        }
        return {};
    }
}

export class SurpriseAttack extends SkillModel {
    constructor() {
        super({
            id: 'SurpriseAttack',
            name: "奇襲",
            icon: "skills/passive/surprise_attack.svg",
            type: 'passive',
            rarity: 'perfect',
            uniqueFields: ['偷襲系']
        });
    }

    getDodgeIncrease(player: Omit<UserType, 'skills'>): number {
        const baseDodge = player?.dodge ?? 0;
        let equipDodge = 0;
        if (player?.equips) {
            Object.values(player.equips).forEach((item: any) => {
                if (item && typeof item.dodge === 'number') {
                    equipDodge += item.dodge;
                }
            });
        }
        return Math.floor((baseDodge + equipDodge) / 2);
    }

    description(playerStore: PlayerStoreType): string {
        return `裝備「匕首」類武器時，額外增加等同於 ${this.getDodgeIncrease(playerStore.info)}(50%基礎與裝備提供的迴避值)物理攻擊力。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: UserType): Record<string, number> {
        if (isEquip('Knife', EquipmentPosition.WEAPON, player)) {

            return {
                ad: this.getDodgeIncrease(player)
            }
        }
        return {};
    }
}

export class MistBase extends SkillModel {
    constructor() {
        super({
            id: 'MistBase',
            name: "迷霧",
            icon: "skills/active/mist_base.svg",
            type: 'active',
            rarity: 'rare',
            costSp: 20,
            costAction: 1,
            maxCd: 4
        });
    }

    description(): string {
        return `讓戰場陷入迷霧：自身獲得「迷霧(玩家)」（提升 40 點閃避，攻擊或受擊後消失，持續 3 回合），且使全體敵方獲得「迷霧(敵方)」（降低 40 點命中，攻擊或受擊後消失，持續 3 回合）。`;
    }

    protected execute({playerStore, gameStateStore}: SkillParams): boolean {
        if (!playerStore || !gameStateStore) return false;

        // 1. 玩家獲得迷霧
        playerStore.addStatus(SkillStatus.PlayerMistStatus);

        // 2. 所有敵人獲得迷霧
        const enemies = gameStateStore.currentEnemy || [];
        enemies.forEach(enemy => {
            if (enemy.hp > 0) {
                enemy.addEffect(SkillStatus.EnemyMistStatus);
            }
        });

        useFullScreenEffect({
            message: this.name,
            color: '#bdc3c7',
        });

        return true;
    }
}

export class MistPro extends SkillModel {
    constructor() {
        super({
            id: 'MistPro',
            name: "麻醉迷霧",
            icon: "skills/active/mist_pro.svg",
            type: 'active',
            rarity: 'perfect',
            costSp: 30,
            costAction: 1,
            maxCd: 4
        });
    }

    description(): string {
        return `讓戰場陷入麻醉迷霧：自身獲得「麻醉迷霧(玩家)」（提升 60 點閃避值，持續 3 回合），且使全體敵方獲得「麻醉迷霧(敵方)」（降低 60 點命中值，持續 3 回合）。\n(繼承並強化迷霧)`;
    }

    protected execute({playerStore, gameStateStore}: SkillParams): boolean {
        if (!playerStore || !gameStateStore) return false;

        // 1. 玩家獲得麻醉迷霧
        playerStore.addStatus(SkillStatus.PlayerAnestheticMistStatus);

        // 2. 所有敵人獲得麻醉迷霧
        const enemies = gameStateStore.currentEnemy || [];
        enemies.forEach(enemy => {
            if (enemy.hp > 0) {
                enemy.addEffect(SkillStatus.EnemyAnestheticMistStatus);
            }
        });

        useFullScreenEffect({
            message: this.name,
            color: '#a569bd',
        });

        return true;
    }
}

export class Flurry extends SkillModel {
    constructor() {
        super({
            id: 'Flurry',
            name: "亂擊",
            icon: "skills/active/flurry.svg",
            type: 'active',
            rarity: 'rare',
            maxCd: 2,
            costSp: 15,
            costAction: 2
        });
    }

    getMaxHitNum = 4

    randomInt(): number {
        return Math.floor(Math.random() * (this.getMaxHitNum - 2 + 1)) + 2;
    }

    getSingleDamage(playerStore: PlayerStoreType): number {
        return playerStore?.finalStats?.ad ?? 0
    }


    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getSingleDamage(playerStore),
            type: 'ad'
        })
        return `狂亂地連續刺擊，對隨機敵方目標發起 2~${this.getMaxHitNum} 次攻擊，每次造成 ${ColorText.ad(damage)} 物理傷害。`;
    }


    protected async execute(params: SkillParams): Promise<boolean> {
        const playerStore = params.playerStore;
        if (!isEquip('Knife', EquipmentPosition.WEAPON, playerStore.info)) {
            wrongWeaponEffect('Knife')
            return false
        }
        const gameStateStore = params.gameStateStore;
        if (!playerStore || !gameStateStore) return false;

        const enemies = gameStateStore.currentEnemy || [];
        if (enemies.length === 0) return false;

        const hits = this.randomInt();
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
                canCrit: true,
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

export class KnifeWhirlwind extends SkillModel {
    constructor() {
        super({
            id: 'KnifeWhirlwind',
            name: "匕首旋風",
            icon: "skills/active/knife_whirlwind.svg",
            type: 'active',
            rarity: 'perfect',
            costSp: 25,
            costAction: 1,
            maxCd: 2
        });
    }

    getMaxHitNum = 4

    randomInt(): number {
        return Math.floor(Math.random() * (this.getMaxHitNum - 2 + 1)) + 2;
    }

    getSingleDamage(playerStore: PlayerStoreType): number {
        return playerStore?.finalStats?.ad ?? 0
    }


    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getSingleDamage(playerStore),
            type: 'ad'
        });
        return `旋風般飛擲出無數匕首，對全體敵方目標發起 2~${this.getMaxHitNum} 次隨機打擊，每次造成 ${ColorText.ad(damage)} (0.4 AD) 物理傷害。\n(必需裝備「匕首」類武器)`;
    }

    protected async execute({playerStore, gameStateStore}: SkillParams): Promise<boolean> {
        if (!playerStore || !gameStateStore) return false;

        if (!isEquip('Knife', EquipmentPosition.WEAPON, playerStore.info)) {
            wrongWeaponEffect('Knife')
            return false;
        }

        const enemies = gameStateStore.currentEnemy || [];
        if (enemies.length === 0) return false;

        const hits = this.randomInt();
        const dmg = this.getSingleDamage(playerStore);

        useFullScreenEffect({
            message: this.name,
            color: '#bdc3c7',
        });


        for (let i = 0; i < hits; i++) {
            // 每次打擊前過濾出尚存活的目標
            const livingEnemies = enemies.filter(m => m.hp > 0);
            if (livingEnemies.length === 0) break;

            livingEnemies.forEach(enemy => {
                enemy.lastDamageResult = applySkillDamage({
                    speller: playerStore,
                    target: enemy,
                    baseValue: dmg,
                    type: 'ad',
                    canCrit: true,
                    skillName: `${this.name} (${i + 1}擊)`
                });
                const el = getMonsterElement(enemy.id);
                if (el) {
                    useCardImpactEffect(el, 'physical');
                }
            });

            if (i < hits - 1) {
                await Sleep(200);
            }
        }

        return true;
    }
}

export class Assassinate extends SkillModel {
    constructor() {
        super({
            id: 'Assassinate',
            name: "刺殺",
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
        if (!isEquip('Knife', EquipmentPosition.WEAPON, playerStore.info)) {
            wrongWeaponEffect('Knife')
            return false
        }
        const dmg = this.getDamage(playerStore);
        monster.lastDamageResult = applySkillDamage({
            speller: playerStore,
            target: monster,
            baseValue: dmg,
            type: 'ad',
            skillName: this.name,
            canCrit: true,
            modifiers: {
                critIncrease: (playerStore.finalStats?.critIncrease ?? 0) + 25
            }
        });

        useCardImpactEffect(getMonsterElement(monster.id), 'assassinate');
        return true;
    }
}

export class Assassination extends SkillModel {
    constructor() {
        super({
            id: 'Assassination',
            name: "暗殺",
            icon: "skills/active/assassination.svg",
            type: 'active',
            rarity: 'perfect',
            maxCd: 3,
            costSp: 30,
            costAction: 2
        });
    }

    getDamage(playerStore: PlayerStoreType): number {
        const ad = playerStore?.finalStats?.ad ?? 0;
        return Math.floor(ad * 2.5);
    }

    description(playerStore: PlayerStoreType): string {
        const {damage} = getSkillFinalDamage({
            speller: playerStore,
            baseValue: this.getDamage(playerStore),
            type: 'ad'
        });
        return `對目標進行致命暗殺，造成 ${ColorText.ad(damage)} (3.0 AD) 物理傷害。此技能爆擊傷害額外提升 50%。\n(必需裝備「匕首」類武器)`;
    }

    protected execute({playerStore, monster}: SkillParams): boolean {
        if (!playerStore || !monster) return false;

        if (!isEquip('Knife', EquipmentPosition.WEAPON, playerStore.info)) {
            wrongWeaponEffect('Knife')
            return false;
        }

        const dmg = this.getDamage(playerStore);
        monster.lastDamageResult = applySkillDamage({
            speller: playerStore,
            target: monster,
            baseValue: dmg,
            type: 'ad',
            skillName: this.name,
            canCrit: true,
            modifiers: {
                critIncrease: (playerStore.finalStats?.critIncrease ?? 0) + 50
            }
        });

        useCardImpactEffect(getMonsterElement(monster.id), 'assassinate');
        return true;
    }
}

export class PoisonApply extends SkillModel {
    constructor() {
        super({
            id: 'PoisonApply',
            name: "毒藥附加",
            icon: "skills/passive/poison_apply.svg",
            type: 'passive',
            rarity: 'rare',
            uniqueFields: ['毒藥流']
        });
    }

    description(): string {
        return `裝備「匕首」類武器時，攻擊命中時有 30% 機率使目標陷入「中毒」狀態（每回合受到 5 點傷害，持續 4 回合）。`;
    }

    protected execute(): boolean {
        return true;
    }

    override onPlayerAttackHit({monster, playerStore}: SkillOnPlayerAttackHitParams) {
        if (!isEquip('Knife', EquipmentPosition.WEAPON, playerStore.info)) {
            return;
        }
        if (Math.random() <= 0.3) {
            monster.addEffect(UnitStatus.Poison, {value: 5});
            useCardImpactEffect(getMonsterElement(monster.id), 'poison');
        }
    }
}

export class PoisonStack extends SkillModel {
    constructor() {
        super({
            id: 'PoisonStack',
            name: "毒藥堆疊附加",
            icon: "skills/passive/poison_stack.svg",
            type: 'passive',
            rarity: 'perfect',
            uniqueFields: ['毒藥流']
        });
    }

    description(): string {
        return `裝備「匕首」類武器時，攻擊命中時有 30% 機率使目標陷入「中毒」狀態，且此中毒效果可以堆疊（每層每回合造成 5 點傷害，最多堆疊 5 層，持續 4 回合）。`;
    }

    protected execute(): boolean {
        return true;
    }

    override onPlayerAttackHit({monster, playerStore}: SkillOnPlayerAttackHitParams) {
        if (!isEquip('Knife', EquipmentPosition.WEAPON, playerStore.info)) {
            return;
        }
        if (Math.random() <= 0.30) {
            const existing = monster.hasStatus(UnitStatus.Poison.name);
            if (existing) {
                const currentVal = existing.value || 5;
                const newVal = Math.min(25, currentVal + 10);
                existing.value = newVal;
                existing.duration = 4; // 刷新持續時間
                existing.description = `每回合失去 ${newVal} 點生命值`;
            } else {
                monster.addEffect(UnitStatus.Poison);
            }
            useCardImpactEffect(getMonsterElement(monster.id), 'poison');
        }
    }
}

export class ConcealBreath extends SkillModel {
    constructor() {
        super({
            id: 'ConcealBreath',
            name: "迷蹤",
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

export class ConcealBreathInstinct extends SkillModel {
    constructor() {
        super({
            id: 'ConcealBreathInstinct',
            name: "迷蹤本能",
            icon: "skills/active/conceal_breath.svg",
            type: 'active',
            rarity: 'perfect',
            uniqueFields: ['隱蔽氣息'],
            maxProficiency: 0,
            proficiencyGain: 0,
            costAction: 1,
            costSp: 10,
            maxCd: 3
        });
    }

    description(): string {
        return `戰鬥開始時獲得「藏匿」效果（提升 50% 爆擊與 50 點閃避，最多持續 2 回合，若攻擊則消失）。也可以主動使用。`;
    }

    protected execute({playerStore}: SkillParams): boolean {
        playerStore.addStatus(SkillStatus.HideStatus);
        useFullScreenEffect({
            message: this.name,
            color: '#ffffff',
        });
        return true;
    }

    override onRoundStart({playerStore, gameStateStore, logStore}: SkillOnStartParams) {
        const round = gameStateStore?.battleRound ?? 1;
        if (round === 1 && playerStore) {
            playerStore.addStatus(SkillStatus.HideStatus);
            if (logStore) {
                logStore.logger.add(`[隱蔽氣息] 戰鬥開始！玩家獲得「藏匿」效果。`);
            }
        }
    }
}


export const KnifeRelationSkillTree: Record<string, SkillTreeNode> = {
    SwiftStrike: {
        id: 'SwiftStrike',
        pathId: 'swift_strike',
        tier: 2,
        evolvesFrom: ['VerticalSlash'],
        checkEligible: (playerStore) => {
            return !!playerStore.checkSkillPath('knifeplay') && !!playerStore.hasSkill('VerticalSlash');
        }
    },
    SpeedStrike: {
        id: 'SpeedStrike',
        pathId: 'speed_strike',
        tier: 3,
        evolvesFrom: ['SwiftStrike'],
        checkEligible: (playerStore) => {
            return !!playerStore.checkSkillPath('knifeplay') && !!playerStore.hasSkill('SwiftStrike');
        }
    },
    Flurry: {
        id: 'Flurry',
        pathId: 'flurry',
        tier: 2,
        evolvesFrom: ['HorizontalSlash'],
        checkEligible: (playerStore) => {
            return !!playerStore.checkSkillPath('knifeplay') && !!playerStore.hasSkill('HorizontalSlash');
        }
    },
    Assassinate: {
        id: 'Assassinate',
        pathId: 'assassinate',
        tier: 2,
        evolvesFrom: ['Thrust'],
        checkEligible: (playerStore) => {
            const hasKnifePath = playerStore.checkSkillPath('knifeplay');
            const hasThrust = playerStore.hasSkill('Thrust');
            return !!hasKnifePath && !!hasThrust;
        }
    },
    SneakAttack: {
        id: 'SneakAttack',
        pathId: 'sneak_attack',
        tier: 2,
        evolvesFrom: ['VerticalSlash'],
        checkEligible: (playerStore) => {
            return playerStore.hasSkill('VerticalSlash') && playerStore.checkSkillPath('knifeplay');
        }
    },
    SurpriseAttack: {
        id: 'SurpriseAttack',
        pathId: 'sneak_attack',
        tier: 3,
        evolvesFrom: ['SneakAttack'],
        checkEligible: (playerStore) => {
            return playerStore.hasSkill('SneakAttack') && playerStore.checkSkillPath('knifeplay');
        }
    },
    MistBase: {
        id: 'MistBase',
        pathId: 'mist_cloud',
        tier: 2,
        evolvesFrom: ['HorizontalSlash'],
        checkEligible: (playerStore) => {
            return playerStore.hasSkill('HorizontalSlash') && playerStore.checkSkillPath('knifeplay');
        }
    },
    MistPro: {
        id: 'MistPro',
        pathId: 'mist_cloud',
        tier: 3,
        evolvesFrom: ['MistBase'],
        checkEligible: (playerStore) => {
            return playerStore.hasSkill('MistBase') && playerStore.checkSkillPath('knifeplay');
        }
    },
    KnifeWhirlwind: {
        id: 'KnifeWhirlwind',
        pathId: 'flurry',
        tier: 3,
        evolvesFrom: ['Flurry'],
        checkEligible: (playerStore) => {
            return playerStore.hasSkill('Flurry') && playerStore.checkSkillPath('knifeplay');
        }
    },
    Assassination: {
        id: 'Assassination',
        pathId: 'assassinate',
        tier: 3,
        evolvesFrom: ['Assassinate'],
        checkEligible: (playerStore) => {
            return playerStore.hasSkill('Assassinate') && playerStore.checkSkillPath('knifeplay');
        }
    },
    PoisonApply: {
        id: 'PoisonApply',
        pathId: 'poison_apply',
        tier: 2,
        evolvesFrom: ['Thrust'],
        checkEligible: (playerStore) => {
            return playerStore.hasSkill('Thrust') && playerStore.checkSkillPath('knifeplay');
        }
    },
    PoisonStack: {
        id: 'PoisonStack',
        pathId: 'poison_apply',
        tier: 3,
        evolvesFrom: ['PoisonApply'],
        checkEligible: (playerStore) => {
            return playerStore.hasSkill('PoisonApply') && playerStore.checkSkillPath('knifeplay');
        }
    },

    ConcealBreath: {
        id: 'ConcealBreath',
        pathId: 'conceal_breath',
        tier: 2,
        checkEligible: (playerStore) => {
            return playerStore.checkSkillPath('knifeplay');
        }
    },
    ConcealBreathInstinct: {
        id: 'ConcealBreathInstinct',
        pathId: 'conceal_breath',
        tier: 4,
        evolvesFrom: ['ConcealBreath'],
        checkEligible: (playerStore) => {
            return !!playerStore.hasSkill('ConcealBreath');
        }
    },
}
