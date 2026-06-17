import {NoneMonsterItemSkillParams, SpecifyMonsterItemSkillParams} from "@/types";
import {showEffect} from "@/components/Shared/FloatingEffect/EffectManager";
import {GameState} from "@/enums/enums";
import {RoomEnum} from "@/enums/room-enum";
import {ItemStatus} from "@/constants/status/item-status";
import {UnitStatus} from "@/constants/status/unit-status";
import {Boss} from "../monsters/monster-info/99-boss-info";
import {useSaveStore} from "@/store/save-store";
import {Usable} from "@/constants/items/usalbe-item/usable-info";
import EvnStatus from "@/constants/status/evn-status";

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
	useShabbyTent: ({playerStore, gameStateStore, callback, targetElement}) => {
		if (!gameStateStore.stateIs(GameState.SELECTION_PHASE)) {
			showEffect(targetElement, "現在無法使用!", "debuff")
			callback(false);
			return
		}
		playerStore.info.hp = Math.min(playerStore.finalStats.hpLimit, playerStore.info.hp + Math.round(playerStore.finalStats.hpLimit / 2))
		callback(true)
	},
	useGodNotePage: ({playerStore, gameStateStore, callback, targetElement}) => {
		if (!gameStateStore.stateIs(GameState.SELECTION_PHASE)) {
			showEffect(targetElement, "現在無法使用!", "debuff")
			callback(false);
			return
		}
		const saveStore = useSaveStore()
		playerStore.removeItem(Usable.GodNotePage.name)
		saveStore.saveAll()
		showEffect(targetElement, "已存檔", "fullscreen")

		callback(true);
		return
	},
	// 戰鬥回合使用
	useSmokeBomb: ({playerStore, gameStateStore, callback, targetElement}) => {
		const isFightRoom = gameStateStore.roomIs([RoomEnum.Fight.value, RoomEnum.EliteFight.value])
		if (isFightRoom && gameStateStore.stateIs(GameState.EVENT_PHASE)) {
			playerStore.addStatus(ItemStatus.SmokeBomb)
			showEffect(targetElement, "😶‍🌫️😶‍🌫️😶‍🌫️", "fullscreen")
			callback(true)
			return
		}
		showEffect(targetElement, "現在無法使用!", "debuff")
		callback(false);
	},
	useCamouflageGrass: ({playerStore, gameStateStore, callback, targetElement}) => {
		const isFightRoom = gameStateStore.roomIs([RoomEnum.Fight.value, RoomEnum.EliteFight.value])
		if (isFightRoom && gameStateStore.stateIs(GameState.EVENT_PHASE)) {
			playerStore.addStatus(ItemStatus.CamouflageGrass)
			showEffect(targetElement, "🫣🫣🫣", "fullscreen")
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
				gameStateStore.addEffectToMonster(monster, ItemStatus.OnBurn)
				callback(true)
				return
			}
		}
		showEffect(targetElement, "現在無法使用!", "debuff")
		callback(false);
	},
	useUnPoisonPotion: (params: SpecifyMonsterItemSkillParams) => {
		const {playerStore, callback, targetElement} = params;
		if (playerStore.hasStatus('中毒') || playerStore.hasStatus('劇毒')) {
			playerStore.removeStatus('中毒');
			playerStore.removeStatus('劇毒');
			showEffect(targetElement, "中毒狀態已消除", 'buff')
			callback(true)
			return;
		} else {
			showEffect(targetElement, "沒有中毒狀態!", "debuff")
			callback(false);
			return
		}
	},
	usePauseToken: (params: SpecifyMonsterItemSkillParams) => {
		const {monster, monsterIndex, playerStore, gameStateStore, callback, targetElement} = params;
		if (monster && monster.name == Boss.Twilight.name) {

			if (monster.ad > 10) {
				monster.ad -= 4
				monster.adDefend -= 4
			} else {
				monster.ad = 10
				monster.adDefend = 10
			}

			showEffect(targetElement, "攻擊節奏減緩了!", "fullscreen")
			callback(true)
			return
		}
		showEffect(targetElement, "現在無法使用!", "debuff")
		callback(false);
	},
	useDuneBeastBomb: (params: SpecifyMonsterItemSkillParams) => {
		const {monster, monsterIndex, playerStore, gameStateStore, callback, targetElement} = params;
		if (gameStateStore.stateIs(GameState.EVENT_PHASE)) {
			if (monster.name.includes('巨獸')) {
				monster.hp = 300
				monster.adDefend = 5
				monster.apDefend = 5
				monster.ad = 50
				showEffect(targetElement, "💥炸彈在巨獸身體內引爆💥", "fullscreen")
			} else {
				monster.hp -= 200
				playerStore.info.hp -= 100
				showEffect(targetElement, "💥炸彈引爆了💥!!", "debuff")
			}
			callback(true)
			return
		}
		showEffect(targetElement, "現在無法使用!", "debuff")
		callback(false);
	},
	useWarmFruit: (params: SpecifyMonsterItemSkillParams) => {
		const {playerStore, callback, targetElement} = params;
		playerStore.addStatus(ItemStatus.Warming)
		callback(true)
		return;
	},
	useHotFruit: (params: SpecifyMonsterItemSkillParams) => {
		const {playerStore, callback, targetElement} = params;
		playerStore.removeStatus('寒冷');
		showEffect(targetElement, "寒冷狀態已消除,但中毒了", 'buff')
		playerStore.addStatus(EvnStatus.Poison)
		callback(true)
		return;

	},
};