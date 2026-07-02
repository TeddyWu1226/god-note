<script setup lang="ts">
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {useRelicStore} from "@/store/relic-store";
import {getEnumColumn} from "@/utils/enum";
import {StageEnum} from "@/enums/stage-enum";

const gameStateStore = useGameStateStore()
const playerStore = usePlayerStore()
const relicStore = useRelicStore()

const restartGame = async () => {
  // 記錄當前玩家所待的層級、等級以及隨機一件穿在身上的裝備
  relicStore.recordRelic(
    gameStateStore.currentStage,
    playerStore.info.level,
    playerStore.info.equips
  );

  gameStateStore.init()
}

</script>

<template>
  <el-card
      class="dead"
      body-class="flex items-center justify-center flex-column"
  >
    <h1 style="color:var(--el-color-danger)">
      🪦YOU DIED🪦
    </h1>
    <h1 style="color:var(--el-color-danger);text-align: center">
      經歷了 {{ gameStateStore.days }} 天
      <br/>
      你欽定的勇者最終倒在了 {{
        getEnumColumn(StageEnum, gameStateStore.currentStage)
      }}
    </h1>
    <el-button type="danger" style="width: 100%;height: 5rem" @click="restartGame">
      重新開始
    </el-button>
  </el-card>
</template>


<style scoped>

.dead {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.other-btn {
  height: 2rem;
  margin: 1rem;
}
</style>
