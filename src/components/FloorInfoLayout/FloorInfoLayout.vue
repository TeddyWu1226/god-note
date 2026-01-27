<script setup lang="ts">
import {computed} from "vue";
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {getEnumColumn} from "@/utils/enum";
import {StageEnum} from "@/enums/stage-enum";
import {GameState} from "@/enums/enums";
import {ElMessageBox} from "element-plus";
import {RoomEnum} from "@/enums/room-enum";
import {Material} from "@/constants/items/material/material-info";
import {useTrackerStore} from "@/store/track-store";
import {Monster} from "@/constants/monsters/monster-info";
import {SpecialItem} from "@/constants/items/special-item-info";


const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();
const trackerStore = useTrackerStore();


const onClick = () => {
  ElMessageBox.confirm(
      `<p>${stageProgress.value.text}(已達成)</p><p>確定要挑戰本層BOSS?</p>`,
      '再次確認',
      {
        dangerouslyUseHTMLString: true,
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
            playerStore.removeItem(Material.ForestWood.name, 3)
            break;
          case 5:
            playerStore.removeItem(SpecialItem.TwilightKey.name, 1)
            break;
          case 7:
            playerStore.removeItem(SpecialItem.ClearMirror.name, 1)
            playerStore.removeItem(SpecialItem.ClearMirrorFragment.name, -1)
            break;
        }
      })
      .catch(() => {
      })
}

// 任務類型枚舉
enum QuestType {
  COLLECT = 'COLLECT', // 收集物品
  TARGET = 'TARGET', // 擊敗特定怪物
  KILL = 'KILL', // 擊敗不特定怪物
  SURVIVE = 'SURVIVE' // 生存天數
}

const STAGE_GOALS: Record<number, {
  type: QuestType;
  target?: string;
  need: number;
  label: string
}> = {
  1: {type: QuestType.COLLECT, target: Material.ForestWood.name, need: 3, label: '收集'},
  2: {type: QuestType.KILL, need: 30, label: '狩獵'},
  3: {type: QuestType.TARGET, target: Monster.SmallSpider.name, need: 3, label: '擊敗'},
  4: {type: QuestType.SURVIVE, target: '50天', need: 50, label: '生存'},
  5: {type: QuestType.COLLECT, target: SpecialItem.TwilightKey.name, need: 1, label: '收集'},
  6: {type: QuestType.KILL, need: 30, label: '狩獵'},
  7: {type: QuestType.COLLECT, target: SpecialItem.ClearMirror.name, need: 1, label: '收集'},
  8: {type: QuestType.SURVIVE, target: '40天', need: 40, label: '生存'},
  9: {type: QuestType.KILL, need: 50, label: '狩獵'},
  10: {type: QuestType.SURVIVE, target: '30天', need: 30, label: '生存'},
  11: {type: QuestType.COLLECT, target: Material.MagicSnowStone.name, need: 3, label: '收集'},
  12: {type: QuestType.COLLECT, target: Material.MagicSnowStone.name, need: 6, label: '收集'},
  13: {type: QuestType.COLLECT, target: Material.MagicSnowStone.name, need: 9, label: '收集'},
  14: {type: QuestType.COLLECT, target: Material.MagicSnowStone.name, need: 12, label: '收集'},
  15: {type: QuestType.COLLECT, target: Material.MagicSnowStone.name, need: 15, label: '收集'},
  16: {type: QuestType.SURVIVE, target: '999天', need: 999, label: '生存(待開發)'},
};
// 獲取當前階段的進度數據
const stageProgress = computed(() => {
  const goal = STAGE_GOALS[gameStateStore.currentStage];
  if (!goal) return {finish: true, current: 0, need: 0, text: '準備挑戰 Boss'};

  let current = 0;
  let finish = false;

  // 根據不同類型去不同的 Store 拿資料
  switch (goal.type) {

    case QuestType.COLLECT:
      // 收集指定道具
      const [has, count] = playerStore.hasItem(goal.target, goal.need);
      current = count;
      finish = has;
      break;

    case QuestType.TARGET:
      // 擊殺特定怪物
      current = trackerStore.getKillCount(goal.target, 'current');
      finish = current >= goal.need;
      break;

    case QuestType.KILL:
      // 擊殺不特定怪物
      current = trackerStore.getKillCount('TOTAL', 'current');
      finish = current >= goal.need;
      break;


    case QuestType.SURVIVE:
      // 存活定天數
      current = gameStateStore.days;
      finish = current >= goal.need;
      break;
  }

  return {
    finish,
    current,
    need: goal.need,
    text: `${goal.label} ${goal.target ?? '任意怪物'} (${current}/${goal.need})`
  };
});

// 最終暴露給 UI 的變數
const isCanFightBoss = computed(() => {
  if (gameStateStore.stateIs(GameState.EVENT_PHASE)) return false;
  return stageProgress.value.finish;
});

const bossFightHint = computed(() => stageProgress.value.text);

</script>

<template>
  <el-card body-class="flex justify-between items-center">
    <span style="font-size: 16px">
      第 {{ gameStateStore.days }} 天 -
      {{ getEnumColumn(StageEnum, gameStateStore.currentStage, 'label', '塔之後⏳') }}
    </span>
    <div class="flex items-center">
      <span class="gold">{{ playerStore.info.gold }}💰</span>
      <el-button
          v-if="isCanFightBoss && gameStateStore.currentRoomValue !== RoomEnum.Boss.value"
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