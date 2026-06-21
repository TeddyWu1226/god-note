import {MonsterModel} from "@/models/monster-model";
import {WorldDefault} from "@/assets/const";
import {Material} from "@/constants/items/material/material-info";
import {UnitStatus} from "@/constants/status/unit-status";
import {checkProbability, isMultiple} from "@/utils/math";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {applySkillDamage} from "@/constants/fight-func";



/**
 * 冰系魔物 (Ice Monsters)
 */
export class FrostSlime extends MonsterModel {
    constructor() {
        super({
            icon: '🔵',
            code: 'FrostSlime',
            name: '冰霜史萊姆',
            description: '在赤之山脈冰封縫隙中形成的變異史萊姆，極度嚴寒',
            ad: 10,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 4,
            dodge: 5,
            hit: 10,
            hp: 85,
            hpLimit: 85,
            level: 10,
            dropGold: 15,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }

    override onAttackHitHook({playerStore, logStore}: any) {
        playerStore.addStatus(UnitStatus.SlimeSlow);
        logStore.logger.add(`寒氣降低了你的閃避。`);
    }
}

export class IceBat extends MonsterModel {
    constructor() {
        super({
            icon: '🦇',
            code: 'IceBat',
            name: '寒冰蝙蝠',
            description: '散發著冰冷微光的蝙蝠，會使被咬到的目標動作變遲緩',
            ad: 13,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 2,
            dodge: 25,
            hit: 15,
            hp: 65,
            hpLimit: 65,
            level: 11,
            dropGold: 15,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }

    override onAttackHitHook({playerStore, logStore}: any) {
        if (checkProbability(0.5)) {
            playerStore.addStatus(UnitStatus.Blind);
            logStore.logger.add(`你受到了寒氣侵襲，視線變得模糊(命中降低)。`);
        }
    }
}

export class GlacierLizard extends MonsterModel {
    constructor() {
        super({
            icon: '🦎',
            code: 'GlacierLizard',
            name: '冰川蜥蜴',
            class: 'elite',
            description: '身上覆蓋著堅冰護甲的古老蜥蜴，攻擊沉重而精準',
            ad: 26,
            critIncrease: WorldDefault.critIncrease,
            critRate: 15,
            adDefend: 12,
            dodge: 10,
            hit: 40,
            hp: 170,
            hpLimit: 170,
            level: 13,
            dropGold: 60,
        });
    }
}

export class FrostGolem extends MonsterModel {
    constructor() {
        super({
            icon: '☃️',
            code: 'FrostGolem',
            name: '寒冰魔像',
            class: 'elite',
            description: '冰雪與魔力編織而成的重型守衛，能將敵人徹底凍結',
            ad: 22,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 18,
            dodge: -5,
            hit: 20,
            hp: 220,
            hpLimit: 220,
            level: 15,
            dropGold: 80,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }

    override onAttackHitHook({playerStore, logStore}: any) {
        if (checkProbability(0.3)) {
            playerStore.addStatus(UnitStatus.Frozen);
            useFullScreenEffect({
                message: '深度冰凍',
                color: '#64b5f6',
                duration: 1200
            });
            logStore.logger.add(`你被寒冰魔像徹底凍結了！`);
        }
    }
}

/**
 * 火系魔物 (Fire Monsters)
 */
export class LavaSlime extends MonsterModel {
    constructor() {
        super({
            icon: '🔴',
            code: 'LavaSlime',
            name: '熔岩史萊姆',
            description: '體表翻滾著岩漿的史萊姆，極度熾熱',
            ad: 12,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 2,
            dodge: 5,
            hit: 10,
            hp: 80,
            hpLimit: 80,
            level: 12,
            dropGold: 15,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }

    override onAttackHitHook({playerStore, logStore}: any) {
        if (checkProbability(0.5)) {
            playerStore.addStatus(UnitStatus.Burn);
            logStore.logger.add(`你被熔岩灼傷，進入燒傷狀態。`);
        }
    }
}

export class FireBat extends MonsterModel {
    constructor() {
        super({
            icon: '🦇',
            code: 'FireBat',
            name: '烈火蝙蝠',
            description: '雙翼燃燒著火焰的蝙蝠，動作極其敏捷',
            ad: 14,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 0,
            dodge: 30,
            hit: 15,
            hp: 70,
            hpLimit: 70,
            level: 13,
            dropGold: 15,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }
}

export class CrimsonSalamander extends MonsterModel {
    constructor() {
        super({
            icon: '🐊',
            code: 'CrimsonSalamander',
            name: '緋紅鱷',
            class: 'elite',
            description: '棲息在火山岩縫中的大鱷魚，口吐烈火，攻擊極為致命',
            ad: 28,
            critIncrease: 200,
            critRate: 25,
            adDefend: 8,
            dodge: 15,
            hit: 20,
            hp: 160,
            hpLimit: 160,
            level: 14,
            dropGold: 60,
        });
    }

    override onAttackHitHook({playerStore, logStore}: any) {
        if (checkProbability(0.4)) {
            playerStore.addStatus(UnitStatus.Burn);
            logStore.logger.add(`你受到了火焰侵蝕而燒傷。`);
        }
    }
}

export class ObsidianGolem extends MonsterModel {
    constructor() {
        super({
            icon: '🪨',
            code: 'ObsidianGolem',
            name: '黑曜石魔像',
            class: 'elite',
            description: '由高溫熔岩冷卻形成的黑曜石巨人，能將受到的攻擊反彈',
            ad: 24,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 20,
            dodge: -10,
            hit: 20,
            hp: 200,
            hpLimit: 200,
            level: 18,
            dropGold: 80,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }

    override onAttackedHook({playerStore, logStore, damage}: any) {
        if (damage && damage.totalDamage > 0 && checkProbability(0.5)) {
            const reflect = Math.round(damage.totalDamage * 0.2);
            if (reflect > 0) {
                const result = playerStore.takeDamage(reflect);
                if (result.shieldAbsorbed > 0) {
                    logStore.logger.add(`🛡️ 護盾吸收了 ${result.shieldAbsorbed} 點傷害！`);
                }
                logStore.logger.add(`黑曜石魔像的硬殼反彈了 ${reflect} 點傷害給玩家！`);
            }
        }
    }
}

export const RedMountainMonster = {
    LavaSlime: new LavaSlime(),
    FireBat: new FireBat(),
    CrimsonSalamander: new CrimsonSalamander(),
    ObsidianGolem: new ObsidianGolem(),

    FrostSlime: new FrostSlime(),
    IceBat: new IceBat(),
    GlacierLizard: new GlacierLizard(),
    FrostGolem: new FrostGolem()
};
