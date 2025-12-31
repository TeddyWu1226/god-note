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
import {ElMessageBox, ElNotification} from "element-plus";
import {StageTransition} from "@/components/StageTransition";
import DeadPage from "@/views/DeadPage.vue";
import IntroPage from "@/views/IntroPage.vue";
import AchievementDialog from "@/components/FloorInfoLayout/comps/AchievementDialog.vue";

const gameStateStore = useGameStateStore()
const isDead = ref(false)
const cardConfig = ref({
  shadow: 'never',
})
const buttonConfig = ref({
  autoInsertSpace: true,
})

/** 成就 **/
const isShowAchievementDialog = ref(false)
const showAchievement = () => {
  isShowAchievementDialog.value = true
}

/** 說明 **/
const isShowIllustration = ref(false)
const showIllustrate = () => {
  isShowIllustration.value = true
}

/** 重新開始 **/
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
const onSkill = (skillKey: string) => {
  RoomLayoutRef.value?.onSkill(skillKey)
}
const onItemSkill = (prop) => {
  RoomLayoutRef.value?.onItemSkill(prop)
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

const showLoadingSuccess = () => {
  if (!gameStateStore.stateIs(GameState.INITIAL)) {
    ElNotification.success('已讀取緩存數據')
  }
}
onMounted(() => {
  showLoadingSuccess()
})
// 好看的進入階層動畫
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
      <DeadPage
          v-if="isDead"
          @restart="()=>{
            isDead = false
          }"
      />
      <IntroPage v-else-if="gameStateStore.stateIs(GameState.INITIAL)"/>
      <el-container v-else>
        <el-header class="header">
          <span>𝄞神祇記事𝄞</span>
          <div>
            <el-button type="warning" style="height: 2rem" size="small" @click="showAchievement" plain>
              🏆 成就
            </el-button>
            <el-button type="primary" style="height: 2rem" size="small" @click="showIllustrate" plain>
              📖 說明
            </el-button>
            <el-button type="danger" style="height: 2rem" size="small" @click="resetGame" plain>
              🪦 放棄
            </el-button>
          </div>
        </el-header>
        <el-main>
          <FloorInfoLayout/>
          <RoomLayout
              ref="RoomLayoutRef"
              class="room-layout"
              @run-failed="onRunFailed"
          />
          <OperationLayout
              ref="OperationLayoutRef"
              class="operation-layout"
              @run="onRun"
              @attack="onAttack"
              @rest="onRest"
              @cancel="onCancel"
              @skill="onSkill"
          />
          <UserValueLayout @player-dead="onPlayerDead"/>
          <UserLayout class="user-layout" @on-item-skill="onItemSkill"/>
        </el-main>
      </el-container>
      <UserDetailInfo v-if="!gameStateStore.stateIs(GameState.INITIAL)"/>
    </div>
    <StageTransition ref="StageTransitionRef"/>
    <el-dialog v-model="isShowIllustration" title="說明">
      <p>1. 無盡之塔是階層式結構,唯有打敗該層BOSS才能前往下一層</p>
      <p>2. 在達成指定條件前, 無法挑戰該層BOSS</p>
      <p>3. 你可以盡情的選擇你所想要走的路線,但請做好萬全準備後再選擇挑戰BOSS</p>
      <p>4. 命只有一次,死亡即是終點,也是新的開始</p>
      <p>5. 道具,怪物基本都有相關提示,也許多看點對你有幫助</p>
      <p>6. 怪物會隨著時間變得更加強大,直到你通過該層層主</p>
    </el-dialog>
    <AchievementDialog v-model="isShowAchievementDialog"/>
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

.user-layout {
  height: 20vh;
}
</style>
