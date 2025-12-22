<script setup lang="ts">

import {effect, ref} from "vue";
import {useGameStateStore} from "@/store/game-state-store";
import {GameState} from "@/enums/enums";
import {usePlayerStore} from "@/store/player-store";

const playerStore = usePlayerStore();
const gameStateStore = useGameStateStore()

const isRested = ref<boolean>(false)
const onRest = () => {
  isRested.value = true
  playerStore.healFull()
  gameStateStore.transitionToNextState()
}

defineExpose({
  onRest
})
</script>

<template>
  <div class="rest">
    <div style="padding-bottom: 1rem;">這邊好像很適合休息💤...</div>
    <div v-if="isRested" style="color: var(--el-color-success);text-align: center">
      休息了一會,<br/>你的HP跟SP完全恢復了!
    </div>
    <div v-else-if="gameStateStore.currentState === GameState.SELECTION_PHASE">
      但現在的我不想休息!
    </div>
    <div v-else>
      你選擇...?
    </div>
  </div>
</template>

<style scoped>
.rest {
  height: auto;
  font-size: 1.5rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>