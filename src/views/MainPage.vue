<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
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
import AchievementDialog from "@/components/FloorInfoLayout/comps/AchievementDialog/AchievementDialog.vue";
import {LevelUpReward} from "@/components/LevelUpReward";

const gameStateStore = useGameStateStore()
const isDead = computed(() => gameStateStore.isDead);
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
      <DeadPage v-if="isDead"/>
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
          <UserValueLayout/>
          <UserLayout class="user-layout" @on-item-skill="onItemSkill"/>
        </el-main>
      </el-container>
      <UserDetailInfo v-if="!gameStateStore.stateIs(GameState.INITIAL)"/>
    </div>
    <StageTransition ref="StageTransitionRef"/>
    <el-dialog
        v-model="isShowIllustration"
        title="📖 說明"
        width="500px"
        custom-class="illustration-dialog"
    >
      <div class="rule-container">
        <section class="rule-section">
          <h3 class="section-title">◈ 塔層與挑戰</h3>
          <div class="rule-item">
            <span class="rule-icon">🧗</span>
            <p><strong>階層結構：</strong> 唯有擊敗該層 <span class="highlight-boss">BOSS</span> 才能前往下一層。</p>
          </div>
          <div class="rule-item">
            <span class="rule-icon">🔒</span>
            <p><strong>挑戰限制：</strong> 需達成指定條件後，方可解鎖 BOSS 挑戰權。</p>
          </div>
          <div class="rule-item">
            <span class="rule-icon">🗺️</span>
            <p><strong>路線規劃：</strong> 你可以自由選擇路線，但請在挑戰 BOSS 前做好萬全準備。</p>
          </div>
        </section>

        <hr class="divider"/>

        <section class="rule-section">
          <h3 class="section-title">◈ 戰鬥與成長</h3>
          <div class="rule-item">
            <span class="rule-icon">🕒</span>
            <p><strong>環境壓制：</strong> 每一層怪物會隨著 <span class="highlight-time">時間流逝</span> 變得愈發強大。
            </p>
          </div>
          <div class="rule-item">
            <span class="rule-icon">📈</span>
            <p><strong>經驗提升：</strong> 擊敗等級 <span class="highlight-exp">≥1</span> 的怪物可獲高額經驗；低於自身等級者經驗大幅削減。
            </p>
          </div>
          <div class="rule-item">
            <span class="rule-icon">💀</span>
            <p><strong>進階戰鬥：</strong> 有機率遭遇 <span class="highlight-elite">[菁英]</span> 敵人。它們極其強大，但等級更高且<strong>必定掉落</strong>專屬獎勵。
            </p>
          </div>
          <div class="rule-item">
            <span class="rule-icon">✨</span>
            <p><strong>技能強化：</strong> 技能採用熟練度強化,每次使用可提升1點熟練度,最高100(MAX)
            </p>
          </div>
        </section>

        <div class="rule-footer">
          <span class="rule-icon">💡</span> 提示：多觀察道具與怪物的細節描述，往往隱藏著生存關鍵。
        </div>
      </div>
    </el-dialog>
    <AchievementDialog v-model="isShowAchievementDialog"/>
    <LevelUpReward/>
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


.user-layout {
  height: 20vh;
}

.rule-container {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  line-height: 1.6;
  /* 16px / 16 = 1rem */
  padding: 0.5rem;
}

.section-title {
  /* 18px / 16 = 1.125rem */
  font-size: 1.125rem;
  color: #8e44ad;
  margin-bottom: 0.75rem; /* 12px */
  font-weight: bold;
  display: flex;
  align-items: center;
}

.rule-section {
  margin-bottom: 1.5rem; /* 24px */
}

.rule-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.9375rem; /* 15px */
  background: var(--el-card-bg-color);
  padding: 0.625rem; /* 10px */
  border-radius: 0.5rem; /* 8px */
  transition: transform 0.2s ease;
}


.rule-item p {
  margin: 0;
  /* 15px / 16 = 0.9375rem */
  font-size: 0.9375rem;
}

.highlight-boss {
  color: #d63031;
  font-weight: bold;
}

.highlight-time {
  color: #e67e22;
  font-weight: bold;
}

.highlight-exp {
  color: #27ae60;
  font-weight: bold;
}

.highlight-elite {
  color: #0984e3;
  font-weight: bold;
}

.divider {
  border: 0;
  border-top: 0.0625rem dashed #ddd; /* 1px */
  margin: 1.25rem 0; /* 20px */
}

.rule-footer {
  margin-top: 1.25rem; /* 20px */
  padding: 0.75rem; /* 12px */
  background: #fff3cd;
  /* 4px / 16 = 0.25rem */
  border-left: 0.25rem solid #ffc107;
  /* 13.6px / 16 = 0.85rem */
  font-size: 0.85rem;
  border-radius: 0.25rem; /* 4px */
  color: #856404;
}

/* 強制調整 Dialog 內的強勢標籤 */
strong {
  margin-right: 0.125rem;
}
</style>
