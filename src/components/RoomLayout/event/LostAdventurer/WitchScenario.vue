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

// 晶石選項配置
const crystalsConfig = [
  { name: "劣質魔物晶石", rewardExp: 40 },
  { name: "下級魔物晶石", rewardExp: 80 },
  { name: "中級魔物晶石", rewardExp: 150 }
];

// 初始化需要的晶石
onMounted(() => {
  if (!gameStateStore.otherRecord['WITCH_NEED_ITEM']) {
    const randomCrystal = crystalsConfig[Math.floor(Math.random() * crystalsConfig.length)];
    gameStateStore.otherRecord['WITCH_NEED_ITEM'] = randomCrystal.name;
    gameStateStore.otherRecord['WITCH_REWARD_EXP'] = randomCrystal.rewardExp;
  }
});

const needCrystalName = computed(() => gameStateStore.otherRecord['WITCH_NEED_ITEM'] || '');
const rewardExp = computed(() => gameStateStore.otherRecord['WITCH_REWARD_EXP'] || 0);
const isResolved = computed(() => !!gameStateStore.otherRecord['WITCH_RESOLVED']);
const hasNeedCrystal = computed(() => playerStore.hasItem(needCrystalName.value)[0]);

const handleGive = () => {
  if (playerStore.removeItem(needCrystalName.value, 1)) {
    playerStore.gainExp({amount: rewardExp.value});
    gameStateStore.otherRecord['WITCH_RESOLVED'] = true;
  }
};

const handleLeave = () => {
  // 清理暫存記錄
  delete gameStateStore.otherRecord['WITCH_NEED_ITEM'];
  delete gameStateStore.otherRecord['WITCH_REWARD_EXP'];
  delete gameStateStore.otherRecord['WITCH_RESOLVED'];

  gameStateStore.addEventProcess(SpecialEventEnum.LostAdventurer, true);
  gameStateStore.transitionToNextState();
};
</script>

<template>
  <!-- 內容視圖 -->
  <template v-if="props.view === 'content'">
    <div class="general-event">
      <template v-if="!isResolved">
        <div class="event-icon">🔮</div>
        <div class="dialog-box">
          <p>神祕的人影緩緩抬頭，兜帽下露出一雙散發著紫色微光的眼眸，這是一位神祕的女巫。</p>
          <p>她用低沉而富有魔力的聲音對你說道：</p>
          <p class="request-text">「旅人，我正在收集稀有的魔物能量。若你願意奉獻一顆 <span class="highlight-item">{{ needCrystalName }}</span>，我將給予你靈魂的啟示。」</p>
        </div>
      </template>

      <template v-else>
        <div class="event-icon shine">✨</div>
        <div class="dialog-box">
          <p>女巫伸出蒼白的手指接過晶石，晶石在她的掌心化為無數美麗的星塵隨風消逝。</p>
          <p>「明智的抉擇... 靈魂的智慧已與你同在。」</p>
          <p class="success-text">你獲得了 <span class="highlight-exp">{{ rewardExp }} 點經驗值</span>！</p>
        </div>
      </template>
    </div>
  </template>

  <!-- 按鈕視圖 -->
  <template v-else-if="props.view === 'button'">
    <template v-if="!isResolved">
      <el-button type="success" :disabled="!hasNeedCrystal" @click="handleGive">
        奉獻 {{ needCrystalName }} (擁有: {{ hasNeedCrystal ? '有' : '無' }})
      </el-button>
      <el-button type="info" @click="handleLeave">
        拒絕並離開
      </el-button>
    </template>
    <template v-else>
      <el-button type="primary" @click="handleLeave">
        告辭
      </el-button>
    </template>
  </template>
</template>

<style scoped>
.request-text {
  font-weight: bold;
  color: #9c27b0;
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

.highlight-exp {
  color: #409eff;
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
    filter: drop-shadow(0 0 10px #9c27b0);
  }
}
</style>
