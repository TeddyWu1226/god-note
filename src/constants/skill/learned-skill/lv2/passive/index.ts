import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillOnPlayerAttackHitParams, SkillParams} from "@/types";
import {isMatchedWeapon, WeaponSkillMapping} from "@/constants/default-const";
import {useLogStore} from "@/store/log-store";
import {getMonsterElement} from "@/utils/create";
import {checkProbability} from "@/utils/math";
import {MonsterModel} from "@/models/monster-model";
import {applySkillDamage} from "@/constants/fight-func";
import {useCardImpactEffect} from "@/components/Shared/CardImpactEffect/useCardImpactEffect";
import {UsualStatus} from "@/constants/status/usual-status";

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

export class KnightWay extends SkillModel {
    constructor() {
        super({
            id: 'KnightWay',
            name: "騎士劍術",
            icon: "skills/active/knight_way.svg",
            type: 'passive',
            rarity: 'rare',
            maxProficiency: 0,
            proficiencyGain: 0,
            uniqueFields: ['SwordProficiency'],
        });
    }

    addSwordBonus() {
        return {
            hit: 25,
            ad: 5,
        }
    }

    addShieldBonus() {
        return {
            defendIncrease: 5,
            adDefend: 5,
        }
    }

    description(): string {
        const swordBonus = this.addSwordBonus()
        const shieldBonus = this.addShieldBonus()
        return `裝備名稱含有「${WeaponSkillMapping.SwordProficiency.join(', ')}」的武器時, 提升 ${swordBonus.ad} 點物理攻擊力, ${swordBonus.hit} 點命中。`
            + `<br/>裝備名稱含有「盾」的副手時, 提升 ${shieldBonus.defendIncrease}% 抗性 以及 ${shieldBonus.adDefend} 點防禦`
            ;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        const weaponName = player?.equips?.weapon?.name || '';
        const offhandName = player?.equips?.offhand?.name || '';
        let bonus = {}
        if (isMatchedWeapon('SwordProficiency', weaponName)) {
            bonus = {...bonus, ...this.addSwordBonus()}
        }
        if (offhandName.includes('盾')) {
            bonus = {...bonus, ...this.addShieldBonus()}
        }
        return bonus;
    }
}

export class HeartOfRebellion extends SkillModel {
    constructor() {
        super({
            id: 'HeartOfRebellion',
            name: "反抗鬥志",
            icon: "skills/passive/heart_of_rebellion.svg",
            type: 'passive',
            rarity: 'rare',
            uniqueFields: ['格檔強化'],
        });
    }

    description(playerStore: PlayerStoreType): string {
        return `完美格擋（格擋敵方暴擊）的受傷比例減少至 25%。且完美格擋成功時，獲得下一回合 20% 物理與法術增傷。`;
    }

    protected execute(params: SkillParams): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
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
        return `增加 ${this.bonus.critRate}% 爆擊率, ${this.bonus.critIncrease}% 爆擊傷害。`;
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
        return `攻擊時有 ${this.happenRate}% 機率，對其餘敵人造成該次傷害 ${this.diffusionRate}% 的擴散傷害。`;
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
        return `攻擊時有 ${this.chance}% 機率，使目標陷入「破甲」狀態（防禦力降低 ${this.getValue(playerStore)} (5+0.2*等級) 點，持續 3 回合）。`;
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

export class BloodManaLoop extends SkillModel {
    constructor() {
        super({
            id: 'BloodManaLoop',
            name: "血魔循環",
            icon: "skills/passive/blood_mana_loop.svg",
            type: 'passive',
            rarity: 'rare',
        });
    }

    hpBonus = 30
    spBonus = 30
    hpRegenBonus = 2
    spRegenBonus = 2

    description(): string {
        return `最大生命值與最大法力值皆增加 ${this.hpBonus} 點。在戰鬥中，每回合回復 ${this.hpRegenBonus} 點 HP 與 ${this.spRegenBonus} 點 SP。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(): Record<string, number> {
        return {
            hpLimit: this.hpBonus,
            spLimit: this.spBonus,
            hpRegen: this.hpRegenBonus,
            spRegen: this.spRegenBonus
        };
    }
}


/**
 * 紫皮膚 (PurpleSkin) - 融合自 藍皮膚 + 紅皮膚
 * 被動技能，無裝備時加強很多能力。
 */
export class PurpleSkin extends SkillModel {
    constructor() {
        super({
            id: 'PurpleSkin',
            name: "紫皮膚",
            icon: "skills/passive/purple_skin.svg",
            type: 'passive',
            rarity: 'rare'
        });
    }

    regen = 2
    increase = 10

    description(playerStore: PlayerStoreType): string {
        return `當無身體防具時，提升生命與法力回復各 ${this.regen} 點且總輸出提升 ${this.increase}%。`;
    }

    protected execute(params: SkillParams): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        if (!player?.equips?.body) {
            return {
                hpRegen: this.regen,
                spRegen: this.regen,
                adIncrease: this.increase,
                apIncrease: this.increase
            };
        }
        return {};
    }
}
