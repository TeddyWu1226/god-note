<script setup lang="ts">
import {useLogStore} from '@/store/log-store';
import {computed} from 'vue';

const logStore = useLogStore();

// 1. 最新訊息排在最上面
const currentLogs = computed(() => [...logStore.logs].reverse());

// 暴露清空方法
defineExpose({
  clearLog: logStore.logger.clear
});
</script>

<template>
  <div class="log-view-container">
    <transition-group name="log-list" tag="div" class="log-list-wrapper">
      <div
          class="log-item"
          v-for="log in currentLogs"
          :key="log.id"
      >
        <span class="log-text" v-html="log.message"/>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.log-view-container {
  /* 定位在畫面左上方，不干擾中央怪物 */
  position: absolute;
  top: 15rem;
  left: 3rem;

  /* ⭐️ 限制大小：避免遮住畫面過多空間 */
  width: 20rem;
  max-height: 5rem; /* 超過此高度的舊 Log 會被隱藏 */

  /* 基礎設定 */
  pointer-events: none; /* 滑鼠穿透 */
  overflow: hidden; /* 確保超過範圍的 Log 不可見 */
  z-index: 100;

  /* ⭐️ 底部漸變消失：讓 Log 被推下去時自然淡出 */
  -webkit-mask-image: linear-gradient(
      to bottom,
      black 70%,
      transparent 100%
  );
  mask-image: linear-gradient(
      to bottom,
      black 70%,
      transparent 100%
  );
}

.log-list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.log-item {
  background: transparent; /* 背景全透明 */
  padding: 2px 4px;
  transition: all 0.4s ease;
}

.log-text {
  /* ⭐️ 字體顏色調淡 (使用 rgba 更好控制透明度) */
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  font-weight: 400;

  /* ⭐️ 輕微的陰影：既能看清字體，又不會顯得太重 */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);

  word-break: break-all;
  line-height: 1.3;
}

/* --- 動畫效果 --- */

/* 入場：從上方滑入並淡入 */
.log-list-enter-from {
  opacity: 0;
  transform: translateY(-15px);
}

/* 離場：淡出（自動消逝時觸發） */
.log-list-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* 離開時的定位處理，確保 move 動畫平滑 */
.log-list-leave-active {
  position: absolute;
}

/* ⭐️ 關鍵：當新 Log 加入時，舊 Log 平滑向下移動的動畫 */
.log-list-move {
  transition: transform 0.3s ease;
}
</style>