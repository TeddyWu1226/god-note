// 定義所有怪物的特殊行為
import {UnitStatus} from "@/constants/status/unit-status";
import {MonsterOnAttackParams} from "@/types";
import {checkProbability} from "@/utils/math";
import {showEffect} from "@/components/Shared/FloatingEffect/EffectManager";
import {MistyForestMonster} from "@/constants/monsters/monster-info/1-misty-forest-monster";
import {create} from "@/utils/create";
import {Monster} from "@/constants/monsters/monster-info";
import {useFloatingMessage} from "@/components/Shared/FloatingMessage/useFloatingMessage";


export const MonsterOnAttack: Record<string, (params: MonsterOnAttackParams) => void> = {
	slimeOnAttack: ({playerStore, logStore}) => {
		playerStore.addStatus(UnitStatus.SlimeSlow)
		logStore.logger.add(`你沾滿了黏液。`);
	},
	beeOnAttack: ({playerStore, logStore}) => {
		if (checkProbability(0.7)) {
			playerStore.addStatus(UnitStatus.BeePoison)
			logStore.logger.add(`你中毒了。`);
		}
	},
	poisonSlimeOnAttack: ({monster, playerStore, targetElement, logStore}) => {
		// 防禦減少
		showEffect(targetElement, "🛡️⬇️", "debuff");
		monster.adDefend -= 2
		if (monster.adDefend < 0) {
			monster.adDefend = 0
		}
	},
	smallSpiderOnAttack: ({playerStore, logStore}) => {
		if (checkProbability(0.25)) {
			playerStore.addStatus(UnitStatus.SmallSpiderStuck)
			logStore.logger.add(`你被綑綁了。`);
		}
	},
	spiderOnAttack: ({gameStateStore, monsterIndex, playerStore}) => {
		// 獲得針對被綑綁的玩家必定爆擊的一回合效果
		if (playerStore.statusEffects?.find(e => e.name === '綑綁')) {
			gameStateStore.addEffectToMonster(monsterIndex, UnitStatus.SpiderHunter)
		}
	},
	twilightOnAttack: ({monster, playerStore, targetElement, logStore}) => {
		monster.adDefend += 2
		monster.ad += 2
		showEffect(targetElement, "節奏加速了 ⚔️⬆️ 🛡️⬆️", "buff");
		logStore.logger.add('半神的攻擊更凌厲了,防禦也更加堅固!')
	},
	scorchingDunesOnAttack: ({monster, playerStore, targetElement, logStore}) => {
		if (playerStore.hasStatus(UnitStatus.ScorpionPoison.name)) {
			const currentStatus = playerStore.statusEffects.find((status) => status.name === UnitStatus.ScorpionPoison.name);
			// 更新效果
			currentStatus.value += 5
			currentStatus.duration = 10
			currentStatus.description = currentStatus.description.replace(/\d+/, currentStatus.value.toString())
		} else {
			playerStore.addStatus(UnitStatus.ScorpionPoison)
		}
		logStore.logger.add(`你中劇毒了。`);
	},
	desertScorpionOnAttack: ({playerStore, logStore}) => {
		if (checkProbability(0.3)) {
			return
		}
		if (playerStore.hasStatus(UnitStatus.SmallScorpionPoison.name)) {
			const currentStatus = playerStore.statusEffects.find(
				(status) => status.name === UnitStatus.SmallScorpionPoison.name
			);
			// 更新效果
			currentStatus.value += 3
			currentStatus.duration = 10
			currentStatus.description = currentStatus.description.replace(/\d+/, currentStatus.value.toString())
		} else {
			playerStore.addStatus(UnitStatus.SmallScorpionPoison)
			logStore.logger.add(`你中毒了。`);
		}
	},
	mummyOnAttack: ({playerStore, logStore}) => {
		playerStore.addStatus(UnitStatus.MummyRancid)
		logStore.logger.add(`你被腐臭破防了。`);
	},
	pharaohsRestOnAttack: ({playerStore, monster, gameStateStore, logStore, targetElement}) => {
		if (!monster.tick) {
			monster.tick = {}
			monster.tick['pharaohsRest'] = 0
		}
		monster.tick['pharaohsRest'] += 1
		const tick = monster.tick['pharaohsRest']
		if (tick % 10 === 0) {
			let removedCount = 0;
			for (let i = gameStateStore.currentEnemy.length - 1; i >= 0; i--) {
				if (gameStateStore.currentEnemy[i].name === Monster.Mummy.name) {
					gameStateStore.currentEnemy.splice(i, 1);
					removedCount++;
				}
			}
			if (!removedCount) {
				return
			}
			showEffect(targetElement, "成為我的力量吧!", "buff");
			monster.hp = Math.min(monster.hpLimit, Math.floor(monster.hp + removedCount * 100))
		}
	},
};