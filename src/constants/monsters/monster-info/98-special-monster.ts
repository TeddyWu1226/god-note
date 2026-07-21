import {MonsterModel} from "@/models/monster-model";
import {WorldDefault} from "@/assets/const";
import {MonsterRoundBehaviorParams} from "@/types";
import {getCycleRound} from "@/utils/math";
import {UsualStatus} from "@/constants/status/usual-status";
import {SpecialItem} from "@/constants/items/special-item-info";


export class EventThief extends MonsterModel {
    constructor() {
        super({
            icon: '🥷',
            code: 'EventThief',
            name: '強盜',
            description: '潛伏在暗處的惡徒，專門襲擊落單的人。出招狠辣，身手敏捷。',
            ad: 22,
            critIncrease: WorldDefault.critIncrease,
            critRate: 20,
            adDefend: 5,
            dodge: 30,
            hit: 15,
            hp: 120,
            hpLimit: 120,
            level: 12,
            dropGold: 80,
        });
    }

    override onRoundBehaviorHook({battleRound}: MonsterRoundBehaviorParams) {
        const cycleRound = getCycleRound(battleRound, 6)
        if (cycleRound == 3) {
            this.addEffect(UsualStatus.Angry)
        }
        if (cycleRound == 1) {
            this.addEffect(UsualStatus.Dodge)
        }
    }
}

export class SupplyLeader extends MonsterModel {
    constructor() {
        super({
            icon: '😡',
            code: 'SupplyLeader',
            name: '發瘋的隊長',
            description: '發瘋的隊長，受到泰坦瘴氣影響而發瘋，有不凡的實力。',
            ad: 50,
            critIncrease: WorldDefault.critIncrease,
            critRate: 20,
            adDefend: 15,
            dodge: 50,
            hit: 50,
            hp: 700,
            hpLimit: 700,
            level: 45,
            dropGold: 110,
            lifeSteal: 50,
            chaseIncrease: 20,
            drop: [
                {item: SpecialItem.MiasmaBox, chance: 1}
            ]
        });
    }

    override onRoundBehaviorHook({battleRound}: MonsterRoundBehaviorParams) {
        const cycleRound = getCycleRound(battleRound, 4)
        if (cycleRound == 2) {
            this.addEffect(UsualStatus.Angry)
        }
        if (cycleRound == 0) {
            this.addEffect(UsualStatus.Dodge)
        }
    }
}

export const SpecialMonster = {
    EventThief: new EventThief(),
    SupplyLeader: new SupplyLeader()
};
