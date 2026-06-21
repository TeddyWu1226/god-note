import {MonsterModel} from "@/models/monster-model";
import {Usable} from "@/constants/items/usalbe-item/usable-info";
import {useFloatingMessage} from "@/components/Shared/FloatingMessage/useFloatingMessage";
import {UnitStatus} from "@/constants/status/unit-status";
import {useEpicSubtitle} from "@/components/Shared/EpicSubtitle/useEpicSubtitle";
import {SpecialItem} from "@/constants/items/special-item-info";
import {checkProbability, isMultiple} from "@/utils/math";
import {MonsterActionParams, MonsterType} from "@/types";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {UsualStatus} from "@/constants/status/usual-status";
import {genCustomStatus, getMonsterElement} from "@/utils/create";
import {ItemStatus} from "@/constants/status/item-status";

/**
 * --- 迷霧森林 (Misty Forest) Bosses ---
 */
export class AncientSpider extends MonsterModel {
    constructor() {
        super({
            code: 'AncientRoots',
            icon: '/monsters/spider.png',
            name: '古蜘蛛',
            description: '巨大古老的蜘蛛，擅長用蜘蛛網網住獵物',
            class: 'boss big',
            ad: 20,
            critIncrease: 200,
            critRate: 0,
            adDefend: 10,
            dodge: 25,
            hit: 5,
            hp: 300,
            hpLimit: 300,
            level: 5,
            dropGold: 100,
            chaseIncrease: 200
        });
    }

    override onStartHook({playerStore}: MonsterActionParams) {
        useFloatingMessage(
            '絲絲絲!',
            getMonsterElement(this.id),
            {
                duration: 2000,
                color: 'red'
            }
        );
        useFullScreenEffect({
            message: '蛛絲纏繞',
            color: 'white',
            duration: 1500
        });
        playerStore.addStatus(UnitStatus.SpiderStuck);
    }

    override onRoundBehaviorHook({battleRound}) {
        if (isMultiple(battleRound, 5)) {
            this.addEffect(UsualStatus.Angry)
        }
    }
}

export class Twilight extends MonsterModel {
    constructor() {
        super({
            code: "Twilight",
            icon: '/monsters/mad_forest_god.png',
            name: '墮落的半神',
            class: 'mystery',
            description: '掌控森林日出日落的半神，卻因失去愛人而墮落，決定讓太陽永不墜落。',
            ad: 10,
            critIncrease: 100,
            critRate: 0,
            adDefend: 10,
            dodge: 35,
            hit: 0,
            hp: 500,
            hpLimit: 500,
            level: 10,
            dropGold: 300,
            chaseIncrease: 200,
            drop: []
        });
    }

    speed = 0

    override onStartHook() {
        useEpicSubtitle("「餘暉已候多時，只為繼續沈溺在這曲無盡的舞。而你－－蟲子，太吵了。」", 4000);
    }

    override onDeadHook({playerStore}: any) {
        useEpicSubtitle("「希望...與汝再...舞一曲...」", 3000);
        playerStore.removeItem(SpecialItem.PauseToken.name, -1);
    }

    override onRoundBehaviorHook({battleRound}) {
        if (this.hasStatus('燃燒') || this.isStuck()) {
            useFloatingMessage(
                '阿...',
                getMonsterElement(this.id),
                {
                    duration: 1000,
                    color: 'gray'
                }
            );
            this.speed = 0
            this.removeStatus(UnitStatus.SpeedDance.name)
        }

    }

    override onAttackHitHook(param) {
        this.speed += 4
        let bonus = {
            ad: this.speed,
            adDefend: this.speed
        }
        if (this.speed >= 20) {
            useFloatingMessage(
                '狂歡吧!',
                getMonsterElement(this.id),
                {
                    duration: 1000,
                    color: 'red'
                }
            );
            bonus['critRate'] = 100
        } else {
            // 如果身上有燃燒狀態 會反過來燃燒玩家
            if (this.hasStatus('燃燒')) {
                useFloatingMessage(
                    '一起在火焰中共舞吧!',
                    getMonsterElement(this.id),
                    {
                        duration: 1000,
                        color: 'red'
                    }
                );
                param.playerStore.addStatus(
                    genCustomStatus(
                        {
                            base: ItemStatus.OnBurn,
                            value: 10
                        }
                    )
                )
            }
        }
        this.addEffect(
            genCustomStatus(
                {
                    base: UnitStatus.SpeedDance,
                    bonus: bonus
                }
            )
        )
    }
}

/**
 * --- 赤之山脈 (Red Mountain) Bosses ---
 */
export class FrostFlameWyrm extends MonsterModel {
    constructor() {
        super({
            code: 'FrostFlameWyrm',
            icon: '🐉',
            name: '霜炎幼龍',
            description: '掌握了冰與火雙重元素力量的巨龍幼崽，實力不容小覷',
            class: 'boss big',
            ad: 30,
            critIncrease: 200,
            critRate: 15,
            adDefend: 15,
            dodge: 10,
            hit: 40,
            hp: 600,
            hpLimit: 600,
            level: 10,
            dropGold: 400
        });
    }

    override onAttackHitHook({playerStore, logStore}: any) {
        if (checkProbability(0.5)) {
            playerStore.addStatus(UnitStatus.Burn);
            logStore.logger.add(`霜炎幼龍釋放了火焰，你被燒傷了！`);
        } else {
            playerStore.addStatus(UnitStatus.SlimeSlow);
            logStore.logger.add(`霜炎幼龍噴出寒氣，你被減速了！`);
        }
    }
}

export class BlazingPhoenix extends MonsterModel {
    constructor() {
        super({
            code: 'BlazingPhoenix',
            icon: '🐦',
            name: '烈焰不死鳥',
            description: '守護火山底層的聖獸，能於烈火中獲得永生',
            class: 'mystery',
            ad: 50,
            critIncrease: 200,
            critRate: 20,
            adDefend: 25,
            dodge: 25,
            hit: 60,
            hp: 1000,
            hpLimit: 1000,
            level: 12,
            dropGold: 800,
            drop: []
        });
    }

    override onStartHook() {
        useEpicSubtitle("「在無盡的烈焰中燃盡吧，卑微的闖入者！」", 4000);
    }

    override onRoundBehaviorHook() {
        // 每回合開始浴火重生：回復 40 HP
        const heal = 40;
        this.hp = Math.min(this.hpLimit, this.hp + heal);
    }
}

/**
 * --- 大荒地 (Giants Wasteland) Bosses ---
 */
export class WastelandBehemoth extends MonsterModel {
    constructor() {
        super({
            code: 'WastelandBehemoth',
            icon: '🦣',
            name: '荒地巨獸',
            description: '在大荒原生存了數百年的史前巨獸，皮糙肉厚',
            class: 'boss big',
            ad: 50,
            critIncrease: 200,
            critRate: 10,
            adDefend: 30,
            dodge: 5,
            hit: 60,
            hp: 1200,
            hpLimit: 1200,
            level: 15,
            dropGold: 600
        });
    }
}

export class LordOfEarthquakes extends MonsterModel {
    constructor() {
        super({
            code: 'LordOfEarthquakes',
            icon: '🧌',
            name: '震地領主',
            description: '掌控荒野大地的巨石惡魔，每一次踩踏都能引發地震',
            class: 'mystery',
            ad: 80,
            critIncrease: 200,
            critRate: 15,
            adDefend: 40,
            dodge: 10,
            hit: 70,
            hp: 2000,
            hpLimit: 2000,
            level: 17,
            dropGold: 1000,
            drop: []
        });
    }

    override onStartHook() {
        useEpicSubtitle("「大地在此顫抖，你們的骨頭亦然！」", 4000);
    }

    override onAttackHitHook({playerStore, logStore}: any) {
        if (checkProbability(0.3)) {
            playerStore.addStatus(UnitStatus.WoodStuck); // 震地擊暈，使用 stuck 機制
            logStore.logger.add(`🧌 震地領主引發大地震動，你被震暈了！`);
        }
    }
}

/**
 * --- 分裂之谷 (Split Canyon) Bosses ---
 */
export class StormColossus extends MonsterModel {
    constructor() {
        super({
            code: 'StormColossus',
            icon: '🤖',
            name: '風暴巨像',
            description: '由峽谷雷雨雲催生的古老符文構裝體，掌控風暴力量',
            class: 'boss big',
            ad: 80,
            critIncrease: 200,
            critRate: 15,
            adDefend: 45,
            dodge: 15,
            hit: 80,
            hp: 2500,
            hpLimit: 2500,
            level: 20,
            dropGold: 800
        });
    }

    override onAttackHitHook({playerStore, logStore}: any) {
        if (checkProbability(0.5)) {
            playerStore.addStatus(UnitStatus.Shock);
            logStore.logger.add(`🤖 風暴巨像釋放了閃電，你感電了！`);
        }
    }
}

export class DualElementalist extends MonsterModel {
    constructor() {
        super({
            code: 'DualElementalist',
            icon: '🧙',
            name: '雙星元素使',
            description: '同時驅使分裂之谷光明與黑暗兩儀力量的古老元素使',
            class: 'mystery',
            ad: 120,
            critIncrease: 200,
            critRate: 20,
            adDefend: 35,
            dodge: 30,
            hit: 100,
            hp: 4000,
            hpLimit: 4000,
            level: 22,
            dropGold: 1500,
            drop: []
        });
    }

    override onStartHook() {
        useEpicSubtitle("「一邊是白晝，一邊是永夜，這便是兩儀的真理。」", 4000);
    }
}

/**
 * --- 終焉深淵 (End Abyss) Bosses ---
 */
export class AbyssSpecter extends MonsterModel {
    constructor() {
        super({
            code: 'AbyssSpecter',
            icon: '👻',
            name: '深淵亡靈',
            description: '無數死在深淵中的靈魂揉雜而成的怨念亡靈，非常難纏',
            class: 'boss big',
            ad: 130,
            critIncrease: 200,
            critRate: 20,
            adDefend: 40,
            dodge: 25,
            hit: 100,
            hp: 5000,
            hpLimit: 5000,
            level: 25,
            dropGold: 1200
        });
    }
}

export class AbyssDespair extends MonsterModel {
    constructor() {
        super({
            code: 'AbyssDespair',
            icon: '☠️',
            name: '深淵絕望',
            description: '深淵意志的具象化，任何進入其視線的單位都將被絕望吞噬',
            class: 'mystery',
            ad: 200,
            critIncrease: 250,
            critRate: 25,
            adDefend: 50,
            dodge: 35,
            hit: 120,
            hp: 8000,
            hpLimit: 8000,
            level: 27,
            dropGold: 2000,
            drop: []
        });
    }

    override onStartHook() {
        useEpicSubtitle("「放棄抵抗吧，深淵底端只有絕望。」", 4000);
    }

    override onAttackHitHook({playerStore, logStore}: any) {
        playerStore.addStatus(UnitStatus.AbyssCurse);
        logStore.logger.add(`☠️ 深淵之毒蔓延，你受到了深淵詛咒！`);
    }
}

/**
 * --- 審判之日 (Judgment Stage) Bosses ---
 */
export class ArchangelMichael extends MonsterModel {
    constructor() {
        super({
            code: 'ArchangelMichael',
            icon: '👼',
            name: '大天使長-米迦勒',
            description: '奉神之命看守天界門扉的六翼大天使，審判世間罪孽',
            class: 'boss big',
            ad: 250,
            critIncrease: 200,
            critRate: 20,
            adDefend: 60,
            dodge: 30,
            hit: 150,
            hp: 10000,
            hpLimit: 10000,
            level: 30,
            dropGold: 2000
        });
    }

    override onStartHook() {
        useEpicSubtitle("「凡人，你跨越了不該跨越的邊界，接受審判吧！」", 4000);
    }
}

export class GodOfJudgment extends MonsterModel {
    constructor() {
        super({
            code: 'GodOfJudgment',
            icon: '⚖️',
            name: '審判之神',
            description: '高居神座之上的審判之主，決定萬物的終結與重生',
            class: 'mystery',
            ad: 350,
            critIncrease: 300,
            critRate: 30,
            adDefend: 80,
            dodge: 40,
            hit: 200,
            hp: 20000,
            hpLimit: 20000,
            level: 35,
            dropGold: 5000,
            drop: []
        });
    }

    override onStartHook() {
        useEpicSubtitle("「神愛世人，亦審判世人。汝之罪孽，於今日清償。」", 5000);
    }

    override onAttackHitHook({playerStore, logStore}: any) {
        playerStore.addStatus(UnitStatus.JudgmentSilence);
        logStore.logger.add(`⚖️ 神之光輝掠過，你被神聖沉默了！`);
    }
}

export const Boss = {
    // --- 迷霧森林 (Misty Forest) ---
    AncientRoots: new AncientSpider(),
    Twilight: new Twilight(),

    // --- 赤之山脈 (Red Mountain) ---
    FrostFlameWyrm: new FrostFlameWyrm(),
    BlazingPhoenix: new BlazingPhoenix(),

    // --- 大荒地 (Giants Wasteland) ---
    WastelandBehemoth: new WastelandBehemoth(),
    LordOfEarthquakes: new LordOfEarthquakes(),

    // --- 分裂之谷 (Split Canyon) ---
    StormColossus: new StormColossus(),
    DualElementalist: new DualElementalist(),

    // --- 終焉深淵 (End Abyss) ---
    AbyssSpecter: new AbyssSpecter(),
    AbyssDespair: new AbyssDespair(),

    // --- 審判之日 (Judgment Stage) ---
    ArchangelMichael: new ArchangelMichael(),
    GodOfJudgment: new GodOfJudgment()
};

export const StageBosses: Record<number, { mini: MonsterType; main: MonsterType }> = {
    1: {
        mini: Boss.AncientRoots,
        main: Boss.Twilight
    },
    2: {
        mini: Boss.FrostFlameWyrm,
        main: Boss.BlazingPhoenix
    },
    3: {
        mini: Boss.WastelandBehemoth,
        main: Boss.LordOfEarthquakes
    },
    4: {
        mini: Boss.StormColossus,
        main: Boss.DualElementalist
    },
    5: {
        mini: Boss.AbyssSpecter,
        main: Boss.AbyssDespair
    },
    6: {
        mini: Boss.ArchangelMichael,
        main: Boss.GodOfJudgment
    }
};