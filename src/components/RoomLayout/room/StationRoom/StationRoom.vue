<script setup lang="ts">
import '../../room.css'
import {computed, onMounted, ref} from "vue";
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {GameState} from "@/enums/enums";
import RoomTemplate from "@/components/RoomLayout/comps/RoomTemplate.vue";

const playerStore = usePlayerStore();
const gameStateStore = useGameStateStore();

const isRested = ref(false)
const isEnded = computed(() => gameStateStore.stageDays === 100)
const isBorderTown = computed(() => gameStateStore.currentStage === 0)

const titleText = computed(() => {
  if (isBorderTown.value) return '鎮口休息處';
  return isEnded.value ? '旅途之末' : '深處驛站';
})

const onRest = () => {
  isRested.value = true
  playerStore.healFull()
  gameStateStore.transitionToNextState()
}

onMounted(() => {
  // // 邊境城鎮或第 100 天都自動開啟區域選擇
  // if (isBorderTown.value || gameStateStore.stageDays === 100) {
  //   gameStateStore.openStageSelectDialog(false)
  // }
})
</script>

<template>
  <RoomTemplate :title="titleText">
    <template #default>
      <div class="general-event">
        <div class="event-icon">
          <template v-if="isBorderTown">🏡</template>
          <template v-else>{{ isEnded ? '🛤️' : '🏘️' }}</template>
        </div>
        <div class="dialog-box">
          <template v-if="isBorderTown">
            <p>你回到了人類的邊境基地，在這稍作休息。</p>
          </template>
          <template v-else-if="isEnded">
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
      <template v-if="isBorderTown">
        <!-- 邊境城鎮：只有前往其他區域的選項 -->
        <el-button type="warning" @click="gameStateStore.openStageSelectDialog(false)">
          前往其他區域
        </el-button>
      </template>
      <template v-else-if="isEnded">
        <!-- 第 100 天：只有前往其他區域的選項 -->
        <el-button type="warning" @click="gameStateStore.openStageSelectDialog(false)">
          前往其他區域
        </el-button>
      </template>
      <template v-else>
        <!-- 第 50 天且未休息：可以選擇休息或跳關 -->
        <template v-if="!isRested && gameStateStore.stateIs(GameState.EVENT_PHASE)">
          <el-button type="success" @click="onRest">
            休息一會
          </el-button>
          <el-button
              type="warning"
              v-if="gameStateStore.isInClearedStage"
              @click="gameStateStore.openStageSelectDialog(true)"
          >
            前往其他區域
          </el-button>
        </template>
      </template>
    </template>
  </RoomTemplate>
</template>

<style scoped>

</style>
