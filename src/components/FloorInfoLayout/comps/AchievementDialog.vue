<script setup lang="ts">
import {computed, h, ref, watch} from 'vue';
import {useTrackerStore} from "@/store/track-store";
import {QualityEnum} from "@/enums/quality-enum";
import {getEnumColumn} from "@/utils/enum";
import {Achievement} from "@/constants/achievement";
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {AchievementType} from "@/types";
import {ElNotification} from "element-plus";
import {useAchievementStore} from "@/store/achievement-store";
import {CharEnum} from "@/enums/char-enum";

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
 * 成就檢查
 */
// 擊殺類
watch(
    () => [
      trackerStore.currentKills, trackerStore.totalKills, trackerStore.achievementsCount,
      playerStore.info,
      gameStateStore.isBattleWon,
    ],
    () => {
      // 遍歷所有尚未解鎖的成就
      Object.entries(achievementStore.currentAchievement).forEach(([key, ach]: [keyof typeof Achievement, AchievementType]) => {
        if (ach.isUnlocked) return; // 已經解鎖的跳過

        let isConditionMet = false;

        // 總擊殺系列
        if (key.startsWith('Kill')) {
          const totalKills = trackerStore.getKillCount('TOTAL', 'total');
          if (key === 'Kill20' && totalKills >= 20) isConditionMet = true;
          if (key === 'Kill200' && totalKills >= 200) isConditionMet = true;
          if (key === 'Kill2000' && totalKills >= 2000) isConditionMet = true;
        }
        // 菁英擊殺系列
        if (key.startsWith('EliteHunter')) {
          const eliteKills = trackerStore.getKillCount('ElITE', 'total');
          if (key === 'EliteHunter10' && eliteKills >= 10) isConditionMet = true;
          if (key === 'EliteHunter100' && eliteKills >= 100) isConditionMet = true;
          if (key === 'EliteHunter1000' && eliteKills >= 1000) isConditionMet = true;
          if (key === 'EliteHunter1000' && eliteKills >= 1000) isConditionMet = true;
        }
        // 金幣成就
        if (key.startsWith('Gold')) {
          const golds = playerStore.info.gold
          if (key === 'Gold1000' && golds >= 1000) isConditionMet = true;
          if (key === 'Gold9999' && golds >= 9999) isConditionMet = true;
        }
        // BOSS擊殺
        if (key.startsWith('Boss')) {
          if (key === 'Boss0' && trackerStore.getKillCount('森林守護者', 'total')) isConditionMet = true;
        }

        // 隱藏成就
        if (key === 'NewKillWolf' &&
            gameStateStore.currentStage === 1 &&
            (trackerStore.getKillCount('森林之狼', 'current') >= 1)) {
          isConditionMet = true;
        }
        if (key === 'NearDeath' &&
            gameStateStore.isBattleWon &&
            (playerStore.info.hp / playerStore.finalStats.hpLimit) <= 0.05
        ) {
          isConditionMet = true;
        }
        if (key === 'Pacifist' &&
            trackerStore.achievementsCount.peaceDay >= 30) {
          isConditionMet = true;
        }
        if (key === 'GambleMaster' &&
            trackerStore.achievementsCount.gambleWin >= 3) {
          isConditionMet = true;
        }
        if (key === 'ThisGameHasJob' &&
            playerStore.info.char !== CharEnum.Beginner.value
        ) {
          isConditionMet = true;
        }


        // --- 觸發解鎖 ---
        if (isConditionMet) {
          ach.isUnlocked = true;

          // 彈出右下角通知
          triggerAchievementNotify(ach);
        }
      });
    },
    {deep: true, immediate: true}
);
// 統計用
// 進度條顏色階梯
const progressColors = [
  {color: '#909399', percentage: 20},
  {color: '#67c23a', percentage: 40},
  {color: '#409eff', percentage: 60},
  {color: '#e6a23c', percentage: 80},
  {color: '#f56c6c', percentage: 100},
];

// 計算冒險評價
const getRankTitle = computed(() => {
  const ratio = Object.values(achievementStore.currentAchievement).filter(a => a.isUnlocked).length / Object.keys(achievementStore.currentAchievement).length;
  if (ratio >= 1) return '神話級挑戰者';
  if (ratio >= 0.8) return '傳說冒險者';
  if (ratio >= 0.5) return '資深討伐者';
  if (ratio >= 0.2) return '正式勇者';
  return '初出茅廬';
});

const getRankColor = computed(() => {
  const ratio = Object.values(achievementStore.currentAchievement).filter(a => a.isUnlocked).length / Object.keys(achievementStore.currentAchievement).length;
  if (ratio >= 1) return '#ffcc00'; // 金色
  if (ratio >= 0.8) return '#e600ff';
  if (ratio >= 0.5) return '#a335ee';
  return '#409eff'; // 藍色
});
</script>

<template>
  <el-dialog v-model="model" top="5vh" title="🏆 成就" class="achievement-dialog">
    <div class="statistic-container">
      <div class="stat-main">
        <el-progress
            type="circle"
            :percentage="Math.round((Object.values(achievementStore.currentAchievement).filter(a => a.isUnlocked).length / Object.keys(achievementStore.currentAchievement).length) * 100)"
            :stroke-width="10"
            :color="progressColors"
            :width="80"
        >
          <template #default="{ percentage }">
            <div class="progress-label">
              <span class="percentage">{{ percentage }}%</span>
              <span class="label">解鎖率</span>
            </div>
          </template>
        </el-progress>

        <div class="stat-info">
          <div class="stat-item">
            <span class="stat-title">已達成成就</span>
            <span class="stat-value">
              <i class="count">{{
                  Object.values(achievementStore.currentAchievement).filter(a => a.isUnlocked).length
                }}</i>
              <span class="total">/ {{ Object.keys(achievementStore.currentAchievement).length }}</span>
            </span>
          </div>
          <div class="stat-item">
            <span class="stat-title">評價</span>
            <span class="stat-rank" :style="{ color: getRankColor }">{{ getRankTitle }}</span>
          </div>
        </div>
      </div>

      <div class="stat-divider"></div>
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

</style>

<style>
/* 注意：ElNotification 掛載在 body 下，不能用 scoped */
.el-notification.ach-notification {
  background-color: rgba(20, 20, 20, 0.95) !important;
  border: 0.0625rem solid #444 !important; /* 1px */
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.5) !important; /* 4px 12px */
  border-left: 0.3125rem solid #fff !important; /* 5px */
}

.el-notification.ach-notification .el-notification__title {
  color: #999 !important;
  font-size: 0.75rem !important; /* 12px / 16 */
  text-transform: uppercase;
}

/* 根據不同品質定義發光色 (對應你的品質顏色) */
.ach-q-0 {
  border-left-color: #ffffff !important;
}

.ach-q-1 {
  border-left-color: #1eff00 !important;
}

.ach-q-2 {
  border-left-color: #0070dd !important;
}

.ach-q-3 {
  border-left-color: #a335ee !important;
}

.ach-q-4 {
  border-left-color: #ff8000 !important;
}

.ach-q-5 {
  border-left-color: #ffcc00 !important;
  animation: ach-rainbow-glow 2s infinite linear;
}

@keyframes ach-rainbow-glow {
  0% {
    box-shadow: 0 0 5px #ffcc00;
  }
  50% {
    box-shadow: 0 0 20px #ffcc00;
  }
  100% {
    box-shadow: 0 0 5px #ffcc00;
  }
}

/* 讓通知彈出時有細微的縮放震動感 */
.el-notification.ach-notification {
  animation: ach-pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes ach-pop-in {
  from {
    transform: translateX(100%) scale(0.8);
    opacity: 0;
  }
  to {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

.statistic-container {
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(50, 50, 50, 0.7) 100%);
  border: 1px solid #555;
  border-radius: 12px;
  margin: 10px;
  padding: 20px;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.5);
}

.stat-main {
  display: flex;
  align-items: center;
  gap: 25px;
}

.progress-label {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.progress-label .percentage {
  font-size: 1.2rem;
  font-weight: bold;
  color: #eee;
}

.progress-label .label {
  font-size: 0.6rem;
  color: #888;
}

.stat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-title {
  font-size: 0.8rem;
  color: #aaa;
  margin-bottom: 4px;
}

.stat-value {
  font-family: 'Crimson Text', serif; /* 如果有引入遊戲字體 */
  font-size: 1.4rem;
  color: #ddd;
}

.stat-value .count {
  color: #ffcc00; /* 突顯數字 */
  font-style: normal;
  font-weight: bold;
  margin-right: 4px;
}

.stat-value .total {
  font-size: 0.9rem;
  color: #666;
}

.stat-rank {
  font-size: 1.2rem;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.8);
  letter-spacing: 1px;
}

.stat-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, #555, transparent);
  margin-top: 15px;
}

/* 讓 Progress 裡的文字顏色適配暗色模式 */
:deep(.el-progress__text) {
  color: #eee !important;
}
</style>