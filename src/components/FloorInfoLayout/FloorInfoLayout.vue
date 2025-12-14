<script setup>
import MapDialog from "@/components/FloorInfoLayout/comps/MapDialog.vue";
import {ref} from "vue";
import {getEnumColumn} from "@/utils/enum.ts";
import {StageEnum} from "@/enums/stage-enum.ts";
import {useGameStateStore} from "@/store/game-state-store.ts";

const isShowMapDialog = ref(false);

const gameStateStore = useGameStateStore();
</script>

<template>
  <el-card body-class="flex justify-between items-center">
    <span style="font-size: 16px">第 {{ gameStateStore.getCurrentStage }} 階段 - {{ getEnumColumn(StageEnum, gameStateStore.getCurrentStage)}}</span>
    <el-button @click="()=>{isShowMapDialog = true}">地圖</el-button>
  </el-card>
  <MapDialog v-model="isShowMapDialog"></MapDialog>
</template>

<style scoped>

</style>