<script setup lang="ts">
import {onMounted} from "vue";
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
import {StageBosses} from "@/constants/monsters/monster-info/99-boss-info";
import {SpecialEventEnum} from "@/enums/enums";

const props = defineProps({
  disabled: Boolean,
})
const gameStateStore = useGameStateStore()
const playerStore = usePlayerStore()
const trackerStore = useTrackerStore()
const relicStore = useRelicStore();

const isBossDefeated = (day: number): boolean => {
  if (gameStateStore.isInClearedStage) return true;
  const stageBoss = StageBosses[gameStateStore.currentStage];
  if (!stageBoss) return false;
  const boss = day === 50 ? stageBoss.mini : (day === 100 ? stageBoss.main : null);
  if (!boss) return false;
  return trackerStore.isMonsterDefeated(boss.code)
};

const createNextRooms = () => {
  gameStateStore.nextRooms = []

  // 1000 天結束後的選項只有「特殊事件」按鈕可以選
  if (gameStateStore.days === 1000 && !gameStateStore.isEventClose(SpecialEventEnum.EndBell)) {
    gameStateStore.nextRooms = [RoomEnum.Event.value]
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

  // 特判第 50 天 (stageDays === 49) 與第 100 天 (stageDays === 99) 及其前一天的邏輯
  const isDay50BossDefeated = isBossDefeated(50);
  const isDay100BossDefeated = isBossDefeated(100);

  // 第 49 天 (當前選擇第 50 天房間前一天，即 stageDays === 48)
  if (gameStateStore.stageDays === 48) {
    if (!isDay50BossDefeated) {
      gameStateStore.nextRooms = [RoomEnum.Rest.value];
      return;
    }
  }

  // 第 50 天 (當前選擇第 50 天房間，即 stageDays === 49)
  if (gameStateStore.stageDays === 49) {
    if (isDay50BossDefeated) {
      gameStateStore.nextRooms = [RoomEnum.Station.value];
    } else {
      gameStateStore.nextRooms = [RoomEnum.Boss.value];
    }
    return;
  }

  // 第 99 天 (當前選擇第 100 天房間前一天，即 stageDays === 98)
  if (gameStateStore.stageDays === 98) {
    if (!isDay100BossDefeated) {
      gameStateStore.nextRooms = [RoomEnum.Rest.value];
      return;
    }
  }

  // 第 100 天 (當前選擇第 100 天房間，即 stageDays === 99)
  if (gameStateStore.stageDays === 99) {
    if (isDay100BossDefeated) {
      gameStateStore.nextRooms = [RoomEnum.Station.value];
    } else {
      gameStateStore.nextRooms = [RoomEnum.Boss.value];
    }
    return;
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

const goToStageEnd = () => {
  gameStateStore.setRoom(RoomEnum.StageEnd.value)
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
    gameStateStore.setEnvironmentMode(undefined)
  }
  // 根據當前關卡與天數賦予對應的環境效果
  if (gameStateStore.stageDays === 0) {
    resetEvn()
  }
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
        gameStateStore.setEnvironmentMode('sand')
      } else {
        resetEvn()
      }
      break;
    case StageEnum.SplitCanyon.value:
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
  <!-- 已通關大關 BOSS 結算 (適用於第一次挑戰大關 Boss 勝利) -->
  <template v-if="gameStateStore.isBattleWon && gameStateStore.roomIs(RoomEnum.Boss.value)">
    <el-button
        v-if="gameStateStore.stageDays === 100"
        color="var(--el-color-success)"
        style="height: 3rem; font-weight: bold; width: 100%;"
        :disabled="props.disabled"
        @click="goToStageEnd"
    >
      繼續
    </el-button>
    <el-button
        v-else-if="gameStateStore.stageDays === 50"
        color="var(--el-color-success)"
        style="height: 3rem; width: 100%;"
        :disabled="props.disabled"
        @click="continueStage"
    >
      繼續
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