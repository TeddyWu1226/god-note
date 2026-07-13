<script setup lang="ts">
import '../room.css'
import {GameState} from "@/enums/enums";
import NextOperation from "@/components/RoomLayout/comps/NextOperation.vue";
import {useGameStateStore} from "@/store/game-state-store";
import {computed, ref} from "vue";

const props = defineProps({
  title: {type: String, required: false},
  titleClass: {type: String, required: false},
  class: {type: String, required: false, default: 'room-layout'},
})
const gameStateStore = useGameStateStore();

const environmentClass = computed(() => {
  if (gameStateStore.environmentMode) {
    return `env-${gameStateStore.environmentMode}`;
  }
  return '';
});

const NextOperationRef = ref()
const createNextRooms = () => {
  NextOperationRef.value?.createNextRooms()
}

defineExpose({
  createNextRooms
})
</script>

<template>
  <el-card :class="[props.class, environmentClass]">
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
    <NextOperation ref="NextOperationRef" v-if="gameStateStore.stateIs(GameState.SELECTION_PHASE)"/>
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

.env-day {
  box-shadow: inset 0 0 40px rgba(255, 215, 0, 0.35),
  inset 0 0 80px rgba(255, 215, 0, 0.15) !important;
  border-color: rgba(255, 215, 0, 0.3) !important;
  transition: background-color 0.8s ease, box-shadow 0.8s ease, border-color 0.8s ease;
}

.env-night {
  box-shadow: inset 0 0 40px rgba(138, 43, 226, 0.3),
  inset 0 0 80px rgba(138, 43, 226, 0.12) !important;
  border-color: rgba(138, 43, 226, 0.25) !important;
  transition: background-color 0.8s ease, box-shadow 0.8s ease, border-color 0.8s ease;
}

.env-sand {
  box-shadow: inset 0 0 40px rgb(226 119 43 / 0.3),
  inset 0 0 80px rgb(226 119 43 / 0.12) !important;
  border-color: rgba(226 119 43/ 0.25) !important;
  transition: background-color 0.8s ease, box-shadow 0.8s ease, border-color 0.8s ease;
}
</style>