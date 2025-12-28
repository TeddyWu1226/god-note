<script setup lang="ts">
import './event-room.css'
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import EventTemplate from "@/components/RoomLayout/event/EventTemplate.vue";
import {computed, ref} from "vue";
import {GameState} from "@/enums/enums";
import {ElMessage} from "element-plus";

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();

// 0: 初始對話, 1: 儀式進行中, 2: 轉職完成
const answer = ref(0);
const finalText = ref("");

const COST = 100;

const handleJobChange = () => {
  // 1. 檢查金幣是否足夠
  if (playerStore.info.gold < COST) {
    ElMessage.error("你的錢包空空如也，看來沒辦法付學費呢...");
    return;
  }

  answer.value = 1;

  // 執行扣款
  playerStore.info.gold -= COST;
  // 動畫展示
  setTimeout(() => {
    // HP上限+20
    playerStore.info.hpLimit += 20;
    playerStore.info.hp += 20;

    finalText.value = "你支付了 50G，在他的指導下掌握了用劍的精要。你的氣勢變得更加銳利，正式成為了一名【劍士】！";

    // 3. 記錄事件狀態 (可選：用於成就或後續劇情)
    // gameStateStore.addEventProcess('JOB_WARRIOR', true);

    answer.value = 2;
    gameStateStore.transitionToNextState();
  }, 1000);
};

const onLeave = () => {
  gameStateStore.transitionToNextState();
}
</script>

<template>
  <EventTemplate title="⚔️ 轉職事件">
    <template #default>
      <div class="event-room-without-btn general-event">
        <template v-if="answer === 0">
          <div class="event-icon">🤺</div>
          <div class="dialog-box">
            <p>你遇到了一個手拿銀色長劍的登塔者，他正靠在牆邊擦拭劍身。</p>
            <p>「嘿！兄弟，我觀察你很久了。你的揮擊很有力，但缺乏一點技巧。」</p>
            <p>「<b>給我一點錢</b>，我能教你如何成為真正的<b>劍士</b>，如何？」</p>
          </div>
        </template>

        <div v-else-if="answer === 1" class="processing">
          <div class="event-icon">⚔️</div>
          <p>正在領悟劍技中...</p>
        </div>

        <template v-else-if="answer === 2">
          <div class="event-icon pulse">🗡️</div>
          <p class="final-text">{{ finalText }}</p>
        </template>
      </div>
    </template>

    <template #button v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      <template v-if="answer === 0">
        <el-button
            type="warning"
            :disabled="playerStore.info.gold < COST"
            @click="handleJobChange">
          支付 {{ COST }}G
        </el-button>
        <el-button type="info" @click="onLeave">暫時沒興趣</el-button>
      </template>
    </template>
  </EventTemplate>
</template>

<style scoped>
.final-text {
  color: #67C23A;
  font-weight: bold;
}


/* 完成後的發光 */
.pulse {
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    filter: drop-shadow(0 0 5px #67C23A);
  }
  50% {
    filter: drop-shadow(0 0 20px #E6A23C);
  }
}

.processing {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>