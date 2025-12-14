<script setup lang="ts">
import {computed, ref} from "vue";
import {Floor, getNextAvailableRooms, getRoomValue} from "@/storage/floor-storage";
import {getEnumColumn} from "@/utils/enum";
import {RoomEnum} from "@/enums/room-enum";
import {RoomCoordinateTuple} from "@/types";
import {useGameStateStore} from "@/store/game-state-store";

const emit = defineEmits(['attack']);
const props = defineProps({
  disabled: Boolean,
})
const gameStateStore = useGameStateStore()
const nextRooms = computed(() => {
  return getNextAvailableRooms()
})
const selectRoom = (roomXY: RoomCoordinateTuple) => {
  Floor.value.currentRoom = roomXY
  gameStateStore.setRoomValue(getRoomValue(roomXY))

};
</script>

<template>
  <div class="flex">
    <el-button
        v-for="room in nextRooms"
        :color="getEnumColumn(RoomEnum, getRoomValue(room),'color')"
        :disabled="props.disabled"
        @click="selectRoom(room)"
    >
      <span>前往下一層:</span>
      <span>
        {{ getEnumColumn(RoomEnum, getRoomValue(room), 'icon') }}
        {{ getEnumColumn(RoomEnum, getRoomValue(room)) }}
      </span>
    </el-button>
  </div>
</template>

<style scoped>
</style>