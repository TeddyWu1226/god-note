<script setup lang="ts">
import {computed} from "vue";
import {getEnumColumn} from "@/utils/enum";
import {RoomEnum} from "@/enums/room-enum";
import {RoomCoordinateTuple} from "@/types";
import {getNextAvailableRooms, getRoomValue, useGameStateStore} from "@/store/game-state-store";

const props = defineProps({
  disabled: Boolean,
})
const gameStateStore = useGameStateStore()
const nextRooms = computed(() => {
  return getNextAvailableRooms()
})
const selectRoom = (roomXY: RoomCoordinateTuple) => {
  gameStateStore.setRoom(roomXY)

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
      <el-row>
        <el-col :xl="10">前往:</el-col>
        <el-col :xl="14">
          {{ getEnumColumn(RoomEnum, getRoomValue(room), 'icon') }}
          {{ getEnumColumn(RoomEnum, getRoomValue(room)) }}
        </el-col>
      </el-row>
    </el-button>
    <el-button
        v-if="nextRooms.length === 0"
        :color="getEnumColumn(RoomEnum, getRoomValue([gameStateStore.currentRoom[0]+1,0]),'color')"
        :disabled="props.disabled"
        @click="selectRoom([gameStateStore.currentRoom[0]+1,0])"
    >
      <el-row>
        <el-col :xl="10">前往:</el-col>
        <el-col :xl="14">
          {{ getEnumColumn(RoomEnum, getRoomValue([gameStateStore.currentRoom[0] + 1, 0]), 'icon') }}
          {{ getEnumColumn(RoomEnum, getRoomValue([gameStateStore.currentRoom[0] + 1, 0])) }}
        </el-col>
      </el-row>
    </el-button>
  </div>
</template>

<style scoped>
</style>