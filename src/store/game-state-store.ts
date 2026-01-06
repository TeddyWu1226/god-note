import {defineStore} from 'pinia';
import {GameState, SpecialEventEnum} from "@/enums/enums";
import {RoomEnum} from "@/enums/room-enum";
import {MonsterType, StatusEffect} from "@/types";
import {computed, ref} from "vue";
import {useLogStore} from "@/store/log-store";
import {DifficultyEnum} from "@/enums/difficulty-enum";

export const getEffectiveStats = (monster: MonsterType): MonsterType => {
	// 基礎數值作為基底
	const finalStats = {
		icon: monster.icon,
		name: monster.name,
		description: monster.description,
		level: monster.level,
		hp: monster.hp,
		ad: monster.ad || 0,
		adDefend: monster.adDefend || 0,
		apDefend: monster.apDefend || 0,
		hpLimit: monster.hpLimit || 0,
		dodge: monster.dodge || 0,
		hit: monster.hit || 0,
		critRate: monster.critRate || 0,
		critIncrease: monster.critIncrease || 0,
		adIncrease: monster.adIncrease || 0,
		apIncrease: monster.apIncrease || 0,
		defendIncrease: monster.defendIncrease || 0,
		lifeSteal: monster.lifeSteal || 0,
	};

	// 遍歷所有狀態，疊加 Bonus
	monster.status?.forEach(eff => {
		if (eff.bonus) {
			(Object.keys(eff.bonus) as Array<keyof typeof eff.bonus>).forEach(key => {
				const val = eff.bonus![key];
				if (typeof val === 'number') {
					// 根據 key 加上對應的數值
					if (key in finalStats) {
						(finalStats as any)[key] += val;
					}
				}
			});
		}
	});

	return finalStats;
};

export const useGameStateStore = defineStore('game-state', () => {
	const currentRoomValue = ref<number>(RoomEnum.Rest.value);
	const currentStage = ref(1);
	const isDead = ref(false)
	// 無限挑戰制所需參數
	const days = ref(0);
	const nextRooms = ref<number[]>([])
	// 回合/戰鬥用數據
	const currentState = ref<GameState>(GameState.INITIAL);
	const isBattleWon = ref(false);
	const currentEnemy = ref<MonsterType[]>([]);
	// 事件相關紀錄
	const currentEventType = ref<SpecialEventEnum>(SpecialEventEnum.None);
	const eventProcess = ref<Record<SpecialEventEnum, number>>({} as Record<SpecialEventEnum, number>);
	const eventAction = ref(0)
	const thisStageAppear = ref<string[]>([])
	const switchEnemy = ref<MonsterType[]>([]);
	const difficulty = ref(DifficultyEnum.Normal.value);
	const otherRecord = ref<Record<string, any>>({}) // 額外記錄表

	// --- Getters (用 computed 代替) ---
	/**
	 * 不存在或0代表沒發生過
	 * -1 永久不發生
	 */
	const getEventProcess = computed(() => (event: SpecialEventEnum): number => {
		return eventProcess.value[event] ?? 0;
	});

	const stateIs = computed(() => (stateToCheck: GameState): boolean => {
		return currentState.value === stateToCheck;
	});

	const roomIs = computed(() => (roomValue: number | number[]): boolean => {
		if (Array.isArray(roomValue)) {
			return roomValue.includes(currentRoomValue.value);
		}
		return currentRoomValue.value === roomValue;
	});

	// --- Actions ---
	function init(stageNum = 1, restart = false): void {
		if (stageNum === 1) {
			currentState.value = GameState.INITIAL;
			isDead.value = false
			currentRoomValue.value = RoomEnum.Rest.value;
		}
		days.value = 0
		thisStageAppear.value = []
		currentStage.value = stageNum;
		isBattleWon.value = false;
		currentEnemy.value = [];
		currentEventType.value = null;
		eventAction.value = 0
		if (restart) {
			eventProcess.value = {} as Record<SpecialEventEnum, number>;
			otherRecord.value = {}
		}
		console.log('遊戲狀態已重置');
	}

	function setRoom(roomValue: number): void {
		currentRoomValue.value = roomValue ?? RoomEnum.Fight.value;
		isBattleWon.value = false;
		currentEnemy.value = [];
		currentState.value = GameState.EVENT_PHASE;
		// 重製事件
		currentEventType.value = null;
		eventAction.value = 0
	}

	/**
	 * 突然切換至戰鬥房間
	 * @param roomValue
	 * @param monsters
	 */
	function switchToFightRoom(roomValue: number, monsters?: MonsterType[]): void {
		setRoom(roomValue);
		if (monsters) {
			switchEnemy.value = monsters;
		}
	}


	/**
	 * 突然切換至事件房間
	 * @param event
	 */
	function switchToEventRoom(event: SpecialEventEnum): void {
		setRoom(RoomEnum.Event.value);
		currentEventType.value = event;
	}

	function setCurrentEnemy(monsters: MonsterType[]): void {
		currentEnemy.value = monsters
	}


	function takeSwitchEnemy(): MonsterType[] {
		const enemy = switchEnemy.value;
		switchEnemy.value = []
		return enemy
	}

	function setBattleWon(won: boolean): void {
		const battleRooms = [RoomEnum.Fight.value, RoomEnum.EliteFight.value, RoomEnum.Boss.value, RoomEnum.SpecialBoss.value];
		if (battleRooms.includes(currentRoomValue.value)) {
			isBattleWon.value = won;
			if (won) {
				currentEnemy.value = [];
				currentState.value = GameState.SELECTION_PHASE;
			}
		}
	}

	function transitionToNextState(): void {
		switch (currentState.value) {
			case GameState.INITIAL:
			case GameState.SELECTION_PHASE:
				currentState.value = GameState.EVENT_PHASE;
				break;
			case GameState.EVENT_PHASE:
				currentState.value = GameState.SELECTION_PHASE;
				break;
		}
	}

	function setEvent(event: SpecialEventEnum) {
		currentEventType.value = event;
	}

	function isEventClose(event: SpecialEventEnum) {
		if (!eventProcess.value[event]) {
			return false;
		}
		return eventProcess.value[event] === -1;
	}

	function addEventProcess(event: SpecialEventEnum, close: boolean = false) {
		if (close) {
			eventProcess.value[event] = -1
		} else {
			const currentCount = eventProcess.value[event] ?? 0;
			eventProcess.value[event] = currentCount + 1;
		}
	}

	// 施加怪物狀態
	function addEffectToMonster(monsterIndex: number, effect: StatusEffect) {
		const monster = currentEnemy.value[monsterIndex]
		const logStore = useLogStore();
		if (!monster) return;
		logStore.logger.add(`${monster.name} 受到 [${effect.name}] 效果。`);
		// 邏輯：如果已有同名狀態，則更新持續時間，否則新增
		if (!monster.status) {
			monster.status = []
		}
		const existingIdx = monster.status.findIndex(e => e.name === effect.name);
		if (existingIdx > -1) {
			monster.status[existingIdx].duration = effect.duration;
		} else {
			monster.status.push({...effect});
		}
	}

	// 每回合觸發：更新所有怪物的狀態
	function tickAllMonsters() {
		const logStore = useLogStore();
		currentEnemy.value.forEach(monster => {

			if (monster.hp <= 0) return;

			// 1. 處理每回合跳血/回血 (DoT/HoT)
			monster.status?.forEach(eff => {
				let logMessage: string | undefined
				if (eff.type === 'damage' && eff.value) {
					logMessage = `${monster.name} 因[${eff.name}]受到了 ${eff.value} 點傷害。`;
					monster.hp = Math.max(0, monster.hp - eff.value);
				} else if (eff.type === 'heal' && eff.value) {
					const finalStats = getEffectiveStats(monster); // 計算包含 buff 的上限
					monster.hp = Math.min(finalStats.hpLimit, monster.hp + eff.value);
					logMessage = `${monster.name} 因[${eff.name}]回復了 ${eff.value} 點生命。`;
				}
				if (logMessage) {
					logStore.logger.add(logMessage);
				}
			});

			// 2. 減少持續時間並過濾掉已結束的狀態
			monster.status = monster.status?.map(eff => ({
				...eff,
				duration: eff.duration === -1 ? -1 : eff.duration - 1
			}))
				.filter(eff => eff.duration !== 0);
		});
	}

	function recordThisStageAppear(key: string) {
		thisStageAppear.value = Array.from(new Set([...thisStageAppear.value, key]));
	}

	function thisStageAlreadyAppear(key: string): boolean {
		return thisStageAppear.value.includes(key)
	}


	// --- 記得導出所有要在組件中使用的東西 ---
	return {
		currentRoomValue, difficulty, isDead,
		days, nextRooms,
		currentStage,
		currentState,
		isBattleWon,
		thisStageAppear,
		currentEnemy,
		switchEnemy,
		currentEventType,
		eventProcess, otherRecord,
		getEventProcess,
		stateIs,
		roomIs,
		eventAction,
		init, transitionToNextState,
		setRoom, switchToFightRoom, switchToEventRoom, takeSwitchEnemy,
		setCurrentEnemy, setBattleWon,
		setEvent, isEventClose,
		addEventProcess, recordThisStageAppear, thisStageAlreadyAppear,
		addEffectToMonster, tickAllMonsters
	};
}, {
	persist: true // 持久化依然有效
});
