<script setup lang="ts">
import '../room.css';
import { useGameStateStore } from "@/store/game-state-store";
import { usePlayerStore } from "@/store/player-store";
import RoomTemplate from "@/components/RoomLayout/comps/RoomTemplate.vue";
import { GameState, SpecialEventEnum } from "@/enums/enums";
import { SpecialItem } from "@/constants/items/special-item-info";
import { ref } from "vue";

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();

// 記錄本次前進受到的傷害
const lastDamageTaken = ref(0);

const handleAdvance = (nextState: number, damage: number) => {
  lastDamageTaken.value = damage;
  playerStore.takeDamage(damage);
  
  if (playerStore.info.hp <= 0) {
    // 玩家已死亡，將由系統自動處理跳轉到死亡畫面
    return;
  }
  
  gameStateStore.eventAction = nextState;
};

const handleTouchStatue = () => {
  // 獲得「憤怒」道具
  playerStore.gainItem(SpecialItem.Wrath, 1);
  
  // 標記該事件已徹底完成 (關閉)
  gameStateStore.addEventProcess(SpecialEventEnum.AncientWrath, true);
  
  gameStateStore.eventAction = 4;
};

const handleLeave = () => {
  // 離開事件，將進度重置為 0，下次遇到需要重新開始
  gameStateStore.eventAction = 0;
  gameStateStore.transitionToNextState();
};

const handleFinish = () => {
  gameStateStore.transitionToNextState();
};
</script>

<template>
  <RoomTemplate title="神秘的地穴">
    <template #default>
      <div class="general-event">
        <!-- 階段 0：發現神祕洞窟 -->
        <template v-if="gameStateStore.eventAction === 0">
          <div class="event-icon">🕳️</div>
          <div class="dialog-box">
            <p>你發現了一個神祕的洞窟。</p>
            <p>洞窟內散發著令人心悸的可怕氣息，是否要前進？</p>
          </div>
        </template>

        <!-- 階段 1：灼熱小徑 -->
        <template v-else-if="gameStateStore.eventAction === 1">
          <div class="event-icon">🔥</div>
          <div class="dialog-box">
            <p class="damage-text">前進了一次，受到 50 點傷害（坍塌的落石造成傷害）</p>
            <p>眼前是灼熱的小徑，是否要繼續前進？</p>
          </div>
        </template>

        <!-- 階段 2：岩漿路 -->
        <template v-else-if="gameStateStore.eventAction === 2">
          <div class="event-icon">🌋</div>
          <div class="dialog-box">
            <p class="damage-text">再前進一次，受到 100 點傷害（滾燙的岩石噴發造成你的傷害）</p>
            <p>眼前是佈滿岩漿的路，是否前進？</p>
          </div>
        </template>

        <!-- 階段 3：龍之雕像 -->
        <template v-else-if="gameStateStore.eventAction === 3">
          <div class="event-icon">🐉</div>
          <div class="dialog-box">
            <p class="damage-text">再一次前進，受到 200 點傷害</p>
            <p>眼前出現一個龍之雕像，你只能選擇觸碰它。</p>
          </div>
        </template>

        <!-- 階段 4：故事播放與獲得道具 -->
        <template v-else-if="gameStateStore.eventAction === 4">
          <div class="event-icon shine">🔥</div>
          <div class="dialog-box story-box">
            <p>觸碰它後，腦袋出現了一段文字與畫面：</p>
            <div class="story-text">
              <p>「吾等在此締結和約，為阻止不可名狀之神的侵略。」</p>
              <p>「汝之族人為土、吾之族人為火，為創造神的後裔建立最後的屏障以抵禦蟲群侵害」</p>
              <p>「此等屈辱與憤怒，由吾族最後子嗣的你傳承」</p>
            </div>
            <p>聽完這些話，你感到胸中湧現出一股難以平息的古老怨憤。</p>
            <p>你手中出現了神祕符文-<span class="wrath-text">「憤怒」</span></p>
          </div>
        </template>
      </div>
    </template>

    <template #button>
      <template v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
        <!-- 按鈕控制 -->
        <template v-if="gameStateStore.eventAction === 0">
          <el-button type="warning" @click="handleAdvance(1, 50)">前進</el-button>
          <el-button type="info" @click="handleLeave">離開</el-button>
        </template>

        <template v-else-if="gameStateStore.eventAction === 1">
          <el-button type="warning" @click="handleAdvance(2, 100)">繼續前進</el-button>
          <el-button type="info" @click="handleLeave">離開</el-button>
        </template>

        <template v-else-if="gameStateStore.eventAction === 2">
          <el-button type="warning" @click="handleAdvance(3, 200)">繼續前進</el-button>
          <el-button type="info" @click="handleLeave">離開</el-button>
        </template>

        <template v-else-if="gameStateStore.eventAction === 3">
          <el-button type="danger" @click="handleTouchStatue">觸碰它</el-button>
        </template>

        <template v-else-if="gameStateStore.eventAction === 4">
          <el-button type="primary" @click="handleFinish">離開</el-button>
        </template>
      </template>
    </template>
  </RoomTemplate>
</template>

<style scoped>
.damage-text {
  color: #f56c6c;
  font-weight: bold;
  margin-bottom: 1rem;
}

.story-box {
  text-align: left;
  max-width: 500px;
  line-height: 1.6;
}

.story-text {
  color: #e6a23c;
  font-style: italic;
  margin: 1rem 0;
  padding-left: 0.5rem;
  border-left: 3px solid #e6a23c;
}

.wrath-text {
  color: #ff4949;
  font-weight: bold;
}

.shine {
  animation: shine-glow 2s infinite alternate;
}

@keyframes shine-glow {
  from {
    filter: drop-shadow(0 0 2px #fff);
  }
  to {
    filter: drop-shadow(0 0 10px #ff4949);
  }
}
</style>
