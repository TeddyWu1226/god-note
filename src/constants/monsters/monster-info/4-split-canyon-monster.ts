import {MonsterModel} from "@/models/monster-model";
import {WorldDefault} from "@/assets/const";
import {Material} from "@/constants/items/material/material-info";
import {playerAdjustSanity} from "@/constants/status/advanced-status-utils";
import EvnStatus from "@/constants/status/evn-status";


export class DaytimeSlime extends MonsterModel {
    constructor() {
        super({
            icon: '🟡',
            code: 'DaytimeSlime',
            name: '白晝史萊姆',
            description: '溫暖日光凝聚成的史萊姆，擊打它能舒緩緊繃的神經。',
            ad: 32,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 12,
            dodge: 10,
            hit: 35,
            hp: 260,
            hpLimit: 260,
            level: 17,
            dropGold: 35,
            drop: [{item: Material.MediumUpperNormal, chance: 0.5}]
        });
    }

    override onStartHook() {
        this.addEffect(EvnStatus.DaytimeEffect);
    }

    // override onAttackedHook({playerStore, logStore, damage}: any) {
    //     if (damage && damage.isHit && damage.totalDamage > 0 && playerStore) {
    //         playerAdjustSanity(playerStore, 5);
    //     }
    // }
}

export class NighttimeSlime extends MonsterModel {
    constructor() {
        super({
            icon: '🟣',
            code: 'NighttimeSlime',
            name: '黑夜史萊姆',
            description: '幽暗月光凝聚成的史萊姆，擊打它會散發出令人不安的氣息。',
            ad: 34,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 12,
            dodge: 10,
            hit: 35,
            hp: 260,
            hpLimit: 260,
            level: 17,
            dropGold: 35,
            drop: [{item: Material.MediumUpperNormal, chance: 0.5}]
        });
    }

    override onStartHook() {
        this.addEffect(EvnStatus.NighttimeEffect);
    }

    // override onAttackedHook({playerStore,damage}: any) {
    //     if (damage && damage.isHit && damage.totalDamage > 0 && playerStore) {
    //         playerAdjustSanity(playerStore, -5);
    //     }
    // }
}

export class DaytimeIllusion extends MonsterModel {
    constructor() {
        super({
            icon: '🌞',
            code: 'DaytimeIllusion',
            name: '白晝幻象',
            description: '峽谷白晝光影折射產生的幻象，其攻擊帶有淨化心靈的光芒。',
            ad: 38,
            critIncrease: WorldDefault.critIncrease,
            critRate: 15,
            adDefend: 10,
            dodge: 22,
            hit: 42,
            hp: 240,
            hpLimit: 240,
            level: 18,
            dropGold: 45,
            drop: [{item: Material.MediumUpperNormal, chance: 0.5}]
        });
    }

    override onStartHook() {
        this.addEffect(EvnStatus.DaytimeEffect);
    }

    // override onAttackHitHook({playerStore, logStore}: any) {
    //     if (playerStore) {
    //         playerAdjustSanity(playerStore, 5);
    //     }
    // }
}

export class NighttimeIllusion extends MonsterModel {
    constructor() {
        super({
            icon: '🌙',
            code: 'NighttimeIllusion',
            name: '黑夜幻象',
            description: '峽谷黑夜暗影凝聚產生的幻象，其利爪帶有撕裂心智的冰冷。',
            ad: 40,
            critIncrease: WorldDefault.critIncrease,
            critRate: 15,
            adDefend: 10,
            dodge: 22,
            hit: 42,
            hp: 240,
            hpLimit: 240,
            level: 18,
            dropGold: 45,
            drop: [{item: Material.MediumUpperNormal, chance: 0.5}]
        });
    }

    override onStartHook() {
        this.addEffect(EvnStatus.NighttimeEffect);
    }

    // override onAttackHitHook({playerStore, logStore}: any) {
    //     if (playerStore) {
    //         playerAdjustSanity(playerStore, -5);
    //     }
    // }
}

export const SplitCanyonMonster = {
    DaytimeSlime: new DaytimeSlime(),
    NighttimeSlime: new NighttimeSlime(),
    DaytimeIllusion: new DaytimeIllusion(),
    NighttimeIllusion: new NighttimeIllusion()
};
