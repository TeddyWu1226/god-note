import {SkillModel} from "@/models/skill-model";
import {PlayerStoreType, SkillParams, SkillTreeNode} from "@/types";

export class PhysiqueBoost extends SkillModel {
    constructor() {
        super({
            id: 'PhysiqueBoost',
            name: "血魔轉換",
            icon: "skills/physical/physique_boost.svg",
            type: 'passive',
            rarity: 'common',
        });
    }

    hpBonus = 25
    spBonus = 25


    description(): string {
        return `最大生命值增加 ${this.hpBonus} 點但最大SP值減少 ${this.spBonus} 點。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(): Record<string, number> {
        return {
            hpLimit: this.hpBonus,
            spLimit: -this.spBonus
        };
    }
}

export class BrainPowerBoost extends SkillModel {
    constructor() {
        super({
            id: 'BrainPowerBoost',
            name: "魔血轉換",
            icon: "skills/physical/brain_power_boost.svg",
            type: 'passive',
            rarity: 'common',
        });
    }

    hpBonus = 25
    spBonus = 25


    description(): string {
        return `最大法力值增加 ${this.spBonus} 點但最大生命值減少 ${this.hpBonus} 點。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(): Record<string, number> {
        return {
            hpLimit: -this.hpBonus,
            spLimit: this.spBonus
        };
    }
}

export class RedSkin extends SkillModel {
    constructor() {
        super({
            id: 'RedSkin',
            name: "紅皮膚",
            icon: "skills/physical/red_skin.svg",
            type: 'passive',
            rarity: 'common',
            uniqueFields: ['紅皮膚'],
        });
    }

    description(): string {
        return `當無身體防具時，提升生命回復 2 點。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        if (!player?.equips?.body) {
            return {
                hpRegen: 2
            };
        }
        return {};
    }
}

export class BlueSkin extends SkillModel {
    constructor() {
        super({
            id: 'BlueSkin',
            name: "藍皮膚",
            icon: "skills/physical/blue_skin.svg",
            type: 'passive',
            rarity: 'common',
            uniqueFields: ['藍皮膚'],
        });
    }

    description(): string {
        return `當無身體防具時，提升法力回復 2 點。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(player?: any): Record<string, number> {
        if (!player?.equips?.body) {
            return {
                spRegen: 2
            };
        }
        return {};
    }
}

export class BloodManaLoop extends SkillModel {
    constructor() {
        super({
            id: 'BloodManaLoop',
            name: "血魔循環",
            icon: "skills/physical/blood_mana_loop.svg",
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

export class PurpleSkin extends SkillModel {
    constructor() {
        super({
            id: 'PurpleSkin',
            name: "紫皮膚",
            icon: "skills/physical/purple_skin.svg",
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

export class DemonBody extends SkillModel {
    constructor() {
        super({
            id: 'DemonBody',
            name: "魔人之體",
            icon: "skills/physical/demon_body.svg",
            type: 'passive',
            rarity: 'perfect',
        });
    }

    hpBonus = 50
    spBonus = 50
    hpRegenBonus = 5
    spRegenBonus = 5
    damageIncrease = 10
    hit = 25
    adDefend = 5

    description(): string {
        return `獲得魔人強化般的肉體。最大生命值與最大法力值皆增加 ${this.hpBonus} 點。在戰鬥中，每回合回復 ${this.hpRegenBonus} 點 HP 與 ${this.spRegenBonus} 點 SP，總增傷提升 ${this.damageIncrease}%, ${this.hit} 點命中值且防禦增加 ${this.adDefend} 點。`;
    }

    protected execute(): boolean {
        return true;
    }

    override getPassiveBonus(): Record<string, number> {
        return {
            hpLimit: this.hpBonus,
            spLimit: this.spBonus,
            hpRegen: this.hpRegenBonus,
            spRegen: this.spRegenBonus,
            adIncrease: this.damageIncrease,
            apIncrease: this.damageIncrease,
            hit: this.hit,
            adDefend: this.adDefend,
        };
    }
}

/**
 * 魔人強化
 * */
export const DemonBodySkillTree: Record<string, SkillTreeNode> = {
    BlueSkin: {id: 'BlueSkin', pathId: 'blue_skin', tier: 0},
    RedSkin: {id: 'RedSkin', pathId: 'red_skin', tier: 0},
    PurpleSkin: {
        id: 'PurpleSkin',
        pathId: 'purple_skin',
        tier: 2,
        fusesFrom: ['BlueSkin', 'RedSkin'],
        checkEligible: (playerStore) => {
            const hasBlue = playerStore.hasSkill('BlueSkin');
            const hasRed = playerStore.hasSkill('RedSkin');
            return !!hasBlue && !!hasRed;
        }
    },
    PhysiqueBoost: {id: 'PhysiqueBoost', pathId: 'PhysiqueBoost', tier: 0},
    BrainPowerBoost: {id: 'BrainPowerBoost', pathId: 'BrainPowerBoost', tier: 0},
    BloodManaLoop: {
        id: 'BloodManaLoop',
        pathId: 'bloodManaLoop',
        tier: 2,
        fusesFrom: ['PhysiqueBoost', 'BrainPowerBoost'],
        checkEligible: (playerStore) => {
            const hasPhysique = playerStore.hasSkill('PhysiqueBoost');
            const hasBrain = playerStore.hasSkill('BrainPowerBoost');
            return !!hasPhysique && !!hasBrain;
        }
    },
    // 魔人體 (融合紫皮膚與血魔循環)
    DemonBody: {
        id: 'DemonBody',
        pathId: 'demon_body',
        tier: 3,
        fusesFrom: ['PurpleSkin', 'BloodManaLoop'],
        checkEligible: (playerStore) => {
            const hasPurple = playerStore.hasSkill('PurpleSkin');
            const hasBloodMana = playerStore.hasSkill('BloodManaLoop');
            return !!hasPurple && !!hasBloodMana;
        }
    },
}