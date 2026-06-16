<script setup lang="ts">
import '../room.css'
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import RoomTemplate from "@/components/RoomLayout/RoomTemplate.vue";
import {computed, ref} from "vue";
import {GameState} from "@/enums/enums";
import {ElMessage} from "element-plus";
import {useTrackerStore} from "@/store/track-store";

/**
 * 狀態控制
 * 0: 初始, 1: 選擇金額, 2: 拒絕, 3:結果
 */

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();
const trackerStore = useTrackerStore();
const betAmount = ref(0);
const diceResult = ref(1);
const isWin = ref(false);
const isRolling = ref(false);
const GambleValues = [5000, 3000, 1500, 800, 400, 200, 100, 50]
const availablePrices = computed(() => {
  let a = []
  GambleValues.forEach((value) => {
    if (a.length === 2) {
      return
    }
    if (playerStore.info.gold > value) {
      a.push(value)
    }
  })
  if (a.length < 2) {
    a = [100, 50]
  }
  return a
})
const onCancel = () => {
  gameStateStore.eventAction = 2;
  // 延遲一段時間後切換房間狀態，讓玩家看完對話
  gameStateStore.transitionToNextState();
};

const finalText = ref<string | undefined>(undefined);
// 執行賭博
const startGamble = (amount: number) => {
  if (playerStore.info.gold < amount) {
    ElMessage.warning("金幣不足...");
    return;
  }

  betAmount.value = amount;
  isRolling.value = true

  // 模擬擲骰子動畫時間
  setTimeout(() => {
    diceResult.value = Math.floor(Math.random() * 6) + 1;
    // 簡單判定：4、5、6 算贏，1、2、3 算輸
    isWin.value = diceResult.value >= 4;

    if (isWin.value) {
      playerStore.addGold(betAmount.value); // 贏了獲得一倍
      finalText.value = `大成功！贏得了 ${betAmount.value} 金幣!`
      trackerStore.achievementsCount.gambleWin += 1
      trackerStore.achievementsCount.gambleLose = 0
    } else {
      playerStore.addGold(-betAmount.value); // 輸了扣除金額
      finalText.value = `運氣不太好... 輸掉了 ${betAmount.value} 金幣...`
      trackerStore.achievementsCount.gambleWin = 0
      trackerStore.achievementsCount.gambleLose += 1
    }
    isRolling.value = false
    gameStateStore.eventAction = 3; // 顯示結果對話
    gameStateStore.transitionToNextState()
  }, 1200);
};

</script>

<template>
  <RoomTemplate title="賭博遊戲">
    <template #default>
      <div class=" general-event">
        <template v-if="gameStateStore.eventAction === 0">
          <div class="event-icon">👨‍💼</div>
          <div class="dialog-box">
            <p>有一個穿著正裝的人類向你招手:</p>
            <p>「那位小伙, 要不要用你的金幣跟我賭一把? 」</p>
            <p>(4點以上你就贏)</p>
          </div>

        </template>
        <div v-else-if="isRolling" class="dice-container">
          <div class="dice rolling">🎲</div>
          <p>擲骰中...</p>
        </div>
        <template v-else-if="gameStateStore.eventAction === 1">
          <div class="event-icon">👨‍💼</div>
          <div class="dialog-box">
            「有魄力! 那你打算賭多少?」<br/>
          </div>
          <span class="gold-hint">(目前擁有: {{ playerStore.info.gold }} G)</span>
        </template>

        <template v-else-if="gameStateStore.eventAction === 2">
          <div class="dialog-box">
            「阿, 不要就算了...」<br/>
          </div>
          他悻悻然地走了
        </template>
        <template v-else-if="gameStateStore.eventAction === 3">
          <div class="result-display">
            <template v-if="finalText">
              <div class="dice-final">🎲 {{ diceResult }}</div>
              <p v-if="isWin">「手氣真旺! 這是你應得的。」</p>
              <p v-else>「哎呀，看來幸運女神不在你身邊呢。」</p>
              <p :style="{color:isWin?'gold':'gray'}">{{ finalText }}</p>
            </template>
            <template v-else>
              這裡空無一人...
            </template>
          </div>
        </template>
      </div>
    </template>

    <template #button v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      <template v-if="gameStateStore.eventAction === 0">
        <el-button
            v-if="playerStore.info.gold >=50"
            type="warning"
            @click="gameStateStore.eventAction = 1">
          好! 賭多少?
        </el-button>
        <el-button type="info" @click="onCancel">不了</el-button>
      </template>

      <template v-else-if="gameStateStore.eventAction === 1">
        <el-button
            type="warning" @click="startGamble(availablePrices[1])" :disabled="isRolling">
          {{ availablePrices[1] }} G
        </el-button>
        <el-button type="warning" @click="startGamble(availablePrices[0])" :disabled="isRolling">
          {{ availablePrices[0] }} G
        </el-button>
        <el-button type="info" @click="gameStateStore.eventAction = 0" :disabled="isRolling">
          再想想
        </el-button>
      </template>
    </template>
  </RoomTemplate>
</template>

<style scoped>
.gold-hint {
  font-size: 1rem;
  color: #ffca28;
}

/* 骰子動畫 */
.dice-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dice {
  font-size: 4rem;
}

.rolling {
  animation: roll 0.4s infinite linear;
}

.dice-final {
  font-size: 3rem;
  font-weight: bold;
  color: #f56c6c;
  margin-bottom: 1rem;
}

@keyframes roll {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.2);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

.result-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>