<script setup lang="ts">
import FightOperation from "@/components/OperationLayout/comps/FightOperation.vue";
import {useGameStateStore} from "@/store/game-state-store";
import {RoomEnum} from "@/enums/room-enum";
import NextOperation from "@/components/OperationLayout/comps/NextOperation.vue";
import {GameState} from "@/enums/enums";
import RestOperation from "@/components/OperationLayout/comps/RestOperation.vue";
import {ref} from "vue";
import {useFloatingMessage} from "@/components/Shared/FloatingMessage/useFloatingMessage";
import LeaveOperation from "@/components/OperationLayout/comps/LeaveOperation.vue";


const emit = defineEmits(['attack', 'rest', 'cancel', 'run']);
const gameStateStore = useGameStateStore()
/**戰鬥相關操作**/
const onAttack = () => {
  emit('attack')
}

const onRun = () => {
  emit('run')
}

/**復原相關操作**/
const onRest = () => {
  emit('rest')
}

const onCancel = () => {
  emit('cancel')
}
const FightOperationRef = ref<typeof FightOperation>();
const showEscapeFailedMessage = () => {
  if (!FightOperationRef.value) {
    console.error("找不到逃跑按鈕元素來顯示浮動訊息");
    return;
  }

  const messageText = "逃跑失敗!";
  const messageColor = 'var(--el-color-danger)';

  useFloatingMessage(
      messageText,
      FightOperationRef.value.$el, // 按鈕元素
      {
        duration: 800,
        color: messageColor
      }
  );
}
defineExpose({
  showEscapeFailedMessage
})

</script>

<template>
  <FightOperation
      v-if="gameStateStore.roomIs([RoomEnum.Fight.value,RoomEnum.EliteFight.value,RoomEnum.Boss.value]) &&
      gameStateStore.stateIs(GameState.EVENT_PHASE)"
      ref="FightOperationRef"
      @attack="onAttack"
      @run="onRun"
  />
  <RestOperation
      v-else-if="gameStateStore.roomIs(RoomEnum.Rest.value) &&
      gameStateStore.stateIs(GameState.EVENT_PHASE)"
      @rest="onRest"
      @cancel="onCancel"
  />
  <NextOperation v-else-if="gameStateStore.stateIs(GameState.SELECTION_PHASE)"/>
  <LeaveOperation
      v-else-if="gameStateStore.roomIs(RoomEnum.Shop.value) &&
      gameStateStore.stateIs(GameState.EVENT_PHASE)"
      @cancel="onCancel"
  />
</template>

<style scoped>
.flex > * {
  flex: 1;
}
</style>