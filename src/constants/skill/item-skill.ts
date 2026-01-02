import {NoneMonsterItemSkillParams, SpecifyMonsterItemSkillParams} from "@/types";
import {showEffect} from "@/components/Shared/FloatingEffect/EffectManager";
import {GameState} from "@/enums/enums";
import {RoomEnum} from "@/enums/room-enum";
import {UserStatus} from "@/constants/status/user-status";
import {UnitStatus} from "@/constants/status/unit-status";
import {Boss} from "@/constants/monsters/boss-info";
import {useSaveStore} from "@/store/save-store";

export const ItemSkill: Record<string, (params: NoneMonsterItemSkillParams | SpecifyMonsterItemSkillParams) => void> = {
	// 選擇回合使用
	useCampfire: ({playerStore, gameStateStore, callback, targetElement}) => {
		if (!gameStateStore.stateIs(GameState.SELECTION_PHASE)) {
			showEffect(targetElement, "現在無法使用!", "debuff")
			callback(false);
			return
		}
		playerStore.healFull()
		callback(true)
	},
	useGodNotePage: ({playerStore, gameStateStore, callback, targetElement}) => {
		if (!gameStateStore.stateIs(GameState.SELECTION_PHASE)) {
			showEffect(targetElement, "現在無法使用!", "debuff")
			callback(false);
			return
		}
		const saveStore = useSaveStore()
		saveStore.saveAll()
		showEffect(targetElement, "已存檔", "fullscreen")
		callback(true);
		return
	},
	// 戰鬥回合使用
	useSmokeBomb: ({playerStore, gameStateStore, callback, targetElement}) => {
		const isFightRoom = gameStateStore.roomIs([RoomEnum.Fight.value, RoomEnum.EliteFight.value])
		if (isFightRoom && gameStateStore.stateIs(GameState.EVENT_PHASE)) {
			playerStore.addStatus(UserStatus.SmokeBomb)
			showEffect(targetElement, "💨", "fullscreen")
			callback(true)
			return
		}
		showEffect(targetElement, "現在無法使用!", "debuff")
		callback(false);
	},
	useBurningPotion: (params: SpecifyMonsterItemSkillParams) => {
		const {monster, monsterIndex, playerStore, gameStateStore, callback, targetElement} = params;
		if (gameStateStore.stateIs(GameState.EVENT_PHASE)) {
			if (playerStore.hasStatus(UnitStatus.SpiderStuck.name)) {
				playerStore.removeStatus(UnitStatus.SpiderStuck.name);
				showEffect(targetElement, "蜘蛛絲被燒斷了!", "fullscreen")
				callback(true)
				return
			}
			if (monster) {
				gameStateStore.addEffectToMonster(monsterIndex, UserStatus.OnBurn)
				callback(true)
				return
			}
		}
		showEffect(targetElement, "現在無法使用!", "debuff")
		callback(false);
	},
	useUnPoisonPotion: (params: SpecifyMonsterItemSkillParams) => {
		const {playerStore, gameStateStore, callback, targetElement} = params;
		if (!gameStateStore.stateIs(GameState.EVENT_PHASE)) {
			showEffect(targetElement, "現在無法使用!", "debuff")
			callback(false);
			return
		}
		if (playerStore.hasStatus('中毒')) {
			playerStore.removeStatus('中毒');
			showEffect(targetElement, "中毒狀態已消除", 'buff')
		}
		callback(true)
	},
	usePauseToken: (params: SpecifyMonsterItemSkillParams) => {
		const {monster, monsterIndex, playerStore, gameStateStore, callback, targetElement} = params;
		if (monster && monster.name == Boss.Twilight.name) {
			monster.adDefend += 4
			if (monster.ad > 0) {
				monster.ad -= 4
			} else {
				monster.ad = 0
			}

			showEffect(targetElement, "攻擊節奏減緩了!", "fullscreen")
			callback(true)
			return
		}
		showEffect(targetElement, "現在無法使用!", "debuff")
		callback(false);
	},
};