<script setup lang="ts">
import {computed, onMounted} from "vue";
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {SpecialEventEnum} from "@/enums/enums";

const props = defineProps({
  view: {
    type: String, // 'content' | 'button'
    required: true
  }
});

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();

// 道具選項配置
const itemsConfig = [
  { name: "鮮紅果", rewardGold: 80 },
  { name: "冰涼的解毒劑", rewardGold: 120 },
  { name: "破舊帳篷", rewardGold: 200 }
];

// 初始化需要的道具
onMounted(() => {
  if (!gameStateStore.otherRecord['ADVENTURER_NEED_ITEM']) {
    const randomItem = itemsConfig[Math.floor(Math.random() * itemsConfig.length)];
    gameStateStore.otherRecord['ADVENTURER_NEED_ITEM'] = randomItem.name;
    gameStateStore.otherRecord['ADVENTURER_REWARD_GOLD'] = randomItem.rewardGold;
  }
});

const needItemName = computed(() => gameStateStore.otherRecord['ADVENTURER_NEED_ITEM'] || '');
const rewardGold = computed(() => gameStateStore.otherRecord['ADVENTURER_REWARD_GOLD'] || 0);
const isResolved = computed(() => !!gameStateStore.otherRecord['ADVENTURER_RESOLVED']);
const hasNeedItem = computed(() => playerStore.hasItem(needItemName.value)[0]);

const handleGive = () => {
  if (playerStore.removeItem(needItemName.value, 1)) {
    playerStore.info.gold += rewardGold.value;
    gameStateStore.otherRecord['ADVENTURER_RESOLVED'] = true;
  }
};

const handleLeave = () => {
  // 清理暫存記錄
  delete gameStateStore.otherRecord['ADVENTURER_NEED_ITEM'];
  delete gameStateStore.otherRecord['ADVENTURER_REWARD_GOLD'];
  delete gameStateStore.otherRecord['ADVENTURER_RESOLVED'];

  gameStateStore.addEventProcess(SpecialEventEnum.LostAdventurer, true);
  gameStateStore.transitionToNextState();
};
</script>

<template>
  <!-- 內容視圖 -->
  <template v-if="props.view === 'content'">
    <div class="general-event">
      <template v-if="!isResolved">
        <div class="event-icon">🩹</div>
        <div class="dialog-box">
          <p>走近一看，這是一名在戰鬥中受了重傷的冒險者，倒在地上痛苦地呻吟。</p>
          <p>他拉住你的衣角，用微弱的聲音請求：</p>
          <p class="request-text">「求求你... 能給我一個 <span class="highlight-item">{{ needItemName }}</span> 嗎？我快撐不下去了...」</p>
        </div>
      </template>

      <template v-else>
        <div class="event-icon shine">💰</div>
        <div class="dialog-box">
          <p>冒險者感激涕零地接過道具使用，臉色逐漸恢復了紅潤。</p>
          <p>「多虧了你！這是我在路途中收集的報酬，請務必收下。」</p>
          <p class="success-text">你獲得了 <span class="highlight-gold">{{ rewardGold }} 金幣</span>！</p>
        </div>
      </template>
    </div>
  </template>

  <!-- 按鈕視圖 -->
  <template v-else-if="props.view === 'button'">
    <template v-if="!isResolved">
      <el-button type="success" :disabled="!hasNeedItem" @click="handleGive">
        給予 {{ needItemName }} (擁有: {{ hasNeedItem ? '有' : '無' }})
      </el-button>
      <el-button type="info" @click="handleLeave">
        拒絕並離開
      </el-button>
    </template>
    <template v-else>
      <el-button type="primary" @click="handleLeave">
        離開
      </el-button>
    </template>
  </template>
</template>

<style scoped>
.request-text {
  font-weight: bold;
  color: #e6a23c;
  margin-top: 1rem;
}

.highlight-item {
  color: #f56c6c;
  text-decoration: underline;
}

.success-text {
  margin-top: 1rem;
  font-weight: bold;
}

.highlight-gold {
  color: #e6a23c;
  font-size: 1.2rem;
}

.shine {
  animation: shine-glow 2s infinite alternate;
}

@keyframes shine-glow {
  from {
    filter: drop-shadow(0 0 2px #fff);
  }
  to {
    filter: drop-shadow(0 0 10px #ffd700);
  }
}
</style>
