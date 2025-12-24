<script setup lang="ts">

import {ref} from "vue";
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
  <div class="bless">
    <div style="padding-bottom: 1rem;font-size: 3rem">🗿</div>
    <div>一座神秘的雕像豎立在這,上面刻有一段文字:</div>
    <div class="ancient-text">「觸摸我,我將實現你心中所想的訴願。」</div>
    <div v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      你選擇...?
    </div>
    <div v-else>
      👉請前往下一層👉
    </div>
  </div>
</template>

<style scoped>
.bless {
  height: auto;
  font-size: 1.5rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.ancient-text {
  font-style: oblique; /* 人為傾斜（字型沒有斜體時） */
  font-family: "DFKai-SB", "標楷體", "Noto Serif TC", serif;
  font-size: 20px;
  line-height: 2;
  letter-spacing: 0.12em;
  padding: 24px;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
}
</style>