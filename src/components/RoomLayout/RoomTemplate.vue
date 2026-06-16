<script setup lang="ts">
import './room.css'
import {GameState} from "@/enums/enums";
import NextOperation from "@/components/OperationLayout/comps/NextOperation.vue";
import {useGameStateStore} from "@/store/game-state-store";

const props = defineProps({
  title: {type: String, required: true},
  titleClass: {type: String, required: false},
  class: {type: String, required: false, default: 'room-layout'},
})
const gameStateStore = useGameStateStore();
</script>

<template>
  <el-card :class="props.class">
    <div class="title" :class="props.titleClass">
      {{ props.title }}
    </div>
    <slot name="default"></slot>
  </el-card>

  <div class="operation-layout">
    <NextOperation v-if="gameStateStore.stateIs(GameState.SELECTION_PHASE)"/>
    <slot v-else-if="$slots.button" name="button"></slot>
  </div>

</template>

<style scoped>
.title {
  font-size: 1.2rem;
}

.flex > * {
  flex: 1;
}
</style>