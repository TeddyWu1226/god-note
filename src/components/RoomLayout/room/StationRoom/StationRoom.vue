<script setup lang="ts">
import '../../room.css'
import {computed, onMounted, ref} from "vue";
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {useTrackerStore} from "@/store/track-store";
import {GameState} from "@/enums/enums";
import {StageEnum} from "@/enums/stage-enum";
import RoomTemplate from "@/components/RoomLayout/comps/RoomTemplate.vue";

const playerStore = usePlayerStore();
const gameStateStore = useGameStateStore();
const trackerStore = useTrackerStore();

const isRested = ref(false)
const showStageSelectDialog = ref(false)
const isStageSelectClosable = ref(true)
const isEnded = computed(() => gameStateStore.stageDays === 100)
const onRest = () => {
  isRested.value = true
  playerStore.healFull()
  gameStateStore.transitionToNextState()
}

const openStageSelectDialog = (closable = true) => {
  gameStateStore.maxClearedStage = Math.max(gameStateStore.maxClearedStage, gameStateStore.currentStage + 1)
  isStageSelectClosable.value = closable
  showStageSelectDialog.value = true
}

const selectStage = (stageVal: number) => {
  playerStore.healFull()
  trackerStore.init(false)

  // 更新最高通關進度
  gameStateStore.maxClearedStage = Math.max(gameStateStore.maxClearedStage, gameStateStore.currentStage + 1)

  gameStateStore.currentStage = stageVal
  gameStateStore.stageDays = 0
  gameStateStore.isBattleWon = false
  gameStateStore.setRoom(0) // 休息房 RoomEnum.Rest.value
  gameStateStore.nextRooms = []

  showStageSelectDialog.value = false
}

onMounted(() => {
  if (isEnded) {
    openStageSelectDialog(false)
  }
})

const emit = defineEmits(['cancel']);
const cancel = (): void => {
  emit('cancel');
}
</script>

<template>
  <RoomTemplate :title="isEnded ? '命運的叉路' : '驛站'">
    <template #default>
      <div class="general-event">
        <div class="event-icon">
          {{ isEnded ? '🛤️' : '🏘️' }}
        </div>

        <!-- 驛站故事對話盒 -->
        <div class="dialog-box">
          <template v-if="isEnded">
            <p>風景以然變色，已達區域的盡頭。</p>
            <p>「前方是命運的叉路。在這裡，選擇你想前往的區域。」</p>
          </template>
          <template v-else>
            <template v-if="gameStateStore.stateIs(GameState.SELECTION_PHASE) || isRested">
              <p>你在驛站稍作休息，火光溫暖了疲憊的肢體，狀態已完全恢復。</p>
            </template>
            <template v-else>
              <p>以前充滿魔物的地方，居然現著一座破舊卻溫暖的建築。</p>
              <p>「你來到了一個驛站，可以在這休息一會或前往其他區域。」</p>
            </template>
          </template>
        </div>
      </div>
    </template>

    <template #button>
      <template v-if="!isEnded">
        <!-- 第 50 天且未休息：可以選擇休息或跳關 -->
        <template v-if="!isRested && gameStateStore.stateIs(GameState.EVENT_PHASE)">
          <el-button
              color="#4CAF50"
              class="premium-btn"
              @click="onRest"
          >
            🏹 休息一會 (繼續冒險)
          </el-button>
          <el-button
              color="#d32f2f"
              class="premium-btn border-gold"
              @click="openStageSelectDialog(true)"
          >
            🌌 前往其他區域 (跳關)
          </el-button>
        </template>
      </template>
    </template>
  </RoomTemplate>
</template>

<style scoped>
</style>
