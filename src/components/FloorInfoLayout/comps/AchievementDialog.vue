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

const model = defineModel({type: Boolean, default: false});
const achievementStore = useAchievementStore()
const trackerStore = useTrackerStore();
const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();


// 將成就物件轉為陣列，方便渲染，並將已解鎖的排在前面
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
        if (key.startsWith('kill')) {
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

</script>

<template>
  <el-dialog v-model="model" top="5vh" width="50rem" title="🏆 冒險成就" class="achievement-dialog">
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
  gap: 12px;
  padding: 10px;
}

.ach-card {
  display: flex;
  align-items: center;
  background: rgba(40, 40, 40, 0.8);
  border: 1px solid #444;
  border-left: 4px solid var(--ach-color);
  border-radius: 8px;
  padding: 12px;
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
  box-shadow: 0 0 10px v-bind('getColor(ach?.quality) + "33"'); /* 輕微發光 */
}

.ach-icon-wrapper {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #222;
  border-radius: 50%;
  margin-right: 15px;
  font-size: 1.8rem;
  border: 2px solid #333;
}

.ach-info {
  flex: 1;
}

.ach-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
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

/* 滾動條美化 */
:deep(.el-scrollbar__bar.is-vertical) {
  width: 6px;
}
</style>

<style>
/* 注意：ElNotification 掛載在 body 下，不能用 scoped */
.el-notification.ach-notification {
  background-color: rgba(20, 20, 20, 0.95) !important;
  border: 1px solid #444 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
  border-left: 5px solid #fff !important; /* 預設 */
}

.el-notification.ach-notification .el-notification__title {
  color: #999 !important;
  font-size: 12px !important;
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
</style>