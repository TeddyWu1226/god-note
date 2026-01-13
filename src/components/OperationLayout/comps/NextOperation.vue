<script setup lang="ts">
import {onMounted, ref} from "vue";
import {getEnumColumn} from "@/utils/enum";
import {RoomEnum} from "@/enums/room-enum";
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {getRandomLabelByWeight} from "@/utils/create";
import {DEFAULT_ROOM_WEIGHTS, EAST_ROOM_WEIGHTS} from "@/constants/default-const";
import {useTrackerStore} from "@/store/track-store";
import {DifficultyEnum} from "@/enums/difficulty-enum";
import EvnStatus from "@/constants/status/evn-status";
import {useEpicSubtitle} from "@/components/Shared/EpicSubtitle/useEpicSubtitle";

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
  let weight = DEFAULT_ROOM_WEIGHTS
  if (gameStateStore.difficulty === DifficultyEnum.Easy.value) {
    weight = EAST_ROOM_WEIGHTS
  }
  rooms.push(getRandomLabelByWeight(weight))
  rooms.push(getRandomLabelByWeight(weight))
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
  if (gameStateStore.currentStage === 6) {
    playerStore.addStatus(EvnStatus.Sandstorm)
    useEpicSubtitle("沙塵暴席捲整個地區...", 2000);
  }
  if(gameStateStore.currentStage > 8){
    playerStore.removeStatus(EvnStatus.Sandstorm.name)
  }
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
        v-if="gameStateStore.isBattleWon && gameStateStore.roomIs(RoomEnum.Boss.value)"
        color="var(--el-color-success)"
        :disabled="props.disabled"
        @click="goNextStage"
    >
      前往下一區域🚪
    </el-button>
    <template v-else>
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
    </template>
  </div>
</template>

<style scoped>
</style>