import {defineStore} from 'pinia';
import {GameState, SpecialEventEnum} from "@/enums/enums";
import {RoomEnum} from "@/enums/room-enum";
import {Monster} from "@/assets/monster-info";
import {RoomCoordinateTuple, TrapezoidData} from "@/types";
import {createTrapezoidDataWithWeights} from "@/utils/create-floor";
import {DEFAULT_ROOM_WEIGHTS} from "@/assets/default-const";

type MonsterKey = keyof typeof Monster

export const useGameStateStore = defineStore('game-state', {

	// ----------------------------------------------------
	// 2. State (對應原本的 private ref 屬性)
	// ----------------------------------------------------
	state: () => ({
		// 當前房間類型 (currentRoomType)
		currentRoomValue: RoomEnum.Rest.value as number,
		currentRoom: [1, 0] as RoomCoordinateTuple,
		// 階段
		currentStage: 1,
		currentStageRooms: [] as TrapezoidData,
		// 回合子階段 (currentState)
		currentState: GameState.INITIAL as GameState,
		// 戰鬥勝利狀態 (isBattleWon)
		isBattleWon: false as boolean,
		currentEnemy: [] as string[], // 怪物標籤key
		// 當前特殊事件標籤
		currentEventType: SpecialEventEnum.None as SpecialEventEnum
	}),

	// ----------------------------------------------------
	// 3. Getters (對應原本的 public getter 方法和 stateIs)
	// ----------------------------------------------------
	getters: {
		/**
		 * 返回屬性
		 * */
		getCurrentRoomValue: (state) => state.currentRoomValue,
		getCurrentRoom: (state) => state.currentRoom,
		getCurrentStageRooms: (state) => state.currentStageRooms,
		getCurrentStage: (state) => state.currentStage,
		getCurrentState: (state) => state.currentState,
		isWon: (state) => state.isBattleWon,
		getCurrentEnemy: (state) => state.currentEnemy,
		getCurrentEventType: (state) => state.currentEventType,
		/**
		 * 檢查當前狀態是否為指定的狀態。
		 * */
		stateIs: (state) => (stateToCheck: GameState): boolean => {
			return state.currentState === stateToCheck;
		},
		roomIs: (state) => (roomValue: number | number[]): boolean => {
			if (Array.isArray(roomValue)) {
				return roomValue.includes(state.currentRoomValue)
			} else {
				return state.currentRoomValue === roomValue;
			}

		},
	},

	// ----------------------------------------------------
	// 4. Actions (對應原本的所有 public setter 和控制方法)
	// ----------------------------------------------------
	actions: {
		/**
		 * 初始化流程 (重置所有狀態)
		 */
		init(): void {
			this.currentStage = 1
			// 房間重製
			this.currentRoomValue = RoomEnum.Rest.value;
			this.currentRoom = [1, 0]
			this.currentStageRooms = createTrapezoidDataWithWeights(DEFAULT_ROOM_WEIGHTS, 19, 17)
			// 階段重製
			this.currentState = GameState.INITIAL;
			this.isBattleWon = false;
			this.currentEnemy = []
			console.log('遊戲狀態管理器初始化完成。');
		},
		/**
		 * 配置當前的房間/回合類型。
		 * @param room RoomEnum 中的任一類型值
		 */
		setRoom(room: RoomCoordinateTuple): number {
			// 設定房間
			this.currentRoom = room
			this.currentRoomValue = getRoomValue(room);
			// 重置勝利狀態
			this.isBattleWon = false;
			this.transitionToNextState()
			return this.currentRoomValue;
		},
		/**
		 * 配置階段的所有房間。
		 * @param rooms RoomEnum 中的任一類型值
		 */
		setStageRooms(rooms: TrapezoidData): void {
			this.currentStageRooms = rooms;
		},
		/**
		 * 配置當前怪物資訊
		 * @param monsters RoomEnum 中的任一類型值
		 */
		setCurrentEnemy(monsters: MonsterKey[]): MonsterKey[] {
			this.currentEnemy = monsters;
			return this.currentEnemy;
		},
		/**
		 * 配置戰鬥是否勝利。
		 * 只有當前的房間類型為戰鬥時，設置才有效。
		 * @param won 戰鬥是否勝利
		 */
		setBattleWon(won: boolean): void {
			const currentType = this.currentRoomValue;

			if (currentType === RoomEnum.Fight.value ||
				currentType === RoomEnum.EliteFight.value ||
				currentType === RoomEnum.Boss.value) {
				this.isBattleWon = won;
				// ⭐️ 勝利後切換到下一個狀態
				if (won) {
					this.transitionToNextState();
				}
			}
		},
		/**
		 * 進入下一個輪迴狀態。
		 */
		transitionToNextState(): GameState {
			let nextState: GameState;

			switch (this.currentState) {
				case GameState.INITIAL:
				case GameState.SELECTION_PHASE:
					// 從初始或選擇階段進入事件階段 (輪迴起點)
					nextState = GameState.EVENT_PHASE;
					break;

				case GameState.EVENT_PHASE:
					// 從事件階段進入選擇階段
					nextState = GameState.SELECTION_PHASE;
					break;

				default:
					console.error("狀態機錯誤：遇到未知的狀態！");
					return this.currentState;
			}

			// 更新 state，觸發響應性
			this.currentState = nextState;
			return this.currentState;
		},
		/**
		 * 設置特殊事件。
		 */
		setEvent(event: SpecialEventEnum = SpecialEventEnum.None) {
			this.currentEventType = event
		},
	},
});


/**
 * 根據房間座標，從當前樓層資料中獲取該房間的數值（標記/權重）。
 *
 * @param coordinate 房間的座標元組 [layer, index] (layer 從 1 開始，index 從 0 開始)。
 * @returns 該房間的數值 (number)，如果座標無效則返回 null 或 -1 (取決於您的錯誤處理偏好)。
 */
export function getRoomValue(coordinate: RoomCoordinateTuple): number | null {

	const [layer, index] = coordinate;
	const roomsData: TrapezoidData = useGameStateStore().getCurrentStageRooms;
	const maxLayers = roomsData.length;

	// 1. 檢查層次有效性 (1-based)
	// 確保 layer 在 1 到 maxLayers 之間
	if (layer < 1 || layer > maxLayers) {
		console.error(`查詢失敗：層次編號 ${layer} 超出範圍 [1, ${maxLayers}]。`);
		return null;
	}

	// 將 1-based 的 layer 轉換為 0-based 的陣列索引
	const layerIndex = layer - 1;

	// 2. 檢查房間索引有效性 (0-based)
	const targetLayer = roomsData[layerIndex];

	if (!targetLayer || index < 0 || index >= targetLayer.length) {
		console.error(`查詢失敗：層次 ${layer} 的房間索引 ${index} 超出範圍 [0, ${targetLayer?.length ?? '?'}-1]。`);
		return null;
	}

	// 3. 返回房間數值
	return targetLayer[index];
}

/**
 * 根據當前房間座標 [layer, index]，返回下一層可選房間的座標。
 * 邏輯根據層數切換：
 * - Layer 1-8：使用 j, j+1, j+2 進行擴展。
 * - Layer 9+：使用 j-1, j, j+1 進行固定寬度連接。
 *
 * @returns 一個包含下層房間座標元組的陣列。
 */
export function getNextAvailableRooms(): RoomCoordinateTuple[] {
	const gameStateStore = useGameStateStore();

	// layer 是 1-based (從 1 開始)
	const [layer, currentRoomIndex] = gameStateStore.getCurrentRoom;
	const currentStageRooms = gameStateStore.getCurrentStageRooms;
	const maxLayers = currentStageRooms.length;
	const availableCoordinates: RoomCoordinateTuple[] = [];

	// --- 1. 邊界檢查：是否已達終點 ---
	if (layer >= maxLayers) {
		console.log(`已達最大層次 (${maxLayers})，無法向下移動。`);
		return [];
	}

	// --- 2. 獲取下一層資訊 ---
	const nextLayerNumber = layer + 1;
	// 陣列索引是 layer (因為 layer 從 1 開始)
	// 假設 currentStageRooms[layer] 總是下一層的數據
	const nextLayerSize = currentStageRooms[layer].length;

	// --- 3. 確定連接範圍：根據層數切換邏輯 ---

	let loopStart: number;
	let loopEnd: number;

	// 判斷是否已進入固定寬度層 (第 9 層及之後)
	if (layer < 9) {
		// 擴展模式 (Layer 1 - 8)
		// 公式：k = j, j+1, j+2。適用於 1 -> 3 -> 5 的擴展。
		loopStart = currentRoomIndex;
		loopEnd = currentRoomIndex + 2;

	} else {
		// 固定模式 (Layer 9, 10, ...)
		// 公式：k = j-1, j, j+1。適用於 17 -> 17 的固定連接。
		loopStart = currentRoomIndex - 1;
		loopEnd = currentRoomIndex + 1;
	}

	// --- 4. 進行邊界校正和迴圈 ---

	for (let k = loopStart; k <= loopEnd; k++) {
		// 確保 k 在下一層的有效範圍內：k 必須 >= 0 且 < nextLayerSize
		if (k >= 0 && k < nextLayerSize) {
			const coordinate: RoomCoordinateTuple = [nextLayerNumber, k];
			availableCoordinates.push(coordinate);
		}
	}

	return availableCoordinates;
}