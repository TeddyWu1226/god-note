// 定義所有怪物的特殊行為
import {UnitStatus} from "@/constants/status/unit-status";
import {MonsterActionParams} from "@/types";
import {checkProbability, shuffleArray} from "@/utils/math";
import {showEffect} from "@/components/Shared/FloatingEffect/EffectManager";
import {SpecialItem} from "@/constants/items/special-item-info";
import {create} from "@/utils/create";
import {Material} from "@/constants/items/material/material-info";
import {ItemStatus} from "@/constants/status/item-status";
import {Boss} from "@/constants/monsters/boss-info";
import {useFloatingMessage} from "@/components/Shared/FloatingMessage/useFloatingMessage";
import {Monster} from "@/constants/monsters/monster-info";
import { MonsterModel as MonsterClass } from "@/models/monster-model";
import {checkHpThresholds} from "@/constants/fight-func";

/**
 * 怪物受傷後判斷
 */
export const MonsterOnAttacked: Record<string, (params: MonsterActionParams) => void> = {
    poisonSlimeOnAttacked: ({monster, playerStore, targetElement, logStore}) => {
        // 使攻擊者中毒
        playerStore.addStatus(UnitStatus.SlimePoison)
        logStore.logger.add(`你中毒了。`);
        // 防禦增加
        showEffect(targetElement, "🛡️⬆️", "buff");
        monster.adDefend += 5
    },
    mushroomManOnAttacked: ({playerStore, logStore}) => {
        if (checkProbability(0.5)) {
            // 使攻擊者中毒
            playerStore.addStatus(UnitStatus.MushroomManPoison)
            logStore.logger.add(`你中毒了。`);
        }
    },

    twilightOnAttacked: ({monster, playerStore, targetElement, logStore}) => {
        const chance = 0.2 + (((monster.ad - 14) / 2) * 0.1)
        if (checkProbability(chance)) {
            // 掉落休止符
            playerStore.gainItem(SpecialItem.PauseToken)
            logStore.logger.add(`你得到了一個神秘的符號`);
        }
    },
    cactusSpiritOnAttacked: ({monster, playerStore, targetElement, logStore}) => {
        if (monster.status?.some((status) => status.name === ItemStatus.OnBurn.name)) {
            logStore.logger.add(`仙人掌的尖刺被燒掉了,無法對你噴射尖刺`);
            return
        }
        // 使攻擊者受傷
        playerStore.info.hp -= monster.ad
        logStore.logger.add(`仙人掌對你噴射了尖刺,你受到的 ${monster.ad} 傷害`);
    },
    mirageOasisOnAttacked: ({monster, gameStateStore, targetElement, logStore}) => {
        // 幻象分身
        if (!monster.tick) {
            monster.tick = {};
        }
        const currentHpRate = Math.round(monster.hp / monster.hpLimit * 100)
        let trigger = false
        if (!monster.tick['clone'] && currentHpRate <= 80) {
            monster.tick['clone'] = 1
            trigger = true
        }
        if (monster.tick['clone'] === 1 && currentHpRate <= 40) {
            monster.tick['clone'] += 1
            trigger = true
        }
        if (trigger) {
            logStore.logger.add(`幻象巨蟒在水霧中出現了多個!破壞力也更加強大!`)
            monster.status = []
            monster.ad += 5
            const fakeClone = new MonsterClass(monster);
            fakeClone.defendIncrease = -1000
            fakeClone.onAttacked = undefined
            fakeClone.dropGold = 0
            fakeClone.drop = undefined
            fakeClone.level = 1
            gameStateStore.currentEnemy.push(new MonsterClass(fakeClone))
            gameStateStore.currentEnemy.push(new MonsterClass(fakeClone))
            gameStateStore.currentEnemy = shuffleArray(gameStateStore.currentEnemy)
        }

    },
    duneBeastOnAttacked: ({monster, playerStore, targetElement, logStore}) => {
        if (checkProbability(0.2)) {
            // 掉落鱗片
            playerStore.gainItem(Material.BehemothScales)
            logStore.logger.add(`你從巨獸身上得到了一個鱗片`);
        }
    },
    pyramidEntranceOnAttacked: ({monster, gameStateStore, targetElement, logStore}) => {
        // 石像召喚
        if (!monster.tick) {
            monster.tick = {};
        }
        const currentHpRate = Math.round(monster.hp / monster.hpLimit * 100)
        let trigger = false
        if (!monster.tick['pyramidEntrance1'] && currentHpRate <= 50) {
            monster.tick['pyramidEntrance1'] = 1
            trigger = true
        }
        if (gameStateStore.currentEnemy.length === 2) {
            return
        }
        if (trigger) {
            useFloatingMessage(
                '起來吧!',
                targetElement,
                {
                    duration: 2000,
                    color: 'red'
                }
            );
            let m = new MonsterClass(Boss.PyramidEntrance2)
            gameStateStore.currentEnemy.push(m)
        }
    },
    pyramidEntrance2OnAttacked: ({monster, gameStateStore, targetElement, logStore}) => {
        // 石像召喚
        if (!monster.tick) {
            monster.tick = {};
        }
        const currentHpRate = Math.round(monster.hp / monster.hpLimit * 100)
        let trigger = false
        if (!monster.tick['pyramidEntrance2'] && currentHpRate <= 50) {
            monster.tick['pyramidEntrance2'] = 1
            trigger = true
        }
        if (gameStateStore.currentEnemy.length === 2) {
            return
        }
        if (trigger) {
            useFloatingMessage(
                '起來吧!',
                targetElement,
                {
                    duration: 2000,
                    color: 'red'
                }
            );
            let m = new MonsterClass(Boss.PyramidEntrance)
            gameStateStore.currentEnemy.push(m)
        }
    },

    pharaohsRestOnAttacked: ({monster, gameStateStore, targetElement, logStore}) => {
        if (!monster.tick) {
            monster.tick = {}
        }
        if (!monster.tick['pharaohsRestSum']) {
            monster.tick['pharaohsRestSum'] = []
        }
        const entity = {
            hp: monster.hp,
            maxHp: monster.hpLimit,
            triggeredThresholds: monster.tick['pharaohsRestSum'] as number[],
        }

        let trigger = checkHpThresholds(entity)

        if (trigger) {
            if (!monster.status) {
                monster.status = []
            }
            if (monster.status.some((status) => status.name === UnitStatus.EatMummy.name)) {
                return
            }
            monster.status.push(UnitStatus.EatMummy)
            monster.tick['pharaohsRest'] = 0
            if (gameStateStore.currentEnemy.length === 1) {
                let m = new MonsterClass(Monster.Mummy);
                const strengthening = 1 + gameStateStore.days * 0.0075
                // 基本階段強化
                m.hpLimit = Math.round(m.hpLimit * strengthening);
                m.hp = m.hpLimit;
                m.ad = Math.round(m.ad * strengthening);
                gameStateStore.currentEnemy.unshift(new MonsterClass(m))
                gameStateStore.currentEnemy.push(new MonsterClass(m))
            }
        }
    },
    snowyFoothillsOnAttacked: ({monster, gameStateStore, targetElement, logStore}) => {
        const skillName = 'snowyFoothills'
        if (!monster.tick) {
            monster.tick = {}
        }
        if (!monster.tick[skillName]) {
            monster.tick[skillName] = []
        }
        const entity = {
            hp: monster.hp,
            maxHp: monster.hpLimit,
            triggeredThresholds: monster.tick[skillName] as number[],
        }

        let trigger = checkHpThresholds(entity)

        if (trigger) {
            useFloatingMessage(
                '吼!',
                targetElement,
                {
                    duration: 2000,
                    color: 'red'
                }
            );
            gameStateStore.addEffectToMonster(monster, UnitStatus.WhiteAngry)
        }
    },
    frozenCliffsOnAttacked: ({monster, gameStateStore, targetElement, logStore}) => {
        if (checkProbability(0.3)) {
            useFloatingMessage(
                '(拍動翅膀)',
                targetElement,
                {
                    duration: 2000,
                    color: 'blue'
                }
            );
            gameStateStore.addEffectToMonster(monster, UnitStatus.Flying)
        }
    }
};