<script setup lang="ts">
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {getEnumColumn} from "@/utils/enum";
import {StageEnum} from "@/enums/stage-enum";

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();
</script>

<template>
  <el-card body-class="flex justify-between items-center">
    <span style="font-size: 16px">
      第 {{ gameStateStore.days }} 天 -
      {{ getEnumColumn(StageEnum, gameStateStore.currentStage, 'label', '塔之後⏳') }}
    </span>
    <div class="flex items-center">
      <span class="gold">{{ playerStore.info.gold }}💰</span>
    </div>
  </el-card>
</template>

<style scoped>
.gold {
  color: gold;
  font-size: 1rem;
  margin-right: 0.5rem;
}
</style>