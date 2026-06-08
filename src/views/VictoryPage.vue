<script setup lang="ts">
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {getEnumColumn} from "@/utils/enum";
import {CharEnum} from "@/enums/char-enum";
import {computed} from "vue";

const gameStateStore = useGameStateStore()
const playerStore = usePlayerStore()

const restartGame = async () => {
  gameStateStore.init(1, true)
}

const characterClass = computed(() => {
  return getEnumColumn(CharEnum, playerStore.info?.char || 0) || '無名旅行者'
})

const finalSkills = computed(() => {
  return playerStore.info?.skills || []
})
</script>

<template>
  <div class="victory-container flex items-center justify-center">
    <el-card class="victory-card" body-style="padding: 2.5rem; display: flex; flex-direction: column; align-items: center;">
      <!-- 神聖的光環與標題 -->
      <div class="crown-halo">👑</div>
      <h1 class="victory-title">登上神座</h1>
      
      <p class="victory-subtitle">
        — 萬物的起點與終點，皆在你的掌心之中 —
      </p>

      <div class="story-box text-center">
        你歷經了整整 <strong class="highlight">{{ gameStateStore.days }} 天</strong> 的生死磨礪，
        突破了無盡之塔的極限考驗，在最終的審判之關卡中，
        成功擊敗了 <strong class="highlight-boss">創世守護者·塔納托斯</strong>。
        你洗盡凡軀，奪回了屬於神祇的權柄，踏上命運的最高王座！
      </div>

      <!-- 統計數據面板 -->
      <div class="stats-panel flex flex-column gap-3">
        <h3 class="panel-title">⚔️ 終局尊爵戰報 ⚔️</h3>
        <el-row :gutter="20" class="w-full">
          <el-col :span="12">
            <div class="stat-item">
              <span class="label">稱號職業:</span>
              <span class="value">{{ characterClass }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="stat-item">
              <span class="label">神性等級:</span>
              <span class="value">Lv.{{ playerStore.info?.level || 1 }}</span>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="w-full">
          <el-col :span="12">
            <div class="stat-item">
              <span class="label">擁有金幣:</span>
              <span class="value gold-value">{{ playerStore.info?.gold || 0 }} 💰</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="stat-item">
              <span class="label">最大生命:</span>
              <span class="value hp-value">{{ playerStore.finalStats?.hpLimit || 0 }} ❤️</span>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="w-full">
          <el-col :span="8">
            <div class="stat-item mini">
              <span class="label">物理攻擊:</span>
              <span class="value">{{ playerStore.finalStats?.ad || 0 }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="stat-item mini">
              <span class="label">魔法強度:</span>
              <span class="value">{{ playerStore.finalStats?.ap || 0 }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="stat-item mini">
              <span class="label">護甲防禦:</span>
              <span class="value">{{ playerStore.finalStats?.adDefend || 0 }}</span>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="w-full">
          <el-col :span="12">
            <div class="stat-item">
              <span class="label">閃避率:</span>
              <span class="value">{{ playerStore.finalStats?.dodge || 0 }}%</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="stat-item">
              <span class="label">暴擊率:</span>
              <span class="value">{{ playerStore.finalStats?.critRate || 0 }}%</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 神格技能欄位 -->
      <div v-if="finalSkills.length > 0" class="skills-panel w-full">
        <h3 class="panel-title">☄️ 繼承之神格技能 ☄️</h3>
        <div class="skills-grid">
          <div v-for="skill in finalSkills" :key="skill.id" class="skill-icon-box">
            <div class="skill-icon" :title="skill.name">{{ skill.icon }}</div>
            <div class="skill-name">{{ skill.name }}</div>
          </div>
        </div>
      </div>

      <!-- 重新開始按鈕 -->
      <el-button class="restart-btn animate-glow" @click="restartGame">
        開啟新的輪迴 ⏳
      </el-button>
    </el-card>
  </div>
</template>

<style scoped>
.victory-container {
  min-height: 100vh;
  width: 100%;
  background: radial-gradient(circle at center, #1a1510 0%, #0c0907 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 1.5rem;
}

.victory-card {
  width: 100%;
  max-width: 580px;
  background-color: rgba(18, 14, 11, 0.95);
  border: 2px solid #d4af37;
  border-radius: 16px;
  box-shadow: 0 0 25px rgba(212, 175, 55, 0.3), inset 0 0 15px rgba(212, 175, 55, 0.1);
  color: #f5f2eb;
  animation: scale-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.crown-halo {
  font-size: 4.5rem;
  line-height: 1;
  text-shadow: 0 0 20px #ffe066;
  animation: crown-float 3s ease-in-out infinite;
}

.victory-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin: 0.5rem 0 0.2rem 0;
  letter-spacing: 4px;
  background: linear-gradient(135deg, #ffe066 0%, #d4af37 50%, #aa8000 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(212, 175, 55, 0.2);
}

.victory-subtitle {
  font-size: 0.9rem;
  color: #c9b397;
  letter-spacing: 2px;
  font-style: italic;
  margin-bottom: 1.5rem;
}

.story-box {
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(212, 175, 55, 0.2);
  border-radius: 8px;
  padding: 1rem 1.5rem;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #dfdcd3;
  margin-bottom: 1.5rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.highlight {
  color: #ffe066;
  font-weight: bold;
}

.highlight-boss {
  color: #ff5555;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(255, 85, 85, 0.4);
}

.stats-panel {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 8px;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
  box-sizing: border-box;
}

.panel-title {
  font-size: 1rem;
  color: #d4af37;
  text-align: center;
  margin: 0 0 1rem 0;
  letter-spacing: 2px;
}

.w-full {
  width: 100%;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 0.5rem 0.8rem;
  margin-bottom: 8px;
}

.stat-item.mini {
  padding: 0.4rem 0.6rem;
  font-size: 0.85rem;
}

.stat-item .label {
  color: #a39e93;
}

.stat-item .value {
  font-weight: bold;
  color: #fff;
}

.gold-value {
  color: #ffe066 !important;
}

.hp-value {
  color: #ff6b6b !important;
}

.skills-panel {
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  box-sizing: border-box;
}

.skills-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
}

.skill-icon-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;
}

.skill-icon {
  font-size: 1.8rem;
  background-color: rgba(212, 175, 55, 0.15);
  border: 1px solid rgba(212, 175, 55, 0.4);
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.1);
}

.skill-name {
  font-size: 0.75rem;
  color: #dfdcd3;
  margin-top: 4px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.restart-btn {
  width: 100%;
  height: 3.5rem;
  background: linear-gradient(135deg, #d4af37 0%, #aa8000 100%);
  border: none;
  border-radius: 8px;
  color: #120e0b;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.restart-btn:hover {
  background: linear-gradient(135deg, #ffe066 0%, #d4af37 100%);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.5);
  transform: translateY(-2px);
}

.restart-btn:active {
  transform: translateY(0);
}

/* 核心動畫 */
@keyframes scale-up {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes crown-float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0);
  }
}

.animate-glow {
  animation: button-glow 3s infinite alternate;
}

@keyframes button-glow {
  0% {
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
  }
  100% {
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
  }
}

.flex-column {
  flex-direction: column;
}
.gap-3 {
  gap: 12px;
}
</style>
