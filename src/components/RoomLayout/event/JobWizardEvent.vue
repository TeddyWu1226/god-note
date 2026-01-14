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
 * 0: 初始, 1: 轉職, 2: 拒絕, 3: 結果
 */

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();

const isLearning = ref(false);

const COST = 100;

const handleJobChange = () => {
  // 1. 檢查金幣是否足夠
  if (playerStore.info.gold < COST) {
    ElMessage.error("你的靈魂與錢包都顯得如此貧乏，看來與魔法無緣...");
    return;
  }

  gameStateStore.eventAction = 1;
  isLearning.value = true;
  // 執行扣款
  playerStore.info.gold -= COST;

  // 冥想動畫展示
  setTimeout(() => {
    // 法師加成
    playerStore.info.spLimit += 20;
    playerStore.info.sp += 20;
    playerStore.info.char = CharEnum.Wizard.value

    // 習得技能
    playerStore.addSkill(Skills.MagicBall.id)

    gameStateStore.eventAction = 3;
    isLearning.value = false
    gameStateStore.transitionToNextState();
    gameStateStore.addEventProcess(SpecialEventEnum.JobWizard)
  }, 1200);
};

const onLeave = () => {
  gameStateStore.eventAction = 2;
  gameStateStore.transitionToNextState();
}
</script>

<template>
  <EventTemplate title="✨ 轉職事件">
    <template #default>
      <div class="general-event">
        <template v-if="gameStateStore.eventAction === 0">
          <div class="event-icon">🧙</div>
          <div class="dialog-box">
            <p>一位穿著深藍色長袍、兜帽遮住臉龐的長者站在路中。</p>
            <p>「孩子，我能聽見你靈魂中魔力的躁動，那不是凡人的蠻力能比擬的。」</p>
            <p>「<b>捐贈一些獻金</b>作為圖書館的修繕費，我將引導你踏入<b>法術</b>的大門。」</p>
          </div>
        </template>

        <div v-else-if="isLearning" class="processing">
          <div class="event-icon">🔮</div>
          <p>正在與元素進行共鳴中...</p>
        </div>

        <template v-else-if="gameStateStore.eventAction === 3">
          <div class="event-icon pulse-magic">☄️</div>
          <p class="final-text magic-text">
            古老的咒語在你耳邊迴盪。<br/>你感受到了虛空中的奧術能量，<br/>現在，你是一名掌控元素的【法師】了！
          </p>
        </template>

        <template v-else>
          <div class="dialog-box">
            <p>「無知有時也是一種幸福，願真理保佑你。」</p>
          </div>
        </template>
      </div>
    </template>

    <template #button v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      <template v-if="gameStateStore.eventAction === 0">
        <el-button
            type="primary"
            :disabled="playerStore.info.gold < COST"
            @click="handleJobChange">
          支付 {{ COST }}G
        </el-button>
        <el-button type="info" @click="onLeave">繼續尋找力量</el-button>
      </template>
    </template>
  </EventTemplate>
</template>

<style scoped>
.final-text {
  font-weight: bold;
}

.magic-text {
  color: #409EFF;
}

/* 法師專屬藍紫色發光 */
.pulse-magic {
  animation: magic-glow 2s infinite;
}

@keyframes magic-glow {
  0%, 100% {
    filter: drop-shadow(0 0 5px #409EFF);
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 20px #A335EE);
    transform: scale(1.1);
  }
}

.processing {
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>