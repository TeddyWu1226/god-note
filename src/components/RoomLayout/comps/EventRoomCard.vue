<script setup lang="ts">
import {computed, onMounted} from 'vue';
import {useGameStateStore} from "@/store/game-state-store";
import {eventComponentMap} from "@/components/RoomLayout/event/useEventRoom";
import {SpecialEventEnum} from "@/enums/enums";


// 假設您的 Store 中有一個屬性 currentEventType 決定當前事件
const gameStateStore = useGameStateStore();
const currentEventType = computed(() => gameStateStore.getCurrentEventType);

// 動態載入當前事件組件
const currentEventComponent = computed(() => {
  // 根據 Store 中的類型，從映射中取得對應的 Vue 組件
  return eventComponentMap[currentEventType.value as SpecialEventEnum] || null;
});

// 房間初始化邏輯 (確保每次進入房間都重置事件狀態，如果需要)
const initializeEventRoom = () => {
  // 可以在這裡做一些通用處理，例如：紀錄玩家進入特殊房間
  console.log(`進入特殊事件房間：${currentEventType.value}`);
};

onMounted(initializeEventRoom);

// 如果您想讓事件類型變化時也重新初始化，可以添加 watch：
// watch(currentEventType, initializeEventRoom);

</script>

<template>
  <component
      :is="currentEventComponent"
      v-if="currentEventComponent"
      :key="currentEventType"
  />
</template>

<style scoped>
</style>