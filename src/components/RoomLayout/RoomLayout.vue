<script setup lang="ts">

import {getEnumColumn} from "@/utils/enum";
import {RoomEnum} from "@/enums/room-enum";
import {computed, ref, watch} from "vue";
import {useGameStateStore} from "@/store/game-state-store";
import RestRoom from "@/components/RoomLayout/comps/RestRoom.vue";
import FightRoom from "@/components/RoomLayout/comps/FightRoom.vue";

const emit = defineEmits(['playerDead'])
const gameStateStore = useGameStateStore()

const currentRoomValue = computed(() => {
      return gameStateStore.currentRoomValue
    }
)
const onPlayerDead = () => {
  emit('playerDead')
}
/** 戰鬥房間 **/
const FightRoomRef = ref()
// 攻擊
const onAttack = () => {
  FightRoomRef.value.onAttack()
}


/** 休息房間 **/
const RestRoomRef = ref()
const onRest = () => {
  RestRoomRef.value?.onRest()
}


/** 綜合取消 **/
const onCancel = () => {
  switch (currentRoomValue.value) {
    case RoomEnum.Rest.value:
      gameStateStore.transitionToNextState()
      break;
  }
}

defineExpose({
  onAttack,
  onRest,
  onCancel
})

/** 初始化刷新 **/
const roomKeyCounter = ref(0)

// **【新增】監聽房間狀態變化的 watch**
// 假設 gameStateStore.currentRoomValue 是在每次切換房間後更新的。
watch(() => gameStateStore.currentRoom,
    () => {
      roomKeyCounter.value++
    },
    {
      immediate: true,
      deep: true
    }) // 確保在組件第一次加載時也能觸發計數
</script>

<template>
  <el-card>
    <div class="title">
      {{ getEnumColumn(RoomEnum, currentRoomValue, 'icon') }}
      {{ getEnumColumn(RoomEnum, currentRoomValue) }}
    </div>
    <FightRoom
        class="fight"
        ref="FightRoomRef"
        v-if="currentRoomValue === RoomEnum.Fight.value ||currentRoomValue === RoomEnum.EliteFight.value"
        @player-dead="onPlayerDead"
        :key="roomKeyCounter"
    />
    <RestRoom ref="RestRoomRef" v-if="currentRoomValue === RoomEnum.Rest.value" :key="roomKeyCounter"/>
  </el-card>
</template>

<style scoped>
:root {
  --delay: 0.3s
}

.title {
  font-size: 1.2rem;
}


</style>