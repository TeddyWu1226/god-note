import {Achievement} from "@/constants/achievement";
import {AchievementStoreType, AchievementType, GameStateStoreType, PlayerStoreType, TrackerStoreType} from "@/types";
import {CharEnum} from "@/enums/char-enum";
import {Weapon} from "@/constants/items/equipment/weapon-info";
import {Accessory1, Accessory2} from "@/constants/items/equipment/accessories-info";

/**
 * 成就檢查核心邏輯
 * 回傳所有「在此次檢查中新達成」的成就 Key
 */
export const checkAchievements = (
	currentAchievements: Record<string, AchievementType>,
	stores: {
		trackerStore: TrackerStoreType;
		playerStore: PlayerStoreType;
		gameStateStore: GameStateStoreType;
		achievementStore: AchievementStoreType;
	}
): string[] => {
	const {trackerStore, playerStore, gameStateStore, achievementStore} = stores;
	const newlyUnlockedKeys: string[] = [];
	Object.entries(currentAchievements).forEach(([key, ach]: [keyof typeof Achievement, AchievementType]) => {
		if (ach.isUnlocked) return;

		let isConditionMet = false;

		// --- 擊殺類 ---
		if (key.startsWith('Kill')) {
			const totalKills = trackerStore.getKillCount('TOTAL', 'total');
			if (key === 'Kill20' && totalKills >= 20) isConditionMet = true;
			if (key === 'Kill200' && totalKills >= 200) isConditionMet = true;
			if (key === 'Kill2000' && totalKills >= 2000) isConditionMet = true;
		}

		// --- 菁英擊殺 ---
		if (key.startsWith('EliteHunter')) {
			const eliteKills = trackerStore.getKillCount('ELITE', 'total');
			if (key === 'EliteHunter10' && eliteKills >= 10) isConditionMet = true;
			if (key === 'EliteHunter100' && eliteKills >= 100) isConditionMet = true;
			if (key === 'EliteHunter1000' && eliteKills >= 1000) isConditionMet = true;
		}

		// --- 重來次數 ---
		if (key.startsWith('Restart')) {
			const count = achievementStore.tryTime
			if (key === 'Restart0' && count >= 5) isConditionMet = true;
			if (key === 'Restart1' && count >= 20) isConditionMet = true;
			if (key === 'Restart2' && count >= 100) isConditionMet = true;
		}

		// --- 過關類 ---
		if (key.startsWith('Boss')) {
			const count = achievementStore.tryTime
			if (key === 'Boss0' && gameStateStore.currentStage > 1) isConditionMet = true;
			if (key === 'Boss1' && gameStateStore.currentStage > 5) isConditionMet = true;
		}

		/** 隱藏成就 **/
		// --- 魔樹事件 ---
		if (key === 'EvilTree1' && playerStore.hasItem(Weapon.SpikeSpear.name)[0]) isConditionMet = true;
		if (key === 'EvilTree2' && playerStore.hasItem(Accessory1.CursedWoodenRing.name)[0]) isConditionMet = true;
		if (key === 'EvilTree3' && playerStore.hasItem(Accessory2.EvilWoodenHeart.name)[0]) isConditionMet = true;

		// --- 殘血戰鬥 ---
		if (key === 'NearDeath' && gameStateStore.isBattleWon && (playerStore.info.hp / playerStore.finalStats.hpLimit) <= 0.05) {
			isConditionMet = true;
		}

		// --- 轉職 ---
		if (key === 'ThisGameHasJob' && playerStore.info.char !== CharEnum.Beginner.value) {
			isConditionMet = true;
		}

		if (isConditionMet) {
			newlyUnlockedKeys.push(key);
		}
	});

	return newlyUnlockedKeys;
};