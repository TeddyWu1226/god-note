import {MonsterModel} from "@/models/monster-model";
import {WorldDefault} from "@/assets/const";


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
}

export const SpecialMonster = {
    EventThief: new EventThief()
};
