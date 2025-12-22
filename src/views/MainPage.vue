<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {RoomLayout} from "@/components/RoomLayout";
import {UserLayout} from "@/components/UserLayout";
import {OperationLayout} from "@/components/OperationLayout";
import {FloorInfoLayout} from "@/components/FloorInfoLayout";
import {useGameStateStore} from "@/store/game-state-store";
import {GameState} from "@/enums/enums";
import {getEnumColumn} from "@/utils/enum";
import {StageEnum} from "@/enums/stage-enum";
import {UserValueLayout} from "@/components/UserValueLayout";
import {UserDetailInfo} from "@/components/DetailInfo";
import {usePlayerStore} from "@/store/player-store";
import {ElMessageBox, ElNotification} from "element-plus";
import {StageTransition} from "@/components/StageTransition";

const gameStateStore = useGameStateStore()
const playerStore = usePlayerStore()
const isDead = ref(false)
const cardConfig = ref({
  shadow: 'never',
})
const buttonConfig = ref({
  autoInsertSpace: true,
})

const initAll = async () => {
  // 初始化角色
  playerStore.init()
  // 初始化
  gameStateStore.init()
  // 前往第一層
  gameStateStore.setRoom(gameStateStore.currentRoom)
}


const startGame = async () => {
  await initAll()

}

const restartGame = async () => {
  isDead.value = false
  gameStateStore.init()
}

const resetGame = async () => {
  ElMessageBox.confirm(
      '確定要重新開始?',
      '再次確認',
      {
        confirmButtonText: '放棄這次旅程',
        confirmButtonClass: 'danger',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        gameStateStore.init()
      })
      .catch(() => {
      })
}

/** 觸發 **/
const RoomLayoutRef = ref()
const OperationLayoutRef = ref()
const onAttack = () => {
  RoomLayoutRef.value?.onAttack()
}

const onRun = () => {
  RoomLayoutRef.value?.onRun()
}
const onRest = () => {
  RoomLayoutRef.value?.onRest()
}

const onCancel = () => {
  RoomLayoutRef.value?.onCancel()
}

const onPlayerDead = (dead: boolean) => {
  if (!dead) {
    return
  }
  isDead.value = true
}

const onRunFailed = () => {
  OperationLayoutRef.value?.showEscapeFailedMessage()
}

// **【新增】房間唯一 ID/計數器**
// 每次進入一個「新房間」時，這個值就會增加，無論房間類型是否相同。
const showLoadingSuccess = () => {
  if (!gameStateStore.stateIs(GameState.INITIAL)) {
    ElNotification.success('已讀取緩存數據成功!')
  }
}
onMounted(() => {
  showLoadingSuccess()
})

const StageTransitionRef = ref()
watch(
    () => gameStateStore.currentStage,
    (val) => {
      if (val === StageEnum.BeginForest.value) {
        return
      }
      StageTransitionRef.value.playTransition(getEnumColumn(StageEnum, gameStateStore.currentStage));
    }
)
</script>

<template>
  <el-config-provider :card="cardConfig" :button="buttonConfig" :message="{max:3}">
    <div class="common-layout">
      <el-card
          v-if="isDead"
          :class="{'dead': isDead}"
          body-class="flex items-center justify-center flex-column"
      >
        <h1 style="color:var(--el-color-danger)">
          🪦YOU DIED🪦
        </h1>
        <h1 style="color:var(--el-color-danger);text-align: center">
          你倒在了第 {{ gameStateStore.currentStage }} 階段 - {{
            getEnumColumn(StageEnum, gameStateStore.currentStage)
          }} 的旅途上
        </h1>
        <el-button type="danger" style="width: 100%;height: 5rem" @click="restartGame">
          重新開始
        </el-button>
      </el-card>
      <el-card
          class="start-view"
          v-else-if="gameStateStore.stateIs(GameState.INITIAL)"
          body-class="flex items-center justify-center flex-column"
      >
        <h1>🏛️ 神之塔 🏛️</h1>
        <span>~聳立於大陸中央的巨塔,無盡的冒險正在等你開始~</span>
        <el-button style="width: 8rem;height: 5rem;margin-top: 1rem" @click="startGame">
          開始遊戲
        </el-button>
      </el-card>
      <el-container v-else>
        <el-header class="header">
          <span>🏛️ 神之塔 🏛️</span>
          <el-button type="danger" style="height: 2rem" size="small" @click="resetGame">重新開始</el-button>
        </el-header>
        <el-main>
          <FloorInfoLayout/>
          <RoomLayout
              ref="RoomLayoutRef"
              class="room-layout"
              @player-dead="onPlayerDead"
              @run-failed="onRunFailed"
          />
          <OperationLayout
              ref="OperationLayoutRef"
              class="operation-layout"
              @run="onRun"
              @attack="onAttack"
              @rest="onRest"
              @cancel="onCancel"
          />
          <UserValueLayout/>
          <UserLayout class="user-layout"/>
        </el-main>
      </el-container>
      <UserDetailInfo v-if="!gameStateStore.stateIs(GameState.INITIAL)"/>
    </div>
    <StageTransition ref="StageTransitionRef"/>
  </el-config-provider>
</template>


<style scoped>
.common-layout {
  position: relative;
  background-color: #303133;

}

.el-main {
  padding-top: 0 !important;
}

.el-main > * {
  margin-top: .5rem;
  margin-bottom: .5rem;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: bold;
  height: 5vh;
}

.room-layout {
  height: 40vh;
}

.operation-layout {
  height: 5vh;
}


.user-layout {
  height: 20vh;
}


.dead {
  height: 82vh;
  padding-bottom: 15vh;
}

.start-view {
  height: 82vh;
  padding-bottom: 15vh;
}
</style>
