<script setup lang="ts">
import {ref} from 'vue';
import {EnemyLayout} from "@/components/EnemyLayout";
import {UserLayout} from "@/components/UserLayout";
import {OperationLayout} from "@/components/OperationLayout";
import {FloorInfoLayout} from "@/components/FloorInfoLayout";
import {useGameStateStore} from "@/store/game-state-store";
import {GameState} from "@/enums/enums";
import {initAll} from "@/storage/init";
import {ElMessage} from "element-plus";
import {Floor} from "@/storage/floor-storage";
import {getEnumColumn} from "@/utils/enum";
import {StageEnum} from "@/enums/stage-enum";

const isDead = ref(false)
const cardConfig = ref({
  shadow: 'never',
})
const buttonConfig = ref({
  autoInsertSpace: true,
})

const gameStateStore = useGameStateStore()
const startGame = async () => {
  await initAll()
  gameStateStore.transitionToNextState()
}

const restartGame = async () => {
  isDead.value = false
  await initAll()
  gameStateStore.init()
}

/** 觸發 **/
const EnemyLayoutRef = ref()
const onAttack = () => {
  EnemyLayoutRef.value?.onAttack()
}


const onPlayerDead = (dead: boolean) => {
  if (!dead) {
    return
  }
  isDead.value = true
}
</script>

<template>
  <el-config-provider :card="cardConfig" :button="buttonConfig" :message="{max:3}">
    <div class="common-layout">
      <el-card
          v-if="isDead"
          style="padding: 5rem;margin: 2rem"
          body-class="flex items-center justify-center flex-column"
          aaa
      >
        <h1 style="color:var(--el-color-danger)">
          🪦你死了....🪦
        </h1>
        <h1 style="color:var(--el-color-danger)">
          死在第 {{ Floor.currentStage }} 階段 - {{ getEnumColumn(StageEnum, Floor.currentStage) }} 的旅途上
        </h1>
        <el-button type="danger" style="width: 8rem;height: 5rem" @click="restartGame">
          重新開始
        </el-button>
      </el-card>
      <el-card
          v-else-if="gameStateStore.stateIs(GameState.INITIAL)"
          style="padding: 5rem;margin: 2rem"
          body-class="flex items-center justify-center flex-column"
          aaa
      >
        <h1>🏛️ 神之塔 🏛️</h1>
        <span>不斷挑戰神的無限旅途</span>
        <el-button style="width: 8rem;height: 5rem" @click="startGame">
          開始遊戲
        </el-button>
      </el-card>
      <el-container v-else>
        <el-header class="header">
          <span>🏛️ 神之塔 🏛️</span>
        </el-header>
        <el-main>
          <FloorInfoLayout/>
          <EnemyLayout
              ref="EnemyLayoutRef"
              class="enemy-layout"
              @player-dead="onPlayerDead"
          />
          <OperationLayout class="operation-layout" @attack="onAttack"/>
          <UserLayout class="user-layout"/>
        </el-main>
      </el-container>
    </div>
  </el-config-provider>
</template>


<style scoped>
.common-layout {
  background-color: #303133;

}

.el-main {
  padding-top: 0 !important;
}

.el-main > * {
  margin-top: .5rem;
  margin-bottom: .5rem;
}


.enemy-layout {
  height: 40vh;
}

.operation-layout {
  height: 5vh;
}

.user-layout {
  height: 30vh;
}

.header {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}

</style>
