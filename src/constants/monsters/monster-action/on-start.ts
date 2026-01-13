// 定義所有怪物的特殊行為
import {UnitStatus} from "@/constants/status/unit-status";
import {MonsterActionParams} from "@/types";
import {useFloatingMessage} from "@/components/Shared/FloatingMessage/useFloatingMessage";
import {MistyForestMonster} from "@/constants/monsters/monster-info/1-misty-forest-monster";
import {create} from "@/utils/create";
import {useEpicSubtitle} from "@/components/Shared/EpicSubtitle/useEpicSubtitle";
import {SandstormPassWeights} from "@/constants/stage-monster-weights";
import {Boss} from "@/constants/monsters/boss-info";
import {Monster} from "@/constants/monsters/monster-info";


export const MonsterOnStart: Record<string, (params: MonsterActionParams) => void> = {
	wolfOnStart: ({playerStore, targetElement, gameStateStore}) => {
		if (gameStateStore.currentStage >= 5) return
		//效果
		playerStore.addStatus(UnitStatus.WolfRoarWarning)
		//動畫
		useFloatingMessage(
			'啊嗚~',
			targetElement,
			{
				duration: 1500, // 動畫時間保持不變
				color: 'red'
			}
		);
	},
	evilWoodManOnStart: ({playerStore, targetElement}) => {
		//效果
		playerStore.addStatus(UnitStatus.EvilWoodManCurse)
		// 額外動畫演示
		useFloatingMessage(
			'不會讓你逃的!',
			targetElement,
			{
				duration: 2000, // 動畫時間保持不變
				color: 'red'
			}
		);
	},
	bearOnStart: ({targetElement}) => {
		// 額外動畫演示
		useFloatingMessage(
			'這裡不是你該闖入的地方!',
			targetElement,
			{
				duration: 2000, // 動畫時間保持不變
				color: 'red'
			}
		);
	},
	poisonSlimeOnStart: ({playerStore, targetElement}) => {
		// 額外動畫演示
		useFloatingMessage(
			'(有毒的冒泡聲)',
			targetElement,
			{
				duration: 2000, // 動畫時間保持不變
				color: 'purple'
			}
		);
	},
	spiderOnStart: ({playerStore, targetElement}) => {
		// 額外動畫演示
		useFloatingMessage(
			'絲絲絲!',
			targetElement,
			{
				duration: 2000, // 動畫時間保持不變
				color: 'red'
			}
		);
		//效果
		playerStore.addStatus(UnitStatus.SpiderStuck)
	},
	fairyKingOnStart: ({playerStore, gameStateStore, targetElement}) => {
		// 額外動畫演示
		useFloatingMessage(
			'無理的傢伙!用死謝罪吧!',
			targetElement,
			{
				duration: 2000,
				color: 'red'
			}
		);
		let m = create(MistyForestMonster.FairyGuard)
		const strengthening = 1 + gameStateStore.days * 0.015
		// 基本階段強化
		m.hpLimit = Math.round(m.hpLimit * strengthening);
		m.hp = m.hpLimit;
		m.ad = Math.round(m.ad * strengthening);
		gameStateStore.currentEnemy.unshift(create(m))
		gameStateStore.currentEnemy.push(create(m))
	},
	twilightOnStart: ({playerStore, gameStateStore, targetElement}) => {
		useEpicSubtitle("「餘暉已候多時，只為繼續沈溺在這曲無盡的舞。而你－－蟲子，太吵了。」", 4000);
	},
	scorchingDunesOnStart: ({playerStore, targetElement}) => {
		// 額外動畫演示
		useFloatingMessage(
			'刷、刷——沙——',
			targetElement,
			{
				duration: 2000, // 動畫時間保持不變
				color: 'red'
			}
		);
	},
	mirageOasisOnStart: ({playerStore, targetElement}) => {
		// 額外動畫演示
		useFloatingMessage(
			'嘶~!死吧人類!',
			targetElement,
			{
				duration: 2000, // 動畫時間保持不變
				color: 'red'
			}
		);
	},
	atreidesManOnStart: ({playerStore, targetElement}) => {
		// 額外動畫演示
		useFloatingMessage(
			'操!你給我喝了啥!',
			targetElement,
			{
				duration: 2000, // 動畫時間保持不變
				color: 'red'
			}
		);
	},
	duneBeastOnStart: ({playerStore, targetElement, logStore}) => {
		playerStore.addStatus(UnitStatus.MandragoraScared)
		logStore.logger.add(`你受到驚嚇了。`);
		// 額外動畫演示
		useFloatingMessage(
			'吼!!!~~',
			targetElement,
			{
				duration: 2000, // 動畫時間保持不變
				color: 'red'
			}
		);
	},
	sandstormPassOnStart: ({playerStore, targetElement}) => {
		// 額外動畫演示
		useFloatingMessage(
			'刺刺!刺刺!',
			targetElement,
			{
				duration: 2000, // 動畫時間保持不變
				color: 'green'
			}
		);
	},
	pyramidEntranceOnStart: ({playerStore, gameStateStore, targetElement}) => {
		// 額外動畫演示
		useFloatingMessage(
			'接受我們的考驗吧，凡人!',
			targetElement,
			{
				duration: 2000,
				color: 'red'
			}
		);
		let m = create(Boss.PyramidEntrance2)
		gameStateStore.currentEnemy.push(create(m))
	},
	pharaohsRestOnStart: ({playerStore, gameStateStore, targetElement}) => {
		useEpicSubtitle("「好久沒有活人了，但你也將成為死人並臣服於我。」", 4000);
		let m = create(Monster.Mummy);
		const strengthening = 1 + gameStateStore.days * 0.015
		// 基本階段強化
		m.hpLimit = Math.round(m.hpLimit * strengthening);
		m.hp = m.hpLimit;
		m.ad = Math.round(m.ad * strengthening);
		gameStateStore.currentEnemy.unshift(create(m))
		gameStateStore.currentEnemy.push(create(m))
	},
};