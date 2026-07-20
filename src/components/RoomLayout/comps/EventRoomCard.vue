<script setup lang="ts">
import {computed} from 'vue';
import {useGameStateStore} from "@/store/game-state-store";
import {eventComponentMap} from "@/components/RoomLayout/event/useEventRoom";
import {SpecialEventEnum} from "@/enums/enums";
import {usePlayerStore} from "@/store/player-store";
import {useTrackerStore} from "@/store/track-store";
import {useRelicStore} from "@/store/relic-store";
import {SpecialItem} from "@/constants/items/special-item-info";
import {Boss} from "@/constants/monsters/monster-info/99-boss-info";

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();
const trackerStore = useTrackerStore();
const relicStore = useRelicStore();

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
    type: SpecialEventEnum.BushSearch, // 草叢翻找事件
    canAppear: () => gameStateStore.currentStage === 1
  },
  {
    type: SpecialEventEnum.Potion, // 藥水事件
    canAppear: () => gameStateStore.currentStage > 1
  },
  // 背叛的隱藏任務
  {
    type: SpecialEventEnum.GetFruit, // 魔樹事件
    canAppear: () => gameStateStore.currentStage === 1
  },
  {
    type: SpecialEventEnum.EndlessBetrayal, // 無盡的背叛事件
    canAppear: () => gameStateStore.currentStage === 1 && trackerStore.isMonsterDefeated(Boss.Twilight.code) && playerStore.hasItem(SpecialItem.AvelynNecklace.name)[0]
  },
  // 憤怒的隱藏任務
  {
    type: SpecialEventEnum.DragonSkeleton, // 龍之骸骨事件
    canAppear: () => gameStateStore.currentStage === 3 && playerStore.hasItem(SpecialItem.DragonBlood.name)[0]
  },
  {
    type: SpecialEventEnum.AncientWrath, // 遠古的憤怒事件
    canAppear: () => gameStateStore.currentStage === 2 && gameStateStore.otherRecord['ANCIENT_WRATH_UNLOCKED'] === true
  },
  {
    type: SpecialEventEnum.LostAdventurer, // 迷路的冒險者事件
    // canAppear: () => gameStateStore.currentStage >= 2
    canAppear: () => true
  }
];

const SpecifyEvent = [
  {
    type: SpecialEventEnum.EndBell, // 末鐘響起事件
    canAppear: () => gameStateStore.days === 1000
  },
  {
    type: SpecialEventEnum.UnknownGrave, // 不知名的墓事件
    canAppear: () => relicStore.hasRelic && gameStateStore.stageDays === 10
  },
]


const getAvailableEvents = () => {
  // 過濾出所有符合出現條件的事件 Type
  let allowEvent = [...GeneralEvent]

  return allowEvent
      .filter(event => !gameStateStore.isEventClose(event.type))
      .filter(event => event.canAppear())
      .filter(event => event.type !== gameStateStore.lastEventType)
      .map(event => event.type);
};

const getSpecifyEvents = () => {
  // 過濾出所有符合出現條件的事件 Type
  return SpecifyEvent
      .filter(event => !gameStateStore.isEventClose(event.type))
      .filter(event => event.canAppear())
      .filter(event => event.type !== gameStateStore.lastEventType)
      .map(event => event.type);
};

/**
 * 隨機抽取事件
 */
const pickRandomEvent = () => {
  const specifyPool = getSpecifyEvents()
  let pool: SpecialEventEnum[]
  if (specifyPool.length > 0) {
    // 強制事件
    pool = specifyPool
  } else {
    pool = getAvailableEvents();
  }
  console.log('pool', pool)
  // 設置防錯，如果沒有可用事件則給一個預設
  if (pool.length === 0) return SpecialEventEnum.Gamble;
  const randomIndex = Math.floor(Math.random() * pool.length);
  // console.log('pool[randomIndex]', pool[randomIndex])
  return pool[randomIndex] ?? SpecialEventEnum.Gamble;
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