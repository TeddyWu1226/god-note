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
import {StageEnum} from "@/enums/stage-enum";

const props = defineProps({
  disabled: Boolean,
})
const gameStateStore = useGameStateStore()
const playerStore = usePlayerStore()
const trackerStore = useTrackerStore()
const showStageSelectDialog = ref(false)

const createNextRooms = () => {
  gameStateStore.nextRooms = []

  // 如果已經大於等於 1000 天，且不在審判之關卡，不生成普通房間（下一步將會強制為進入審判）
  if (gameStateStore.days >= 1000 && gameStateStore.currentStage !== 6) {
    return
  }

  // 審判之關卡邏輯 (Stage 6)
  if (gameStateStore.currentStage === 6) {
    if (gameStateStore.stageDays === 4 || gameStateStore.stageDays === 9) {
      gameStateStore.nextRooms = [RoomEnum.Boss.value]
    } else {
      // 審判之關卡的生存路徑：精英戰鬥或休息
      gameStateStore.nextRooms = [RoomEnum.EliteFight.value, RoomEnum.Rest.value]
    }
    return
  }

  // 49 與 99 天必定只能休息
  if (gameStateStore.stageDays === 48 || gameStateStore.stageDays === 98) {
    gameStateStore.nextRooms = [RoomEnum.Rest.value]
    return
  }
  // 50 與 100 天必定挑戰 BOSS
  if (gameStateStore.stageDays === 49 || gameStateStore.stageDays === 99) {
    gameStateStore.nextRooms = [RoomEnum.Boss.value]
    return
  }

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
  if (roomValue !== RoomEnum.Event.value) {
    gameStateStore.days += 1
    gameStateStore.stageDays += 1
    trackerStore.achievementsCount.peaceDay += 1
  }
  gameStateStore.nextRooms = []
};

const continueStage = () => {
  gameStateStore.isBattleWon = false
  gameStateStore.setRoom(RoomEnum.Rest.value)
  gameStateStore.nextRooms = []
}

const openStageSelectDialog = () => {
  // 破關時，打開彈窗前就更新 maxClearedStage，確保彈窗渲染時新大關已解鎖
  gameStateStore.maxClearedStage = Math.max(gameStateStore.maxClearedStage, gameStateStore.currentStage)
  showStageSelectDialog.value = true
}

const selectStage = (stageVal: number) => {
  playerStore.healFull()
  trackerStore.init(false)

  // 更新最高通關進度
  gameStateStore.maxClearedStage = Math.max(gameStateStore.maxClearedStage, gameStateStore.currentStage)

  gameStateStore.currentStage = stageVal
  gameStateStore.stageDays = 0
  gameStateStore.isBattleWon = false
  gameStateStore.setRoom(RoomEnum.Rest.value)
  gameStateStore.nextRooms = []

  if (stageVal === 2) {
    playerStore.addStatus(EvnStatus.Sandstorm)
    useEpicSubtitle("沙塵暴席捲整個地區...", 2000);
  } else {
    playerStore.removeStatus(EvnStatus.Sandstorm.name)
  }

  showStageSelectDialog.value = false
}

const triggerJudgmentStage = () => {
  playerStore.healFull()
  trackerStore.init(false)

  gameStateStore.enterJudgmentStage()

  playerStore.removeStatus(EvnStatus.Sandstorm.name)
  useEpicSubtitle("⚖️ 審判時刻已到，終焉的考驗降臨...", 4000);
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
  <!-- 總天數已達 1000 天，且尚未進入審判之關卡 -->
  <template v-if="gameStateStore.days >= 1000 && gameStateStore.currentStage !== 6">
    <el-button
        color="#d32f2f"
        style="width: 100%; height: 3.5rem; font-size: 1.1rem; font-weight: bold; border: 2px solid gold; box-shadow: 0 0 10px rgba(255,215,0,0.5);"
        :disabled="props.disabled"
        @click="triggerJudgmentStage"
    >
      ⚖️ 迎接命運之審判 (進入第 1001 天)
    </el-button>
  </template>

  <!-- 已通關大關 BOSS 結算 -->
  <template v-else-if="gameStateStore.isBattleWon && gameStateStore.roomIs(RoomEnum.Boss.value)">
    <el-button
        v-if="gameStateStore.stageDays === 100"
        color="var(--el-color-success)"
        style="height: 3rem; font-weight: bold; width: 100%;"
        :disabled="props.disabled"
        @click="openStageSelectDialog"
    >
      選擇下一個區域 🗺️
    </el-button>
    <el-button
        v-else-if="gameStateStore.stageDays === 50"
        color="var(--el-color-success)"
        style="height: 3rem; width: 100%;"
        :disabled="props.disabled"
        @click="continueStage"
    >
      繼續冒險🏹
    </el-button>
  </template>

  <!-- 普通選擇房間 -->
  <template v-else>
    <el-button
        v-for="room in gameStateStore.nextRooms"
        :key="room"
        :color="getEnumColumn(RoomEnum, room,'color')"
        :disabled="props.disabled"
        @click="selectRoom(room)"
        style="width: 100%; margin: 4px 0;"
    >
      <el-row style="width: 100%">
        <el-col :span="8" style="text-align: left;">選擇:</el-col>
        <el-col :span="16" style="text-align: right;">
          {{ getEnumColumn(RoomEnum, room, 'icon') }}
          {{ getEnumColumn(RoomEnum, room) }}
        </el-col>
      </el-row>
    </el-button>
  </template>

  <!-- 大關選擇彈窗 (Dialog) -->
  <el-dialog
      v-model="showStageSelectDialog"
      title="🌌 選擇前往的區域"
      width="90%"
      align-center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      destroy-on-close
  >
    <div class="stage-select-container flex flex-column gap-3">
      <div class="stage-select-tip text-center" style="margin-bottom: 1rem; color: var(--el-text-color-secondary);">
        通過前一區域即可解鎖下一區域。您可以自由選擇回到已通關的區域刷取資源。
      </div>

      <div
          v-for="(stage, key) in StageEnum"
          :key="key"
          style="width: 100%; margin-bottom: 8px;"
      >
        <!-- 只列出 1 到 5 大關供選擇 (審判之關卡 6 為天數強制進入) -->
        <template v-if="stage.value <= 5">
          <el-button
              style="width: 100%; height: 3.5rem; text-align: left; display: flex; justify-content: space-between; align-items: center;"
              :type="stage.value <= gameStateStore.maxClearedStage + 1 ? 'primary' : 'info'"
              :disabled="stage.value > gameStateStore.maxClearedStage + 1"
              @click="selectStage(stage.value)"
              plain
          >
              <span style="font-size: 1rem; font-weight: bold;padding-right: 0.5rem">
                第 {{ stage.value }} 區: {{ stage.value <= gameStateStore.maxClearedStage + 1 ? stage.label : '???' }}
              </span>
            <el-tag
                v-if="stage.value <= gameStateStore.maxClearedStage"
                type="success"
                size="small"
                effect="dark"
            >
              已通關
            </el-tag>
            <el-tag
                v-else-if="stage.value === gameStateStore.maxClearedStage + 1"
                type="danger"
                size="small"
                effect="dark"
            >
              NEW
            </el-tag>
            <el-tag
                v-else
                type="info"
                size="small"
                effect="dark"
            >
              🔒未發現
            </el-tag>
          </el-button>
        </template>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.stage-select-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flex-column {
  flex-direction: column;
}


.gap-3 {
  gap: 12px;
}

.text-center {
  text-align: center;
}
</style>