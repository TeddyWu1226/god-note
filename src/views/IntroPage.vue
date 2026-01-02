<script setup lang="ts">
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {RoomEnum} from "@/enums/room-enum";
import {Usable} from "@/constants/items/usalbe-item/usable-info";
import {useTrackerStore} from "@/store/track-store";
import {useAchievementStore} from "@/store/achievement-store";
import {DifficultyEnum} from "@/enums/difficulty-enum";
import {computed} from "vue";
import {useSaveStore} from "@/store/save-store";
import {ElMessageBox} from "element-plus";

const gameStateStore = useGameStateStore()
const playerStore = usePlayerStore()
const trackStore = useTrackerStore()
const achievementStore = useAchievementStore()
const saveStore = useSaveStore();

// ⭐️ 判斷是否有存檔：檢查 savedSlots[0] 是否有內容
const hasSave = computed(() => {
  return !!saveStore.savedSlots[0];
});

const initAll = async () => {
  playerStore.init();
  saveStore.clearSaves()
  gameStateStore.init();
  if (gameStateStore.difficulty === DifficultyEnum.Easy.value) {
    playerStore.gainItem(Usable.SmokeBomb);
    playerStore.gainItem(Usable.SmokeBomb);
    playerStore.gainItem(Usable.SmokeBomb);
  }
  trackStore.init();
  achievementStore.tryTime += 1;
  gameStateStore.setRoom(RoomEnum.Bless.value);
};

// ⭐️ 重新開始：如果有舊存檔，先跳出詢問
const startGame = async () => {
  if (hasSave.value) {
    try {
      await ElMessageBox.confirm(
          '重新開始將會覆蓋現有的神祇記事存檔，確定要抹除過去的輪迴嗎？',
          '命運警告',
          {
            confirmButtonText: '確定抹除',
            cancelButtonText: '保留回憶',
            type: 'warning',
            center: true,
          }
      );
      await initAll();
    } catch {
      // 點擊取消，不做任何動作
    }
  } else {
    await initAll();
  }
};

// ⭐️ 繼續遊戲
const continueGame = () => {
  saveStore.loadAll(0);
};


</script>

<template>
  <el-card class="start-view">
    <div class="content-wrapper">
      <h1 class="game-title">神祇記事</h1>
      <h2 class="game-subtitle">~無盡之塔~</h2>

      <div class="story-box">
        <p class="typewriter">傳說，高塔之巔棲息著能實現一切願望的神明</p>
        <p class="typewriter delay-1">千年來，無數勇者化作枯骨，卻無人能觸及雲端</p>
        <p class="typewriter delay-2">陌生的登塔者啊，你是命運的第幾次輪迴？</p>
      </div>
      <div class="difficulty-selection">
        <p class="select-title">—— 選擇命運的難度 ——</p>
        <div class="diff-cards">
          <div
              v-for="opt in DifficultyEnum"
              :key="opt.value"
              class="diff-card"
              :class="{ active: gameStateStore.difficulty === opt.value }"
              :style="{ '--diff-color': opt.color }"
              @click="gameStateStore.difficulty = opt.value"
          >
            <div class="diff-icon">{{ opt.icon }}</div>
            <div class="diff-label">{{ opt.label }}</div>
            <div class="diff-desc">{{ opt.desc }}</div>
          </div>
        </div>
      </div>
      <div class="action-zone">
        <el-button
            v-if="hasSave"
            class="continue-btn"
            @click="continueGame"
        >
          從紀錄開始
        </el-button>

        <el-button
            :class="hasSave ? 'restart-btn' : 'start-btn'"
            @click="startGame"
        >
          {{ hasSave ? '抹除並重新開始' : '登上旅途' }}
        </el-button>
      </div>
    </div>
  </el-card>
</template>


<style scoped>


/* 首頁背景與佈局 */
.start-view {
  height: 90vh;
  background: radial-gradient(circle at center, #1a1a1a 0%, #000000 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #444;
  position: relative;
  overflow: hidden;
}

/* 裝飾性光暈 */
.start-view::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  background: rgba(255, 215, 0, 0.05);
  filter: blur(80px);
  transform: translate(-50%, -50%);
}

.content-wrapper {
  text-align: center;
  z-index: 1;
}

/* 標題特效 */
.game-title {
  font-size: 3.5rem;
  font-family: "serif";
  letter-spacing: 0.5rem;
  background: linear-gradient(to bottom, #ffffff 0%, #888888 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
  margin-bottom: 0.5rem;
}

.game-subtitle {
  color: #ffd700;
  font-size: 1.2rem;
  letter-spacing: 0.8rem;
  margin-bottom: 3rem;
  opacity: 0.8;
}

/* 故事文字與打字機動畫 */
.story-box {
  margin-bottom: 4rem;
  min-height: 120px;
}

.typewriter {
  color: #ccc;
  font-size: 1rem;
  margin: 0.8rem 0;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid transparent;
  animation: typing 0.5s steps(40, end), fade-in 2s forwards;
}

.delay-1 {
  animation-delay: 0.5s;
  opacity: 0;
}

.delay-2 {
  animation-delay: 1s;
  opacity: 0;
}

/* 按鈕美化 */
.start-btn {
  background: transparent !important;
  border: 1px solid #ffd700 !important;
  color: #ffd700 !important;
  font-size: 1.5rem !important;
  padding: 2.5rem 4rem !important;
  transition: all 0.3s !important;
  position: relative;
}

.start-btn:hover {
  background: #ffd700 !important;
  color: #000 !important;
  box-shadow: 0 0 20px rgba(255, 214, 0, 0.6);
}


/* 動畫定義 */
@keyframes typing {
  from {
    width: 0
  }
  to {
    width: 100%
  }
}

@keyframes fade-in {
  to {
    opacity: 1;
  }
}


.difficulty-selection {
  margin-bottom: 3rem;
  animation: fade-in 2s forwards;
  animation-delay: 1.5s;
  opacity: 0;
}

.select-title {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  letter-spacing: 0.2rem;
}


:root {
  --diff-color: #fff
}

.diff-cards {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.diff-card {
  width: 140px;
  padding: 1.25rem 0.625rem;
  border: 1px solid #333;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.diff-card:hover {
  border-color: #666;
  background: rgba(255, 255, 255, 0.1);
}

.diff-card.active {
  border-color: var(--diff-color);
  background: rgba(var(--diff-color), 0.1);
  box-shadow: inset 0 0 15px var(--diff-color);
  transform: translateY(-5px);
}

.diff-label {
  color: #eee;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.diff-desc {
  font-size: 0.75rem;
  color: #777;
  line-height: 1.4;
}

.diff-card.active .diff-label {
  color: var(--diff-color);
}

.diff-card.active .diff-desc {
  color: #ccc;
}

.diff-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.action-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}

/* 繼續按鈕：充滿神性與光芒 */
.continue-btn {
  background: rgba(255, 215, 0, 0.1) !important;
  border: 1px solid #ffd700 !important;
  color: #fff !important;
  font-size: 1.6rem !important;
  padding: 2.2rem 4.5rem !important;
  transition: all 0.4s ease !important;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
  letter-spacing: 0.3rem;
  animation: pulse-glow 2.5s infinite;
}

.continue-btn:hover {
  background: #ffd700 !important;
  color: #000 !important;
  box-shadow: 0 0 30px rgba(255, 214, 0, 0.8);
  transform: scale(1.05);
}

/* 重新開始按鈕：有存檔時顯得比較暗淡且危險 */
.restart-btn {
  background: transparent !important;
  border: 1px solid #444 !important;
  color: #666 !important;
  font-size: 0.9rem !important;
  padding: 0.8rem 1.5rem !important;
  transition: all 0.3s !important;
}

.restart-btn:hover {
  border-color: #ff4d4d !important;
  color: #ff4d4d !important;
  background: rgba(255, 77, 77, 0.05) !important;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
    opacity: 0.9;
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
    opacity: 1;
  }
}
</style>
