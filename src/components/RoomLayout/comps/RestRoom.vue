<script setup lang="ts">
import '../room.css'
import {effect, ref} from "vue";
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {GameState, SpecialEventEnum} from "@/enums/enums";
import {checkProbability} from "@/utils/math";

const playerStore = usePlayerStore();
const gameStateStore = useGameStateStore()

const isRested = ref<boolean>(false)
const onRest = () => {
  isRested.value = true
  playerStore.healFull()
  gameStateStore.transitionToNextState()
  if (gameStateStore.thisStageAlreadyAppear(SpecialEventEnum.Storyteller)) {
    return
  }
  if (checkProbability(0.3)) {
    gameStateStore.switchToEventRoom(SpecialEventEnum.Storyteller)
  }

}

defineExpose({
  onRest
})
</script>

<template>
  <div class="rest">
    <template v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      <div class="event-icon">💤</div>
      <div class="dialog-box">
        <p>這邊好像很適合休息...</p>
        <p>你選擇...?</p>
      </div>
    </template>
    <template v-else>
      <template v-if="isRested">
        <div class="event-icon">💤</div>
        <div style="color: var(--el-color-success);text-align: center" class="dialog-box">
          你休息了一會,<br/>你的HP跟SP完全恢復外,身上暫時的負面效果也消除了!
        </div>
      </template>
      <div v-else class="dialog-box">
        趕路吧...
      </div>
    </template>

  </div>
</template>

<style scoped>
.rest {
  height: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>