import {defineStore} from 'pinia';
import {GameState, SpecialEventEnum} from "@/enums/enums";
import {RoomEnum} from "@/enums/room-enum";
import {computed, ref, watch, nextTick} from "vue";
import {DifficultyEnum} from "@/enums/difficulty-enum";
import {MonsterModel} from "@/models/monster-model";
import {MonsterFactory} from "@/constants/monsters/monster-factory";
import {usePlayerStore} from "@/store/player-store";

export const getEffectiveStats = (monster: any): any => {
    if (monster && typeof monster.getEffectiveStats === 'function') {
        return monster.getEffectiveStats();
    }
    return monster;
};

export const useGameStateStore = defineStore('game-state', () => {
    /** 當前所處的房間類型數值 (例如：戰鬥房、休息房、商店房、祝福房等) */
    const currentRoomValue = ref<number>(RoomEnum.Rest.value);

    /** 當前遊戲關卡/層數 (第幾大關) */
    const currentStage = ref(1);

    /** 玩家是否已死亡 */
    const isDead = ref(false);

    /** 累計生存或挑戰天數 (無限挑戰制參數) */
    const days = ref(0);

    /** 當前關卡已度過的天數/前進步數 */
    const stageDays = ref(0);

    /** 歷史最高通關關卡數 */
    const maxClearedStage = ref(0);

    /** 遊戲是否已獲得最終勝利 */
    const isVictory = ref(false);

    /** 隨機產生的後續可選房間類型列表 */
    const nextRooms = ref<number[]>([]);

    // --- 回合/戰鬥用數據 ---
    /** 當前遊戲狀態階段 (例如：初始化、探索中、事件處理中、戰鬥中、結算等) */
    const currentState = ref<GameState>(GameState.INITIAL);

    /** 當前戰鬥是否已獲勝 */
    const isBattleWon = ref(false);

    /** 當前房間中的敵方怪物列表 (MonsterModel 實例陣列) */
    const currentEnemy = ref<MonsterModel[]>([]);

    // --- 事件相關紀錄 ---
    /** 當前觸發的特殊事件類型 */
    const currentEventType = ref<SpecialEventEnum>(SpecialEventEnum.None);

    /** 上一次觸發的特殊事件類型 */
    const lastEventType = ref<SpecialEventEnum>(SpecialEventEnum.None);

    /** 特殊事件的進度紀錄表，對應各個 SpecialEventEnum 的數值進度 */
    const eventProcess = ref<Record<SpecialEventEnum, number>>({} as Record<SpecialEventEnum, number>);

    /** 當前事件中所執行的行動次數或進階狀態指標 */
    const eventAction = ref(0);

    /** 本大關已出現過的怪物名稱或 ID 列表 (避免重複或用於紀錄) */
    const thisStageAppear = ref<string[]>([]);

    /** 戰鬥中後備或準備切換登場的敵方怪物列表 */
    const switchEnemy = ref<MonsterModel[]>([]);

    /** 當前遊戲難度數值 (簡單、普通、困難等) */
    const difficulty = ref(DifficultyEnum.Normal.value);

    /** 額外記錄表，用於存放暫存的特殊機制、任務或小遊戲變數 */
    const otherRecord = ref<Record<string, any>>({});

    /** 當前戰鬥的累計回合數 */
    const battleRound = ref(1);

    /** 玩家在當前戰鬥回合剩餘的可用行動點數 (AP) */
    const playerActionPoints = ref(0);

    /** 是否為玩家的行動回合 */
    const isPlayerTurn = ref(true);

    /** 用於刷新房間的ID */
    const roomId = ref(0);

    /** 下方面板的顯示模式：'backpack' (顯示背包) 或 'skills' (顯示技能) */
    const bottomPanelMode = ref<'backpack' | 'skills'>('skills');

    /** 是否正在進行全螢幕震動 */
    const isScreenShaking = ref(false);

    /** 觸發全螢幕震動 */
    function triggerScreenShake(duration = 300): void {
        isScreenShaking.value = false;
        nextTick(() => {
            isScreenShaking.value = true;
            setTimeout(() => {
                isScreenShaking.value = false;
            }, duration);
        });
    }

    // 深度監聽敵怪數據，自動重構為 Class 實例
    watch(() => currentEnemy.value, (newVal) => {
        if (newVal) {
            for (let i = 0; i < newVal.length; i++) {
                if (newVal[i] && !(newVal[i] instanceof MonsterModel)) {
                    // @ts-ignore
                    currentEnemy.value[i] = MonsterFactory.createMonster(newVal[i].code, newVal[i]);
                }
            }
        }
    }, {deep: true, immediate: true});

    watch(() => switchEnemy.value, (newVal) => {
        if (newVal) {
            for (let i = 0; i < newVal.length; i++) {
                if (newVal[i] && !(newVal[i] instanceof MonsterModel)) {
                    // @ts-ignore
                    switchEnemy.value[i] = MonsterFactory.createMonster(newVal[i].code, newVal[i]);
                }
            }
        }
    }, {deep: true, immediate: true});

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
        if (stageNum === 1 || restart) {
            currentState.value = GameState.INITIAL;
            isDead.value = false;
            isVictory.value = false;
            days.value = 0;
            maxClearedStage.value = 0;
            currentRoomValue.value = RoomEnum.Rest.value;
        }
        stageDays.value = 0;
        roomId.value = 0;
        thisStageAppear.value = []
        currentStage.value = stageNum;
        isBattleWon.value = false;
        currentEnemy.value = [];
        switchEnemy.value = [];
        nextRooms.value = [];
        currentEventType.value = null;
        battleRound.value = 1;
        playerActionPoints.value = 0;
        isPlayerTurn.value = true;
        lastEventType.value = null;
        eventAction.value = 0
        if (restart) {
            eventProcess.value = {} as Record<SpecialEventEnum, number>;
            otherRecord.value = {}
        }
        bottomPanelMode.value = 'backpack'; // 重置時預設顯示背包
        console.log('遊戲狀態已重置');
    }

    function enterJudgmentStage(): void {
        days.value = 1001;
        stageDays.value = 0;
        currentStage.value = 6;
        currentRoomValue.value = RoomEnum.Bless.value;
        isBattleWon.value = false;
        currentEnemy.value = [];
        currentEventType.value = null;
        battleRound.value = 1;
        playerActionPoints.value = 0;
        lastEventType.value = null;
        eventAction.value = 0;
        nextRooms.value = [];
        thisStageAppear.value = [];
    }

    function setRoom(roomValue: number): void {
        roomId.value += 1
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
        const battleRooms = [RoomEnum.Fight.value, RoomEnum.EliteFight.value, RoomEnum.Boss.value];
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
    function switchToFightRoom(roomValue: number, monsters?: MonsterModel[]): void {
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

    function setCurrentEnemy(monsters: MonsterModel[]): void {
        currentEnemy.value = monsters
    }


    function takeSwitchEnemy(): MonsterModel[] {
        const enemy = [...switchEnemy.value]
        switchEnemy.value = []
        return enemy
    }

    function setBattleWon(won: boolean): void {
        const battleRooms = [RoomEnum.Fight.value, RoomEnum.EliteFight.value, RoomEnum.Boss.value];
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

    function recordThisStageAppear(key: string) {
        thisStageAppear.value = Array.from(new Set([...thisStageAppear.value, key]));
    }

    function thisStageAlreadyAppear(key: string): boolean {
        return thisStageAppear.value.includes(key)
    }


    // --- 記得導出所有要在組件中使用的東西 ---
    return {
        currentRoomValue, difficulty, isDead,
        days, stageDays, maxClearedStage, isVictory, nextRooms,
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
        roomId,
        eventAction,
        battleRound,
        playerActionPoints,
        isPlayerTurn,
        refillActionPoints,
        bottomPanelMode,
        isScreenShaking,
        triggerScreenShake,
        init, transitionToNextState,
        setRoom, switchToFightRoom, switchToEventRoom, takeSwitchEnemy,
        setCurrentEnemy, setBattleWon,
        setEvent, isEventClose,
        addEventProcess, recordThisStageAppear, thisStageAlreadyAppear,
        enterJudgmentStage
    };
}, {
    persist: {
        omit: ['isScreenShaking']
    }
});
