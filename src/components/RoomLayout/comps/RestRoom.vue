<script setup lang="ts">

import {ref} from "vue";
import {UserInfo} from "@/storage/userinfo-storage";
import {useGameStateStore} from "@/store/game-state-store";
import {GameState} from "@/enums/enums";

const isRested = ref<boolean>(false)
const gameStateStore = useGameStateStore()
const onRest = () => {
  isRested.value = true
  if (UserInfo.value.hp < UserInfo.value.hpLimit) {
    UserInfo.value.hp = UserInfo.value.hpLimit
  }
  if (UserInfo.value.sp < UserInfo.value.spLimit) {
    UserInfo.value.sp = UserInfo.value.spLimit
  }
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
      休息了一會,<br/>你的HP跟MP完全恢復了!
    </div>
    <div v-else-if="gameStateStore.getCurrentState === GameState.SELECTION_PHASE">
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