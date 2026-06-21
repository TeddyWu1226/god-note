<script setup lang="ts">
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {RoomEnum} from "@/enums/room-enum";
import {useTrackerStore} from "@/store/track-store";

import {computed, ref} from "vue";
import {useSaveStore} from "@/store/save-store";
import {ElMessageBox} from "element-plus";
import {Dagger, Sword} from "@/constants/items/equipment/weapon-info";
import {NormalFruits} from "@/constants/items/usalbe-item/bush-info";
import {CharEnum} from "@/enums/char-enum";
import {Offhand} from "@/constants/items/equipment/offhand-info";

const gameStateStore = useGameStateStore()
const playerStore = usePlayerStore()
const trackStore = useTrackerStore()

const saveStore = useSaveStore();

const showClassSelect = ref(false)
const selectedClass = ref<string>('')

// ⭐️ 判斷是否有存盤：檢查 savedSlots[0] 是否有內容
const hasSave = computed(() => {
  return !!saveStore.savedSlots[0];
});


const confirmClassSelection = async () => {
  if (!selectedClass.value) return;

  playerStore.init();
  saveStore.clearSaves()
  gameStateStore.init(1, true);

  // 設定玩家選擇的職業
  playerStore.info.char = selectedClass.value;

  // 套用職業初始獎勵
  switch (selectedClass.value) {
    case CharEnum.Villager.value:
      playerStore.equipItem(Sword.WoodSword);
      playerStore.gainItem(NormalFruits.RedApple, 3)
      break;
    case CharEnum.Merchant.value:
      playerStore.info.gold = 300;
      playerStore.info.ad = 8
      playerStore.info.ap = 8
      break;
    case CharEnum.Thief.value:
      playerStore.equipItem(Dagger.Dagger0);
      playerStore.info.hpLimit = 50;
      break;
    case CharEnum.Stargazer.value:
      playerStore.info.ap = 13;
      playerStore.info.ad = 7
      playerStore.info.spLimit = 100;
      playerStore.equipItem(Offhand.Book0);
      break;

  }

  playerStore.healFull()
  trackStore.init();

  gameStateStore.setRoom(RoomEnum.Bless.value);
}

// ⭐️ 點擊開始遊戲：如果有舊存檔，先跳出詢問
const startGame = async () => {
  if (hasSave.value) {
    try {
      await ElMessageBox.confirm(
          '重新開始將會覆蓋現有的【締造】存檔，確定要抹除過去的輪迴嗎？',
          '命運警告',
          {
            confirmButtonText: '確定抹除',
            cancelButtonText: '保留回憶',
            type: 'warning',
            center: true,
          }
      );
      selectedClass.value = '';
      showClassSelect.value = true;
    } catch {
      // 點擊取消，不做任何動作
    }
  } else {
    selectedClass.value = '';
    showClassSelect.value = true;
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
      <template v-if="!showClassSelect">
        <h1 class="game-title">締造</h1>
        <h2 class="game-subtitle">~諸神黃昏~</h2>

        <div class="story-box">
          <p class="typewriter">當諸神的星圖軌跡交匯，千日後的黃昏將是萬物的終局。</p>
          <p class="typewriter delay-1">垂憐世人的星辰悄然墜落，於凡軀之中刻下弒神升華的印記。</p>
          <p class="typewriter delay-2">沙漏無聲流逝，在千夜盡頭，唯有締造半神，對抗命運。</p>
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
            {{ hasSave ? '重新開始' : '開始' }}
          </el-button>
        </div>
      </template>

      <template v-else>
        <h1 class="select-class-title">選擇你的欽定之人</h1>
        <div class="class-cards">
          <div
              v-for="cls in CharEnum"
              :key="cls.value"
              class="class-card"
              :class="{ active: selectedClass === cls.value }"
              @click="selectedClass = cls.value"
          >
            <div class="class-icon">{{ cls.icon }}</div>
            <div class="class-label">{{ cls.label }}</div>
            <div class="class-desc">{{ cls.desc }}</div>
          </div>
        </div>

        <div class="action-zone class-select-zone">
          <el-button
              class="confirm-btn"
              :disabled="!selectedClass"
              @click="confirmClassSelection"
          >
            開始締造之旅
          </el-button>
          <el-button
              class="back-btn"
              @click="showClassSelect = false"
          >
            返回
          </el-button>
        </div>
      </template>
    </div>
  </el-card>
</template>


<style scoped>
/* 首頁背景與佈局 */
.start-view {
  height: 100%;
  box-sizing: border-box;
  background: radial-gradient(circle at center, #1a1a1a 0%, #000000 100%);
  border: 1px solid #444;
  position: relative;
  overflow: hidden;
}

:deep(.el-card__body) {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  overflow: hidden;
}

.class-select-zone {
  margin-top: 3rem;
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
  pointer-events: none;
}

.content-wrapper {
  position: relative;
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

/* 職業選擇標題與排版 */
.select-class-title {
  font-size: 2.2rem;
  color: #ffd700;
  margin-bottom: 0.5rem;
  letter-spacing: 0.2rem;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.select-class-subtitle {
  color: #888;
  font-size: 0.95rem;
  margin-bottom: 2.5rem;
  letter-spacing: 0.1rem;
}

.class-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(140px, 240px));
  justify-content: center;
  gap: 1.2rem;
  width: 90vw;
  max-width: 500px;
  margin: 0 auto;
}

.class-card {
  padding: 1.2rem 1rem;
  border: 1px solid #333;
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
}

.class-card:hover {
  border-color: #ffd700;
  background: rgba(255, 215, 0, 0.03);
  transform: translateY(-5px);
}

.class-card.active {
  border-color: #ffd700;
  background: rgba(255, 215, 0, 0.08);
  box-shadow: inset 0 0 15px rgba(255, 215, 0, 0.2), 0 5px 15px rgba(255, 215, 0, 0.1);
  transform: translateY(-5px);
}

.class-icon {
  font-size: 2.2rem;
  margin-bottom: 0.8rem;
}

.class-label {
  color: #eee;
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.6rem;
}

.class-card.active .class-label {
  color: #ffd700;
}

.class-desc {
  font-size: 0.8rem;
  color: #777;
  line-height: 1.4;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.class-card.active .class-desc {
  color: #ccc;
}

/* 矮螢幕適應，避免 14 吋與小筆電高度出現滾動條 */
@media (max-height: 800px), (max-width: 767px) {
  :deep(.el-card__body) {
    padding: 1.5rem;
  }

  .class-cards {
    gap: 0.8rem;
    max-width: 420px;
  }

  .class-card {
    padding: 0.8rem 0.6rem;
  }

  .class-icon {
    font-size: 1.8rem;
    margin-bottom: 0.4rem;
  }

  .class-label {
    font-size: 0.95rem;
    margin-bottom: 0.3rem;
  }

  .class-desc {
    font-size: 0.75rem;
    height: auto;
    min-height: 48px;
    line-height: 1.3;
  }

  .select-class-title {
    font-size: 1.8rem;
    margin-bottom: 0.3rem;
  }

  .select-class-subtitle {
    margin-bottom: 1.2rem;
  }

  .class-select-zone {
    margin-top: 1.5rem;
  }

  .confirm-btn {
    padding: 1.2rem 2.5rem !important;
    font-size: 1.1rem !important;
  }

  .back-btn {
    padding: 1rem 2rem !important;
    font-size: 0.9rem !important;
  }

  .start-btn {
    padding: 1.5rem 2.5rem !important;
    font-size: 1.2rem !important;
  }

  .continue-btn {
    padding: 1.5rem 2.5rem !important;
    font-size: 1.2rem !important;
  }

  .action-zone {
    gap: 0.8rem;
  }

  .game-title {
    font-size: 2.5rem;
    margin-bottom: 0.3rem;
  }

  .game-subtitle {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .story-box {
    margin-bottom: 2rem;
    min-height: auto;
  }

  .typewriter {
    font-size: 0.9rem;
    margin: 0.4rem 0;
  }
}

@media (max-height: 680px) {
  :deep(.el-card__body) {
    padding: 1rem;
  }

  .class-cards {
    gap: 0.6rem;
    max-width: 400px;
  }

  .class-card {
    padding: 0.6rem 0.5rem;
  }

  .class-icon {
    font-size: 1.5rem;
    margin-bottom: 0.3rem;
  }

  .class-label {
    font-size: 0.9rem;
    margin-bottom: 0.2rem;
  }

  .class-desc {
    font-size: 0.7rem;
    min-height: 36px;
  }

  .select-class-title {
    font-size: 1.5rem;
    margin-bottom: 0.2rem;
  }

  .select-class-subtitle {
    margin-bottom: 0.8rem;
  }

  .class-select-zone {
    margin-top: 1rem;
  }

  .confirm-btn {
    padding: 0.8rem 1.8rem !important;
    font-size: 1rem !important;
  }

  .back-btn {
    padding: 0.7rem 1.5rem !important;
    font-size: 0.85rem !important;
  }

  .start-btn {
    padding: 1rem 1.8rem !important;
    font-size: 1rem !important;
  }

  .continue-btn {
    padding: 1rem 1.8rem !important;
    font-size: 1rem !important;
  }

  .action-zone {
    gap: 0.5rem;
  }

  .game-title {
    font-size: 2rem;
  }

  .game-subtitle {
    margin-bottom: 1rem;
  }

  .story-box {
    margin-bottom: 1rem;
  }

  .typewriter {
    font-size: 0.8rem;
    margin: 0.3rem 0;
  }
}

@media (max-height: 520px) {
  :deep(.el-card__body) {
    padding: 0.5rem;
  }

  .class-cards {
    gap: 0.4rem;
    max-width: 360px;
  }

  .class-card {
    padding: 0.4rem 0.3rem;
  }

  .class-icon {
    font-size: 1.2rem;
    margin-bottom: 0.1rem;
  }

  .class-label {
    font-size: 0.8rem;
    margin-bottom: 0.1rem;
  }

  .class-desc {
    display: none;
  }

  .select-class-title {
    font-size: 1.2rem;
    margin-bottom: 0.1rem;
  }

  .select-class-subtitle {
    margin-bottom: 0.4rem;
  }

  .class-select-zone {
    margin-top: 0.5rem;
  }

  .confirm-btn {
    padding: 0.6rem 1.2rem !important;
    font-size: 0.85rem !important;
  }

  .back-btn {
    padding: 0.5rem 1rem !important;
    font-size: 0.8rem !important;
  }

  .start-btn {
    padding: 0.8rem 1.2rem !important;
    font-size: 0.9rem !important;
  }

  .continue-btn {
    padding: 0.8rem 1.2rem !important;
    font-size: 0.9rem !important;
  }

  .game-title {
    font-size: 1.5rem;
  }

  .game-subtitle {
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
  }

  .story-box {
    margin-bottom: 0.5rem;
  }

  .typewriter {
    font-size: 0.75rem;
    margin: 0.2rem 0;
  }
}

.confirm-btn {
  background: linear-gradient(135deg, #ffd700 0%, #aa8000 100%) !important;
  border: none !important;
  color: #120e0b !important;
  font-size: 1.3rem !important;
  font-weight: bold !important;
  padding: 2.2rem 4.5rem !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3) !important;
  letter-spacing: 0.2rem;
}

.confirm-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #ffffff 0%, #ffd700 100%) !important;
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5) !important;
  transform: translateY(-2px);
}

.confirm-btn:disabled {
  background: #333 !important;
  color: #666 !important;
  cursor: not-allowed;
  box-shadow: none !important;
}

.back-btn {
  background: transparent !important;
  border: 1px solid #444 !important;
  color: #888 !important;
  font-size: 1rem !important;
  padding: 1.8rem 3rem !important;
  transition: all 0.3s !important;
}

.back-btn:hover {
  border-color: #ffd700 !important;
  color: #ffd700 !important;
  background: rgba(255, 215, 0, 0.02) !important;
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
