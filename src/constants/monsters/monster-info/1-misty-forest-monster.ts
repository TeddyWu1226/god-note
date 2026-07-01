import {MonsterModel} from "@/models/monster-model";
import {WorldDefault} from "@/assets/const";
import {Material} from "@/constants/items/material/material-info";
import {UnitStatus} from "@/constants/status/unit-status";
import {checkProbability, isMultiple} from "@/utils/math";
import {useFloatingMessage} from "@/components/Shared/FloatingMessage/useFloatingMessage";
import {MonsterOnAttackParams, MonsterRoundBehaviorParams} from "@/types";
import {useHeroStatusEffect} from "@/components/Shared/FullScreenEffect/useHeroStatusEffect";
import {UsualStatus} from "@/constants/status/usual-status";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {getMonsterElement, notHitPlayer} from "@/utils/create";

export class Slime extends MonsterModel {
    constructor() {
        super({
            icon: '🟢',
            code: 'Slime',
            name: '史萊姆',
            description: '森林中最常見的粘稠生物。體表覆滿綠色黏液，受到打擊時會噴濺黏液降低攻擊者的行動速度。',
            ad: 5,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 0,
            dodge: 10,
            hit: 0,
            hp: 20,
            hpLimit: 20,
            level: 1,
            dropGold: 3,
            drop: [
                {item: Material.BadNormal, chance: 0.5}
            ]
        });
    }

    override onAttackedHook({playerStore, logStore}: any) {
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
            description: '植物形態的魔物。每隔 3 回合有機率施展「老樹盤根」將對手緊緊束縛，使其無法行動。',
            ad: 3,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 2,
            dodge: 0,
            hit: 0,
            hp: 30,
            hpLimit: 30,
            level: 1,
            dropGold: 5,
            drop: [
                {item: Material.BadNormal, chance: 0.5}
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
                notHitPlayer()
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
            description: '體型細小但甲殼堅硬，擁有較佳的防禦力與極高的閃避率，容易躲避笨重的大開大合攻擊。',
            ad: 6,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 3,
            dodge: 15,
            hit: 0,
            hp: 30,
            hpLimit: 30,
            level: 3,
            dropGold: 5,
            drop: [
                {item: Material.BadNormal, chance: 0.5}
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
            description: '身手無比敏捷的森林毒蜂。尾部帶有致命的麻痺毒針，攻擊命中時有高機率使目標麻痺。',
            ad: 7,
            critIncrease: 100,
            critRate: 0,
            adDefend: 0,
            dodge: 35,
            hit: 0,
            hp: 25,
            hpLimit: 25,
            level: 3,
            dropGold: 12,
            drop: [
                {item: Material.BadNormal, chance: 0.5}
            ]
        });
    }


    override onAttackHitHook({playerStore, logStore}: any) {
        if (checkProbability(0.7)) {
            playerStore.addStatus(UnitStatus.Paralysis);
            logStore.logger.add(`你麻痹了。`);
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
            description: '森林中的凶猛掠食者。開戰時會施展警告性「狼嚎」，且每隔 3 回合就會陷入一次可怕的「暴怒」狀態。',
            ad: 20,
            critIncrease: WorldDefault.critIncrease,
            critRate: 10,
            adDefend: 6,
            dodge: 40,
            hit: 10,
            hp: 85,
            hpLimit: 85,
            level: 5,
            dropGold: 33
        });
    }

    override onStartHook({playerStore}) {
        playerStore.addStatus(UnitStatus.WolfRoarWarning);
        useFloatingMessage(
            '啊嗚~',
            getMonsterElement(this.id),
            {
                duration: 1500,
                color: 'red'
            }
        );
    }

    override onRoundBehaviorHook({battleRound}: MonsterRoundBehaviorParams) {
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
            name: '迷霧蜘蛛',
            description: '戰鬥開始時會搶先施展「蛛絲纏繞」限制獵物前 2 回合的行動。',
            class: 'elite',
            ad: 12,
            critIncrease: 150,
            critRate: 25,
            adDefend: 3,
            dodge: 25,
            hit: 5,
            hp: 60,
            hpLimit: 60,
            level: 6,
            dropGold: 48
        });
    }

    override onStartHook({playerStore}: any) {
        useFullScreenEffect({
            message: '蛛絲纏繞',
            color: 'white',
            duration: 1500
        });
        playerStore.addStatus(
            UnitStatus.SpiderStuck,
            {
                duration: 2
            }
        );
    }
}

export class PoisonSlime extends MonsterModel {
    constructor() {
        super({
            icon: '🟣',
            code: 'PoisonSlime',
            name: '毒史萊姆',
            description: '受到毒性變異的史萊姆。開戰時會生成毒液裝甲，在裝甲存在時攻擊它會導致攻擊者中毒。',
            ad: 6,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 0,
            dodge: 5,
            hit: 0,
            hp: 45,
            hpLimit: 45,
            level: 5,
            dropGold: 22,
            drop: [
                {item: Material.BadNormal, chance: 0.5}
            ]
        });
    }

    override onAttackedHook({playerStore, logStore}: any) {
        if (this.hasStatus(UnitStatus.PoisonDefend.name)) {
            playerStore.addStatus(UnitStatus.Poison);
            logStore.logger.add(`你中毒了。`);
        }
    }

    override onStartHook() {
        this.addEffect(UnitStatus.PoisonDefend)
    }
}

export class WoodGuardian extends MonsterModel {
    constructor() {
        super({
            icon: '🌳',
            code: 'WoodGuardian',
            name: '樹人衛士',
            description: '守護森林的古老樹衛。外皮堅硬如鐵（高防禦力），每 3 回合能以較高機率施展「老樹盤根」捆綁目標。',
            ad: 10,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 10,
            dodge: 10,
            hit: 0,
            hp: 60,
            hpLimit: 60,
            level: 6,
            dropGold: 34,
            drop: [
                {item: Material.BadNormal, chance: 0.5}
            ]
        });
    }

    onAttackHook({playerStore, gameStateStore, logStore}: MonsterOnAttackParams) {
        if (isMultiple(gameStateStore.battleRound, 3)) {
            if (checkProbability(0.6)) {
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
                notHitPlayer()
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


