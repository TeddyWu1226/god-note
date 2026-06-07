import { SkillDescriptionParams, SkillParams } from "@/types";
import { applySkillDamage } from "@/constants/fight-func";
import { ColorText } from "@/utils/color";
import { checkProbability, formatPrecision } from "@/utils/math";
import { ItemStatus } from "@/constants/status/item-status";
import { create, genCustomStatus, Sleep } from "@/utils/create";
import { useFullScreenEffect } from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import { SkillStatus } from "@/constants/status/skill-status";

export type SkillRarity = 'common' | 'rare' | 'legendary' | 'unique';
export type SkillTypeCategory = 'active' | 'passive';

export class Skill {
    id: string;
    name: string;
    icon: string;
    type: SkillTypeCategory;
    rarity: SkillRarity;
    level: number;
    proficiency: number;
    currentCd: number;
    maxCd: number;
    costSp: number;
    costHp: number;
    costAction: number;
    description: (playerStore: any) => string;
    use: (params: SkillParams) => Promise<boolean>;
    passiveBonusFn?: (self: Skill) => Record<string, number>; // 💡 被動加成運算函式

    constructor(data: {
        id: string;
        name: string;
        icon: string;
        type: SkillTypeCategory;
        rarity: SkillRarity;
        level?: number;
        proficiency?: number;
        currentCd?: number;
        maxCd?: number;
        costSp?: number;
        costHp?: number;
        costAction?: number;
        description: (playerStore: any, self: Skill) => string;
        use: (params: SkillParams, self: Skill) => Promise<boolean> | boolean;
        passiveBonus?: (self: Skill) => Record<string, number>; // 💡 被動加成屬性
    }) {
        this.id = data.id;
        this.name = data.name;
        this.icon = data.icon;
        this.type = data.type;
        this.rarity = data.rarity;
        this.level = data.level || 1;
        this.proficiency = data.proficiency || 0;
        this.currentCd = data.currentCd || 0;
        this.maxCd = data.maxCd || 0;
        this.costSp = data.costSp || 0;
        this.costHp = data.costHp || 0;
        this.costAction = data.costAction || 1;
        this.passiveBonusFn = data.passiveBonus;

        // 包裝函數以提供自身實例的屬性存取
        const descFn = data.description;
        this.description = (playerStore: any) => descFn(playerStore, this);

        const useFn = data.use;
        this.use = async (params: SkillParams) => {
            if (this.currentCd > 0) {
                return false;
            }
            const success = await useFn(params, this);
            if (success) {
                this.currentCd = this.maxCd;
            }
            return success;
        };
    }

    // 💡 獲取被動加成數據
    getPassiveBonus(): Record<string, number> {
        if (this.type !== 'passive' || !this.passiveBonusFn) {
            return {};
        }
        return this.passiveBonusFn(this);
    }

    // 序列化為 JSON，用於 Pinia 儲存
    toJSON() {
        return {
            id: this.id,
            level: this.level,
            proficiency: this.proficiency,
            currentCd: this.currentCd
        };
    }
}

export const SKILL_TEMPLATES: Record<string, any> = {
    CommonHeal: {
        id: 'CommonHeal',
        name: "初級治療",
        icon: "💕",
        type: 'active',
        rarity: 'common',
        maxCd: 2,
        costSp: 25,
        description: (playerStore: any, self: Skill) => {
            const value = Math.floor((30 + self.level * 15 + self.proficiency * 0.7));
            return `自身 ${ColorText.heal(value)}。 [冷卻: ${self.maxCd} 回合]`;
        },
        use: async (params: SkillParams, self: Skill) => {
            const playerStore = params.playerStore!;
            const value = Math.floor((30 + self.level * 15 + self.proficiency * 0.7));
            playerStore.info.hp = Math.min(playerStore.finalStats.hpLimit, playerStore.info.hp + value);
            return true;
        }
    },
    DoubleHit: {
        id: 'DoubleHit',
        name: "二連擊",
        icon: "⚔️",
        type: 'active',
        rarity: 'common',
        maxCd: 1,
        costSp: 15,
        description: (playerStore: any, self: Skill) => {
            const base = playerStore.finalStats.ad * (0.6 + self.level * 0.15 + self.proficiency * 0.005);
            const dmg = Math.floor(base * (1 + (playerStore.finalStats.adIncrease / 100)));
            return `快速斬出兩擊，各別造成 ${ColorText.ad(dmg)}。 [冷卻: ${self.maxCd} 回合]`;
        },
        use: async (params: SkillParams, self: Skill) => {
            const playerStore = params.playerStore!;
            const monster = params.monster;
            if (!monster) return false;
            const base = playerStore.finalStats.ad * (0.6 + self.level * 0.15 + self.proficiency * 0.005);
            const dmg = Math.floor(base * (1 + (playerStore.finalStats.adIncrease / 100)));
            let damageOutput = applySkillDamage(playerStore.finalStats, monster, dmg, 'ad', '二連擊');
            monster.lastDamageResult = damageOutput;
            if (damageOutput.isKilled) {
                return true;
            }
            await Sleep(200);
            damageOutput = applySkillDamage(playerStore.finalStats, monster, dmg, 'ad', '二連擊');
            monster.lastDamageResult = damageOutput;
            return true;
        }
    },
    SwordMind: {
        id: 'SwordMind',
        name: "劍意",
        icon: "🤺",
        type: 'active',
        rarity: 'rare',
        maxCd: 4,
        costSp: 20,
        description: (playerStore: any, self: Skill) => {
            const remain = 3 + self.level + Math.floor(self.proficiency * 0.07);
            const adInc = 10 + self.level * 5;
            return `提升自身 ${adInc}% 所有增傷以及 10% 抗性，持續 ${remain} 回合。 [冷卻: ${self.maxCd} 回合]`;
        },
        use: async (params: SkillParams, self: Skill) => {
            const playerStore = params.playerStore!;
            const remain = 3 + self.level + Math.floor(self.proficiency * 0.07);
            const adInc = 10 + self.level * 5;
            const status = create(SkillStatus.SwordMind);
            status.duration = remain;
            status.bonus = {
                ...status.bonus,
                adIncrease: adInc,
                apIncrease: adInc
            };
            playerStore.addStatus(status);
            useFullScreenEffect({
                message: '輸出以及抗性提升',
            });
            return true;
        }
    },
    MagicBall: {
        id: 'MagicBall',
        name: "法力彈",
        icon: "🔵",
        type: 'active',
        rarity: 'common',
        maxCd: 0,
        costSp: 10,
        description: (playerStore: any, self: Skill) => {
            const dmg = Math.floor((5 + self.level * 5 + self.proficiency * 0.15) * (1 + playerStore.finalStats.apIncrease / 100));
            return `對目標丟出一法力凝聚的光彈,造成 ${ColorText.ap(dmg)}。`;
        },
        use: async (params: SkillParams, self: Skill) => {
            const playerStore = params.playerStore!;
            const monster = params.monster;
            if (!monster) return false;
            const dmg = Math.floor((5 + self.level * 5 + self.proficiency * 0.15) * (1 + playerStore.finalStats.apIncrease / 100));
            monster.lastDamageResult = applySkillDamage(playerStore.finalStats, monster, dmg, 'ap', '法力彈');
            return true;
        }
    },
    FireBall: {
        id: 'FireBall',
        name: "火球術",
        icon: "🔥",
        type: 'active',
        rarity: 'rare',
        maxCd: 2,
        costSp: 15,
        description: (playerStore: any, self: Skill) => {
            const dmg = Math.floor((10 + self.level * 8 + self.proficiency * 0.15) * (1 + playerStore.finalStats.apIncrease / 100));
            const percent = formatPrecision(0.1 + self.level * 0.05 + self.proficiency * 0.007, 3) * 100;
            return `對目標丟出一顆火球,造成 ${ColorText.ap(dmg)},有 ${percent}% 機率造成「燃燒」效果。 [冷卻: ${self.maxCd} 回合]`;
        },
        use: async (params: SkillParams, self: Skill) => {
            const playerStore = params.playerStore!;
            const monster = params.monster;
            const gameStateStore = params.gameStateStore!;
            if (!monster) return false;
            const dmg = Math.floor((10 + self.level * 8 + self.proficiency * 0.15) * (1 + playerStore.finalStats.apIncrease / 100));
            monster.lastDamageResult = applySkillDamage(playerStore.finalStats, monster, dmg, 'ap', '火球術');
            if (monster.lastDamageResult.isHit) {
                const percent = formatPrecision(0.1 + self.level * 0.05 + self.proficiency * 0.007, 3);
                if (checkProbability(percent)) {
                    gameStateStore.addEffectToMonster(monster, ItemStatus.OnBurn);
                }
            }
            return true;
        }
    },
    MagicDefend: {
        id: 'MagicDefend',
        name: "法術裝甲",
        icon: "🌐",
        type: 'active',
        rarity: 'rare',
        maxCd: 3,
        costSp: 25,
        description: (playerStore: any, self: Skill) => {
            const defend = 5 + self.level * 5 + Math.floor(self.proficiency * 0.2);
            return `提升自身 ${defend} 點防禦，持續 3 回合。 [冷卻: ${self.maxCd} 回合]`;
        },
        use: async (params: SkillParams, self: Skill) => {
            const playerStore = params.playerStore!;
            const defend = 5 + self.level * 5 + Math.floor(self.proficiency * 0.2);
            playerStore.addStatus(genCustomStatus({
                base: SkillStatus.MagicDefend,
                bonus: {
                    adDefend: defend
                },
                duration: 3
            }));
            useFullScreenEffect({
                message: '防禦提升',
                color: 'blue'
            });
            return true;
        }
    },
    // 副手技能
    ShieldBlock: {
        id: 'ShieldBlock',
        name: "格擋",
        icon: "🛡",
        type: 'active',
        rarity: 'common',
        maxCd: 0,
        costSp: 20,
        description: (playerStore: any, self: Skill) => {
            const shield = (playerStore.info.equips?.offhand?.adDefend ?? 0);
            return `舉起盾牌進行防禦,本回合內提升 ${shield} 點防禦,如果敵方爆擊,則額外造成對方暫時暈眩`;
        },
        use: async (params: SkillParams, self: Skill) => {
            const playerStore = params.playerStore!;
            const shield = (playerStore.info.equips?.offhand?.adDefend ?? 0);
            playerStore.addStatus(genCustomStatus({
                base: ItemStatus.Block,
                bonus: {
                    adDefend: shield
                },
                duration: 1
            }));
            useFullScreenEffect({
                message: '格擋',
                color: 'gray'
            });
            return true;
        }
    },
    MagicRegain: {
        id: 'MagicRegain',
        name: "法力恢復",
        icon: "🌱",
        type: 'active',
        rarity: 'common',
        maxCd: 0,
        costSp: 0,
        description: (playerStore: any, self: Skill) => {
            const value = (playerStore.info.equips?.offhand?.spLimit ?? 0) / 4;
            return `喚起書中魔力文字,立刻恢復 ${value} 點法力`;
        },
        use: async (params: SkillParams, self: Skill) => {
            const playerStore = params.playerStore!;
            const value = (playerStore.info.equips?.offhand?.spLimit ?? 0) / 4;
            playerStore.info.sp = Math.min(playerStore.info.sp + value, playerStore.finalStats.spLimit);
            useFullScreenEffect({
                message: '法力恢復',
                color: 'blue'
            });
            return true;
        }
    },
    // 被動技能
    PhysiqueBoost: {
        id: 'PhysiqueBoost',
        name: "強健體魄",
        icon: "🏋️",
        type: 'passive',
        rarity: 'common',
        description: (playerStore: any, self: Skill) => {
            return `【被動】最大生命值增加 ${20 * self.level} 點。`;
        },
        passiveBonus: (self: Skill) => ({
            hpLimit: 20 * self.level
        }),
        use: () => true
    },
    ManaFlow: {
        id: 'ManaFlow',
        name: "魔力流動",
        icon: "💧",
        type: 'passive',
        rarity: 'common',
        description: (playerStore: any, self: Skill) => {
            return `【被動】最大法力值增加 ${10 * self.level} 點。`;
        },
        passiveBonus: (self: Skill) => ({
            spLimit: 10 * self.level
        }),
        use: () => false
    },
    AdPower: {
        id: 'AdPower',
        name: "物理精通",
        icon: "💪",
        type: 'passive',
        rarity: 'rare',
        description: (playerStore: any, self: Skill) => {
            return `【被動】物理傷害增加 ${8 * self.level}%。`;
        },
        passiveBonus: (self: Skill) => ({
            adIncrease: 8 * self.level
        }),
        use: () => true
    },
    ApPower: {
        id: 'ApPower',
        name: "魔法精通",
        icon: "⚡",
        type: 'passive',
        rarity: 'rare',
        description: (playerStore: any, self: Skill) => {
            return `【被動】魔法傷害增加 ${8 * self.level}%。`;
        },
        passiveBonus: (self: Skill) => ({
            apIncrease: 8 * self.level
        }),
        use: () => true
    },
    LethalStrikes: {
        id: 'LethalStrikes',
        name: "致命一擊",
        icon: "🎯",
        type: 'passive',
        rarity: 'legendary',
        description: (playerStore: any, self: Skill) => {
            return `【被動】增加 ${10 * self.level}% 爆擊率與 ${25 * self.level}% 爆擊傷害。`;
        },
        passiveBonus: (self: Skill) => ({
            critRate: 10 * self.level,
            critIncrease: 25 * self.level
        }),
        use: () => true
    },
    GodBlessing: {
        id: 'GodBlessing',
        name: "神之庇護",
        icon: "🛡️",
        type: 'passive',
        rarity: 'unique',
        description: (playerStore: any, self: Skill) => {
            return `【被動】物理與魔法傷害增加 ${15 * self.level}%，且所有抗性增加 ${10 * self.level} 點。`;
        },
        passiveBonus: (self: Skill) => ({
            adIncrease: 15 * self.level,
            apIncrease: 15 * self.level,
            adDefend: 10 * self.level
        }),
        use: () => true
    }
};

export class SkillFactory {
    static createSkill(id: string, customData: Partial<Skill> = {}): Skill {
        const template = SKILL_TEMPLATES[id];
        if (!template) {
            return new Skill({
                id,
                name: id,
                icon: "❔",
                type: 'active',
                rarity: 'common',
                description: () => "未知技能",
                use: () => true,
                ...customData
            });
        }
        return new Skill({
            ...template,
            ...customData
        });
    }
}
