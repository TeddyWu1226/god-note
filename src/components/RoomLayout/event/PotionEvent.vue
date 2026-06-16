<script setup lang="tsx">
import '../room.css'
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import RoomTemplate from "@/components/RoomLayout/RoomTemplate.vue";
import {computed, ref} from "vue";
import {GameState, SpecialEventEnum} from "@/enums/enums";
import {getRandomElements} from "@/utils/math";
import {StatusEffect} from "@/types";
import EvnStatus from "@/constants/status/evn-status";

/**
 * 狀態控制 (eventAction)
 * 0: 初始, 2: 離開, 3: 結果
 */

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();
const isDrinking = ref(false);
const resultType = ref<'heal' | 'mana' | 'debuff' | 'neutral' | null>(null);

const isShowPotion = computed(() => gameStateStore.currentStage <= 5)
const resultMsg = ref(isShowPotion.value ? "這裡剩下滿地的空瓶子。" : '這裡剩下一口乾涸的水井。');
const buff = ref<StatusEffect | undefined>();


const eventConfig = computed(() => {
  if (isShowPotion.value) {
    return {
      title: "奇怪的藥劑櫃",
      icon: "🧪",
      defaultMsg: "你發現了一個佈滿五顏六色瓶子的藥劑櫃。標籤已經脫落...",
      leaveMsg: "你決定不拿自己的腸胃開玩笑，轉身離開了。",
      actionText: "隨便喝一瓶",
      drinkingMsg: "咕嚕咕嚕... 呸！",
      animClass: "animate-cabinet"
    };
  } else {
    return {
      title: "神秘的水井",
      icon: "🕳️",
      defaultMsg: "一口隱約散發著清涼氣息的古井，井口溢出一些不明的神祕液體。",
      leaveMsg: "看著混濁的水面，你決定還是忍耐口渴。",
      actionText: "喝一口井水",
      drinkingMsg: "大口大口地飲用井水...",
      animClass: "animate-well"
    };
  }
});

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

      if (!isShowPotion.value && !!gameStateStore.otherRecord['WATER'] && !gameStateStore.isEventClose(SpecialEventEnum.NeedWater)) {
        resultMsg.value += `<br/>你想起手上的空瓶,順手用這乾淨的液體裝了滿了它。`
        gameStateStore.otherRecord['WATER'] = 2
      }
    } else if (rnd < 55) {
      // 5% 惡作劇
      resultType.value = 'neutral';
      resultMsg.value = `喝完之後你的皮膚變成了 <span style="color: #9c27b0; font-weight: bold;">紫色</span>，雖然感覺沒什麼用，但你覺得自己變帥了。`;

      if (!isShowPotion.value && !!gameStateStore.otherRecord['WATER'] && !gameStateStore.isEventClose(SpecialEventEnum.NeedWater)) {
        resultMsg.value += `<br/>你想起手上的空瓶,順手用這奇怪的液體裝了滿了它。`
        gameStateStore.otherRecord['WATER'] = 2
      }
    } else {
      // 45% 機率：獲得狀態效果 (Buff/Debuff)
      resultType.value = 'debuff';
      const randomStatus = getRandomElements([
        EvnStatus.Focus, EvnStatus.Excited, EvnStatus.Blind, EvnStatus.Weak, EvnStatus.Poison
      ], 1)[0];

      buff.value = randomStatus;
      playerStore.addStatus(randomStatus);

      resultMsg.value = `嘔... 味道怪怪的！你感到身體產生異樣，獲得狀態 <span style="color: #ff4d4f; font-weight: bold;">${randomStatus.name}</span>。`;

      if (!isShowPotion.value && !!gameStateStore.otherRecord['WATER'] && !gameStateStore.isEventClose(SpecialEventEnum.NeedWater)) {
        resultMsg.value += `<br/>你想起手上的空瓶,順手用這奇怪的液體裝了滿了它。`
        gameStateStore.otherRecord['WATER'] = 3
      }
    }

    // 動畫結束，切換狀態
    isDrinking.value = false;
    gameStateStore.eventAction = 3;
    gameStateStore.transitionToNextState();
  }, 1500);
};

</script>

<template>
  <RoomTemplate :title="eventConfig.title">
    <template #default>
      <div class="general-event">
        <template v-if="gameStateStore.eventAction === 0">
          <div :class="['event-icon', eventConfig.animClass, { 'is-active': isDrinking }]">
            {{ eventConfig.icon }}
          </div>
          <div class="dialog-box">
            <template v-if="!isDrinking">
              <p>{{ eventConfig.defaultMsg }}</p>
            </template>
            <template v-else>
              <p class="drinking-text">{{ eventConfig.drinkingMsg }}</p>
            </template>
          </div>
        </template>

        <template v-else-if="gameStateStore.eventAction === 2">
          <div class="event-icon" style="opacity: 0.5">{{ eventConfig.icon }}</div>
          <div class="dialog-box">
            <p>{{ eventConfig.leaveMsg }}</p>
          </div>
        </template>

        <template v-else-if="gameStateStore.eventAction === 3">
          <div class="result-display">
            <div class="result-icon-large">
              {{ resultType === 'heal' ? '💖' : (buff?.icon || '✨') }}
            </div>
            <div class="dialog-box">
              <p v-html="resultMsg"></p>
            </div>
          </div>
        </template>
      </div>
    </template>

    <template #button v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      <template v-if="gameStateStore.eventAction === 0">
        <el-button type="success" @click="drinkPotion" :loading="isDrinking">
          {{ eventConfig.actionText }}
        </el-button>
        <el-button type="info" @click="onLeave" :disabled="isDrinking">
          離開
        </el-button>
      </template>
    </template>
  </RoomTemplate>
</template>

<style scoped>
/* 藥劑櫃：左右晃動傾斜 */
.animate-cabinet.is-active {
  animation: cab-shake 0.5s infinite alternate;
}

@keyframes cab-shake {
  to {
    transform: rotate(30deg) translateY(-10px);
  }
}

/* 井水：上下震動（吸水的感覺） */
.animate-well.is-active {
  animation: well-pump 0.3s infinite alternate;
}

@keyframes well-pump {
  to {
    transform: translateY(10px) scaleY(0.9);
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