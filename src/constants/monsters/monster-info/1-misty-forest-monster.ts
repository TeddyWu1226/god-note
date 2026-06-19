import {MonsterModel} from "@/models/monster-model";
import {WorldDefault} from "@/assets/const";
import {Material} from "@/constants/items/material/material-info";
import {UnitStatus} from "@/constants/status/unit-status";
import {checkProbability, isMultiple} from "@/utils/math";
import {useFloatingMessage} from "@/components/Shared/FloatingMessage/useFloatingMessage";
import {MonsterActionParams, MonsterOnAttackParams} from "@/types";
import {useHeroStatusEffect} from "@/components/Shared/FullScreenEffect/useHeroStatusEffect";
import {calculateIsHit} from "@/constants/fight-func";
import {UsualStatus} from "@/constants/status/usual-status";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";

export class Slime extends MonsterModel {
    constructor() {
        super({
            icon: '/monsters/slime.png',
            code: 'Slime',
            name: '史萊姆',
            description: '森林中最常見的粘稠生物，帶有淡淡的草本氣味',
            ad: 5,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 0,
            dodge: 5,
            hit: 1,
            hp: 20,
            hpLimit: 20,
            level: 1,
            dropGold: 3,
            drop: [
                {item: Material.LowerNormal, chance: 0.5}
            ]
        });
    }

    override onAttackHitHook({playerStore, logStore}: any) {
        playerStore.addStatus(UnitStatus.SlimeSlow);
        logStore.logger.add(`你沾滿了黏液。`);
    }
}

export class ForestSprout extends MonsterModel {
    constructor() {
        super({
            icon: '/monsters/sprout.png',
            code: 'ForestSprout',
            name: '小樹人',
            description: '植物形態的魔物，擅長施展綑綁',
            ad: 3,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 2,
            dodge: -5,
            hit: 10,
            hp: 30,
            hpLimit: 30,
            level: 1,
            dropGold: 5,
            drop: [
                {item: Material.LowerNormal, chance: 0.5}
            ]
        });
    }

    override onAttackHook({playerStore, gameStateStore, logStore}: MonsterOnAttackParams) {
        if (isMultiple(gameStateStore.battleRound, 3)) {
            if (calculateIsHit(this.getEffectiveStats(), playerStore.finalStats)) {
                playerStore.addStatus(UnitStatus.WoodStuck);
                useHeroStatusEffect({
                    message: '老樹盤根',
                    color: '#632b2b',
                    icon: '🪵',
                    duration: 1000
                })
                logStore.logger.add(`對你施展了「老樹盤根」,你被捆綁了。`);
            } else {
                logStore.logger.add(`對你施展了「老樹盤根」但沒命中。`);
            }

        }
        return false
    }
}

export class WoodTick extends MonsterModel {
    constructor() {
        super({
            icon: '🐜',
            name: '木兵蟻',
            code: 'WoodTick',
            description: '體型細小但甲殼堅硬，容易躲開笨重的攻擊',
            ad: 4,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 3,
            dodge: 12,
            hit: 5,
            hp: 20,
            hpLimit: 20,
            level: 2,
            dropGold: 5,
            drop: [
                {item: Material.LowerNormal, chance: 0.5}
            ]
        });
    }
}

export class StingerBee extends MonsterModel {
    constructor() {
        super({
            icon: '🐝',
            name: '森林虎頭蜂',
            code: 'StingerBee',
            description: '擁有致命的毒刺，一旦被刺中傷口劇痛不已',
            ad: 2,
            critIncrease: 100,
            critRate: 0,
            adDefend: 0,
            dodge: 25,
            hit: 20,
            hp: 25,
            hpLimit: 25,
            level: 3,
            dropGold: 12,
            drop: [
                {item: Material.LowerNormal, chance: 0.5}
            ]
        });
    }

    override onAttackHitHook({playerStore, logStore}: any) {
        if (checkProbability(0.7)) {
            playerStore.addStatus(UnitStatus.BeePoison);
            logStore.logger.add(`你中毒了。`);
        }
    }
}

export class GreenRabbit extends MonsterModel {
    constructor() {
        super({
            code: 'GreenRabbit',
            icon: '🐇',
            name: '綠兔',
            description: '額頭長有小角的兔子，衝撞力驚人',
            ad: 7,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 5,
            dodge: 10,
            hit: 4,
            hp: 30,
            hpLimit: 30,
            level: 3,
            dropGold: 12,
            drop: [
                {item: Material.LowerNormal, chance: 0.5}
            ]
        });
    }
}

export class ForestOwl extends MonsterModel {
    constructor() {
        super({
            code: 'ForestOwl',
            icon: '🦉',
            name: '夜行梟',
            description: '在樹蔭間穿梭的獵食者，眼神銳利',
            ad: 10,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 0,
            dodge: 30,
            hit: 10,
            hp: 25,
            hpLimit: 25,
            level: 3,
            dropGold: 12,
            drop: [
                {item: Material.LowerNormal, chance: 0.5}
            ]
        });
    }
}


export class FierceWolf extends MonsterModel {
    constructor() {
        super({
            code: 'FierceWolf',
            icon: '🐺',
            name: '森林之狼',
            class: 'elite',
            description: '森林中的巡邏者',
            ad: 20,
            critIncrease: WorldDefault.critIncrease,
            critRate: 10,
            adDefend: 6,
            dodge: 12,
            hit: 10,
            hp: 85,
            hpLimit: 85,
            level: 5,
            dropGold: 50,
            drop: [
                {item: Material.WolfSkin, chance: 0.3}
            ]
        });
    }

    override onStartHook({playerStore, targetElement}) {
        playerStore.addStatus(UnitStatus.WolfRoarWarning);
        useFloatingMessage(
            '啊嗚~',
            targetElement,
            {
                duration: 1500,
                color: 'red'
            }
        );
    }

    override onRoundBehaviorHook({battleRound}) {
        if (isMultiple(battleRound, 3)) {
            this.addEffect(UsualStatus.Angry)
        }
    }
}

export class SmallSpider extends MonsterModel {
    constructor() {
        super({
            code: 'SmallSpider',
            icon: '🕷️',
            name: '古蜘蛛的眷屬',
            description: '古蜘蛛的眷屬,強大的狩獵能力,攻擊時有機率綑綁敵人',
            class: 'elite',
            ad: 15,
            critIncrease: 200,
            critRate: 5,
            adDefend: 5,
            dodge: 0,
            hit: 70,
            hp: 80,
            hpLimit: 80,
            level: 5,
            dropGold: 250
        });
    }

    override onStartHook({playerStore, targetElement}: any) {
        useFullScreenEffect({
            message: '蛛絲纏繞',
            color: 'white',
            duration: 1500
        });
        playerStore.addStatus(UnitStatus.SmallSpiderStuck);
    }
}

export const MistyForestMonster = {
    Slime: new Slime(),
    ForestSprout: new Slime(),
    WoodTick: new WoodTick(),
    StingerBee: new StingerBee(),
    GreenRabbit: new GreenRabbit(),
    ForestOwl: new ForestOwl(),
    FierceWolf: new FierceWolf(),
    SmallSpider: new SmallSpider(),
};


