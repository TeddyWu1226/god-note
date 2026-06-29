<script setup lang="ts">
import { statLabels } from "@/types";

const props = defineProps<{
  show: boolean;
  isForging: boolean;
  isFlashWhite: boolean;
  forgeResult: 'success' | 'fail' | 'break' | null;
  prevLevel: number;
  nextLevel: number;
  lastForgedItem: any;
  upgradedStatKey: string;
  equipIcon: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

// 取得裝備大於 0 的正向屬性
const getEligibleStats = (item: any): string[] => {
  if (!item) return [];
  const keys = Object.keys(statLabels);
  return keys.filter(key => typeof item[key] === 'number' && item[key] > 0);
};
</script>

<template>
  <Transition name="fade">
    <div v-if="props.show" class="forge-overlay">
      <div class="forge-anim-area">
        <!-- 進行中的打鐵特效 -->
        <div v-if="props.isForging" class="forge-hammering">
          <div class="hammer">🔨</div>
          
          <div class="anvil-wrapper">
            <div class="anvil">{{ props.equipIcon }}</div>
            <!-- Spark elements -->
            <div class="sparks">
              <span class="spark s1">✨</span>
              <span class="spark s2">🔸</span>
              <span class="spark s3">⚡</span>
              <span class="spark s4">✨</span>
              <span class="spark s5">🔸</span>
            </div>
            
            <!-- 覆蓋鐵鎚與武器的光芒爆裂特效 -->
            <div class="light-burst" :class="{ active: props.isFlashWhite }"></div>
          </div>
          
          <div class="status-msg">矮人鐵匠正在強化與熔煉...</div>
        </div>

        <!-- 強化結果展示 -->
        <div v-else class="forge-result-display" :class="props.forgeResult">
          
          <!-- 橫向並排布局，減少高度佔用並避免溢出 -->
          <div class="result-body-layout">
            <!-- 左側：成功/失敗 狀態與等級變化 -->
            <div class="result-summary-side">
              <div class="result-text">
                <span v-if="props.forgeResult === 'success'">強化成功！</span>
                <span v-if="props.forgeResult === 'fail'">強化失敗！</span>
                <span v-if="props.forgeResult === 'break'">裝備損毀！</span>
              </div>

              <!-- 等級變化顯示 -->
              <div class="level-transition">
                <span class="lvl-old">+{{ props.prevLevel }}</span>
                <span class="lvl-arrow">➡️</span>
                <span class="lvl-new" :class="{ success: props.forgeResult === 'success', break: props.forgeResult === 'break' }">
                  {{ props.forgeResult === 'success' ? '+' + props.nextLevel : (props.forgeResult === 'break' ? '💀' : '+' + props.prevLevel) }}
                </span>
              </div>
            </div>

            <!-- 右側：成功時顯示強化後的裝備素質 (可滾動) -->
            <div v-if="props.forgeResult === 'success' && props.lastForgedItem" class="stats-preview-box">
              <div class="equip-info-header">
                <span class="equip-name-small">{{ props.lastForgedItem.name }}</span>
              </div>
              
              <!-- 滾動包裝層，允許長屬性列表局部滾動 -->
              <div class="stats-list-scroll-wrapper">
                <div class="stats-list">
                  <div
                    v-for="statKey in getEligibleStats(props.lastForgedItem)"
                    :key="statKey"
                    class="stat-preview-row"
                    :class="{ upgraded: statKey === props.upgradedStatKey }"
                  >
                    <span class="stat-label">{{ statLabels[statKey as keyof typeof statLabels] }}</span>
                    <span class="stat-value">
                      {{ props.lastForgedItem.baseStats?.[statKey] ?? props.lastForgedItem[statKey] }} 
                      <span v-if="statKey === props.upgradedStatKey" class="stat-gain">
                        ➡️ {{ props.lastForgedItem[statKey] }} (+{{ (props.lastForgedItem.enhancements?.[statKey] || 0) * 20 }}%)
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 確認按鈕 -->
          <el-button type="primary" size="large" class="confirm-btn" @click="emit('close')">
            確認並關閉
          </el-button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.forge-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(22, 23, 28, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: background-color 0.1s ease-in-out;
}

.light-burst {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  background-color: #ffffff;
  border-radius: 50%;
  pointer-events: none;
  z-index: 100;
  opacity: 0;
  box-shadow: 0 0 80px 40px #ffffff;
}

.light-burst.active {
  animation: light-burst-expand 0.25s forwards cubic-bezier(0.1, 0.8, 0.1, 1);
}

@keyframes light-burst-expand {
  0% {
    width: 0;
    height: 0;
    opacity: 0;
  }
  20% {
    opacity: 1;
    width: 80px;
    height: 80px;
  }
  100% {
    opacity: 1;
    width: 300vmax;
    height: 300vmax;
    border-radius: 50%;
  }
}

.forge-anim-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.forge-hammering {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.forge-hammering .hammer {
  font-size: 5rem;
  animation: strike-sequence 2.6s forwards cubic-bezier(0.25, 0.8, 0.25, 1);
  transform-origin: bottom right;
  position: relative;
  z-index: 10;
}

.anvil-wrapper {
  position: relative;
  display: inline-block;
  z-index: 1;
}

.forge-hammering .anvil {
  font-size: 5rem;
  margin-top: -15px;
  animation: anvil-sequence 2.6s forwards cubic-bezier(0.25, 0.8, 0.25, 1);
  display: inline-block;
  position: relative;
  z-index: 2;
}

.sparks {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 5;
}

.spark {
  position: absolute;
  font-size: 1.5rem;
  opacity: 0;
  transform: translate(0, 0) scale(0);
}

.spark.s1 { animation: spark-1 2.6s forwards cubic-bezier(0.1, 0.8, 0.3, 1); }
.spark.s2 { animation: spark-2 2.6s forwards cubic-bezier(0.1, 0.8, 0.3, 1); }
.spark.s3 { animation: spark-3 2.6s forwards cubic-bezier(0.1, 0.8, 0.3, 1); }
.spark.s4 { animation: spark-4 2.6s forwards cubic-bezier(0.1, 0.8, 0.3, 1); }
.spark.s5 { animation: spark-5 2.6s forwards cubic-bezier(0.1, 0.8, 0.3, 1); }

@keyframes spark-1 {
  /* Strike 1 (12%) */
  0% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  10% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  12% { opacity: 1; transform: translate(-50px, -40px) rotate(25deg) scale(1.2); }
  16% { opacity: 0; transform: translate(-60px, -48px) rotate(25deg) scale(0.4); }

  /* Strike 2 (30%) */
  17% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  28% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  30% { opacity: 1; transform: translate(-50px, -40px) rotate(25deg) scale(1.2); }
  34% { opacity: 0; transform: translate(-60px, -48px) rotate(25deg) scale(0.4); }

  /* Strike 3 (48%) */
  35% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  46% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  48% { opacity: 1; transform: translate(-50px, -40px) rotate(25deg) scale(1.2); }
  52% { opacity: 0; transform: translate(-60px, -48px) rotate(25deg) scale(0.4); }

  /* Final Smash (100%) */
  53% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  96% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  100% { opacity: 1; transform: translate(-75px, -60px) rotate(25deg) scale(2); }
}

@keyframes spark-2 {
  /* Strike 1 (12%) */
  0% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  10% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  12% { opacity: 1; transform: translate(50px, -40px) rotate(-25deg) scale(1.2); }
  16% { opacity: 0; transform: translate(60px, -48px) rotate(-25deg) scale(0.4); }

  /* Strike 2 (30%) */
  17% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  28% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  30% { opacity: 1; transform: translate(50px, -40px) rotate(-25deg) scale(1.2); }
  34% { opacity: 0; transform: translate(60px, -48px) rotate(-25deg) scale(0.4); }

  /* Strike 3 (48%) */
  35% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  46% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  48% { opacity: 1; transform: translate(50px, -40px) rotate(-25deg) scale(1.2); }
  52% { opacity: 0; transform: translate(60px, -48px) rotate(-25deg) scale(0.4); }

  /* Final Smash (100%) */
  53% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  96% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  100% { opacity: 1; transform: translate(75px, -60px) rotate(-25deg) scale(2); }
}

@keyframes spark-3 {
  /* Strike 1 (12%) */
  0% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  10% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  12% { opacity: 1; transform: translate(-70px, -10px) rotate(45deg) scale(1.2); }
  16% { opacity: 0; transform: translate(-84px, -12px) rotate(45deg) scale(0.4); }

  /* Strike 2 (30%) */
  17% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  28% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  30% { opacity: 1; transform: translate(-70px, -10px) rotate(45deg) scale(1.2); }
  34% { opacity: 0; transform: translate(-84px, -12px) rotate(45deg) scale(0.4); }

  /* Strike 3 (48%) */
  35% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  46% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  48% { opacity: 1; transform: translate(-70px, -10px) rotate(45deg) scale(1.2); }
  52% { opacity: 0; transform: translate(-84px, -12px) rotate(45deg) scale(0.4); }

  /* Final Smash (100%) */
  53% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  96% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  100% { opacity: 1; transform: translate(-105px, -15px) rotate(45deg) scale(2); }
}

@keyframes spark-4 {
  /* Strike 1 (12%) */
  0% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  10% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  12% { opacity: 1; transform: translate(70px, -10px) rotate(-45deg) scale(1.2); }
  16% { opacity: 0; transform: translate(84px, -12px) rotate(-45deg) scale(0.4); }

  /* Strike 2 (30%) */
  17% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  28% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  30% { opacity: 1; transform: translate(70px, -10px) rotate(-45deg) scale(1.2); }
  34% { opacity: 0; transform: translate(84px, -12px) rotate(-45deg) scale(0.4); }

  /* Strike 3 (48%) */
  35% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  46% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  48% { opacity: 1; transform: translate(70px, -10px) rotate(-45deg) scale(1.2); }
  52% { opacity: 0; transform: translate(84px, -12px) rotate(-45deg) scale(0.4); }

  /* Final Smash (100%) */
  53% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  96% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  100% { opacity: 1; transform: translate(105px, -15px) rotate(-45deg) scale(2); }
}

@keyframes spark-5 {
  /* Strike 1 (12%) */
  0% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  10% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  12% { opacity: 1; transform: translate(0px, -70px) rotate(0deg) scale(1.2); }
  16% { opacity: 0; transform: translate(0px, -84px) rotate(0deg) scale(0.4); }

  /* Strike 2 (30%) */
  17% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  28% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  30% { opacity: 1; transform: translate(0px, -70px) rotate(0deg) scale(1.2); }
  34% { opacity: 0; transform: translate(0px, -84px) rotate(0deg) scale(0.4); }

  /* Strike 3 (48%) */
  35% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  46% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  48% { opacity: 1; transform: translate(0px, -70px) rotate(0deg) scale(1.2); }
  52% { opacity: 0; transform: translate(0px, -84px) rotate(0deg) scale(0.4); }

  /* Final Smash (100%) */
  53% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  96% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0); }
  100% { opacity: 1; transform: translate(0px, -105px) rotate(0deg) scale(2); }
}

.status-msg {
  margin-top: 2rem;
  font-size: 1.15rem;
  font-weight: bold;
  color: #ff9f43;
  text-shadow: 0 0 10px rgba(255, 159, 67, 0.3);
}

@keyframes strike-sequence {
  /* Strike 1 */
  0% { transform: rotate(0deg) translate(0, 0); }
  6% { transform: rotate(35deg) translate(5px, -5px); }
  12% { transform: rotate(-45deg) translate(-2px, 2px); }
  15% { transform: rotate(-40deg); }
  
  /* Strike 2 */
  18% { transform: rotate(0deg); }
  24% { transform: rotate(35deg) translate(5px, -5px); }
  30% { transform: rotate(-45deg) translate(-2px, 2px); }
  33% { transform: rotate(-40deg); }

  /* Strike 3 */
  36% { transform: rotate(0deg); }
  42% { transform: rotate(35deg) translate(5px, -5px); }
  48% { transform: rotate(-45deg) translate(-2px, 2px); }
  51% { transform: rotate(-40deg); }

  /* Charge & Tremble (蓄力抖動) */
  55% { transform: rotate(50deg) translate(10px, -15px); }
  58% { transform: rotate(49deg) translate(9px, -16px); }
  61% { transform: rotate(52deg) translate(11px, -14px); }
  64% { transform: rotate(48deg) translate(9px, -15px); }
  67% { transform: rotate(51deg) translate(10px, -16px); }
  70% { transform: rotate(49deg) translate(11px, -14px); }
  73% { transform: rotate(52deg) translate(9px, -15px); }
  76% { transform: rotate(48deg) translate(10px, -16px); }
  79% { transform: rotate(51deg) translate(9px, -14px); }
  82% { transform: rotate(49deg) translate(11px, -15px); }
  85% { transform: rotate(52deg) translate(10px, -16px); }
  88% { transform: rotate(50deg) translate(10px, -15px); }

  /* Final Mighty Smash (奮力敲下去) */
  90% { transform: rotate(60deg) translate(12px, -18px); }
  100% { transform: rotate(-65deg) translate(-5px, 5px); }
}

@keyframes anvil-sequence {
  0% { transform: translate(0, 0) scale(1); }
  
  /* Strike 1 Impact */
  12% { transform: translate(0, 2px) scale(0.98); }
  15% { transform: translate(0, 0) scale(1); }

  /* Strike 2 Impact */
  30% { transform: translate(0, 2px) scale(0.98); }
  33% { transform: translate(0, 0) scale(1); }

  /* Strike 3 Impact */
  48% { transform: translate(0, 2px) scale(0.98); }
  51% { transform: translate(0, 0) scale(1); }

  /* Charge Trembling */
  55% { transform: translate(0, 0); }
  58% { transform: translate(-1px, 1px); }
  61% { transform: translate(1px, -1px); }
  64% { transform: translate(-1px, -1px); }
  67% { transform: translate(1px, 1px); }
  70% { transform: translate(-1px, 0); }
  73% { transform: translate(1px, -1px); }
  76% { transform: translate(-1px, 1px); }
  79% { transform: translate(1px, 1px); }
  82% { transform: translate(-1px, -1px); }
  85% { transform: translate(1px, 0); }
  88% { transform: translate(0, 0); }

  /* Final Smash Impact */
  100% { transform: translate(0, 6px) scale(0.95); }
}

.forge-result-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: zoomIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}



.result-text {
  font-size: 1.6rem;
  font-weight: bold;
}

.forge-result-display.success {
  color: #2ecc71;
}

.forge-result-display.fail {
  color: #ff9f43;
}

.forge-result-display.break {
  color: #ff7675;
}

/* 等級變化 */
.level-transition {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffffff;
}

.level-transition .lvl-arrow {
  font-size: 1.5rem;
  color: #909399;
}

.level-transition .lvl-new.success {
  color: #2ecc71;
  text-shadow: 0 0 15px rgba(46, 204, 113, 0.6);
}

.level-transition .lvl-new.break {
  color: #ff7675;
  text-shadow: 0 0 15px rgba(255, 118, 117, 0.6);
}

.result-body-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  margin-top: 1rem;
}

.result-summary-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-width: 220px;
}

/* 屬性預覽框 */
.stats-preview-box {
  background-color: rgba(0, 0, 0, 0.45);
  border: 1px solid #373a4e;
  border-radius: 8px;
  padding: 1.25rem;
  width: 15rem;
  text-align: left;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  max-height: 240px;
}

.stats-list-scroll-wrapper {
  overflow-y: auto;
  padding-right: 0.5rem;
  flex: 1;
  min-height: 0;
}

/* 復古精緻滾動條 */
.stats-list-scroll-wrapper::-webkit-scrollbar {
  width: 6px;
}
.stats-list-scroll-wrapper::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
.stats-list-scroll-wrapper::-webkit-scrollbar-thumb {
  background: #373a4e;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.stats-list-scroll-wrapper::-webkit-scrollbar-thumb:hover {
  background: #ff9f43;
}

.equip-info-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
  border-bottom: 1px dashed #4e5066;
  padding-bottom: 0.5rem;
}



.equip-name-small {
  color: #ffffff;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-preview-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: #a4b0be;
}

.stat-preview-row.upgraded {
  color: #f1c40f;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(241, 196, 15, 0.4);
}

.stat-gain {
  color: #2ecc71;
  margin-left: 4px;
}

.confirm-btn {
  margin-top: 1.75rem;
  width: 200px !important;
  font-weight: bold !important;
}

@keyframes zoomIn {
  0% { transform: scale(0.6); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

</style>
