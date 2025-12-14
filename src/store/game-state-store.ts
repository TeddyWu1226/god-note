import {defineStore} from 'pinia';
import {GameState} from "@/enums/enums";
import {RoomEnum} from "@/enums/room-enum";
import {Monster} from "@/assets/monster-info";

type MonsterKey = keyof typeof Monster

export const useGameStateStore = defineStore('game-state', {

    // ----------------------------------------------------
    // 2. State (對應原本的 private ref 屬性)
    // ----------------------------------------------------
    state: () => ({
        // 當前房間類型 (currentRoomType)
        currentRoomValue: RoomEnum.Rest.value as number,
        // 回合子階段 (currentState)
        currentState: GameState.INITIAL as GameState,
        // 戰鬥勝利狀態 (isBattleWon)
        isBattleWon: false as boolean,
        currentEnemy: [] as string[] // 怪物標籤key
    }),

    // ----------------------------------------------------
    // 3. Getters (對應原本的 public getter 方法和 stateIs)
    // ----------------------------------------------------
    getters: {
        // 直接返回 state 屬性，Pinia 會自動處理響應性
        getCurrentRoomType: (state) => state.currentRoomValue,
        getCurrentState: (state) => state.currentState,
        isWon: (state) => state.isBattleWon,
        getCurrentEnemy: (state) => state.currentEnemy,
        /** 檢查當前狀態是否為指定的狀態。 */
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
            this.currentState = GameState.INITIAL;
            this.currentRoomValue = RoomEnum.Rest.value;
            this.isBattleWon = false;
            this.currentEnemy = []
            console.log('遊戲狀態管理器初始化完成。');
        },
        /**
         * 配置當前的房間/回合類型。
         * @param roomValue RoomEnum 中的任一類型值
         */
        setRoomValue(roomValue: number): number {
            this.currentRoomValue = roomValue;

            // 重置勝利狀態
            this.isBattleWon = false;
            console.log(`回合類型配置為: ${roomValue}`);
            this.transitionToNextState()
            return this.currentRoomValue;
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
        }
    },
});