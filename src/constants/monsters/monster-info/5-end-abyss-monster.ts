import {MonsterModel} from "@/models/monster-model";
import {WorldDefault} from "@/assets/const";
import {Material} from "@/constants/items/material/material-info";
import {UnitStatus} from "@/constants/status/unit-status";
import {checkProbability} from "@/utils/math";

export class AbyssSlime extends MonsterModel {
    constructor() {
        super({
            icon: '🟣',
            code: 'AbyssSlime',
            name: '深淵史萊姆',
            description: '被深淵力量完全腐蝕的史萊姆，散發著不祥氣息',
            ad: 60,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 20,
            dodge: 15,
            hit: 50,
            hp: 450,
            hpLimit: 450,
            level: 21,
            dropGold: 60,
            drop: [{item: Material.MediumSuperiorNormal, chance: 0.5}]
        });
    }
}

export class VoidGazer extends MonsterModel {
    constructor() {
        super({
            icon: '👁️',
            code: 'VoidGazer',
            name: '虛空凝視者',
            description: '來自虛空的怪異眼球魔物，其凝視能抽乾靈魂力量',
            ad: 70,
            critIncrease: WorldDefault.critIncrease,
            critRate: 15,
            adDefend: 15,
            dodge: 25,
            hit: 60,
            hp: 400,
            hpLimit: 400,
            level: 21,
            dropGold: 65,
            drop: [{item: Material.MediumSuperiorNormal, chance: 0.5}]
        });
    }

    override onAttackHitHook({playerStore, logStore}: any) {
        if (checkProbability(0.5)) {
            const spDrained = 20;
            playerStore.info.sp = Math.max(0, playerStore.info.sp - spDrained);
            logStore.logger.add(`👁️ 虛空凝視者抽乾了你 ${spDrained} 點法力(SP)！`);
        }
    }
}

export class ShadowGargoyle extends MonsterModel {
    constructor() {
        super({
            icon: '👺',
            code: 'ShadowGargoyle',
            name: '暗影石像鬼',
            description: '守護深淵入口的石雕怪物，皮膚堅硬如同地底頑石',
            ad: 75,
            critIncrease: WorldDefault.critIncrease,
            critRate: 10,
            adDefend: 35,
            dodge: 5,
            hit: 50,
            hp: 500,
            hpLimit: 500,
            level: 22,
            dropGold: 70,
            drop: [{item: Material.MediumSuperiorNormal, chance: 0.5}]
        });
    }
}

export class ChaosHorror extends MonsterModel {
    constructor() {
        super({
            icon: '👿',
            code: 'ChaosHorror',
            name: '混沌恐懼',
            description: '無形無相的陰暗恐懼聚合物，會使人陷入手足無措的境地',
            ad: 80,
            critIncrease: WorldDefault.critIncrease,
            critRate: 20,
            adDefend: 20,
            dodge: 20,
            hit: 55,
            hp: 480,
            hpLimit: 480,
            level: 22,
            dropGold: 75,
            drop: [{item: Material.MediumSuperiorNormal, chance: 0.5}]
        });
    }

    override onAttackHitHook({playerStore, logStore}: any) {
        if (checkProbability(0.3)) {
            playerStore.addStatus(UnitStatus.MandragoraScared); // 使用驚嚇 (攻擊減少 50%)
            logStore.logger.add(`👿 你被混沌恐懼籠罩，陷入驚嚇狀態！`);
        }
    }
}

export class AbyssReaper extends MonsterModel {
    constructor() {
        super({
            icon: '💀',
            code: 'AbyssReaper',
            name: '深淵收割者',
            class: 'elite',
            description: '揮舞巨大鐮刀的黑影惡魔，專門收割將死之人的生命',
            ad: 140,
            critIncrease: 250,
            critRate: 35,
            adDefend: 25,
            dodge: 30,
            hit: 80,
            hp: 750,
            hpLimit: 750,
            level: 24,
            dropGold: 220
        });
    }

    override onAttackHitHook({playerStore, logStore}: any) {
        if (checkProbability(0.5)) {
            playerStore.addStatus(UnitStatus.Bleed);
            logStore.logger.add(`💀 深淵之鐮撕裂了你的傷口，你開始血流不止！`);
        }
    }
}

export class VoidBeast extends MonsterModel {
    constructor() {
        super({
            icon: '👾',
            code: 'VoidBeast',
            name: '虛空吞噬獸',
            class: 'elite',
            description: '長滿巨口的虛空巨獸，能吞噬眼前的一切物質與魔力',
            ad: 120,
            critIncrease: WorldDefault.critIncrease,
            critRate: 15,
            adDefend: 30,
            dodge: 10,
            hit: 70,
            hp: 900,
            hpLimit: 900,
            level: 24,
            dropGold: 250
        });
    }

    override onAttackHitHook({playerStore, logStore, damage}: any) {
        if (damage && damage.totalDamage > 0) {
            const steal = Math.round(damage.totalDamage * 0.5);
            this.hp = Math.min(this.hpLimit, this.hp + steal);
            const spDrained = 30;
            playerStore.info.sp = Math.max(0, playerStore.info.sp - spDrained);
            logStore.logger.add(`👾 吞噬獸吞噬了你 ${steal} 生命與 ${spDrained} 法力！`);
        }
    }
}

export class DarkCorruptor extends MonsterModel {
    constructor() {
        super({
            icon: '👤',
            code: 'DarkCorruptor',
            name: '黑暗墮落者',
            description: '迷失在深淵中的前行者，全身被黑色怨念包覆',
            ad: 90,
            critIncrease: WorldDefault.critIncrease,
            critRate: 15,
            adDefend: 22,
            dodge: 20,
            hit: 60,
            hp: 550,
            hpLimit: 550,
            level: 23,
            dropGold: 90,
            drop: [{item: Material.MediumSuperiorNormal, chance: 0.5}]
        });
    }

    override onAttackHitHook({playerStore, logStore}: any) {
        if (checkProbability(0.4)) {
            playerStore.addStatus(UnitStatus.AbyssCurse);
            logStore.logger.add(`你受到了黑暗怨念的侵蝕，被深淵詛咒！`);
        }
    }
}

export class CursedKnight extends MonsterModel {
    constructor() {
        super({
            icon: '🏇',
            code: 'CursedKnight',
            name: '詛咒騎士',
            description: '穿戴著沉重詛咒鋼甲的幽冥騎士，防線難以被攻破',
            ad: 95,
            critIncrease: WorldDefault.critIncrease,
            critRate: 15,
            adDefend: 45,
            dodge: 5,
            hit: 65,
            hp: 600,
            hpLimit: 600,
            level: 23,
            dropGold: 95,
            drop: [{item: Material.MediumSuperiorNormal, chance: 0.5}]
        });
    }
}

export const EndAbyssMonster = {
    AbyssSlime: new AbyssSlime(),
    VoidGazer: new VoidGazer(),
    ShadowGargoyle: new ShadowGargoyle(),
    ChaosHorror: new ChaosHorror(),
    AbyssReaper: new AbyssReaper(),
    VoidBeast: new VoidBeast(),
    DarkCorruptor: new DarkCorruptor(),
    CursedKnight: new CursedKnight()
};
