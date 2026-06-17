<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

const props = defineProps({
  message: { type: String, default: '' },
  icon: { type: String, default: '' },
  color: { type: String, default: '#add8e6' }, // 漸層與文字的主色調
  duration: { type: Number, default: 2000 },
});

const emit = defineEmits(['unmount']);

const isVisible = ref(false);

const effectStyle = computed(() => ({
  '--effect-duration': `${props.duration}ms`,
  '--effect-color': props.color,
}));

onMounted(() => {
  isVisible.value = true;

  // 結束前觸發 Vue transition (Fade Out)
  setTimeout(() => {
    isVisible.value = false;
  }, props.duration - 500);

  // 徹底移除 DOM 節點
  setTimeout(() => {
    emit('unmount');
  }, props.duration + 200);
});
</script>

<template>
  <transition name="hero-effect-fade">
    <div v-if="isVisible" class="hero-effect-overlay" :style="effectStyle">
      <!-- 畫面四周漸層 -->
      <div class="vignette-layer"></div>

      <!-- 文字與圖示容器 -->
      <div class="message-container">
        <div v-if="icon" class="effect-icon">{{ icon }}</div>
        <h2 class="effect-message">{{ message }}</h2>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.hero-effect-overlay {
  --effect-color: #add8e6;
  --effect-duration: 2000ms;

  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 四周向內發光效果 */
.vignette-layer {
  position: absolute;
  inset: 0;
  box-shadow: inset 0 0 100px 20px var(--effect-color);
  opacity: 0;
  animation: vignette-pulse var(--effect-duration) ease-in-out forwards;
}

@keyframes vignette-pulse {
  0% {
    opacity: 0;
    box-shadow: inset 0 0 150px 50px var(--effect-color);
  }
  20% {
    opacity: 0.6;
    box-shadow: inset 0 0 80px 30px var(--effect-color);
  }
  80% {
    opacity: 0.5;
    box-shadow: inset 0 0 100px 40px var(--effect-color);
  }
  100% {
    opacity: 0;
    box-shadow: inset 0 0 200px 100px var(--effect-color);
  }
}

/* 文字樣式 */
.message-container {
  position: relative;
  z-index: 10;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
}

.effect-icon {
  font-size: 3rem;
  filter: drop-shadow(0 0 8px var(--effect-color));
  animation: message-pop var(--effect-duration) cubic-bezier(0.1, 0.7, 1.0, 0.1) forwards;
}

.effect-message {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 3.5rem;
  font-weight: 900;
  color: #ffffff;
  /* 文字發光顏色與設定顏色一致 */
  text-shadow: 0 0 10px var(--effect-color),
               0 0 20px var(--effect-color),
               0 0 40px var(--effect-color);
  margin: 0;
  letter-spacing: 0.2rem;
  animation: message-pop var(--effect-duration) cubic-bezier(0.1, 0.7, 1.0, 0.1) forwards;
}

@keyframes message-pop {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
    filter: blur(8px);
  }
  15% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0);
  }
  85% {
    opacity: 1;
    transform: scale(1.05) translateY(0);
    filter: blur(0);
  }
  100% {
    opacity: 0;
    transform: scale(1.1) translateY(-5px);
    filter: blur(12px);
  }
}

.hero-effect-fade-enter-active,
.hero-effect-fade-leave-active {
  transition: opacity 0.4s ease;
}

.hero-effect-fade-enter-from,
.hero-effect-fade-leave-to {
  opacity: 0;
}

@media (max-width: 767px) {
  .effect-message {
    font-size: 2rem;
  }
  .effect-icon {
    font-size: 1.8rem;
  }
  .vignette-layer {
    box-shadow: inset 0 0 60px 15px var(--effect-color);
  }
}
</style>
