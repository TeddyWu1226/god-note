<script setup lang="ts">
import {ref} from "vue";
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {getEnumColumn} from "@/utils/enum";
import {StageEnum} from "@/enums/stage-enum";
import MaterialTab from "@/components/UserLayout/comps/MaterialTab.vue";

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();
const isShowBackpack = ref(false);
</script>

<template>
  <el-card body-class="flex justify-between items-center">
    <span style="font-size: 16px">
      <template v-if="gameStateStore.days === 0">
        命運之始
      </template>
      <template v-else>
        第 {{ gameStateStore.stageDays }} 天 -
        {{ getEnumColumn(StageEnum, gameStateStore.currentStage, 'label', '塔之後⏳') }}
      </template>
    </span>
    <div class="flex items-center">
      <span class="gold">{{ playerStore.info.gold }}💰</span>
      <el-button
          type="info"
          style="height: 2rem; margin-left: 0.5rem;"
          size="small"
          @click="isShowBackpack = true"
          plain
      >
        背包
      </el-button>
    </div>
  </el-card>

  <el-dialog
      top="5vh"
      v-model="isShowBackpack"
      title="背包"
      width="400px"
      append-to-body
  >
    <div style="padding: 0.5rem 0;">
      <MaterialTab />
    </div>
  </el-dialog>
</template>

<style scoped>
.gold {
  color: gold;
  font-size: 1rem;
}
</style>