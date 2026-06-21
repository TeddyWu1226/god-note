import {MonsterModel} from "@/models/monster-model";
import {WorldDefault} from "@/assets/const";
import {Material} from "@/constants/items/material/material-info";
import {UnitStatus} from "@/constants/status/unit-status";
import {checkProbability} from "@/utils/math";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";

export class JudgmentSlime extends MonsterModel {
    constructor() {
        super({
            icon: '⚪',
            code: 'JudgmentSlime',
            name: '審判史萊姆',
            description: '浸染了神聖光輝的史萊姆，極為沉重',
            ad: 110,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 30,
            dodge: 20,
            hit: 70,
            hp: 700,
            hpLimit: 700,
            level: 26,
            dropGold: 100,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }
}

export class LightInquisitor extends MonsterModel {
    constructor() {
        super({
            icon: '🧙',
            code: 'LightInquisitor',
            name: '光之審判官',
            description: '代神行使權能的審判官，其聖光能令敵人無法施法',
            ad: 120,
            critIncrease: WorldDefault.critIncrease,
            critRate: 15,
            adDefend: 25,
            dodge: 25,
            hit: 80,
            hp: 650,
            hpLimit: 650,
            level: 26,
            dropGold: 110,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }

    override onAttackHitHook({playerStore, logStore}: any) {
        if (checkProbability(0.5)) {
            playerStore.addStatus(UnitStatus.JudgmentSilence);
            logStore.logger.add(`🧙 審判官施展神聖禁錮，你被沉默了(法術增傷降低)！`);
        }
    }
}

export class AngelSentry extends MonsterModel {
    constructor() {
        super({
            icon: '👼',
            code: 'AngelSentry',
            name: '天使哨兵',
            description: '手持光羽長槍的天使哨兵，攻擊精準無比',
            ad: 130,
            critIncrease: WorldDefault.critIncrease,
            critRate: 20,
            adDefend: 28,
            dodge: 30,
            hit: 120,
            hp: 750,
            hpLimit: 750,
            level: 27,
            dropGold: 120,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }
}

export class HolyArchon extends MonsterModel {
    constructor() {
        super({
            icon: '👑',
            code: 'HolyArchon',
            name: '神聖執政官',
            description: '神聖軍團的指揮官，能引導聖光治癒盟友',
            ad: 125,
            critIncrease: WorldDefault.critIncrease,
            critRate: 15,
            adDefend: 35,
            dodge: 20,
            hit: 90,
            hp: 800,
            hpLimit: 800,
            level: 27,
            dropGold: 130,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }

    override onRoundBehaviorHook() {
        // 每回合自我治癒 50 HP
        const heal = 50;
        this.hp = Math.min(this.hpLimit, this.hp + heal);
    }
}

export class SeraphimGuard extends MonsterModel {
    constructor() {
        super({
            icon: '🛡️',
            code: 'SeraphimGuard',
            name: '熾天使衛士',
            class: 'elite',
            description: '擁有六翼的熾天使守衛，神聖護盾堅不可摧',
            ad: 220,
            critIncrease: WorldDefault.critIncrease,
            critRate: 20,
            adDefend: 50,
            dodge: 20,
            hit: 100,
            hp: 1200,
            hpLimit: 1200,
            level: 29,
            dropGold: 300
        });
    }

    override onStartHook() {
        useFullScreenEffect({
            message: '聖羽屏障',
            color: '#fff9c4',
            duration: 1500
        });
    }
}

export class DivineExecutioner extends MonsterModel {
    constructor() {
        super({
            icon: '⚔️',
            code: 'DivineExecutioner',
            name: '神聖處刑者',
            class: 'elite',
            description: '代神行刑的巨劍使，其神聖裁決能穿透一切防禦',
            ad: 200,
            critIncrease: WorldDefault.critIncrease,
            critRate: 30,
            adDefend: 30,
            dodge: 20,
            hit: 110,
            hp: 1400,
            hpLimit: 1400,
            level: 29,
            dropGold: 350
        });
    }

    override onAttackHitHook({playerStore, logStore, damage}: any) {
        if (damage && damage.totalDamage > 0) {
            // 附帶 20% 真實傷害 (不計防禦)
            const trueDmg = Math.round(this.ad * 0.2);
            const result = playerStore.takeDamage(trueDmg);
            if (playerStore.info.hp <= 0) {
                playerStore.info.hp = 1;
            }
            if (result.shieldAbsorbed > 0) {
                logStore.logger.add(`🛡️ 護盾吸收了 ${result.shieldAbsorbed} 點傷害！`);
            }
            logStore.logger.add(`⚔️ 處刑者的巨劍對你造成了額外 ${trueDmg} 點神聖真實傷害！`);
        }
    }
}

export class JudgmentWatcher extends MonsterModel {
    constructor() {
        super({
            icon: '👁️',
            code: 'JudgmentWatcher',
            name: '審判凝視者',
            description: '飄浮在審判之庭的巨大監察之眼，能看穿一切虛妄與閃避',
            ad: 150,
            critIncrease: WorldDefault.critIncrease,
            critRate: 20,
            adDefend: 30,
            dodge: 30,
            hit: 200, // 極高命中
            hp: 900,
            hpLimit: 900,
            level: 28,
            dropGold: 150,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }
}

export class FaithZealot extends MonsterModel {
    constructor() {
        super({
            icon: '🔥',
            code: 'FaithZealot',
            name: '信仰狂熱者',
            description: '燃燒靈魂以維護信仰的狂熱信徒，生命值越低，攻擊力越可怕',
            ad: 160,
            critIncrease: WorldDefault.critIncrease,
            critRate: 15,
            adDefend: 20,
            dodge: 25,
            hit: 95,
            hp: 850,
            hpLimit: 850,
            level: 28,
            dropGold: 160,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }

    override getEffectiveStats() {
        const base = super.getEffectiveStats();
        // 當生命降低時，攻擊力最高增加 50%
        const lostHpPct = (this.hpLimit - this.hp) / this.hpLimit;
        base.ad = Math.round(base.ad * (1 + lostHpPct * 0.5));
        return base;
    }
}

export const JudgmentStageMonster = {
    JudgmentSlime: new JudgmentSlime(),
    LightInquisitor: new LightInquisitor(),
    AngelSentry: new AngelSentry(),
    HolyArchon: new HolyArchon(),
    SeraphimGuard: new SeraphimGuard(),
    DivineExecutioner: new DivineExecutioner(),
    JudgmentWatcher: new JudgmentWatcher(),
    FaithZealot: new FaithZealot()
};
