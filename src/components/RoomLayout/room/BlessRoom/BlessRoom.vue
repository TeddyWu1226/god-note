<script setup lang="ts">

import {ref} from "vue";
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import BlessOperation from "@/components/RoomLayout/room/BlessRoom/BlessOperation.vue";
import RoomTemplate from "@/components/RoomLayout/comps/RoomTemplate.vue";

const playerStore = usePlayerStore();
const gameStateStore = useGameStateStore()

const isRested = ref<boolean>(false)
const onRest = () => {
  isRested.value = true
  playerStore.healFull()
  gameStateStore.transitionToNextState()
}

defineExpose({
  onRest
})
</script>

<template>
  <RoomTemplate title="起始之泉">
    <template #default>
      <div class="general-event" style="padding: 1.5rem 1rem;">
        <div class="event-icon">⛲</div>
        <div class="dialog-box">
          <p style="margin: 0.5rem 0; font-weight: bold; color: var(--el-color-primary-light-3);">
            在小鎮的泉水散發著光輝</p>
          <p style="margin: 0.5rem 0;">欽定的勇者獲得改變世界的力量</p>
          <p style="margin: 0.5rem 0; font-style: italic; color: #909399;">開始你的旅程吧!</p>
        </div>
      </div>
    </template>
    <template #button>
      <BlessOperation></BlessOperation>
    </template>
  </RoomTemplate>
</template>

<style scoped>

</style>