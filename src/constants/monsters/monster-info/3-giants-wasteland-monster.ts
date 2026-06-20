import {MonsterModel} from "@/models/monster-model";
import {WorldDefault} from "@/assets/const";
import {Material} from "@/constants/items/material/material-info";
import {UnitStatus} from "@/constants/status/unit-status";
import {checkProbability} from "@/utils/math";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";

export class SandSlime extends MonsterModel {
    constructor() {
        super({
            icon: '🟡',
            code: 'SandSlime',
            name: '沙礫史萊姆',
            description: '融合了荒野黃沙的史萊姆，防禦力較高',
            ad: 22,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 10,
            dodge: 0,
            hit: 15,
            hp: 150,
            hpLimit: 150,
            level: 11,
            dropGold: 20,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }
}

export class WastelandVulture extends MonsterModel {
    constructor() {
        super({
            icon: '🦅',
            code: 'WastelandVulture',
            name: '荒野禿鷹',
            description: '在荒原上空盤旋的飢餓猛禽，速度極快',
            ad: 25,
            critIncrease: WorldDefault.critIncrease,
            critRate: 15,
            adDefend: 5,
            dodge: 25,
            hit: 30,
            hp: 130,
            hpLimit: 130,
            level: 11,
            dropGold: 22,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }
}

export class CactusFighter extends MonsterModel {
    constructor() {
        super({
            icon: '🌵',
            code: 'CactusFighter',
            name: '仙人掌鬥士',
            description: '長滿利刺的植物型魔物，會反彈受到的近戰傷害',
            ad: 24,
            critIncrease: WorldDefault.critIncrease,
            critRate: 5,
            adDefend: 12,
            dodge: -5,
            hit: 20,
            hp: 170,
            hpLimit: 170,
            level: 12,
            dropGold: 25,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }

    override onAttackedHook({playerStore, logStore, damage}: any) {
        if (damage && damage.totalDamage > 0 && damage.type === 'ad') {
            const reflect = Math.round(damage.totalDamage * 0.15);
            if (reflect > 0) {
                playerStore.info.hp = Math.max(1, playerStore.info.hp - reflect);
                logStore.logger.add(`🌵 仙人掌的尖刺反彈了 ${reflect} 點傷害給玩家！`);
            }
        }
    }
}

export class DustDevil extends MonsterModel {
    constructor() {
        super({
            icon: '🌪️',
            code: 'DustDevil',
            name: '沙塵惡靈',
            description: '由狂風與飛砂構成的自然惡靈，極難被物理攻擊命中',
            ad: 26,
            critIncrease: WorldDefault.critIncrease,
            critRate: 10,
            adDefend: 6,
            dodge: 35,
            hit: 25,
            hp: 140,
            hpLimit: 140,
            level: 12,
            dropGold: 24,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }
}

export class DuneCrawler extends MonsterModel {
    constructor() {
        super({
            icon: '🐛',
            code: 'DuneCrawler',
            name: '沙丘爬行者',
            class: 'elite',
            description: '潛伏在沙丘底下的巨型蠕蟲，會突然竄出將獵物拖入地下',
            ad: 45,
            critIncrease: WorldDefault.critIncrease,
            critRate: 15,
            adDefend: 15,
            dodge: 5,
            hit: 35,
            hp: 280,
            hpLimit: 280,
            level: 14,
            dropGold: 90
        });
    }

    override onAttackHitHook({playerStore, logStore}: any) {
        if (checkProbability(0.4)) {
            playerStore.addStatus(UnitStatus.WoodStuck); // 用老樹盤根相同的stuck限制
            useFullScreenEffect({
                message: '流沙束縛',
                color: '#d7ccc8',
                duration: 1200
            });
            logStore.logger.add(`你被沙丘爬行者拖入流沙中，無法行動！`);
        }
    }
}

export class StoneGiant extends MonsterModel {
    constructor() {
        super({
            icon: '🗿',
            code: 'StoneGiant',
            name: '石巨人',
            class: 'elite',
            description: '荒原深處由巨石構成的守衛，防禦力驚人且力大無窮',
            ad: 40,
            critIncrease: WorldDefault.critIncrease,
            critRate: 10,
            adDefend: 30,
            dodge: -15,
            hit: 30,
            hp: 350,
            hpLimit: 350,
            level: 14,
            dropGold: 100,
        });
    }
}

export class WastelandScavenger extends MonsterModel {
    constructor() {
        super({
            icon: '🧟',
            code: 'WastelandScavenger',
            name: '荒地食屍鬼',
            description: '在戰場遺蹟徘徊的食屍鬼，能吸取敵人的生命力來恢復自己',
            ad: 30,
            critIncrease: WorldDefault.critIncrease,
            critRate: 10,
            adDefend: 8,
            dodge: 15,
            hit: 25,
            hp: 190,
            hpLimit: 190,
            level: 13,
            dropGold: 30,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }

    override onAttackHitHook({playerStore, logStore, damage}: any) {
        if (damage && damage.totalDamage > 0) {
            const heal = Math.round(damage.totalDamage * 0.4);
            if (heal > 0) {
                this.hp = Math.min(this.hpLimit, this.hp + heal);
                logStore.logger.add(`🧟 食屍鬼撕咬目標，回復了 ${heal} 點生命！`);
            }
        }
    }
}

export class DesertBasilisk extends MonsterModel {
    constructor() {
        super({
            icon: '🐍',
            code: 'DesertBasilisk',
            name: '沙漠蛇妖',
            description: '傳說中擁有石化凝視的毒蛇魔物，會使人肢體僵硬',
            ad: 32,
            critIncrease: WorldDefault.critIncrease,
            critRate: 10,
            adDefend: 10,
            dodge: 20,
            hit: 30,
            hp: 180,
            hpLimit: 180,
            level: 13,
            dropGold: 32,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }

    override onAttackHitHook({playerStore, logStore}: any) {
        if (checkProbability(0.25)) {
            playerStore.addStatus(UnitStatus.WoodStuck); // 石化同樣使用 stuck 機制
            useFullScreenEffect({
                message: '石化凝視',
                color: '#b0bec5',
                duration: 1000
            });
            logStore.logger.add(`你對上蛇妖的雙眼，身體漸漸石化了！`);
        }
    }
}

export const GiantsWastelandMonster = {
    SandSlime: new SandSlime(),
    WastelandVulture: new WastelandVulture(),
    CactusFighter: new CactusFighter(),
    DustDevil: new DustDevil(),
    DuneCrawler: new DuneCrawler(),
    StoneGiant: new StoneGiant(),
    WastelandScavenger: new WastelandScavenger(),
    DesertBasilisk: new DesertBasilisk()
};
