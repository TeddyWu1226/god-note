<script setup lang="ts">
import {computed, ref} from "vue";
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {getEnumColumn} from "@/utils/enum";
import {StageEnum} from "@/enums/stage-enum";
import {GameState} from "@/enums/enums";
import {ElMessageBox} from "element-plus";
import {RoomEnum} from "@/enums/room-enum";
import {MATERIAL} from "@/constants/material-info";


const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();


const onClick = () => {
  ElMessageBox.confirm(
      '確定要挑戰本層BOSS?',
      '再次確認',
      {
        confirmButtonText: '確定',
        confirmButtonClass: 'danger',
        cancelButtonText: '再想想',
        type: 'warning',
      }
  )
      .then(() => {
        gameStateStore.days += 1
        gameStateStore.setRoom(RoomEnum.Boss.value);
        switch (gameStateStore.currentStage) {
          case 1:
            playerStore.removeItem(MATERIAL.ForestWood.name, 3)
        }
      })
      .catch(() => {
      })
}

const bossFightHint = ref('')
const isCanFightBoss = computed(() => {
  if (gameStateStore.stateIs(GameState.EVENT_PHASE)) {
    return false
  }
  switch (gameStateStore.currentStage) {
    case 1:
      // 收集靈木細枝
      const need = 3
      const [finish, current] = playerStore.hasItem(MATERIAL.ForestWood.name, need)
      bossFightHint.value = `收集 ${MATERIAL.ForestWood.name}(${current}/${need})`
      return finish
    default:
      return true
  }
})

</script>

<template>
  <el-card body-class="flex justify-between items-center">
    <span style="font-size: 16px">
      第 {{ gameStateStore.days }} 天
      [{{ getEnumColumn(StageEnum, gameStateStore.currentStage, 'label', '塔之後⏳') }}]
    </span>
    <div class="flex items-center">
      <span class="gold">{{ playerStore.info.gold }}💰</span>
      <el-button
          v-if="isCanFightBoss"
          type="danger"
          class="boss-btn active"
          @click="onClick"
      >
        挑戰BOSS💀
      </el-button>
      <el-button
          v-else-if="gameStateStore.stateIs(GameState.EVENT_PHASE)"
          type="info"
          class="boss-btn disabled"
          disabled>
        行動中...
      </el-button>
      <el-tooltip v-else effect="light">
        <template #content>
          <span>{{ bossFightHint }}</span>
        </template>
        <el-button type="info" class="boss-btn disabled" disabled>
          封印中🔒
        </el-button>
      </el-tooltip>
    </div>
  </el-card>
</template>

<style scoped>
.gold {
  color: gold;
  font-size: 1rem;
  margin-right: 0.5rem;
}

/* 基礎樣式 */
.boss-btn {
  position: relative;
  font-weight: bold;
  letter-spacing: 1px;
  transition: all 0.2s ease;
  overflow: hidden;
}

/* 啟動狀態：呼吸燈特效 */
.boss-btn.active {
  background: linear-gradient(45deg, #8b0000, #ff0000) !important;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
  animation: boss-pulse 1.5s infinite ease-in-out;
}

/* 懸停時：瘋狂抖動 + 強光 */
.boss-btn.active:hover {
  box-shadow: 0 0 25px rgba(255, 0, 0, 0.9);
  animation: boss-shake 0.1s infinite;
}

/* 禁用狀態：石化質感 */
.boss-btn.disabled {
  background: #333 !important;
  border: 1px solid #555 !important;
  color: #777 !important;
  filter: grayscale(1);
}

/* 呼吸動畫 */
@keyframes boss-pulse {
  0% {
    box-shadow: 0 0 5px rgba(255, 0, 0, 0.6);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 0, 0, 1), 0 0 30px rgba(139, 0, 0, 0.5);
  }
  100% {
    box-shadow: 0 0 5px rgba(255, 0, 0, 0.6);
  }
}

/* 抖動動畫 (增加臨場感) */
@keyframes boss-shake {
  0% {
    transform: translate(0, 0) scale(1.1);
  }
  25% {
    transform: translate(1px, -1px) scale(1.1);
  }
  50% {
    transform: translate(-1px, 1px) scale(1.1);
  }
  75% {
    transform: translate(1px, 1px) scale(1.1);
  }
  100% {
    transform: translate(0, 0) scale(1.1);
  }
}

/* 按鈕掃光效果 */
.boss-btn.active::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
  transform: rotate(45deg);
  animation: sweep 2s infinite;
}

@keyframes sweep {
  0% {
    transform: translate(-100%, -100%) rotate(45deg);
  }
  100% {
    transform: translate(100%, 100%) rotate(45deg);
  }
}
</style>