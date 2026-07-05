<script setup lang="ts">
import {computed, onMounted} from "vue";
import {getEnumColumn} from "@/utils/enum";
import {RoomEnum} from "@/enums/room-enum";
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {getRandomLabelByWeight} from "@/utils/create";
import {DEFAULT_ROOM_WEIGHTS, EAST_ROOM_WEIGHTS} from "@/constants/default-const";
import {useTrackerStore} from "@/store/track-store";
import {DifficultyEnum} from "@/enums/difficulty-enum";
import {useEpicSubtitle} from "@/components/Shared/EpicSubtitle/useEpicSubtitle";
import EvnStatus from "@/constants/status/evn-status";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {StageEnum} from "@/enums/stage-enum";
import {playerAdjustSanity} from "@/constants/status/advanced-status-utils";
import {useRelicStore} from "@/store/relic-store";

const props = defineProps({
  disabled: Boolean,
})
const gameStateStore = useGameStateStore()
const playerStore = usePlayerStore()
const trackerStore = useTrackerStore()
const relicStore = useRelicStore();

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

  // 當前是已通關過的大關時，套用特判邏輯
  if (gameStateStore.isInClearedStage) {
    // 第 50 天 (stageDays === 49) 與第 100 天 (stageDays === 99) 強制進入驛站
    if (gameStateStore.stageDays === 49 || gameStateStore.stageDays === 99) {
      gameStateStore.nextRooms = [RoomEnum.Station.value]
      return
    }
  } else {
    // 尚未通關過的大關 (原本邏輯)
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
  }
  if (relicStore.hasRelic && gameStateStore.currentStage === relicStore.lastStage && gameStateStore.stageDays === 10) {
    gameStateStore.nextRooms = [RoomEnum.Event.value]
    return;
  }

  // 建立兩個選項 (未通關大關的普通天數，或已通關大關的 49、99 天等普通天數)
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
  if (roomValue !== RoomEnum.Event.value) {
    gameStateStore.days += 1
    gameStateStore.stageDays += 1
    trackerStore.achievementsCount.peaceDay += 1
    // 黑夜白天理智調整
    if (gameStateStore.currentStage === 4) {
      if (gameStateStore.environmentMode === 'day') {
        playerAdjustSanity(playerStore, 3);
      } else if (gameStateStore.environmentMode === 'night') {
        playerAdjustSanity(playerStore, -3);
      }
    }
    // 💡 經過一天：觸發自身狀態變化（持續回合-1 與觸發效果）、減少技能冷卻
    playerStore.nextTurnStatus()
  }
  gameStateStore.setRoom(roomValue)
  gameStateStore.nextRooms = []
  updateEnvironmentStatus()
};

const continueStage = () => {
  gameStateStore.isBattleWon = false
  gameStateStore.setRoom(RoomEnum.Rest.value)
  gameStateStore.nextRooms = []
  updateEnvironmentStatus()
}


const triggerJudgmentStage = () => {
  playerStore.healFull()
  gameStateStore.enterJudgmentStage()
  updateEnvironmentStatus()
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

/**
 * 更新特定大關與天數的環境 Buff / Debuff
 */
const updateEnvironmentStatus = () => {
  const stage = gameStateStore.currentStage;
  const days = gameStateStore.stageDays;
  const resetEvn = () => {
    const envStatusNames = [
      EvnStatus.Sandstorm.name,
      EvnStatus.Sanity.name,
      EvnStatus.HighSanity.name,
      EvnStatus.LowSanity.name,
    ];
    playerStore.statusEffects = playerStore.statusEffects.filter(e => !envStatusNames.includes(e.name));
  }
  // 根據當前關卡與天數賦予對應的環境效果
  switch (stage) {
    case StageEnum.GiantsWasteland.value:
      // 大荒地環境：魔力風暴 - 每回合扣 30 hp (受物理防禦減免)
      const isStorm = (days >= 5 && days <= 20) || (days >= 35 && days <= 50) || (days >= 65 && days <= 80);
      if (isStorm) {
        if (!playerStore.hasStatus(EvnStatus.Sandstorm.name)) {
          useFullScreenEffect({
            message: '風暴來襲...',
            color: 'brown'
          });
        }
        playerStore.addStatus(EvnStatus.Sandstorm);
      } else {
        resetEvn()
      }
      break;

    case 4:
      if (!playerStore.hasStatus('理智')) {
        playerAdjustSanity(playerStore, 0);
      }
      const isDay = (days >= 1 && days <= 10) || (days >= 21 && days <= 30) || (days >= 41 && days <= 50) || (days >= 61 && days <= 70) || (days >= 81 && days <= 90)
      if (isDay && gameStateStore.environmentMode !== 'day') {
        useFullScreenEffect({
          message: '白日來臨...',
          color: '#fdff7e',
          duration: 1500
        });
      }
      if (!isDay && gameStateStore.environmentMode !== 'night') {
        useFullScreenEffect({
          message: '黑夜來臨...',
          color: '#c57eff',
          duration: 1500
        });
      }
      gameStateStore.setEnvironmentMode(isDay ? 'day' : 'night')
      break;

    default:
      resetEvn()
  }

};

defineExpose({
  createNextRooms
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


  <!-- 已通關大關 BOSS 結算 (適用於第一次挑戰大關 Boss 勝利) -->
  <template v-else-if="gameStateStore.isBattleWon && gameStateStore.roomIs(RoomEnum.Boss.value)">
    <el-button
        v-if="gameStateStore.stageDays === 100"
        color="var(--el-color-success)"
        style="height: 3rem; font-weight: bold; width: 100%;"
        :disabled="props.disabled"
        @click="gameStateStore.openStageSelectDialog(false)"
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
        :color="room === RoomEnum.Station.value ? '#4CAF50' : getEnumColumn(RoomEnum, room,'color')"
        :disabled="props.disabled"
        @click="selectRoom(room)"
        style="width: 100%; margin: 4px 0;"
    >
      <el-row style="width: 100%">
        <el-col :span="8" style="text-align: left;">選擇:</el-col>
        <el-col :span="16" style="text-align: right;">
          {{ room === RoomEnum.Station.value ? '🛌🏾' : getEnumColumn(RoomEnum, room, 'icon') }}
          {{ room === RoomEnum.Station.value ? '休息' : getEnumColumn(RoomEnum, room) }}
        </el-col>
      </el-row>
    </el-button>
  </template>
</template>

<style scoped>
</style>