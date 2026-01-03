<script setup lang="ts">
import {computed, onMounted} from 'vue';
import {useGameStateStore} from "@/store/game-state-store";
import {eventComponentMap} from "@/components/RoomLayout/event/useEventRoom";
import {SpecialEventEnum} from "@/enums/enums";
import {usePlayerStore} from "@/store/player-store";
import {CharEnum} from "@/enums/char-enum";
import {useTrackerStore} from "@/store/track-store";

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();
const trackerStore = useTrackerStore();
/**
 * 事件配置表：控制隨機權限
 */
const EVENT_CONFIG = [
  {
    type: SpecialEventEnum.Gamble,
    canAppear: () => true
  },
  {
    type: SpecialEventEnum.Chest,
    canAppear: () => true
  },
  {
    type: SpecialEventEnum.Potion,
    canAppear: () => true
  },
  {
    type: SpecialEventEnum.GetFruit, // 魔樹事件
    canAppear: () => !gameStateStore.thisStageAlreadyAppear(SpecialEventEnum.GetFruit) &&
        !gameStateStore.isEventClose(SpecialEventEnum.GetFruit)
  },
  {
    type: SpecialEventEnum.JobWarrior, // 劍士轉職事件
    canAppear: () => {
      if (playerStore.info.char !== CharEnum.Beginner.value) {
        return false;
      }
      return trackerStore.getKillCount("USE_SWORD", 'total') >= 10;
    }
  },
  {
    type: SpecialEventEnum.JobWizard, // 法師轉職事件
    canAppear: () => {
      if (playerStore.info.char !== CharEnum.Beginner.value) {
        return false;
      }
      return playerStore.finalStats.apIncrease > 10
    }
  }
];


/**
 * 獲取當前允許的所有隨機事件
 */
const getAvailableEvents = () => {
  // 過濾出所有符合出現條件的事件 Type
  return EVENT_CONFIG
      .filter(event => event.canAppear())
      .map(event => event.type);
};

/**
 * 隨機抽取事件
 */
const pickRandomEvent = () => {
  const pool = getAvailableEvents();
  console.log('pool', pool)
  // 設置防錯，如果沒有可用事件則給一個預設
  if (pool.length === 0) return SpecialEventEnum.Gamble;

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
};

// 初始化邏輯
const initializeEventRoom = () => {
  // 只有當前還沒有事件時才初始化，避免在某些情況下組件重新渲染導致事件變更
  if (!gameStateStore.currentEventType) {
    const selectedEvent = pickRandomEvent();
    gameStateStore.setEvent(selectedEvent);
  }
};

// 動態載入當前事件組件
const currentEventComponent = computed(() => {
  return eventComponentMap[gameStateStore.currentEventType as SpecialEventEnum] || null;
});
onMounted(() => {
  initializeEventRoom();
});
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