<script setup lang="ts">
import {computed} from 'vue';
import {useGameStateStore} from "@/store/game-state-store";
import {eventComponentMap} from "@/components/RoomLayout/event/useEventRoom";
import {SpecialEventEnum} from "@/enums/enums";
import {getRandomFromEnumArray} from "@/utils/create";


// 假設您的 Store 中有一個屬性 currentEventType 決定當前事件
const gameStateStore = useGameStateStore();

// 動態載入當前事件組件
const currentEventComponent = computed(() => {
  // 根據 Store 中的類型，從映射中取得對應的 Vue 組件
  return eventComponentMap[gameStateStore.currentEventType as SpecialEventEnum] || null;
});

// 隨機事件抽取
const getRandomEvent = () => {
  const availableEvent = [SpecialEventEnum.Gamble]
  // 魔樹事件
  if (!gameStateStore.isEventClose(SpecialEventEnum.GetFruit)) {
    availableEvent.push(SpecialEventEnum.GetFruit)
  }
  return getRandomFromEnumArray(availableEvent)
}

// 房間初始化邏輯 (確保每次進入房間都重置事件狀態，如果需要)
const initializeEventRoom = () => {
  gameStateStore.setEvent(getRandomEvent())
};

initializeEventRoom()

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