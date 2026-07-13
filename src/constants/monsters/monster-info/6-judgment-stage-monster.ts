import {MonsterModel} from "@/models/monster-model";
import {WorldDefault} from "@/assets/const";
import {Material} from "@/constants/items/material/material-info";
import {UnitStatus} from "@/constants/status/unit-status";
import {checkProbability} from "@/utils/math";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";

export class LightInquisitor extends MonsterModel {
    constructor() {
        super({
            icon: '🧙',
            code: 'LightInquisitor',
            class: ['big'],
            name: '光之審判官',
            description: '代神行使權能的審判官，其聖光能令敵人無法施法',
            ad: 1000,
            critIncrease: WorldDefault.critIncrease,
            critRate: 15,
            adDefend: 1000,
            dodge: 1000,
            hit: 1000,
            hp: 6500,
            hpLimit: 6500,
            level: 99,
            dropGold: 1200
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
            class: ['big'],
            description: '手持光羽長槍的天使哨兵，攻擊精準無比',
            ad: 1000,
            critIncrease: WorldDefault.critIncrease,
            critRate: 15,
            adDefend: 1000,
            dodge: 1000,
            hit: 1000,
            hp: 6500,
            hpLimit: 6500,
            level: 99,
            dropGold: 1200
        });
    }
}


export class SeraphimGuard extends MonsterModel {
    constructor() {
        super({
            icon: '🛡️',
            code: 'SeraphimGuard',
            name: '熾天使衛士',
            class: ['big'],
            description: '擁有六翼的熾天使守衛，神聖護盾堅不可摧',
            ad: 1000,
            critIncrease: WorldDefault.critIncrease,
            critRate: 15,
            adDefend: 1000,
            dodge: 1000,
            hit: 1000,
            hp: 6500,
            hpLimit: 6500,
            level: 99,
            dropGold: 1200,
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
            class: ['big'],
            description: '代神行刑的巨劍使，其神聖裁決能穿透一切防禦',
            ad: 1000,
            critIncrease: WorldDefault.critIncrease,
            critRate: 15,
            adDefend: 1000,
            dodge: 1000,
            hit: 1000,
            hp: 6500,
            hpLimit: 6500,
            level: 99,
            dropGold: 1200,
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
            class: ['large'],
            description: '飄浮在審判之庭的巨大監察之眼，能看穿一切虛妄與閃避',
            ad: 1000,
            critIncrease: WorldDefault.critIncrease,
            critRate: 15,
            adDefend: 1000,
            dodge: 1000,
            hit: 1000,
            hp: 6500,
            hpLimit: 6500,
            level: 99,
            dropGold: 1200,
        });
    }
}


export const JudgmentStageMonster = {
    LightInquisitor: new LightInquisitor(),
    AngelSentry: new AngelSentry(),
    SeraphimGuard: new SeraphimGuard(),
    DivineExecutioner: new DivineExecutioner(),
    JudgmentWatcher: new JudgmentWatcher()
};
