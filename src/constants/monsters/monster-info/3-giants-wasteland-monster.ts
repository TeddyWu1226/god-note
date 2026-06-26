import {MonsterModel} from "@/models/monster-model";
import {WorldDefault} from "@/assets/const";
import {Material} from "@/constants/items/material/material-info";
import {UnitStatus} from "@/constants/status/unit-status";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {UsualStatus} from "@/constants/status/usual-status";
import {MonsterOnAttackHitParams} from "@/types";
import {useFloatingMessage} from "@/components/Shared/FloatingMessage/useFloatingMessage";
import {getMonsterElement} from "@/utils/create";

export class SandSlime extends MonsterModel {
    constructor() {
        super({
            icon: '🟡',
            code: 'SandSlime',
            name: '荒漠史萊姆',
            description: '融合了荒野黃沙的史萊姆，自帶抵抗效果，受到攻擊後會提升戰力',
            ad: 25,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 15,
            dodge: 25,
            hit: 15,
            hp: 200,
            hpLimit: 200,
            level: 26,
            dropGold: 33,
            drop: [{item: Material.MediumNormal, chance: 0.5}]
        });
    }

    override onStartHook() {
        this.addEffect(UsualStatus.Resistance);
    }

    override onAttackedHook() {
        this.adDefend += 5
        this.ad += 5
    }
}

export class WastelandVulture extends MonsterModel {
    constructor() {
        super({
            icon: '🦅',
            code: 'WastelandVulture',
            name: '荒野禿鷹',
            description: '在荒原上空盤旋的飢餓猛禽，速度極快，受到攻擊後會起飛躲避攻擊',
            ad: 30,
            critIncrease: WorldDefault.critIncrease,
            critRate: 50,
            adDefend: 5,
            dodge: 30,
            hit: 30,
            hp: 150,
            hpLimit: 150,
            level: 27,
            dropGold: 38,
            drop: [{item: Material.MediumNormal, chance: 0.5}]
        });
    }

    override onAttackedHook() {
        this.addEffect(UnitStatus.Flying)
    }
}

export class UnstableExplosiveBee extends MonsterModel {
    private roundsCount = 5;
    private damage = 50;

    constructor() {
        super({
            icon: '🐝',
            code: 'UnstableExplosiveBee',
            class: 'icon-red',
            name: '不穩定的爆炸蜂',
            description: '體內蘊含著極不穩定能量的變異蜂，會在5回合後自爆並造成巨額傷害',
            ad: 25,
            critIncrease: WorldDefault.critIncrease,
            critRate: 5,
            adDefend: 5,
            dodge: 45,
            hit: 20,
            hp: 150,
            hpLimit: 150,
            level: 26,
            dropGold: 15,
            drop: [{item: Material.MediumNormal, chance: 0.5}]
        });
    }

    override onStartHook() {
        this.addEffect(UnitStatus.CountDown, {duration: this.roundsCount})
    }

    override onRoundBehaviorHook({playerStore, gameStateStore}: any) {
        this.roundsCount--;
        if (this.roundsCount <= 0) {
            gameStateStore.triggerScreenShake(500);
            playerStore.takeDamage(this.damage);
            this.level = 0
            this.drop = []
            this.hp = 0;
            useFullScreenEffect({
                message: '自爆！',
                color: '#ff5722',
                duration: 1000
            });
        }
    }
}

export class RockBull extends MonsterModel {
    constructor() {
        super({
            icon: '🐂',
            code: 'RockBull',
            name: '岩牛',
            description: '全身覆蓋著堅硬岩石的牛型魔物，在血量較低時會憤怒。在憤怒時命中目標時，會使敵方繳械',
            ad: 32,
            critIncrease: WorldDefault.critIncrease,
            critRate: 0,
            adDefend: 20,
            dodge: 25,
            hit: 30,
            hp: 280,
            hpLimit: 280,
            level: 28,
            dropGold: 40,
            drop: [{item: Material.MediumNormal, chance: 0.5}]
        });
    }

    override onRoundBehaviorHook() {
        if (this.hp <= (this.hpLimit / 3)) {
            this.addEffect(UsualStatus.Angry)
        }
    }

    override onAttackHitHook({playerStore}: MonsterOnAttackHitParams) {
        if (this.hasStatus(UsualStatus.Angry.name)) {
            playerStore.unequipItem('weapon')
            useFloatingMessage(
                '哞!!',
                getMonsterElement(this.id),
                {
                    duration: 800,
                    color: 'red'
                }
            );
        }
    }
}

export class MutatedBloodworm extends MonsterModel {
    constructor() {
        super({
            icon: '🐛',
            code: 'MutatedBloodworm',
            name: '異變血蟲',
            description: '受到深淵異變影響的血蟲，擁有極高的生命值與破壞力',
            ad: 35,
            critIncrease: WorldDefault.critIncrease,
            critRate: 25,
            adDefend: 20,
            dodge: 25,
            hit: 30,
            hp: 300,
            hpLimit: 300,
            level: 29,
            dropGold: 51,
            drop: [{item: Material.MediumNormal, chance: 0.5}]
        });
    }
}


export class WastelandScavenger extends MonsterModel {
    constructor() {
        super({
            icon: '🧟',
            code: 'WastelandScavenger',
            name: '食屍鬼',
            description: '在戰場遺蹟徘徊的食屍鬼，能吸取敵人的生命力來恢復自己',
            ad: 48,
            critIncrease: WorldDefault.critIncrease,
            critRate: 25,
            adDefend: 0,
            dodge: 35,
            hit: 40,
            hp: 230,
            hpLimit: 230,
            level: 29,
            dropGold: 71,
            lifeSteal: 100,
            drop: [{item: Material.MediumNormal, chance: 0.5}]
        });
    }
}

export const GiantsWastelandMonster = {
    SandSlime: new SandSlime(),
    WastelandVulture: new WastelandVulture(),
    RockBull: new RockBull(),
    WastelandScavenger: new WastelandScavenger(),
    UnstableExplosiveBee: new UnstableExplosiveBee(),
    MutatedBloodworm: new MutatedBloodworm()
};
