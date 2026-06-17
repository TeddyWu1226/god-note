<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

const props = defineProps({
  message: { type: String, default: '' },
  icon: { type: String, default: '' },
  color: { type: String, default: '#add8e6' }, // 漸層與文字的主色調
  duration: { type: Number, default: 1500 },
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
  }, props.duration - 300);

  // 徹底移除 DOM 節點
  setTimeout(() => {
    emit('unmount');
  }, props.duration);
});
</script>

<template>
  <transition name="card-effect-fade">
    <div v-if="isVisible" class="card-status-overlay" :style="effectStyle">
      <!-- 卡片四周漸層 -->
      <div class="card-vignette"></div>

      <!-- 文字與圖示容器 -->
      <div class="card-message-container">
        <div v-if="icon" class="card-icon">{{ icon }}</div>
        <div class="card-message">{{ message }}</div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.card-status-overlay {
  --effect-color: #add8e6;
  --effect-duration: 1500ms;

  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: inherit;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 卡片邊緣內發光 */
.card-vignette {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 30px 10px var(--effect-color);
  opacity: 0;
  animation: card-vignette-pulse var(--effect-duration) ease-in-out forwards;
}

@keyframes card-vignette-pulse {
  0% {
    opacity: 0;
    box-shadow: inset 0 0 45px 15px var(--effect-color);
  }
  20% {
    opacity: 0.75;
    box-shadow: inset 0 0 25px 8px var(--effect-color);
  }
  80% {
    opacity: 0.7;
    box-shadow: inset 0 0 25px 8px var(--effect-color);
  }
  100% {
    opacity: 0;
    box-shadow: inset 0 0 45px 15px var(--effect-color);
  }
}

.card-message-container {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  width: 90%;
  animation: card-message-pop var(--effect-duration) cubic-bezier(0.1, 0.7, 1.0, 0.1) forwards;
}

.card-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 4px var(--effect-color));
}

.card-message {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 1.15rem;
  font-weight: 900;
  color: #ffffff;
  text-shadow: 0 0 5px var(--effect-color),
               0 0 10px var(--effect-color);
  margin: 0;
  letter-spacing: 0.05rem;
  text-align: center;
  white-space: nowrap;
}

@keyframes card-message-pop {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(10px);
  }
  15% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  85% {
    opacity: 1;
    transform: scale(1.02) translateY(0);
  }
  100% {
    opacity: 0;
    transform: scale(1.05) translateY(-8px);
  }
}

.card-effect-fade-enter-active,
.card-effect-fade-leave-active {
  transition: opacity 0.3s ease;
}

.card-effect-fade-enter-from,
.card-effect-fade-leave-to {
  opacity: 0;
}
</style>
