import {MonsterModel} from "@/models/monster-model";
import {useFloatingMessage} from "@/components/Shared/FloatingMessage/useFloatingMessage";
import {UnitStatus} from "@/constants/status/unit-status";
import {useEpicSubtitle} from "@/components/Shared/EpicSubtitle/useEpicSubtitle";
import {SpecialItem} from "@/constants/items/special-item-info";
import {checkProbability, isMultiple} from "@/utils/math";
import {
    GameStateStoreType,
    MonsterActionParams,
    MonsterOnAttackHitParams,
    MonsterOnAttackParams,
    MonsterRoundBehaviorParams,
    MonsterType
} from "@/types";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {UsualStatus} from "@/constants/status/usual-status";
import {getMonsterElement} from "@/utils/create";
import {ItemStatus} from "@/constants/status/item-status";
import {playerGetColdStackEffects, playerAdjustSanity} from "@/constants/status/advanced-status-utils";
import {applySkillDamage} from "@/constants/fight-func";
import EvnStatus from "@/constants/status/evn-status";
import {useHeroStatusEffect} from "@/components/Shared/FullScreenEffect/useHeroStatusEffect";

/**
 * --- 迷霧森林 (Misty Forest) Bosses ---
 */
export class AncientSpider extends MonsterModel {
    constructor() {
        super({
            code: 'AncientRoots',
            icon: '/monsters/spider.png',
            name: '古蜘蛛',
            description: '巨大古老的蜘蛛，會對入侵者發射蜘蛛網。',
            class: ['boss', 'big'],
            ad: 15,
            critIncrease: 200,
            critRate: 0,
            adDefend: 5,
            dodge: 10,
            hit: 0,
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

    override onRoundBehaviorHook({battleRound}: MonsterRoundBehaviorParams) {
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
            name: '癲狂的代理者',
            class: ['boss', 'big'],
            description: '維持森林協調的神祗代理者，但現在陷入癲狂而墮落，在永不退去的迷霧之中無盡的舞蹈。其舞蹈會加強他的破壞力，若要阻止，必須先停下他的舞蹈。',
            ad: 10,
            critIncrease: 100,
            critRate: 0,
            adDefend: 10,
            dodge: 35,
            hit: 0,
            hp: 650,
            hpLimit: 650,
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

    override onRoundBehaviorHook() {
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
            adDefend: this.speed / 4
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
        }
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
                ItemStatus.OnBurn,
                {
                    value: 10
                }
            )
        }
        this.addEffect(UnitStatus.SpeedDance, {bonus: bonus})
    }
}

/**
 * --- 赤之山脈 (Red Mountain) Bosses ---
 */
export class FrostGiant extends MonsterModel {
    constructor() {
        super({
            code: 'FrostGiant',
            icon: '/monsters/frost_giant.png',
            name: '冰凍的巨人',
            description: '被永久冰封在山脈深處的遠古巨人，揮舞著巨大的寒冰錘。',
            class: ['boss', 'big', 'icon-blue'],
            ad: 0,
            critIncrease: 100,
            critRate: 0,
            adDefend: 10,
            dodge: 0,
            hit: 15,
            hp: 1250,
            hpLimit: 2500,
            level: 15,
            dropGold: 400,
            chaseIncrease: 200
        });
    }

    override onStartHook() {
        this.addEffect(UnitStatus.IceWeak)
        useFloatingMessage(
            '復...復仇...',
            getMonsterElement(this.id),
            {
                duration: 2000,
                color: 'gray'
            }
        );
    }

    isFinal = false

    override onRoundBehaviorHook({playerStore, gameStateStore, battleRound}: MonsterRoundBehaviorParams) {
        const limit = 650
        if (!this.isFinal && this.hp <= limit) {
            this.isFinal = true
            this.adDefend = 10
            this.critRate = 25
            this.icon = '/monsters/frost_giant_last_stand.png'
            this.ad = battleRound * 5
            this.removeStatus(UnitStatus.IceWeak.name)
            gameStateStore.triggerScreenShake(1000);
            useFloatingMessage(
                '巨人是不會屈服的!',
                getMonsterElement(this.id),
                {
                    duration: 1000,
                    color: 'red'
                }
            );
        }
        if (this.hp > limit) {
            playerGetColdStackEffects(playerStore, -5)
            useFullScreenEffect({
                color: '#0fb5f1',
            });
            useFloatingMessage(
                '....',
                getMonsterElement(this.id),
                {
                    duration: 1000,
                    color: 'gray'
                }
            );
            this.shake(1000)
        }
    }

    override onAttackHook() {
        if (this.ad > 50) {
            useFloatingMessage(
                '死吧!',
                getMonsterElement(this.id),
                {
                    duration: 1000,
                    color: 'red'
                }
            );
        }
        return true
    }
}

export class FireWyrmling extends MonsterModel {
    constructor() {
        super({
            code: 'FireWyrmling',
            icon: '/monsters/fire_wyrmling.png',
            name: '炎幼龍',
            description: '在火山核心孵化的炎龍幼崽，吞吐著毀滅性的烈焰。',
            class: ['mystery', 'big', 'icon-red'],
            ad: 25,
            critIncrease: 200,
            critRate: 50,
            adDefend: 20,
            dodge: 35,
            hit: 60,
            hp: 1000,
            hpLimit: 1000,
            level: 12,
            dropGold: 800,
            chaseIncrease: 200,
            drop: []
        });
    }

    override onStartHook({playerStore, gameStateStore}: MonsterActionParams) {
        useFloatingMessage(
            '吼!!!!',
            getMonsterElement(this.id),
            {
                duration: 2000,
                color: 'red'
            }
        );
        gameStateStore.triggerScreenShake(2000);
        playerStore.addStatus(UnitStatus.Scared, {duration: 5});
    }

    override onRoundBehaviorHook({playerStore, battleRound, gameStateStore}: MonsterRoundBehaviorParams) {
        if (isMultiple(battleRound, 10)) {
            useFloatingMessage(
                '吼!!!!',
                getMonsterElement(this.id),
                {
                    duration: 1000,
                    color: 'red'
                }
            );
            gameStateStore.triggerScreenShake(1000);
            playerStore.addStatus(UnitStatus.Scared, {duration: 5});
        }
    }

    override onAttackHitHook({playerStore, logStore}: MonsterOnAttackHitParams) {
        playerStore.addStatus(ItemStatus.OnBurn, {duration: 5, value: 12});
        logStore.logger.add(`${this.name}噴吐出熊熊烈焰，你被嚴重燒傷了！`);
    }
}

/**
 * --- 大荒地 (Giants Wasteland) Bosses ---
 */
export class BurrowingBehemoth extends MonsterModel {
    triggered75 = false;
    triggered50 = false;
    triggered25 = false;

    burrowCountdown = 0;
    inHole = false;

    constructor() {
        super({
            code: 'BurrowingBehemoth',
            icon: '/monsters/burrowing_behemoth.png',
            name: '掘地巨獸',
            description: '是一隻兇猛的土色巨獸，擁有巨大的雙手與巨嘴，擅長鑽地伏擊。',
            class: ['boss', 'giant', 'icon-brown'],
            ad: 50,
            critIncrease: 200,
            critRate: 10,
            adDefend: 30,
            dodge: 30,
            hit: 60,
            hp: 2000,
            hpLimit: 2000,
            level: 30,
            dropGold: 600
        });
    }
    override onStartHook({gameStateStore, logStore}: MonsterActionParams) {
        useFloatingMessage(
            '咕吼!!',
            getMonsterElement(this.id),
            {
                duration: 2000,
                color: 'red'
            }
        );
        this.triggerBurrow(gameStateStore);
    }


    override onAttackHook({playerStore, gameStateStore, logStore}: MonsterOnAttackParams) {
        // 鑽地期間不進行普通攻擊
        if (this.inHole && this.burrowCountdown === 0) {
            if (this.hasStatus(UsualStatus.DigHoleResistance.name)) {
                const damage = this.ad * 4;
                applySkillDamage({
                    speller: this,
                    target: playerStore,
                    baseValue: damage,
                    type: "true",
                    sureHit: true,
                    skillName: '大地裂變'
                })
                gameStateStore.triggerScreenShake(1000);
                useFullScreenEffect({
                    message: '大地裂變！',
                    color: 'red',
                    duration: 1500
                });
                logStore.logger.add(`${this.name}從地面翻滔而起，造成玩家 ${damage} 點真實傷害!`)
                // 清理狀態
                this.removeStatus(UsualStatus.DigHoleResistance.name);
                this.emerge();
                return false
            } else {
                useFloatingMessage(
                    '重新現身...',
                    getMonsterElement(this.id),
                    {
                        duration: 2000,
                        color: 'red'
                    }
                );
                this.emerge();
                return false
            }
        }
        if (this.burrowCountdown > 0) {
            useFloatingMessage(
                '蓄力中...',
                getMonsterElement(this.id),
                {
                    duration: 1000,
                    color: 'yellow'
                }
            );
            return false
        }
        return true
    }

    override onRoundBehaviorHook({playerStore, gameStateStore, logStore}: MonsterRoundBehaviorParams) {
        const hpRatio = this.hp / this.hpLimit;

        if (hpRatio <= 0.75 && !this.triggered75) {
            this.triggerBurrow(gameStateStore);
        } else if (hpRatio <= 0.5 && !this.triggered50) {
            this.triggered75 = true;
            this.triggerBurrow(gameStateStore);
        } else if (hpRatio <= 0.25 && !this.triggered25) {
            this.triggered75 = true;
            this.triggered50 = true;
            this.triggerBurrow(gameStateStore);
        }

        if (this.inHole && !this.hasStatus(UsualStatus.DigHoleResistance.name)) {
            useFloatingMessage(
                '重新現身...',
                getMonsterElement(this.id),
                {
                    duration: 2000,
                    color: 'red'
                }
            );
            this.emerge();
        }

        if (this.burrowCountdown > 0) {
            this.burrowCountdown--;
        }
    }

    private triggerBurrow(gameStateStore) {
        const hpRatio = this.hp / this.hpLimit;
        if (hpRatio <= 0.25) {
            this.triggered25 = true;
            this.triggered50 = true;
            this.triggered75 = true;
        } else if (hpRatio <= 0.5) {
            this.triggered50 = true;
            this.triggered75 = true;
        } else if (hpRatio <= 0.75) {
            this.triggered75 = true;
        }
        gameStateStore.triggerScreenShake(2000);
        this.icon = '🕳️';
        this.addEffect(UsualStatus.DigHoleResistance);
        useFloatingMessage(
            '鑽入地洞！',
            getMonsterElement(this.id),
            {
                duration: 2000,
                color: 'orange'
            }
        );
        this.shake(1000)
        this.burrowCountdown = 5;
        this.inHole = true;
    }

    private emerge() {
        this.burrowCountdown = 0;
        this.icon = '/monsters/burrowing_behemoth.png';
        this.inHole = false;
        // 確保移除相關抵抗盾
        this.removeStatus(UsualStatus.DigHoleResistance.name);
    }
}

export class RockGolemClone extends MonsterModel {
    isCracked = false;

    constructor(bossHp: number) {
        super({
            code: 'RockGolemClone',
            icon: '/monsters/rock_golem_normal.png',
            name: '巨岩魔像',
            description: '沙塵與岩石幻化出的龐然大物，與本體具有相同的威壓與形體，但胸口核心之處似乎少了一絲靈動。',
            class: ['boss', 'big'],
            ad: 55,
            critIncrease: 200,
            critRate: 15,
            adDefend: 50,
            dodge: 10,
            hit: 70,
            hp: bossHp,
            hpLimit: 2000,
            level: 35,
            noExp: true,
            dropGold: 0,
            drop: []
        });
    }

    override onAttackedHook({logStore, damage}: any) {
        if (!this.isCracked) {
            if (damage && damage.isHit && damage.totalDamage > 0) {
                if (checkProbability(0.2)) {
                    this.isCracked = true;
                    this.icon = '/monsters/rock_golem_cracked_nocore.png';
                    this.adDefend = 25
                    this.defendIncrease = -500
                    if (logStore) {
                        logStore.logger.add(`💥 受到攻擊！${this.name} 的胸前岩石碎裂了！`);
                    }
                }
            }
        }
    }
}

export class RockGolemGroup extends MonsterModel {
    triggered75 = false;
    triggered50 = false;
    triggered25 = false;
    isCracked = false;

    constructor() {
        super({
            code: 'RockGolemGroup',
            icon: '/monsters/rock_golem_normal.png',
            name: '巨岩魔像',
            description: '由無數荒野巨石聚合而成的魔力核心載體。它們在岩石中重組與分裂，只有擊破那顆恆久的魔力源泉，才能令魔像群徹底靜止。',
            class: ['boss', 'big'],
            ad: 55,
            critIncrease: 150,
            critRate: 15,
            adDefend: 50,
            dodge: 10,
            hit: 70,
            hp: 2000,
            hpLimit: 2000,
            level: 35,
            dropGold: 1000,
            drop: []
        });
    }

    createGolemGroup(gameStateStore: GameStateStoreType, logStore: any) {
        // 清除現有分身
        gameStateStore.currentEnemy = gameStateStore.currentEnemy.filter((m: any) => m.code !== 'RockGolemClone');

        // 召喚分身
        const clone1 = new RockGolemClone(this.hp);
        const clone2 = new RockGolemClone(this.hp);

        const list = [...gameStateStore.currentEnemy, clone1, clone2];

        // 隨機打亂順序
        for (let i = list.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
        }

        gameStateStore.currentEnemy = list;
        logStore.logger.add(`巨岩魔像群發動了【石像軍團】！`);
        gameStateStore.triggerScreenShake(800);
    }

    override onStartHook({gameStateStore, logStore}: MonsterActionParams) {
        useEpicSubtitle("大地震盪...無數巨石化作魔物顯現...", 3000);
        this.createGolemGroup(gameStateStore, logStore)
    }

    override onAttackedHook({gameStateStore, logStore, damage}: any) {
        if (!this.isCracked) {
            if (damage && damage.isHit && damage.totalDamage > 0) {
                if (checkProbability(0.2)) {
                    this.isCracked = true;
                    this.icon = '/monsters/rock_golem_cracked_core.png';
                    this.adDefend = 25
                    if (logStore) {
                        logStore.logger.add(`💥 受到攻擊！${this.name} 的胸前岩石碎裂了！`);
                    }
                }
            }
        } else {
            // 已暴露核心，又再次受到傷害
            if (damage && damage.isHit && damage.totalDamage > 0 && gameStateStore) {
                const hasClones = gameStateStore.currentEnemy.some((m: any) => m.code === 'RockGolemClone');
                if (hasClones) {
                    gameStateStore.currentEnemy = gameStateStore.currentEnemy.filter((m: any) => m.code !== 'RockGolemClone');
                    if (logStore) {
                        logStore.logger.add(`💀 巨岩魔像群本尊的核心再次受到重創！所有分身化為碎石消散！`);
                    }
                }
            }
        }
    }

    override onRoundBehaviorHook({gameStateStore, logStore}: MonsterRoundBehaviorParams) {
        if (this.hp <= 0) return;
        const hpRatio = this.hp / this.hpLimit;

        let shouldSummon = false;
        if (hpRatio <= 0.25 && !this.triggered25) {
            this.triggered75 = true;
            this.triggered50 = true;
            this.triggered25 = true;
            shouldSummon = true;
        } else if (hpRatio <= 0.50 && !this.triggered50) {
            this.triggered75 = true;
            this.triggered50 = true;
            shouldSummon = true;
        } else if (hpRatio <= 0.75 && !this.triggered75) {
            this.triggered75 = true;
            shouldSummon = true;
        }

        if (shouldSummon && gameStateStore) {
            // 1. 本尊回滿血，重置碎裂狀態、圖示與防禦力
            this.hp = this.hpLimit;
            this.isCracked = false;
            this.icon = '/monsters/rock_golem_normal.png';
            this.adDefend = 50;
            this.status = []

            // 召喚石頭
            useFullScreenEffect({
                message: '石像軍團',
                color: '#d7ccc8',
                duration: 1200
            });
            this.createGolemGroup(gameStateStore, logStore)

        }
    }

    override onDeadHook({gameStateStore, logStore}: any) {
        if (logStore) {
            logStore.logger.add(`💀 巨岩魔像群本尊的核心破碎崩潰！所有分身也化為碎石消散！`);
        }
        // 清除現有分身
        gameStateStore.currentEnemy = gameStateStore.currentEnemy.filter((m: any) => m.code !== 'RockGolemClone');
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
            class: ['boss', 'big'],
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
            class: ['mystery'],
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
            class: ['boss', 'big'],
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
            class: ['mystery'],
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
            class: ['boss', 'big'],
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
            class: ['mystery'],
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

export class DayTitan extends MonsterModel {
    constructor() {
        super({
            code: 'DayTitan',
            icon: '/monsters/day_titan.png',
            name: '日之泰坦',
            description: '克蘇魯風格的白晝支配者，散發著熾熱的日光光芒。',
            class: ['boss', 'giant'],
            ad: 85,
            critIncrease: 200,
            critRate: 15,
            adDefend: 40,
            dodge: 15,
            hit: 80,
            hp: 3000,
            hpLimit: 3000,
            level: 22,
            dropGold: 1200
        });
    }

    override onStartHook() {
        useEpicSubtitle("「光芒所及之處，皆為吾之領域。凡人，直視這萬丈烈陽吧！」", 4000);
    }

    override onAttackHook({playerStore, logStore}: MonsterOnAttackParams) {
        if (checkProbability(0.3)) {
            const isMad = playerStore?.hasStatus(EvnStatus.LowSanity.name);
            const multiplier = isMad ? 1.5 : 1.0;
            const damage = Math.round(this.ad * 1.5 * multiplier);

            if (isMad && logStore) {
                logStore.logger.add(`🔥 [癲狂破綻] 玩家的心智破綻被日之泰坦洞悉，烈陽耀斑傷害提升 50%！`);
            }

            applySkillDamage({
                speller: this,
                target: playerStore as any,
                baseValue: damage,
                type: "ad",
                sureHit: true,
                skillName: '烈陽耀斑'
            });

            return false;
        }
        return true;
    }

    override onRoundBehaviorHook({playerStore, logStore}: MonsterRoundBehaviorParams) {
        if (this.hp <= 0) return;

        // 耀光洗禮：每回合結束時，若玩家理智值低於 0，強制 +10
        const sanityStatus = playerStore?.statusEffects.find((s: any) => s.name === EvnStatus.Sanity.name);
        const sanityValue = sanityStatus ? (sanityStatus.value || 0) : 0;
        if (sanityValue < 0 && playerStore) {
            playerAdjustSanity(playerStore, 10);
            if (logStore) {
                logStore.logger.add(`☀️ [耀光洗禮] 日之泰坦強行淨化心靈，玩家理智提升了 10 點！`);
            }
        }
    }
}

export class NightTitan extends MonsterModel {
    whisperCooldown = 0;

    constructor() {
        super({
            code: 'NightTitan',
            icon: '/monsters/night_titan.png',
            name: '夜之泰坦',
            description: '克蘇魯風格的黑夜支配者，驅使著無盡的暗影囈語。',
            class: ['boss', 'giant'],
            ad: 110,
            critIncrease: 200,
            critRate: 20,
            adDefend: 50,
            dodge: 20,
            hit: 100,
            hp: 5000,
            hpLimit: 5000,
            level: 25,
            dropGold: 2500
        });
    }

    override onStartHook() {
        useEpicSubtitle("「黑暗終將籠罩一切，在永無止境的虛空呢喃中崩潰吧。」", 4000);
    }

    override onAttackHook({playerStore, logStore}: MonsterOnAttackParams) {
        this.whisperCooldown++;
        if (this.whisperCooldown >= 3) {
            this.whisperCooldown = 0;
            const damage = Math.round(this.ad * 1.2);

            applySkillDamage({
                speller: this,
                target: playerStore as any,
                baseValue: damage,
                type: "ap",
                sureHit: true,
                skillName: '黯月呢喃'
            });

            if (playerStore) {
                playerAdjustSanity(playerStore, -15);
            }
            if (logStore) {
                logStore.logger.add(`🌙 [黯月呢喃] 受到暗影侵蝕，玩家理智降低了 15 點！`);
            }

            return false;
        }
        return true;
    }

    override onRoundBehaviorHook({playerStore, logStore}: MonsterRoundBehaviorParams) {
        if (this.hp <= 0) return;

        // 無盡癲狂：每回合結束時，若玩家理智值高於 0，強制 -10
        const sanityStatus = playerStore?.statusEffects.find((s: any) => s.name === EvnStatus.Sanity.name);
        const sanityValue = sanityStatus ? (sanityStatus.value || 0) : 0;
        if (sanityValue > 0 && playerStore) {
            playerAdjustSanity(playerStore, -10);
            if (logStore) {
                logStore.logger.add(`🌌 [無盡癲狂] 夜之泰坦的暗影耳語響起，玩家理智降低了 10 點！`);
            }
        }
    }
}

export class DemonWood extends MonsterModel {
    constructor() {
        super({
            code: "DemonWood",
            icon: '/monsters/demon_wood.png',
            name: '背叛的樹妖',
            class: ['boss', 'big', 'icon-purple'],
            description: '背叛森林的樹之魔物。',
            ad: 12,
            critIncrease: 150,
            critRate: 25,
            adDefend: 10,
            dodge: 10,
            hit: 10,
            hp: 200,
            hpLimit: 200,
            level: 15,
            dropGold: 0,
            chaseIncrease: 0,
            drop: []
        });
    }

    override onStartHook() {
        useEpicSubtitle("「你是我的救命稻草，也是我復仇的第一滴血！」", 2500);
    }

    override onRoundBehaviorHook({playerStore, logStore}: MonsterRoundBehaviorParams) {
        this.ad += 2
    }

    override onAttackHook({playerStore, gameStateStore, logStore}: MonsterOnAttackParams) {
        const round = gameStateStore?.battleRound ?? 1;
        if (isMultiple(round, 3)) {
            playerStore.addStatus(UnitStatus.WoodStuck);
            useHeroStatusEffect({
                message: '老樹盤根',
                color: '#632b2b',
                icon: '🪵',
                duration: 1000
            });
            return false;
        }
        return true;
    }
}

export const Boss = {
    // --- 迷霧森林 (Misty Forest) ---
    AncientRoots: new AncientSpider(),
    Twilight: new Twilight(),

    // --- 赤之山脈 (Red Mountain) ---
    FrostGiant: new FrostGiant(),
    FireWyrmling: new FireWyrmling(),

    // --- 大荒地 (Giants Wasteland) ---
    BurrowingBehemoth: new BurrowingBehemoth(),
    RockGolemGroup: new RockGolemGroup(),

    // --- 分裂之谷 (Split Canyon) ---
    StormColossus: new StormColossus(),
    DualElementalist: new DualElementalist(),

    // --- 終焉深淵 (End Abyss) ---
    AbyssSpecter: new AbyssSpecter(),
    AbyssDespair: new AbyssDespair(),

    // --- 審判之日 (Judgment Stage) ---
    ArchangelMichael: new ArchangelMichael(),
    GodOfJudgment: new GodOfJudgment(),

    // --- 特殊 Boss ---
    DayTitan: new DayTitan(),
    NightTitan: new NightTitan(),
    DemonWood: new DemonWood()
};

export const StageBosses: Record<number, { mini: MonsterType; main: MonsterType }> = {
    1: {
        mini: Boss.AncientRoots,
        main: Boss.Twilight
    },
    2: {
        mini: Boss.FrostGiant,
        main: Boss.FireWyrmling
    },
    3: {
        mini: Boss.BurrowingBehemoth,
        main: Boss.RockGolemGroup
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