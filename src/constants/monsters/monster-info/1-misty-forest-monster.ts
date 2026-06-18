import {MonsterModel} from "@/models/monster-model";
import {WorldDefault} from "@/assets/const";
import {Material} from "@/constants/items/material/material-info";
import {UnitStatus} from "@/constants/status/unit-status";
import {checkProbability, isMultiple} from "@/utils/math";
import {useFloatingMessage} from "@/components/Shared/FloatingMessage/useFloatingMessage";
import {MonsterOnAttackParams} from "@/types";
import {useHeroStatusEffect} from "@/components/Shared/FullScreenEffect/useHeroStatusEffect";
import {calculateIsHit} from "@/constants/fight-func";

export class Slime extends MonsterModel {
    constructor() {
        super({
            icon: '/monsters/slime.png',
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
                {item: Material.SlimeGoo, chance: 0.5}
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
                {item: Material.ForestWood, chance: 0.5}
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
                {item: Material.AntShell, chance: 0.5}
            ]
        });
    }
}

export class StingerBee extends MonsterModel {
    constructor() {
        super({
            icon: '🐝',
            name: '森林虎頭蜂',
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
                {item: Material.BeeStinger, chance: 0.1}
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
                {item: Material.RabbitHorn, chance: 0.3}
            ]
        });
    }
}

export class ForestOwl extends MonsterModel {
    constructor() {
        super({
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
                {item: Material.OwlFeather, chance: 0.5}
            ]
        });
    }
}

export class FairyGuard extends MonsterModel {
    constructor() {
        super({
            icon: '🧚',
            name: '妖精守衛',
            description: '守衛著迷霧森林核心區域的靈體，動作輕盈且攻擊精準，手中的靈光長矛不容小覷',
            ad: 12,
            critIncrease: 150,
            critRate: 10,
            adDefend: 4,
            dodge: 15,
            hit: 15,
            hp: 50,
            hpLimit: 50,
            level: 4,
            dropGold: 30
        });
    }
}

export class MushroomMan extends MonsterModel {
    constructor() {
        super({
            icon: '🍄',
            name: '毒粉蕈人',
            description: '行走緩慢的蕈類，厚實的菌蓋提供了極佳防護,而且攻擊他都會飄逸神秘粉末',
            ad: 10,
            critIncrease: 0,
            critRate: 0,
            adDefend: 20,
            dodge: -10,
            hit: 5,
            hp: 10,
            hpLimit: 10,
            level: 5,
            dropGold: 25
        });
    }

    override onAttackedHook({playerStore, logStore}: any) {
        if (checkProbability(0.5)) {
            playerStore.addStatus(UnitStatus.MushroomManPoison);
            logStore.logger.add(`你中毒了。`);
        }
    }
}

export class Mandragora extends MonsterModel {
    constructor() {
        super({
            icon: '🌺',
            name: '尖叫蔓陀羅',
            class: 'elite',
            description: '森林的恐怖傳聞，其尖叫聲能震懾所有入侵者',
            ad: 15,
            critIncrease: 200,
            critRate: 25,
            adDefend: 5,
            dodge: 0,
            hit: 20,
            hp: 65,
            hpLimit: 65,
            level: 6,
            dropGold: 40,
            drop: [
                {item: Material.MandrakeRoot, chance: 0.1}
            ]
        });
    }
}

export class FierceWolf extends MonsterModel {
    constructor() {
        super({
            icon: '🐺',
            name: '森林之狼',
            class: 'elite',
            description: '森林的巡邏者,極具威脅,遇到了建議跑',
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
                {item: Material.WolfSkin, chance: 1}
            ]
        });
    }

    override onStartHook({playerStore, targetElement, gameStateStore}: any) {
        if (gameStateStore.currentStage >= 5) return;
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
}

export class SmallSpider extends MonsterModel {
    constructor() {
        super({
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

    override onAttackHook({playerStore, logStore}: any) {
        if (checkProbability(0.25)) {
            playerStore.addStatus(UnitStatus.SmallSpiderStuck);
            logStore.logger.add(`你被綑綁了。`);
        }
    }
}

export const MistyForestMonster = {
    Slime: new Slime(),
    ForestSprout: new ForestSprout(),
    WoodTick: new WoodTick(),
    StingerBee: new StingerBee(),
    GreenRabbit: new GreenRabbit(),
    ForestOwl: new ForestOwl(),
    FairyGuard: new FairyGuard(),
    MushroomMan: new MushroomMan(),
    Mandragora: new Mandragora(),
    FierceWolf: new FierceWolf(),
    SmallSpider: new SmallSpider(),
};
