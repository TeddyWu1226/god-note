<script setup lang="ts">
import MapDialog from "@/components/FloorInfoLayout/comps/MapDialog.vue";
import {ref} from "vue";
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {getEnumColumn} from "@/utils/enum";
import {StageEnum} from "@/enums/stage-enum";


const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();

const isShowMapDialog = ref(false);


</script>

<template>
  <el-card body-class="flex justify-between items-center">
    <span style="font-size: 16px">第 {{
        gameStateStore.getCurrentStage
      }} 階段 - {{ getEnumColumn(StageEnum, gameStateStore.getCurrentStage) }}</span>
    <div class="flex items-center">
      <span class="gold">{{ playerStore.info.gold }}💰</span>
      <el-button @click="()=>{isShowMapDialog = true}">地圖</el-button>
    </div>
  </el-card>
  <MapDialog v-model="isShowMapDialog"></MapDialog>
</template>

<style scoped>
.gold {
  color: gold;
  font-size: 1rem;
  margin-right: 0.5rem;
}
</style>