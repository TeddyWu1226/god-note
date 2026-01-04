<script setup lang="ts">
import {ref, watch} from 'vue';
import {usePlayerStore} from "@/store/player-store";

const playerStore = usePlayerStore();
const isShow = ref(false);
const canClick = ref(false); // 新增：控制是否允許點擊
// 品質配置
const QUALITY_CONFIG: any = {
  NORMAL: {label: '普通', color: '#b2bec3', weight: 60, multiplier: 1},
  RARE: {label: '稀有', color: '#0984e3', weight: 25, multiplier: 1.5},
  LUCKY: {label: '幸運', color: '#fdcb6e', weight: 10, multiplier: 2},
  GODLY: {label: '歐皇', color: '#d63031', weight: 5, multiplier: 3},
};

// 屬性設定
const STAT_OPTIONS = [
  {key: 'ad', label: '攻擊力', icon: '⚔️', min: 6, max: 9, unit: '%', type: 'percent'},
  {key: 'hpLimit', label: '生命上限', icon: '❤️', min: 6, max: 9, unit: '', type: 'value'},
  {key: 'critRate', label: '爆擊率', icon: '💥', min: 1, max: 2, unit: '%', type: 'value'},
  {key: 'critIncrease', label: '爆擊傷害', icon: '💢', min: 1, max: 3, unit: '%', type: 'value'},
  {key: 'apIncrease', label: '法術增傷', icon: '💫', min: 2, max: 3, unit: '%', type: 'value'},
  {key: 'hit', label: '命中值', icon: '🎯', min: 2, max: 3, unit: '', type: 'value'}
];
const getRandomQuality = () => {
  const rand = Math.random() * 100;
  let curr = 0;
  for (const [key, config] of Object.entries(QUALITY_CONFIG)) {
    curr += (config as any).weight;
    if (rand < curr) return key;
  }
  return 'NORMAL';
};
const generateOptions = () => {
  const options = [];
  for (let i = 0; i < 3; i++) {
    const qKey = getRandomQuality();
    const quality = QUALITY_CONFIG[qKey];
    // 隨機選取一個屬性模板
    const statBase = STAT_OPTIONS[Math.floor(Math.random() * STAT_OPTIONS.length)];

    // 1. 計算隨機基礎值並乘以品質倍率
    let bonus = (Math.random() * (statBase.max - statBase.min) + statBase.min) * quality.multiplier;

    // 2. 關鍵改動：不論是百分比還是數值，全部強制取整
    // 這樣卡片上顯示的就是 +5%、+50HP、+8命中
    const finalIntegerValue = Math.round(bonus);

    options.push({
      ...statBase,
      quality,
      finalValue: finalIntegerValue
    });
  }
  playerStore.remainingLevelUpRewards = options;
};

const startRewardSequence = () => {
  // 升級回血/回魔
  playerStore.info.hp = Math.min(playerStore.finalStats.hpLimit, playerStore.info.hp + Math.round(playerStore.finalStats.hpLimit / 2))
  playerStore.info.sp = Math.min(playerStore.finalStats.spLimit, playerStore.info.sp + Math.round(playerStore.finalStats.spLimit / 2))
  generateOptions();
  isShow.value = true;
  // 開始鎖定點擊
  canClick.value = false;
  // 1 秒後解除鎖定
  setTimeout(() => {
    canClick.value = true;
  }, 1000);
};
// 監聽待領取獎勵次數
watch(
    () => playerStore.pendingLevelUpRewards,
    (newCount) => {
      // 如果有次數且目前遮罩是關閉的，就觸發顯示
      if (newCount > 0 && !isShow.value) {
        if (playerStore.remainingLevelUpRewards.length === 0) {
          startRewardSequence();
        } else {
          canClick.value = true;
          isShow.value = true;
        }
      }
    },
    {immediate: true} // 初始化時也檢查一次，解決重新整理後的顯示問題
);


const handleSelect = (reward: any) => {
  // 如果還在冷卻時間，直接攔截
  if (!canClick.value) return;

  const {key, finalValue, type} = reward;

  // 1. 執行屬性提升邏輯
  if (type === 'percent') {
    const baseValue = playerStore.info[key] || 0;
    playerStore.info[key] += Math.max(Math.round(baseValue * (finalValue / 100)), 1);
  } else {
    playerStore.info[key] += finalValue;
    if (key === 'hpLimit') {
      playerStore.info.hp += finalValue;
    }
  }

  // 2. 關鍵：減少待領取次數
  playerStore.pendingLevelUpRewards -= 1;

  // 3. 關閉當前畫面
  isShow.value = false;
  playerStore.remainingLevelUpRewards = []
};
</script>

<template>
  <Transition name="fade">
    <div v-if="isShow" class="levelup-overlay">
      <div class="overlay-content">
        <h1 class="level-title">LEVEL UP</h1>
        <p class="level-subtitle">獲得新的感悟，選擇一項能力提升</p>

        <div class="card-wrapper">
          <div
              v-for="(opt, i) in playerStore.remainingLevelUpRewards"
              :key="i"
              class="reward-card"
              :class="[opt.quality.label, { 'is-locked': !canClick }]"
              :style="{ '--q-color': opt.quality.color }"
              @click="handleSelect(opt)"
          >
            <div class="card-inner">
              <div class="q-tag">{{ opt.quality.label }}</div>
              <div class="s-icon">{{ opt.icon }}</div>
              <div class="s-label">{{ opt.label }}</div>
              <div class="s-value">+{{ opt.finalValue }}{{ opt.unit }}</div>
            </div>
            <div class="bg-text">{{ opt.quality.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
:root {
  --q-color: #fff
}

/* 全螢幕遮罩 */
.levelup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.95) 0%, rgba(20, 20, 20, 1) 100%);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  overflow: hidden;
}

.overlay-content {
  text-align: center;
  width: 100%;
  height: 80%;
}

.level-title {
  font-size: 4rem;
  letter-spacing: 1rem;
  margin-bottom: 0;
  background: linear-gradient(to bottom, #fff 0%, #aaa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 1rem rgba(255, 255, 255, 0.2));
  animation: title-in 0.8s ease-out;
}

.level-subtitle {
  color: #666;
  margin-bottom: 4rem;
  letter-spacing: 0.2rem;
}

/* 卡片容器 */
.card-wrapper {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 0 1rem;
}

/* 獎勵卡片 */
.reward-card {
  position: relative;
  width: 12rem;
  height: 18rem;
  background: #1a1a1a;
  border: 2px solid var(--q-color);
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.reward-card:hover {
  transform: translateY(-1.5rem) scale(1.05);
  box-shadow: 0 0 3rem var(--q-color);
  background: #222;
}

.card-inner {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.q-tag {
  position: absolute;
  top: 1rem;
  font-size: 0.8rem;
  color: var(--q-color);
  border: 1px solid var(--q-color);
  padding: 0.2rem 0.8rem;
  border-radius: 1rem;
}

.s-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.s-label {
  font-size: 1.2rem;
  color: #ccc;
  margin-bottom: 0.5rem;
}

.s-value {
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
}

/* 背景裝飾 */
.bg-text {
  position: absolute;
  bottom: -1rem;
  right: -0.5rem;
  font-size: 5rem;
  font-weight: 900;
  color: var(--q-color);
  opacity: 0.05;
  pointer-events: none;
}

/* 歐皇特別動畫 */
.reward-card:nth-child(n).歐皇 {
  animation: god-pulse 2s infinite;
}

@keyframes god-pulse {
  0% {
    border-color: #d63031;
    box-shadow: 0 0 1rem #d63031;
  }
  50% {
    border-color: #ff7675;
    box-shadow: 0 0 3rem #d63031;
  }
  100% {
    border-color: #d63031;
    box-shadow: 0 0 1rem #d63031;
  }
}

/* 進場動畫 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes title-in {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* 手機適配 */
@media (max-width: 768px) {
  .card-wrapper {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .reward-card {
    width: 80vw;
    height: 8rem;
  }

  .card-inner {
    flex-direction: row;
    gap: 1rem;
    justify-content: space-around;
  }

  .q-tag {
    top: -0.5rem;
    right: 1rem;
    left: auto;
    transform: none;
  }

  .s-icon {
    font-size: 2.5rem;
    margin: 0;
  }

  .level-title {
    font-size: 2.5rem;
  }
}

/* 鎖定時的樣式 */
.reward-card.is-locked {
  cursor: not-allowed;
  opacity: 0.7;
  filter: grayscale(0.5); /* 稍微灰階一點點 */
  transform: none !important; /* 禁止 hover 放大動畫 */
  box-shadow: none !important;
}

/* 只有在非鎖定狀態下才有 hover 效果 */
.reward-card:not(.is-locked):hover {
  transform: translateY(-1.5rem) scale(1.05);
  box-shadow: 0 0 3rem var(--q-color);
  background: #222;
}
</style>