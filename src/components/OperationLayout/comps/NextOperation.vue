<script setup lang="ts">
import {onMounted, ref} from "vue";
import {getEnumColumn} from "@/utils/enum";
import {RoomEnum} from "@/enums/room-enum";
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {getRandomLabelByWeight} from "@/utils/create";
import {DEFAULT_ROOM_WEIGHTS} from "@/constants/default-const";
import {useTrackerStore} from "@/store/track-store";

const props = defineProps({
  disabled: Boolean,
})
const gameStateStore = useGameStateStore()
const playerStore = usePlayerStore()
const trackerStore = useTrackerStore()
const createNextRooms = () => {
  gameStateStore.nextRooms = []
  // 建立兩個選項
  const rooms = []
  rooms.push(getRandomLabelByWeight(DEFAULT_ROOM_WEIGHTS))
  rooms.push(getRandomLabelByWeight(DEFAULT_ROOM_WEIGHTS))
  // 去重複
  gameStateStore.nextRooms = Array.from(new Set(rooms));
}

const selectRoom = (roomValue: number) => {
  gameStateStore.setRoom(roomValue)
  gameStateStore.days += 1
  trackerStore.achievementsCount.peaceDay += 1
  gameStateStore.nextRooms = []
};

const goNextStage = () => {
  playerStore.healFull()
  trackerStore.init(false)
  gameStateStore.init(gameStateStore.currentStage + 1)
  gameStateStore.setRoom(RoomEnum.Bless.value)
  gameStateStore.nextRooms = []
}
onMounted(() => {
  if (gameStateStore.nextRooms.length > 0) {
    return
  }
  if (gameStateStore.currentRoomValue !== RoomEnum.Boss.value) {
    createNextRooms()
  }
})
</script>

<template>
  <div class="flex">
    <el-button
        v-for="room in gameStateStore.nextRooms"
        :color="getEnumColumn(RoomEnum, room,'color')"
        :disabled="props.disabled"
        @click="selectRoom(room)"
    >
      <el-row>
        <el-col :xl="10">選擇:</el-col>
        <el-col :xl="14">
          {{ getEnumColumn(RoomEnum, room, 'icon') }}
          {{ getEnumColumn(RoomEnum, room) }}
        </el-col>
      </el-row>
    </el-button>
    <el-button
        v-if="gameStateStore.isBattleWon && gameStateStore.roomIs(RoomEnum.Boss.value)"
        color="var(--el-color-success)"
        :disabled="props.disabled"
        @click="goNextStage"
    >
      前往下一區域🚪
    </el-button>
  </div>
</template>

<style scoped>
</style>