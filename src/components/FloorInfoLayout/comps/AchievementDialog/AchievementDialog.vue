<script setup lang="ts">
import {computed, h, watch} from 'vue';
import {useTrackerStore} from "@/store/track-store";
import {QualityEnum} from "@/enums/quality-enum";
import {getEnumColumn} from "@/utils/enum";
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {AchievementType} from "@/types";
import {ElNotification} from "element-plus";
import {useAchievementStore} from "@/store/achievement-store";
import {checkAchievements} from "@/components/FloorInfoLayout/comps/AchievementDialog/achievement-service";
import {StageEnum} from "@/enums/stage-enum";

const model = defineModel({type: Boolean, default: false});
const achievementStore = useAchievementStore()
const trackerStore = useTrackerStore();
const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();


const sortedAchievements = computed(() => {
  // 將物件轉為陣列進行排序
  return Object.values(achievementStore.currentAchievement).sort((a, b) => {
    // 1. 如果解鎖狀態不同，已解鎖 (true) 的排前面
    if (a.isUnlocked !== b.isUnlocked) {
      return a.isUnlocked ? -1 : 1;
    }

    // 2. 如果解鎖狀態相同，則依照 quality 降冪排序 (大到小)
    return (a.quality || 0) - (b.quality || 0);
  });
});

// 取得品質對應顏色
const getColor = (quality: number) => {
  return getEnumColumn(QualityEnum, quality, 'color', '#ffffff');
};

// 成就通知
const triggerAchievementNotify = (ach: AchievementType) => {
  const achColor = getColor(ach.quality);

  ElNotification({
    title: '🏆 成就解鎖',
    // 使用 h 函數自定義內容，增加圖示與名稱的質感
    message: h('div', {style: `color: ${achColor}; font-weight: bold; font-size: 16px;`}, [
      h('h3', {style: `color: ${achColor}`}, `${ach.icon} ${ach.name}`),
      h('span', {style: `font-size: 0.8rem;`}, ach.description)
    ]),
    position: 'bottom-right',
    duration: 4000,
    offset: 20,
    customClass: `ach-notification ach-q-${ach.quality}`, // 注入品質 class
  });
}

/**
 * 解鎖成就檢查
 */
// 擊殺類
watch(
    () => [
      trackerStore.currentKills,
      trackerStore.totalKills,
      trackerStore.achievementsCount,
      playerStore.info,
      gameStateStore.isBattleWon,
      achievementStore.tryTime
    ],
    () => {
      // 呼叫外部服務進行檢查
      const unlockedKeys = checkAchievements(
          achievementStore.currentAchievement,
          {
            trackerStore: trackerStore,
            playerStore: playerStore,
            gameStateStore: gameStateStore,
            achievementStore: achievementStore
          }
      );

      // 處理新解鎖的成就
      unlockedKeys.forEach(key => {
        const ach = achievementStore.currentAchievement[key];
        ach.isUnlocked = true;
        triggerAchievementNotify(ach);
      });
    },
    {deep: true, immediate: true}
);
// 統計用
// 進度條顏色階梯
// 公開成就數據
const publicStats = computed(() => {
  const items = Object.values(achievementStore.currentAchievement).filter(a => !a.isHide);
  return {unlocked: items.filter(a => a.isUnlocked).length, total: items.length};
});

// 隱藏成就數據
const hiddenStats = computed(() => {
  const items = Object.values(achievementStore.currentAchievement).filter(a => a.isHide);
  return {unlocked: items.filter(a => a.isUnlocked).length, total: items.length};
});

// 進度百分比
const publicProgress = computed(() => (publicStats.value.total ? (publicStats.value.unlocked / publicStats.value.total) * 100 : 0));
const hiddenProgress = computed(() => (hiddenStats.value.total ? (hiddenStats.value.unlocked / hiddenStats.value.total) * 100 : 0));
// 更新成就名稱
const init = () => {
  achievementStore.init()
}
init()
</script>

<template>
  <el-dialog v-model="model" top="5vh" title="🏆 成就" class="achievement-dialog">
    <el-card style="margin-bottom: 1rem">
      目前進度: 第 {{gameStateStore.currentStage}} 層- {{getEnumColumn(StageEnum, gameStateStore.currentStage)}} (存活第 {{gameStateStore.days}} 天)
    </el-card>
    <div class="statistic-container">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="stat-card public">
            <el-statistic :value="publicStats.unlocked">
              <template #title>
                <div class="stat-title">
                  公開成就
                </div>
              </template>
              <template #suffix>/ {{ publicStats.total }}</template>
            </el-statistic>
            <div class="stat-progress-bg">
              <div class="stat-progress-fill" :style="{ width: publicProgress + '%' }"></div>
            </div>
          </div>
        </el-col>

        <el-col :span="12">
          <div class="stat-card hidden">
            <el-statistic :value="hiddenStats.unlocked" :value-style="{ color: '#a335ee' }">
              <template #title>
                <div class="stat-title">
                  隱藏成就
                </div>
              </template>
              <template #suffix>/ {{ hiddenStats.total }}</template>
            </el-statistic>
            <div class="stat-progress-bg">
              <div class="stat-progress-fill" :style="{ width: hiddenProgress + '%' }"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-scrollbar max-height="60vh">
      <div class="achievement-grid">
        <div
            v-for="ach in sortedAchievements"
            :key="ach.name"
            class="ach-card"
            :class="{ 'locked': !ach.isUnlocked, 'is-hide': ach.isHide && !ach.isUnlocked }"
            :style="{ '--ach-color': getColor(ach.quality) }"
        >
          <div class="ach-icon-wrapper">
            <span class="ach-icon">
              {{ (ach.isHide && !ach.isUnlocked) ? '❓' : ach.icon }}
            </span>
          </div>

          <div class="ach-info">
            <div class="ach-header">
              <span class="ach-name" :style="{ color: ach.isUnlocked ? getColor(ach.quality) : '#888' }">
                {{ (ach.isHide && !ach.isUnlocked) ? '？？？' : ach.name }}
              </span>
              <el-tag v-if="ach.isUnlocked" size="small" effect="dark" type="primary">
                已達成!
              </el-tag>
            </div>

            <p class="ach-desc">
              <template v-if="ach.isUnlocked || !ach.isHide">
                {{ ach.description }}
                <i v-if="ach.isUnlocked &&ach.hindHint" class="hint-text" style="padding-left: 1rem">
                  {{ ach.hindHint }}
                </i>
              </template>
              <template v-else>
                <i class="hint-text">{{ ach.hindHint || '尚未解鎖的隱藏成就...' }}</i>
              </template>
            </p>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<style scoped>
:root {
  --ach-color: #ffff
}

.achievement-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.625rem;
}

.ach-card {
  display: flex;
  align-items: center;
  background: rgba(40, 40, 40, 0.8);
  border: 0.0625rem solid #444; /* 1px / 16 */
  border-left: 0.25rem solid var(--ach-color); /* 4px / 16 */
  border-radius: 0.5rem; /* 8px / 16 */
  padding: 0.75rem; /* 12px / 16 */
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.ach-card.locked {
  filter: grayscale(0.8);
  opacity: 0.7;
}

.ach-card:not(.locked) {
  background: rgba(50, 50, 50, 0.9);
  box-shadow: 0 0 0.625rem v-bind('getColor(ach?.quality) + "33"');
}

.ach-icon-wrapper {
  width: 3.125rem; /* 50px / 16 */
  height: 3.125rem; /* 50px / 16 */
  display: flex;
  justify-content: center;
  align-items: center;
  background: #222;
  border-radius: 50%;
  margin-right: 0.9375rem; /* 15px / 16 */
  font-size: 1.8rem;
  border: 0.125rem solid #333; /* 2px / 16 */
}

.ach-info {
  flex: 1;
}

.ach-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem; /* 4px / 16 */
}

.ach-name {
  font-size: 1.1rem;
  font-weight: bold;
}

.ach-desc {
  margin: 0;
  font-size: 0.9rem;
  color: #bbb;
  line-height: 1.4;
}

.hint-text {
  color: #666;
  font-style: italic;
}

/* 隱藏成就特別樣式 */
.is-hide {
  border-style: dashed;
}

.statistic-container {
  padding: 1.25rem;
  background: rgba(20, 20, 20, 0.6);
  border-radius: 0.75rem;
  border: 0.0625rem solid #444;
  margin-bottom: 1rem;
}

.stat-card {
  padding: 0.625rem 1rem;
  background: rgba(45, 45, 45, 0.4);
  border-radius: 0.5rem;
  position: relative;
  overflow: hidden;
}

.stat-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #aaa;
}

/* 自定義迷你進度條（位於數字下方） */
.stat-progress-bg {
  height: 0.1875rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.125rem;
  margin-top: 0.5rem;
}

.stat-progress-fill {
  height: 100%;
  transition: width 0.6s ease;
}

.public .stat-progress-fill {
  background: #409eff;
  box-shadow: 0 0 0.5rem #409eff;
}

.hidden .stat-progress-fill {
  background: #a335ee;
  box-shadow: 0 0 0.5rem #a335ee;
}

/* 覆蓋 Element Plus 預設字體顏色 */
:deep(.el-statistic__content) {
  font-family: 'Monaco', 'Courier New', monospace;
  font-weight: bold;
}

:deep(.el-statistic__head) {
  margin-bottom: 0.25rem;
}

</style>

