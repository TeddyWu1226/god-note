import {defineStore} from 'pinia';
import {GameState, SpecialEventEnum} from "@/enums/enums";
import {RoomEnum} from "@/enums/room-enum";
import {MonsterType, StatusEffect} from "@/types";
import {computed, ref, watch} from "vue";
import {useLogStore} from "@/store/log-store";
import {DifficultyEnum} from "@/enums/difficulty-enum";
import {Monster} from "@/models/monster";
import {usePlayerStore} from "@/store/player-store";

export const getEffectiveStats = (monster: MonsterType): MonsterType => {
	if (monster instanceof Monster) {
		return monster.getEffectiveStats();
	}

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
	if (!monster.status) {
		monster.status = []
	}
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
	const lastEventType = ref<SpecialEventEnum>(SpecialEventEnum.None);
	const eventProcess = ref<Record<SpecialEventEnum, number>>({} as Record<SpecialEventEnum, number>);
	const eventAction = ref(0)
	const thisStageAppear = ref<string[]>([])
	const switchEnemy = ref<MonsterType[]>([]);
	const difficulty = ref(DifficultyEnum.Normal.value);
	const otherRecord = ref<Record<string, any>>({}); // 額外記錄表
	const battleRound = ref(1); // 戰鬥回合數
	const playerActionPoints = ref(0); // 玩家當前行動點數
	const bottomPanelMode = ref<'backpack' | 'skills'>('skills'); // 下方區塊模式: backpack (背包) 或 skills (技能)

	// 深度監聽敵怪數據，自動重構為 Class 實例
	watch(currentEnemy, (newVal) => {
		if (newVal) {
			for (let i = 0; i < newVal.length; i++) {
				if (newVal[i] && !(newVal[i] instanceof Monster)) {
					newVal[i] = new Monster(newVal[i]);
				}
			}
		}
	}, { deep: true, immediate: true });

	watch(switchEnemy, (newVal) => {
		if (newVal) {
			for (let i = 0; i < newVal.length; i++) {
				if (newVal[i] && !(newVal[i] instanceof Monster)) {
					newVal[i] = new Monster(newVal[i]);
				}
			}
		}
	}, { deep: true, immediate: true });

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
		battleRound.value = 1;
		playerActionPoints.value = 0;
		lastEventType.value = null;
		eventAction.value = 0
		if (restart) {
			eventProcess.value = {} as Record<SpecialEventEnum, number>;
			otherRecord.value = {}
		}
		bottomPanelMode.value = 'backpack'; // 重置時預設顯示背包
		console.log('遊戲狀態已重置');
	}

	function setRoom(roomValue: number): void {
		currentRoomValue.value = roomValue ?? RoomEnum.Fight.value;
		isBattleWon.value = false;
		currentEnemy.value = [];
		currentState.value = GameState.EVENT_PHASE;
		// 重製事件
		currentEventType.value = null;
		eventAction.value = 0;
		battleRound.value = 1;
		playerActionPoints.value = 0;
		// 進入房間時判定：如果是戰鬥房間且玩家擁有主動技能，預設開啟技能面板，否則開啟背包面板
		const playerStore = usePlayerStore();
		const battleRooms = [RoomEnum.Fight.value, RoomEnum.EliteFight.value, RoomEnum.Boss.value, RoomEnum.SpecialBoss.value];
		const hasActiveSkills = playerStore.info.skills?.some((s: any) => s.type === 'active');
		if (battleRooms.includes(roomValue) && hasActiveSkills) {
			bottomPanelMode.value = 'skills';
		} else {
			bottomPanelMode.value = 'backpack';
		}
	}

	function refillActionPoints(): void {
		const playerStore = usePlayerStore();
		playerActionPoints.value = Math.floor((playerStore.finalStats.actionValue ?? 50) / 50);
	}

	/**
	 * 突然切換至戰鬥房間
	 * @param roomValue
	 * @param monsters
	 */
	function switchToFightRoom(roomValue: number, monsters?: MonsterType[]): void {
		if (monsters) {
			switchEnemy.value = monsters;
		}
		setRoom(roomValue);
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
		const enemy = [...switchEnemy.value]
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
				bottomPanelMode.value = 'backpack'; // 戰鬥勝利結算時，切換回背包模式以查看掉落物
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
		lastEventType.value = event;
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
	function addEffectToMonster(monster: MonsterType, effect: StatusEffect) {
		if (!monster) return;
		if (monster instanceof Monster) {
			monster.addEffect(effect, useLogStore());
		} else {
			const logStore = useLogStore();
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
	}

	/**
	 * 每回合觸發：更新所有怪物狀態
	 */
	function tickAllMonsters() {
		const logStore = useLogStore();
		currentEnemy.value.forEach(monster => {
			if (monster.hp <= 0) return;

			if (monster instanceof Monster) {
				// 處理 DoT/HoT 等狀態效果
				monster.tickEffects(logStore);
				// 處理回合習性行為
				monster.executeRoundBehavior(battleRound.value, logStore);
			} else {
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
			}
		});

		// 增加回合數
		battleRound.value += 1;
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
		lastEventType,
		eventProcess, otherRecord,
		getEventProcess,
		stateIs,
		roomIs,
		eventAction,
		battleRound,
		playerActionPoints,
		refillActionPoints,
		bottomPanelMode,
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
