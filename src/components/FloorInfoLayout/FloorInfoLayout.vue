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
      <!-- 屬性加點提醒 -->
      <div 
          v-if="playerStore.info.statPoints && playerStore.info.statPoints > 0" 
          class="stat-upgrade-reminder"
          @click="gameStateStore.isShowStats = true"
      >
        ⚡可分配屬性點: {{ playerStore.info.statPoints }}
      </div>
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

.stat-upgrade-reminder {
  cursor: pointer;
  color: #ffd700;
  font-size: 0.75rem;
  font-weight: bold;
  background-color: rgba(255, 215, 0, 0.15);
  border: 1px dashed #ffd700;
  padding: 2px 8px;
  border-radius: 4px;
  margin-right: 0.8rem;
  animation: pulse-glow 2s infinite ease-in-out;
  display: flex;
  align-items: center;
  gap: 2px;
  transition: background-color 0.2s, border-style 0.2s, box-shadow 0.2s;
  user-select: none;
}

.stat-upgrade-reminder:hover {
  background-color: rgba(255, 215, 0, 0.35);
  border-style: solid;
}

.stat-upgrade-reminder:active {
  background-color: rgba(255, 215, 0, 0.45);
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 4px rgba(255, 215, 0, 0.1);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
    transform: scale(1.03);
  }
}
</style>