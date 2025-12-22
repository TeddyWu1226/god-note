<script setup lang="ts">
import { onMounted } from 'vue';

const props = defineProps<{
  text: string;
  type: 'buff' | 'debuff';
  x: number;
  y: number;
  onComplete: () => void;
}>();

onMounted(() => {
  // 動態消失：500ms 後通知父層移除自己
  setTimeout(() => {
    props.onComplete();
  }, 800);
});
</script>

<template>
  <div
      class="floating-effect"
      :class="type"
      :style="{ left: x + 'px', top: y + 'px' }"
  >
    {{ text }}
  </div>
</template>

<style scoped>
.floating-effect {
  position: fixed;
  pointer-events: none; /* 不會擋到點擊 */
  z-index: 9999;
  font-weight: bold;
  font-size: 1.2rem;
  white-space: nowrap;
  animation: floatUp 0.8s ease-out forwards;
}

.buff { color: #00ff00; text-shadow: 0 0 5px #000; }
.debuff { color: #ff4444; text-shadow: 0 0 5px #000; }

@keyframes floatUp {
  0% { transform: translateY(0); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(-50px); opacity: 0; }
}
</style>