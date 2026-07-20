<script setup lang="ts">

import {ref} from "vue";
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import BlessOperation from "@/components/RoomLayout/room/BlessRoom/BlessOperation.vue";
import RoomTemplate from "@/components/RoomLayout/comps/RoomTemplate.vue";
import {RoomEnum} from "@/enums/room-enum";
import '@/components/RoomLayout/room.css'
const playerStore = usePlayerStore();
const gameStateStore = useGameStateStore()

const isRested = ref<boolean>(false)
const onRest = () => {
  isRested.value = true
  playerStore.healFull()
  gameStateStore.setRoom(RoomEnum.MainEvent.value)
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
          <p>
            在熙熙攘攘的廣場，中央的泉水散發著光輝
          </p>
          <p >欽定之人受其吸引而獲得力量</p>
          <p class="special-item-text shine">開始你的旅程吧!</p>
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