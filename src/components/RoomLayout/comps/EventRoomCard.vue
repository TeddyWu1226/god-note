<script setup lang="ts">
import {computed, onMounted} from 'vue';
import {useGameStateStore} from "@/store/game-state-store";
import {eventComponentMap} from "@/components/RoomLayout/event/useEventRoom";
import {SpecialEventEnum} from "@/enums/enums";
import {usePlayerStore} from "@/store/player-store";
import {CharEnum} from "@/enums/char-enum";
import {useTrackerStore} from "@/store/track-store";
import {Material} from "@/constants/items/material/material-info";
import {Usable} from "@/constants/items/usalbe-item/usable-info";
import {Monster} from "@/constants/monsters/monster-info";

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();
const trackerStore = useTrackerStore();
/**
 * 事件配置表：控制隨機權限
 */
const GeneralEvent = [
  {
    type: SpecialEventEnum.Gamble,
    canAppear: () => playerStore.info.gold >= 50
  },
  {
    type: SpecialEventEnum.Chest,
    canAppear: () => true
  },
  {
    type: SpecialEventEnum.GetFruit, // 魔樹事件
    canAppear: () => !gameStateStore.thisStageAlreadyAppear(SpecialEventEnum.GetFruit)
  },
];


const getAvailableEvents = () => {
  // 過濾出所有符合出現條件的事件 Type
  let allowEvent = [...GeneralEvent]

  // 計算區域索引 (1-25)
  const subZoneIdx = Math.min(4, Math.floor((Math.max(1, gameStateStore.stageDays) - 1) / 20))
  const oldStageIndex = (gameStateStore.currentStage - 1) * 5 + 1 + subZoneIdx

  if (oldStageIndex >= 11) {
    // 山區開始提供樹叢事件
    allowEvent.push({
      type: SpecialEventEnum.BushSearch,
      canAppear: () => oldStageIndex >= 11
    })
  }

  return allowEvent
      .filter(event => !gameStateStore.isEventClose(event.type))
      .filter(event => event.canAppear())
      .filter(event => event.type !== gameStateStore.lastEventType)
      .map(event => event.type);
};

/**
 * 隨機抽取事件
 */
const pickRandomEvent = () => {
  let pool = getAvailableEvents();
  console.log('pool', pool)
  // 設置防錯，如果沒有可用事件則給一個預設
  if (pool.length === 0) return SpecialEventEnum.Gamble;
  // 強制事件
  if (pool.includes(SpecialEventEnum.Fusion)) {
    pool = [SpecialEventEnum.Fusion]
  }
  const randomIndex = Math.floor(Math.random() * pool.length);
  console.log('pool[randomIndex]', pool[randomIndex])
  return pool[randomIndex] ?? SpecialEventEnum.Gamble;
};

// 初始化邏輯
const initializeEventRoom = () => {
  // 只有當前還沒有事件時才初始化，避免在某些情況下組件重新渲染導致事件變更
  console.log('觸發了', gameStateStore.currentEventType)
  if (!gameStateStore.currentEventType) {
    const selectedEvent = pickRandomEvent();
    gameStateStore.setEvent(selectedEvent);
  }
};

// 動態載入當前事件組件
const currentEventComponent = computed(() => {
  return eventComponentMap[gameStateStore.currentEventType as SpecialEventEnum] || null;
});

initializeEventRoom();
</script>

<template>
  <component
      :is="currentEventComponent"
      v-if="currentEventComponent"
      :key="gameStateStore.currentEventType"
  />
</template>

<style scoped>
</style>