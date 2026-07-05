<script setup lang="ts">
import '../../room.css'
import {ref} from "vue";
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {GameState} from "@/enums/enums";
import RoomTemplate from "@/components/RoomLayout/comps/RoomTemplate.vue";
import RestOperation from "@/components/RoomLayout/room/RestRoom/RestOperation.vue";

const playerStore = usePlayerStore();
const gameStateStore = useGameStateStore()

const isRested = ref<boolean>(false)
const isUnFeelWell = ref<boolean>(false)
const onRest = () => {
  isRested.value = true
  if (playerStore.statusEffects?.some((eff) => !eff?.isBuff)) {
    // 身上不舒服所以只能回復一半
    playerStore.info.hp = Math.min(playerStore.finalStats.hpLimit, playerStore.info.hp + Math.round(playerStore.finalStats.hpLimit / 2))
    playerStore.statusEffects = playerStore.statusEffects.filter(effect => effect.isBuff || effect.duration === -1)
    isUnFeelWell.value = true
  } else {
    playerStore.healFull()
  }
  gameStateStore.transitionToNextState()
}
const emit = defineEmits(['cancel']);

const onCancel = () => {
  emit('cancel')
}

defineExpose({
  onRest
})
</script>

<template>
  <RoomTemplate title="平靜的地方">
    <template #default>
      <div class="general-event">
        <template v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
          <div class="event-icon">💤</div>
          <div class="dialog-box">
            <p>這邊好像很適合休息...</p>
            <p>選擇...?</p>
          </div>
        </template>
        <template v-else>
          <template v-if="isRested">
            <div class="event-icon">💤</div>
            <div v-if="isUnFeelWell" style="color: var(--el-color-success);text-align: center" class="dialog-box">
              你輾轉難眠。<br/>雖然身上的不適消除了，但只回復了一半的生命!
            </div>
            <div v-else style="color: var(--el-color-success);text-align: center" class="dialog-box">
              休息了一會。<br/>你的HP跟SP完全恢復!
            </div>
          </template>
          <div v-else class="dialog-box">
            趕路吧...
          </div>
        </template>
      </div>
    </template>
    <template #button>
      <RestOperation @rest="onRest" @cancel="onCancel"/>
    </template>
  </RoomTemplate>
</template>

<style scoped>
</style>