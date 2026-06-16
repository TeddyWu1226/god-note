<script setup lang="ts">
import {useGameStateStore} from "@/store/game-state-store";
import {getEnumColumn} from "@/utils/enum";
import {StageEnum} from "@/enums/stage-enum";

const gameStateStore = useGameStateStore()

const restartGame = async () => {
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
      你在無盡之塔中存活了 {{ gameStateStore.days }} 天
      <br/>
      倒在了第 {{
        getEnumColumn(StageEnum, gameStateStore.currentStage)
      }} 的旅途上
    </h1>
    <!--    <div>-->
    <!--      <el-button type="primary" class="other-btn">顯示其他數據</el-button>-->
    <!--    </div>-->
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
