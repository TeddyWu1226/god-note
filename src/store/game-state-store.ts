import {defineStore} from 'pinia';
import {GameState, SpecialEventEnum} from "@/enums/enums";
import {RoomEnum} from "@/enums/room-enum";
import {MonsterType, RoomCoordinateTuple, TrapezoidData} from "@/types";
import {createTrapezoidDataWithWeights} from "@/utils/create-floor";
import {DEFAULT_ROOM_WEIGHTS} from "@/constants/default-const";
import {computed, ref} from "vue";


export const useGameStateStore = defineStore('game-state', () => {
    // --- State (用 ref 代替) ---
    const currentRoomValue = ref<number>(RoomEnum.Rest.value);
    const currentRoom = ref<RoomCoordinateTuple>([1, 0]);
    const currentStage = ref(1);
    const currentStageRooms = ref<TrapezoidData>([]);
    const currentState = ref<GameState>(GameState.INITIAL);
    const isBattleWon = ref(false);
    const currentEnemy = ref<MonsterType[]>([]);
    const currentEventType = ref<SpecialEventEnum>(SpecialEventEnum.None);
    const eventProcess = ref<Record<SpecialEventEnum, number>>({} as Record<SpecialEventEnum, number>);

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

    // --- Actions (用普通 function 代替) ---
    function init(stageNum = 1): void {
        if (stageNum === 1) {
            currentState.value = GameState.INITIAL;
            currentRoomValue.value = RoomEnum.Rest.value;
        }
        currentStageRooms.value = createTrapezoidDataWithWeights(DEFAULT_ROOM_WEIGHTS, 19, 17);
        isBattleWon.value = false;
        currentEnemy.value = [];
        currentEventType.value = SpecialEventEnum.None;
        eventProcess.value = {} as Record<SpecialEventEnum, number>;

        currentStage.value = stageNum;
        currentRoom.value = [1, 0];
        console.log('遊戲狀態已重置 (Setup Store):', stageNum);
    }

    function setRoom(room: RoomCoordinateTuple): void {
        currentRoom.value = room;
        currentRoomValue.value = getRoomValue(room) ?? RoomEnum.Rest.value;
        isBattleWon.value = false;
        currentEnemy.value = [];
        currentEventType.value = SpecialEventEnum.None;
        currentState.value = GameState.EVENT_PHASE;
    }

    function setCurrentEnemy(monsters: MonsterType[]): void {
        // 使用深拷貝防止引用污染
        currentEnemy.value = monsters
    }

    function setBattleWon(won: boolean): void {
        const battleRooms = [RoomEnum.Fight.value, RoomEnum.EliteFight.value, RoomEnum.Boss.value];
        if (battleRooms.includes(currentRoomValue.value)) {
            isBattleWon.value = won;
            if (won) {
                currentEnemy.value = [];
                transitionToNextState();
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

    // --- 記得導出所有要在組件中使用的東西 ---
    return {
        currentRoomValue,
        currentRoom,
        currentStage,
        currentStageRooms,
        currentState,
        isBattleWon,
        currentEnemy,
        currentEventType,
        eventProcess,
        getEventProcess,
        stateIs,
        roomIs,
        init, setRoom, setCurrentEnemy, setBattleWon, transitionToNextState, setEvent, isEventClose, addEventProcess
    };
}, {
    persist: true // 持久化依然有效
});

/**
 * 根據房間座標，從當前樓層資料中獲取該房間的數值（標記/權重）。
 *
 * @param coordinate 房間的座標元組 [layer, index] (layer 從 1 開始，index 從 0 開始)。
 * @returns 該房間的數值 (number)，如果座標無效則返回 null 或 -1 (取決於您的錯誤處理偏好)。
 */
export function getRoomValue(coordinate: RoomCoordinateTuple): number | null {

    const [layer, index] = coordinate;
    const roomsData: TrapezoidData = useGameStateStore().currentStageRooms;
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
    const [layer, currentRoomIndex] = gameStateStore.currentRoom;
    const currentStageRooms = gameStateStore.currentStageRooms;
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