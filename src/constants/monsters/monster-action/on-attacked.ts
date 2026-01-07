// 定義所有怪物的特殊行為
import {UnitStatus} from "@/constants/status/unit-status";
import {MonsterActionParams} from "@/types";
import {checkProbability, shuffleArray} from "@/utils/math";
import {showEffect} from "@/components/Shared/FloatingEffect/EffectManager";
import {SpecialItem} from "@/constants/items/special-item-info";
import {create} from "@/utils/create";
import {MATERIAL} from "@/constants/items/material/material-info";

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
			logStore.logger.add(`幻象巨蟒在水霧中出現了多個!`)
			monster.status = []
			const fakeClone = create(monster);
			fakeClone.defendIncrease = -1000
			fakeClone.onAttacked = undefined
			fakeClone.dropGold = 0
			fakeClone.drop = undefined
			fakeClone.level = 1
			gameStateStore.currentEnemy.push(create(fakeClone))
			gameStateStore.currentEnemy.push(create(fakeClone))
			gameStateStore.currentEnemy = shuffleArray(gameStateStore.currentEnemy)
		}

	},

	duneBeastOnAttacked: ({monster, playerStore, targetElement, logStore}) => {
		if (checkProbability(0.2)) {
			// 掉落鱗片
			playerStore.gainItem(MATERIAL.BehemothScales)
			logStore.logger.add(`你從巨獸身上得到了一個鱗片`);
		}
	},
};