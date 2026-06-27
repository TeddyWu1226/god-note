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
            description: '受極寒變異的史萊姆。體表散發著徹骨嚴寒，任何對其造成的攻擊都會使攻擊者累積寒冷層數。',
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
            description: '散發著幽藍微光的洞窟蝙蝠。身形極其敏捷難以被擊中，其帶有寒霜的撕咬有 50% 機率使對手受寒。',
            ad: 10,
            critIncrease: WorldDefault.critIncrease,
            critRate: 50,
            adDefend: 2,
            dodge: 50,
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
            description: '高山上的耐寒蜥蜴。冰甲厚實（防禦力高），行動雖緩慢，但其沉重的啃咬精準度極高，防不勝防。',
            ad: 23,
            critIncrease: WorldDefault.critIncrease,
            critRate: 15,
            adDefend: 12,
            dodge: 15,
            hit: 25,
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
            description: '由冰雪編織而成的重裝魔能守衛。防禦力堅實，且每一次拳擊命中都會直接為目標施加強烈寒冷效果。',
            ad: 20,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 15,
            dodge: 0,
            hit: 20,
            hp: 220,
            hpLimit: 220,
            level: 15,
            dropGold: 80,
            chaseIncrease: -15,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }

    override onAttackHitHook({playerStore}: MonsterOnAttackHitParams) {
        playerGetColdStackEffects(playerStore, -4)
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
            description: '體表覆蓋翻滾岩漿的史萊姆。受創時濺出的岩漿使攻擊者陷入持續燃燒的灼傷狀態。',
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
        playerStore.addStatus(ItemStatus.OnBurn, {duration: 5, value: 10});
    }
}

export class FireBat extends MonsterModel {
    constructor() {
        super({
            icon: '🦇',
            code: 'FireBat',
            name: '烈色蝙蝠',
            class: 'icon-red',
            description: '通體赤紅的凶猛蝙蝠。在火山口的熱風中飛速掠行，具備極高的閃避率，且特別擅長發起暴擊。',
            ad: 14,
            critIncrease: WorldDefault.critIncrease,
            critRate: 50,
            adDefend: 0,
            dodge: 60,
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
            description: '火山岩縫中的巨型紅鱷。尾擊與烈火噬咬極為狂暴，且攻擊命中有 60% 機率使對手燃燒。',
            ad: 25,
            critIncrease: 130,
            critRate: 25,
            adDefend: 12,
            dodge: 20,
            hit: 20,
            hp: 100,
            hpLimit: 100,
            level: 14,
            dropGold: 60,
        });
    }

    override onAttackHitHook({playerStore}: MonsterOnAttackHitParams) {
        if (checkProbability(0.6)) {
            playerStore.addStatus(ItemStatus.OnBurn, {duration: 5, value: 10});
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
            description: '高溫熔岩急冷形成的黑曜石守衛。擁有無可摧毀的堅硬外殼，能將所承受物理傷害的 20% 反彈回攻擊者。',
            ad: 24,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 20,
            dodge: 25,
            hit: 20,
            hp: 200,
            hpLimit: 200,
            level: 16,
            dropGold: 80,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }

    override onAttackedHook({playerStore, logStore, damage}: MonsterOnAttackedParams) {
        if (damage && damage.totalDamage > 0) {
            const reflect = Math.round(damage.totalDamage * 0.2);
            if (reflect > 0) {
                playerStore.takeDamage(reflect);
                logStore.logger.add(`黑曜石魔像的硬殼反彈了 ${reflect} 點真實傷害給玩家！`);
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
