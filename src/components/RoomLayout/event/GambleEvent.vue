<script setup lang="ts">
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import EventTemplate from "@/components/RoomLayout/event/EventTemplate.vue";
import {ref} from "vue";
import {GameState} from "@/enums/enums";
import {ElMessage} from "element-plus";

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();

// 狀態控制
// 0: 初始, 1: 選擇金額, 2: 拒絕, 3: 擲骰中, 4: 結算結果
const answer = ref(0);
const betAmount = ref(0);
const diceResult = ref(1);
const isWin = ref(false);

const onCancel = () => {
  answer.value = 2;
  // 延遲一段時間後切換房間狀態，讓玩家看完對話
  gameStateStore.transitionToNextState();
};

const finalText = ref("")
// 執行賭博
const startGamble = (amount: number) => {
  if (playerStore.info.gold < amount) {
    ElMessage.warning("金幣不足...");
    return;
  }

  betAmount.value = amount;
  answer.value = 3; // 進入擲骰子狀態

  // 模擬擲骰子動畫時間
  setTimeout(() => {
    diceResult.value = Math.floor(Math.random() * 6) + 1;
    // 簡單判定：4、5、6 算贏，1、2、3 算輸
    isWin.value = diceResult.value >= 4;

    if (isWin.value) {
      playerStore.addGold(betAmount.value); // 贏了獲得一倍
      finalText.value = `大成功！贏得了 ${betAmount.value} 金幣!`
    } else {
      playerStore.addGold(-betAmount.value); // 輸了扣除金額
      finalText.value = `運氣不太好... 輸掉了 ${betAmount.value} 金幣...`
    }

    answer.value = 4; // 顯示結果對話
    gameStateStore.transitionToNextState()
  }, 1200);
};

</script>

<template>
  <EventTemplate title="👨‍💼生意人">
    <template #default>
      <div class="event-room-without-btn gamble-event">
        <span v-if="gameStateStore.stateIs(GameState.SELECTION_PHASE) && answer ===0">
          這裡空無一人...
        </span>
        <template v-else-if="answer === 0">
          有一個穿著正裝的人類向你招手:<br/>
          「那位小伙, 要不要用你的金幣跟我賭一把? <br/>(4點以上你就贏)」
        </template>

        <template v-else-if="answer === 1">
          「有魄力! 那你打算賭多少?」<br/>
          <span class="gold-hint">(目前擁有: {{ playerStore.info.gold }} G)</span>
        </template>

        <template v-else-if="answer === 2">
          「阿, 不要就算了...」<br/>
          他悻悻然地走了
        </template>

        <div v-else-if="answer === 3" class="dice-container">
          <div class="dice rolling">🎲</div>
          <p>擲骰中...</p>
        </div>

        <template v-else-if="answer === 4">
          <div class="result-display">
            <div class="dice-final">🎲 {{ diceResult }}</div>
            <p v-if="isWin">「手氣真旺! 這是你應得的。」</p>
            <p v-else>「哎呀，看來幸運女神不在你身邊呢。」</p>
            <p :style="{color:isWin?'gold':'gray'}">{{ finalText }}</p>
          </div>
        </template>
      </div>
    </template>

    <template #button v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      <template v-if="answer === 0">
        <el-button type="warning" @click="answer = 1">好! 賭多少?</el-button>
        <el-button type="info" @click="onCancel">不了</el-button>
      </template>

      <template v-else-if="answer === 1">
        <el-button type="warning" @click="startGamble(50)">50 G</el-button>
        <el-button type="warning" @click="startGamble(100)">100 G</el-button>
        <el-button type="info" @click="answer = 0">再想想</el-button>
      </template>
    </template>
  </EventTemplate>
</template>

<style scoped>
.gamble-event {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  letter-spacing: 0.1em;
  text-align: center;
  min-height: 200px;
}

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