<script setup lang="ts">
import {computed} from "vue";
import {getEnumColumn} from "@/utils/enum";
import {RoomEnum} from "@/enums/room-enum";
import {RoomCoordinateTuple} from "@/types";
import {getNextAvailableRooms, getRoomValue, useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";

const props = defineProps({
  disabled: Boolean,
})
const gameStateStore = useGameStateStore()
const playerStore = usePlayerStore()
const nextRooms = computed(() => {
  return getNextAvailableRooms()
})
const selectRoom = (roomXY: RoomCoordinateTuple) => {
  gameStateStore.setRoom(roomXY)
};

const goNestStage = () => {
  playerStore.healFull()
  gameStateStore.init(gameStateStore.currentStage + 1)
  gameStateStore.setRoom(gameStateStore.currentRoom)

}
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
        v-if="gameStateStore.isBattleWon && gameStateStore.roomIs(RoomEnum.Boss.value)"
        color="var(--el-color-success)"
        :disabled="props.disabled"
        @click="goNestStage"
    >
      前往下一區域🚪
    </el-button>
    <el-button
        v-else-if="nextRooms.length === 0"
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