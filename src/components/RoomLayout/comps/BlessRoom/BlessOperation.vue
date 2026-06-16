<script setup lang="ts">
import {usePlayerStore} from "@/store/player-store";
import {useGameStateStore} from "@/store/game-state-store";

const emit = defineEmits(['cancel']);
const props = defineProps({
  disabled: Boolean,
})
const playerStore = usePlayerStore();
const gameStateStore = useGameStateStore()


const gainFirstPower = () => {
  playerStore.info.pendingSkillPoints = (playerStore.info.pendingSkillPoints || 0) + 1;
  gameStateStore.transitionToNextState();
};

</script>

<template>
  <el-button type="primary" :disabled="props.disabled" @click="gainFirstPower">
    獲得第一份力量
  </el-button>
</template>

<style scoped>
</style>