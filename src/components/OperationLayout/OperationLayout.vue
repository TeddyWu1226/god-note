<script setup lang="ts">
import FightOperation from "@/components/OperationLayout/comps/FightOperation.vue";
import {useGameStateStore} from "@/store/game-state-store";
import {RoomEnum} from "@/enums/room-enum";
import NextOperation from "@/components/OperationLayout/comps/NextOperation.vue";
import {GameState} from "@/enums/enums";


const emit = defineEmits(['attack']);
const gameStateStore = useGameStateStore()
/**戰鬥相關操作**/
const onAttack = () => {
  emit('attack')
}

</script>

<template>
  <FightOperation
      v-if="gameStateStore.roomIs([RoomEnum.Fight.value,RoomEnum.EliteFight.value]) &&
      gameStateStore.stateIs(GameState.EVENT_PHASE)"
      @attack="onAttack"
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