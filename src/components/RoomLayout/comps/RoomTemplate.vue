<script setup lang="ts">
import '../room.css'
import {GameState} from "@/enums/enums";
import NextOperation from "@/components/RoomLayout/comps/NextOperation.vue";
import {useGameStateStore} from "@/store/game-state-store";

const props = defineProps({
  title: {type: String, required: false},
  titleClass: {type: String, required: false},
  class: {type: String, required: false, default: 'room-layout'},
})
const gameStateStore = useGameStateStore();
</script>

<template>
  <el-card :class="props.class">
    <div class="title" :class="props.titleClass">
      <template v-if="props.title">
        {{ props.title }}
      </template>
      <slot v-else name="title"></slot>
    </div>
    <div class="room-body">
      <slot name="default"></slot>
    </div>

  </el-card>
  <div class="operation-layout">
    <NextOperation v-if="gameStateStore.stateIs(GameState.SELECTION_PHASE)"/>
    <slot v-else-if="$slots.button" name="button"></slot>
  </div>

</template>

<style scoped>
.title {
  font-size: 1.2rem;
  padding-bottom: 1rem;
}

.flex > * {
  flex: 1;
}

.room-body {
  height: calc(100% - 3.2rem);
  overflow-y: auto;
  container-type: size;
  container-name: room-body;
}
</style>