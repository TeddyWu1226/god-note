import {MonsterModel} from "@/models/monster-model";
import {WorldDefault} from "@/assets/const";
import {Material} from "@/constants/items/material/material-info";
import {UnitStatus} from "@/constants/status/unit-status";
import {checkProbability, isMultiple} from "@/utils/math";
import {useFloatingMessage} from "@/components/Shared/FloatingMessage/useFloatingMessage";
import {MonsterOnAttackParams} from "@/types";
import {useHeroStatusEffect} from "@/components/Shared/FullScreenEffect/useHeroStatusEffect";
import {UsualStatus} from "@/constants/status/usual-status";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {genCustomStatus} from "@/utils/create";

export class Slime extends MonsterModel {
    constructor() {
        super({
            icon: '🟢',
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
            icon: '🌱',
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

    onAttackHook({playerStore, gameStateStore, logStore}: MonsterOnAttackParams) {
        if (isMultiple(gameStateStore.battleRound, 3)) {
            if (checkProbability(0.3)) {
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
                useFloatingMessage(
                    'MISS',
                    null,
                    {
                        duration: 800, // 動畫時間保持不變
                        color: 'white',
                    }
                );
            }
            return false
        }
    }
}

export class WoodTick extends MonsterModel {
    constructor() {
        super({
            icon: '🐜',
            name: '木兵蟻',
            code: 'WoodTick',
            description: '體型細小但甲殼堅硬，容易躲開笨重的攻擊',
            ad: 6,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 3,
            dodge: 12,
            hit: 5,
            hp: 30,
            hpLimit: 30,
            level: 3,
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
            name: '森林毒蜂',
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
            dodge: 25,
            hit: 15,
            hp: 85,
            hpLimit: 85,
            level: 5,
            dropGold: 33
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

export class PoisonSlime extends MonsterModel {
    constructor() {
        super({
            icon: '🟣',
            code: 'PoisonSlime',
            name: '毒史萊姆',
            description: '受到毒區影響變異的史萊姆,有強烈毒性',
            ad: 6,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 0,
            dodge: 10,
            hit: 10,
            hp: 45,
            hpLimit: 45,
            level: 5,
            dropGold: 22,
            drop: [
                {item: Material.LowerNormal, chance: 0.5}
            ]
        });
    }

    override onAttackedHook({playerStore, logStore}: any) {
        if (checkProbability(0.7)) {
            playerStore.addStatus(UnitStatus.ScorpionPoison);
            logStore.logger.add(`你中毒了。`);
        }
    }

    override onStartHook({playerStore, targetElement}) {
        this.addEffect(genCustomStatus({base: UsualStatus.AdDefendInCrease, bonus: {adDefend: 10}}))
    }
}

export class WoodGuardian extends MonsterModel {
    constructor() {
        super({
            icon: '🌳',
            code: 'WoodGuardian',
            name: '樹人衛士',
            description: '守護森林的古老樹衛，外皮如鋼鐵般堅硬。',
            ad: 10,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 10,
            dodge: -10,
            hit: 5,
            hp: 60,
            hpLimit: 60,
            level: 5,
            dropGold: 26,
            drop: [
                {item: Material.LowerNormal, chance: 0.5}
            ]
        });
    }

    onAttackHook({playerStore, gameStateStore, logStore}: MonsterOnAttackParams) {
        if (isMultiple(gameStateStore.battleRound, 3)) {
            if (checkProbability(0.5)) {
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
                useFloatingMessage(
                    'MISS',
                    null,
                    {
                        duration: 800, // 動畫時間保持不變
                        color: 'white',
                    }
                );
            }
            return false
        }
    }
}

export const MistyForestMonster = {
    Slime: new Slime(),
    ForestSprout: new ForestSprout(),
    WoodTick: new WoodTick(),
    StingerBee: new StingerBee(),
    FierceWolf: new FierceWolf(),
    SmallSpider: new SmallSpider(),
    PoisonSlime: new PoisonSlime(),
    WoodGuardian: new WoodGuardian()
};


