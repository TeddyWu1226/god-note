<script setup lang="ts">
import './event-room.css'
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import EventTemplate from "@/components/RoomLayout/event/EventTemplate.vue";
import {ref} from "vue";
import {GameState, SpecialEventEnum} from "@/enums/enums";
import {ElMessage} from "element-plus";
import {CharEnum} from "@/enums/char-enum";
import {Skills} from "@/constants/skill/skill";

/**
 * 狀態控制
 * 0: 初始, 1: 轉職, 2: 拒絕 ,3:結果
 */

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();

const isLearning = ref(false);

const COST = 100;

const handleJobChange = () => {
  // 1. 檢查金幣是否足夠
  if (playerStore.info.gold < COST) {
    ElMessage.error("你的錢包空空如也，看來沒辦法付學費呢...");
    return;
  }

  gameStateStore.eventAction = 1;
  isLearning.value = true;
  // 執行扣款
  playerStore.info.gold -= COST;
  // 動畫展示
  setTimeout(() => {
    // HP上限+20
    playerStore.info.hpLimit += 20;
    playerStore.info.hp += 20;
    playerStore.info.char = CharEnum.Warrior.value
    // 習得技能
    playerStore.addSkill(Skills.DoubleHit.id)


    gameStateStore.eventAction = 3;
    isLearning.value = false
    gameStateStore.transitionToNextState();
    gameStateStore.addEventProcess(SpecialEventEnum.JobWarrior)
  }, 1000);
};

const onLeave = () => {
  gameStateStore.eventAction = 2;
  gameStateStore.transitionToNextState();
}
</script>

<template>
  <EventTemplate title="⚔️ 轉職事件">
    <template #default>
      <div class="event-room-without-btn general-event">
        <template v-if="gameStateStore.eventAction === 0">
          <div class="event-icon">🤺</div>
          <div class="dialog-box">
            <p>你遇到了一個手拿銀色長劍的登塔者，他正靠在牆邊擦拭劍身。</p>
            <p>「嘿！兄弟，我觀察你很久了。你的揮擊很有力，但缺乏一點技巧。」</p>
            <p>「<b>給我一點錢</b>，我能教你如何成為真正的<b>劍士</b>，如何？」</p>
          </div>
        </template>
        <div v-else-if="isLearning" class="processing">
          <div class="event-icon">⚔️</div>
          <p>正在領悟劍技中...</p>
        </div>


        <template v-else-if="gameStateStore.eventAction === 3">
          <div class="event-icon pulse">🗡️</div>
          <p class="final-text">
            在他的指導下掌握了用劍的精要。<br/>你的氣勢變得更加銳利，<br/>正式成為了一名【劍士】！
          </p>
        </template>
        <template v-else>
          <div class="dialog-box">
            <p>「好吧,等你想清楚再來找我。」</p>
          </div>
        </template>
      </div>
    </template>

    <template #button v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      <template v-if="gameStateStore.eventAction === 0">
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