import {MonsterModel} from "@/models/monster-model";
import {WorldDefault} from "@/assets/const";
import {Material} from "@/constants/items/material/material-info";
import {checkProbability} from "@/utils/math";
import {ItemStatus} from "@/constants/status/item-status";
import {playerGetColdStackEffects} from "@/constants/status/advanced-status-utils";
import {MonsterOnAttackedParams, MonsterOnAttackHitParams} from "@/types";


/**
 * 冰系魔物 (Ice Monsters)
 */
export class FrostSlime extends MonsterModel {
    constructor() {
        super({
            icon: '🔵',
            code: 'FrostSlime',
            class: 'icon-blue',
            name: '冰霜史萊姆',
            description: '在赤之山脈冰封縫隙中形成的變異史萊姆，極度嚴寒',
            ad: 10,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 4,
            dodge: 25,
            hit: 10,
            hp: 85,
            hpLimit: 85,
            level: 10,
            dropGold: 15,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }

    override onAttackedHook({playerStore}: MonsterOnAttackedParams) {
        playerGetColdStackEffects(playerStore)
    }
}

export class IceBat extends MonsterModel {
    constructor() {
        super({
            icon: '🦇',
            code: 'IceBat',
            name: '冷光蝙蝠',
            class: 'icon-blue',
            description: '散發著冰冷微光的蝙蝠，其銳利的牙齒可能造成寒冷',
            ad: 10,
            critIncrease: WorldDefault.critIncrease,
            critRate: 50,
            adDefend: 0,
            dodge: 45,
            hit: 15,
            hp: 65,
            hpLimit: 65,
            level: 11,
            dropGold: 15,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }

    override onAttackHitHook({playerStore}: MonsterOnAttackHitParams) {
        if (checkProbability(0.5)) {
            playerGetColdStackEffects(playerStore)
        }
    }
}

export class GlacierLizard extends MonsterModel {
    constructor() {
        super({
            icon: '🦎',
            code: 'GlacierLizard',
            name: '高山蜥蜴',
            description: '生存在寒冷高山的蜥蜴魔物，雖然動作緩慢但對侵略地盤的人毫不手軟',
            ad: 26,
            critIncrease: WorldDefault.critIncrease,
            critRate: 15,
            adDefend: 12,
            dodge: 30,
            hit: 40,
            hp: 170,
            hpLimit: 170,
            level: 13,
            dropGold: 60,
            chaseIncrease: -20
        });
    }
}

export class FrostGolem extends MonsterModel {
    constructor() {
        super({
            icon: '☃️',
            code: 'FrostGolem',
            name: '寒冰魔像',
            class: 'elite icon-blue',
            description: '冰雪與魔力編織而成的重型守衛，他的攻擊都附帶寒冷效果',
            ad: 22,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 18,
            dodge: 30,
            hit: 20,
            hp: 220,
            hpLimit: 220,
            level: 15,
            dropGold: 80,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }

    override onAttackHitHook({playerStore}: MonsterOnAttackHitParams) {
        playerGetColdStackEffects(playerStore, -6)
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
            class: 'icon-red',
            description: '體表翻滾著岩漿的史萊姆，極度熾熱',
            ad: 12,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 2,
            dodge: 30,
            hit: 10,
            hp: 80,
            hpLimit: 80,
            level: 12,
            dropGold: 15,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }

    override onAttackedHook({playerStore}: MonsterOnAttackedParams) {
        if (checkProbability(0.5)) {
            playerStore.addStatus(ItemStatus.OnBurn, {duration: 5, value: 10});
        }
    }
}

export class FireBat extends MonsterModel {
    constructor() {
        super({
            icon: '🦇',
            code: 'FireBat',
            name: '烈色蝙蝠',
            class: 'icon-red',
            description: '火紅色的蝙蝠，動作極其敏捷',
            ad: 14,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 0,
            dodge: 45,
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
            class: 'elite icon-red',
            description: '棲息在火山岩縫中的大鱷魚，口吐烈火，攻擊極為致命',
            ad: 28,
            critIncrease: 200,
            critRate: 25,
            adDefend: 8,
            dodge: 45,
            hit: 20,
            hp: 160,
            hpLimit: 160,
            level: 14,
            dropGold: 60,
        });
    }

    override onAttackHitHook({playerStore, logStore}: any) {
        if (checkProbability(0.4)) {
            playerStore.addStatus(ItemStatus.OnBurn);
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
            class: 'elite icon-purple',
            description: '由高溫熔岩冷卻形成的黑曜石巨人，能將受到的攻擊反彈',
            ad: 24,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 20,
            dodge: 25,
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
