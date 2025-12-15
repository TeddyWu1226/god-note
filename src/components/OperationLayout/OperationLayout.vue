<script setup lang="ts">
import FightOperation from "@/components/OperationLayout/comps/FightOperation.vue";
import {useGameStateStore} from "@/store/game-state-store";
import {RoomEnum} from "@/enums/room-enum";
import NextOperation from "@/components/OperationLayout/comps/NextOperation.vue";
import {GameState} from "@/enums/enums";
import RestOperation from "@/components/OperationLayout/comps/RestOperation.vue";


const emit = defineEmits(['attack', 'rest','cancel']);
const gameStateStore = useGameStateStore()
/**戰鬥相關操作**/
const onAttack = () => {
  emit('attack')
}

/**復原相關操作**/
const onRest = () => {
  emit('rest')
}

const onCancel = () => {
  emit('cancel')
}

</script>

<template>
  <FightOperation
      v-if="gameStateStore.roomIs([RoomEnum.Fight.value,RoomEnum.EliteFight.value]) &&
      gameStateStore.stateIs(GameState.EVENT_PHASE)"
      @attack="onAttack"
  />
  <RestOperation
      v-else-if="gameStateStore.roomIs(RoomEnum.Rest.value) &&
      gameStateStore.stateIs(GameState.EVENT_PHASE)"
      @rest="onRest"
      @cancel="onCancel"
  />
  <NextOperation v-else-if="gameStateStore.stateIs(GameState.SELECTION_PHASE)"/>
</template>

<style scoped>
.el-button {
  height: 100%;
}

.flex > * {
  flex: 1;
}
</style>