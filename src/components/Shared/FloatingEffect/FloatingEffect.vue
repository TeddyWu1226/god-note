<script setup lang="ts">
import {onMounted} from 'vue';

const props = defineProps<{
  text: string;
  type: 'buff' | 'debuff';
  x: number;
  y: number;
  onComplete: () => void;
}>();

onMounted(() => {
  const duration = 800;
  setTimeout(() => {
    props.onComplete();
  }, duration);
});
</script>

<template>
  <div
      class="floating-effect"
      :class="type"
      :style=" { left: x + 'px', top: y + 'px' }"
  >
    <span class="text-content">{{ text }}</span>
  </div>
</template>

<style scoped>
.floating-effect {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  font-family: "Microsoft JhengHei", "Arial Black", sans-serif;
  font-weight: 900;
  white-space: nowrap;
  will-change: transform, opacity; /* 提升渲染效能 */
}

/* 基礎樣式優化 */
.buff {
  color: #52ff7e;
  text-shadow: 0 0 10px rgba(82, 255, 126, 0.5);
  animation: floatUp 0.8s ease-out forwards;
}

.debuff {
  color: #ff4d4d;
  text-shadow: 0 0 10px rgba(255, 77, 77, 0.5);
  animation: floatUp 0.8s ease-out forwards;
}


/* 常規浮動動畫 */
@keyframes floatUp {
  0% {
    transform: translateY(0) scale(0.8);
    opacity: 0;
  }
  20% {
    opacity: 1;
    transform: translateY(-10px) scale(1.1);
  }
  100% {
    transform: translateY(-60px) scale(1);
    opacity: 0;
  }
}
</style>