<script setup lang="ts">

import {useGameStateStore} from "@/store/game-state-store";
import {SpecialEventEnum} from "@/enums/enums";
import {ref} from "vue";
import {RoomEnum} from "@/enums/room-enum";

const gameStateStore = useGameStateStore();
const emit = defineEmits(['rest', 'cancel']);
const props = defineProps({
  disabled: Boolean,
})
/**狀態紀錄**/
const rest = (): void => {
  if (gameStateStore.roomIs(RoomEnum.Fusion.value)) {
    gameStateStore.setRoom(RoomEnum.Rest.value)
  } else {
    emit('rest');
  }
}

const fusion = (): void => {
  gameStateStore.setRoom(RoomEnum.Fusion.value)
}


const cancel = (): void => {
  emit('cancel');
}
</script>

<template>
  <div class="flex">
    <el-button type="success" :disabled="props.disabled" @click="rest">
      休息一下
    </el-button>
    <template v-if="gameStateStore.isEventClose(SpecialEventEnum.Fusion) && gameStateStore.roomIs(RoomEnum.Rest.value)">
      <el-button
          type="warning"
          :disabled="props.disabled"
          @click="fusion">
        合成
      </el-button>
    </template>
    <el-button type="info" :disabled="props.disabled" @click="cancel">
      繼續趕路
    </el-button>
  </div>
</template>

<style scoped>
</style>