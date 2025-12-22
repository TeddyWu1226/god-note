<script setup lang="ts">
import { ref } from 'vue';

const isVisible = ref(false);
const stageName = ref('');

/**
 * 觸發動畫的函數
 * @param name 顯示的區域名稱
 */
const playTransition = (name: string) => {
  stageName.value = name;
  isVisible.value = true;

  // 動態計算總時間：大約 3秒後關閉遮罩
  // (文字掉落 0.8s + 停留 1.5s + 淡出 0.7s)
  setTimeout(() => {
    isVisible.value = false;
  }, 2000);
};

// 暴露方法給父組件使用
defineExpose({ playTransition });
</script>

<template>
  <Transition name="fade-overlay">
    <div v-if="isVisible" class="stage-mask">
      <div class="text-container">
        <h1 class="stage-title">〔 {{ stageName }} 〕</h1>
        <div class="stage-decoration"></div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* 1. 全螢幕遮罩 */
.stage-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 確保在所有 UI 之上 */
  pointer-events: all; /* 動畫期間禁止點擊後方 */
}

/* 2. 文字容器與動畫 */
.text-container {
  text-align: center;
  /* 執行文字由上往下掉落的動畫 */
  animation: drop-in 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

.stage-title {
  color: #fff;
  font-size: 4rem;
  font-weight: bold;
  letter-spacing: 0.8rem;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  margin: 0;
  font-family: "Microsoft JhengHei", sans-serif;
}

/* 文字下方的裝飾條線 */
.stage-decoration {
  height: 2px;
  background: linear-gradient(90deg, transparent, #fff, transparent);
  width: 0;
  margin: 1rem auto;
  animation: expand-line 0.8s 0.3s ease-out forwards;
}

/* --- 動畫關鍵影格 --- */

/* 文字掉落效果 */
@keyframes drop-in {
  0% {
    opacity: 0;
    transform: translateY(-100px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 線條擴張效果 */
@keyframes expand-line {
  0% { width: 0; }
  100% { width: 120%; }
}

/* 3. Vue Transition: 整體淡出效果 */
.fade-overlay-enter-active {
  transition: opacity 0.5s ease;
}

.fade-overlay-leave-active {
  transition: opacity 0.8s ease-in;
}

.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}
</style>