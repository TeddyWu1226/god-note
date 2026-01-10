<script setup lang="ts">
import {computed, onMounted} from 'vue';
import {useGameStateStore} from "@/store/game-state-store";
import {eventComponentMap} from "@/components/RoomLayout/event/useEventRoom";
import {SpecialEventEnum} from "@/enums/enums";
import {usePlayerStore} from "@/store/player-store";
import {CharEnum} from "@/enums/char-enum";
import {useTrackerStore} from "@/store/track-store";
import {Material} from "@/constants/items/material/material-info";
import {Usable} from "@/constants/items/usalbe-item/usable-info";
import {Monster} from "@/constants/monsters/monster-info";

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();
const trackerStore = useTrackerStore();
/**
 * 事件配置表：控制隨機權限
 */
const GeneralEvent = [
  {
    type: SpecialEventEnum.Gamble,
    canAppear: () => playerStore.info.gold >= 50
  },
  {
    type: SpecialEventEnum.Chest,
    canAppear: () => true
  },
  {
    type: SpecialEventEnum.Potion,
    canAppear: () => true
  },
  {
    type: SpecialEventEnum.GetFruit, // 魔樹事件
    canAppear: () => !gameStateStore.thisStageAlreadyAppear(SpecialEventEnum.GetFruit)
  },
  {
    type: SpecialEventEnum.JobWarrior, // 劍士轉職事件
    canAppear: () => {
      if (playerStore.info.char !== CharEnum.Beginner.value) {
        return false;
      }
      return trackerStore.getKillCount("USE_SWORD", 'total') >= 10;
    }
  },
  {
    type: SpecialEventEnum.JobWizard, // 法師轉職事件
    canAppear: () => {
      if (playerStore.info.char !== CharEnum.Beginner.value) {
        return false;
      }
      return playerStore.finalStats.apIncrease > 10
    }
  },
];

// 第二區域才開放的事件(stage >=6)
const ScorchedSandsEvent = [
  {
    type: SpecialEventEnum.Fusion, // 合成功能解鎖
    canAppear: () => true
  },
  {
    type: SpecialEventEnum.NeedWater, // 求水事件
    canAppear: () => {
      return !(gameStateStore.otherRecord['WATER'] === 1)
    }
  },
  {
    type: SpecialEventEnum.HuntDuneBeast, // 狩獵巨獸事件
    canAppear: () => {
      return (
          (!gameStateStore.thisStageAlreadyAppear(SpecialEventEnum.HuntDuneBeast) &&
              gameStateStore.getEventProcess(SpecialEventEnum.HuntDuneBeast) === 0 &&
              playerStore.hasItem(Material.BehemothScales.name)[0]
          ) ||
          (gameStateStore.getEventProcess(SpecialEventEnum.HuntDuneBeast) === 1 &&
              playerStore.hasItem(Usable.DuneBeastBomb.name)[0]
          ) ||
          (trackerStore.getKillCount(Monster.DuneBeast.name, 'current') >= 1
          )
      )
    }
  }
]

/**
 * 獲取當前允許的所有隨機事件
 */
const getAvailableEvents = () => {
  // 過濾出所有符合出現條件的事件 Type
  let allowEvent = [...GeneralEvent]
  if (gameStateStore.currentStage >= 6) {
    allowEvent = allowEvent.concat(ScorchedSandsEvent)
  }
  return allowEvent
      .filter(event => !gameStateStore.isEventClose(event.type))
      .filter(event => event.canAppear())
      .map(event => event.type);
};

/**
 * 隨機抽取事件
 */
const pickRandomEvent = () => {
  let pool = getAvailableEvents();
  console.log('pool', pool)
  // 設置防錯，如果沒有可用事件則給一個預設
  if (pool.length === 0) return SpecialEventEnum.Gamble;
  // 強制事件
  if (pool.includes(SpecialEventEnum.Fusion)) {
    pool = [SpecialEventEnum.Fusion]
  }
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
};

// 初始化邏輯
const initializeEventRoom = () => {
  // 只有當前還沒有事件時才初始化，避免在某些情況下組件重新渲染導致事件變更
  if (!gameStateStore.currentEventType) {
    const selectedEvent = pickRandomEvent();
    gameStateStore.setEvent(selectedEvent);
  }
};

// 動態載入當前事件組件
const currentEventComponent = computed(() => {
  return eventComponentMap[gameStateStore.currentEventType as SpecialEventEnum] || null;
});
onMounted(() => {
  initializeEventRoom();
});
</script>

<template>
  <component
      :is="currentEventComponent"
      v-if="currentEventComponent"
      :key="gameStateStore.currentEventType"
  />
</template>

<style scoped>
</style>