<script setup lang="ts">
import './event-room.css'
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import EventTemplate from "@/components/RoomLayout/event/EventTemplate.vue";
import {ref} from "vue";
import {GameState} from "@/enums/enums";
import {getRandomElements} from "@/utils/math";
import {UserStatus} from "@/constants/status/user-status";
import {StatusEffect} from "@/types";

/**
 * 狀態控制 (eventAction)
 * 0: 初始, 2: 離開, 3: 結果
 */

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();
const isDrinking = ref(false);
const resultType = ref<'heal' | 'mana' | 'debuff' | 'neutral' | null>(null);
const resultMsg = ref("這裡剩下滿地的空瓶子。");
const buff = ref<StatusEffect | undefined>();

const onLeave = () => {
  gameStateStore.eventAction = 2;
  gameStateStore.transitionToNextState();
};

const drinkPotion = () => {
  // 動畫啟動，保持在 eventAction 0
  isDrinking.value = true;

  setTimeout(() => {
    const rnd = Math.random() * 100;
    const stage = gameStateStore.currentStage;

    if (rnd < 50) {
      // 50% 機率：恢復效果 (Heal)
      resultType.value = 'heal';
      const healAmount = 20 + (stage * 20);
      playerStore.info.hp = Math.min(playerStore.finalStats.hpLimit, playerStore.info.hp + healAmount);
      resultMsg.value = `味道意外地清甜！恢復了 <span style="color: #4caf50; font-weight: bold;">${healAmount} HP</span>。`;

    } else if (rnd < 55) {
      // 5% 惡作劇
      resultType.value = 'neutral';
      resultMsg.value = `喝完之後你的皮膚變成了 <span style="color: #9c27b0; font-weight: bold;">紫色</span>，雖然感覺沒什麼用，但你覺得自己變帥了。`;

    } else {
      // 45% 機率：獲得狀態效果 (Buff/Debuff)
      resultType.value = 'debuff';
      const randomStatus = getRandomElements([
        UserStatus.Focus, UserStatus.Excited, UserStatus.Blind, UserStatus.Weak, UserStatus.Poison
      ], 1)[0];

      buff.value = randomStatus;
      playerStore.addStatus(randomStatus);

      // 判斷狀態好壞來決定顏色 (簡單邏輯)
      const statusColor = '#ff4d4f';
      resultMsg.value = `嘔... 味道怪怪的！你感到身體產生異樣，獲得狀態 <span style="color: ${statusColor}; font-weight: bold;">${randomStatus.name}</span>。`;
    }

    // 動畫結束，切換狀態
    isDrinking.value = false;
    gameStateStore.eventAction = 3;
    gameStateStore.transitionToNextState();
  }, 1500);
};
</script>

<template>
  <EventTemplate title="奇怪的藥劑櫃">
    <template #default>
      <div class="general-event">

        <template v-if="gameStateStore.eventAction === 0">
          <div :class="['event-icon', 'cabinet-icon', { 'animate-drink': isDrinking }]">🧪</div>
          <div class="dialog-box">
            <template v-if="!isDrinking">
              <p>你發現了一個佈滿五顏六色瓶子的藥劑櫃。</p>
              <p>有些標籤已經脫落，有些則散發著詭異的光芒...</p>
              <p class="hint-text">(看起來雖然可疑，但或許能救你一命？)</p>
            </template>
            <template v-else>
              <p class="drinking-text">咕嚕咕嚕... 呸！</p>
            </template>
          </div>
        </template>

        <template v-else-if="gameStateStore.eventAction === 2">
          <div class="event-icon cabinet-icon" style="opacity: 0.5">🧪</div>
          <div class="dialog-box">
            <p>你決定不拿自己的腸胃開玩笑，轉身離開了。</p>
          </div>
        </template>

        <template v-else-if="gameStateStore.eventAction === 3">
          <div class="result-display">
            <div v-if="resultType === 'heal'" class="result-icon-large">💖</div>
            <div v-else-if="resultType === 'debuff'" class="result-icon-large">{{ buff?.icon || '🌀' }}</div>
            <div v-else-if="resultType === 'neutral'" class="result-icon-large">✨</div>

            <div class="dialog-box">
              <p v-html="resultMsg"></p>
            </div>
          </div>
        </template>
      </div>
    </template>

    <template #button v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      <template v-if="gameStateStore.eventAction === 0">
        <el-button
            type="success"
            @click="drinkPotion"
            :loading="isDrinking"
        >
          隨便喝一瓶
        </el-button>
        <el-button
            type="info"
            @click="onLeave"
            :disabled="isDrinking"
        >
          還是別亂喝
        </el-button>
      </template>
    </template>
  </EventTemplate>
</template>

<style scoped>
.cabinet-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 10px rgba(156, 39, 176, 0.4));
  transition: all 0.3s ease;
}

/* 飲用動畫 */
.animate-drink {
  animation: drink 0.5s infinite alternate ease-in-out;
}

@keyframes drink {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(45deg) translate(10px, -10px);
  }
}

.drinking-text {
  color: #81c784;
  font-weight: bold;
  font-style: italic;
  animation: pulse 0.8s infinite;
}

.result-icon-large {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.hint-text {
  font-size: 0.9rem;
  color: #888;
  font-style: italic;
}

.result-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

@keyframes pulse {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}

:deep(.dialog-box span) {
  text-shadow: 0 0 5px currentColor;
}
</style>