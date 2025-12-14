<script setup lang="ts">
import {ref, onMounted} from 'vue';

const props = defineProps({
  // 要顯示的文字內容
  message: {
    type: String,
    required: true,
  },
  // 顯示時間 (毫秒)
  duration: {
    type: Number,
    default: 1500,
  },
  // 特效顏色 (可選)
  color: {
    type: String,
    default: 'white',
  },
  // 特效的 CSS 類別 (可選)
  messageClass: {
    type: String,
    default: '',
  },
  customStyle: {
    type: Object,
    default: () => ({}),
  },
});

const isVisible = ref(false);
let timer: any = null;

const show = () => {
  isVisible.value = true;
  if (timer) clearTimeout(timer);

  // 定時隱藏
  timer = setTimeout(() => {
    isVisible.value = false;
    // 這裡可以發出事件通知父組件銷毀實例
    // emit('destroy');
  }, props.duration);
};

// 為了讓外部能夠控制顯示
onMounted(() => {
  show();
});

// 根據 props.color 設置樣式
const messageStyle = {
  'color': props.color,
  // 動畫時長應與 CSS @keyframes 中定義的時長匹配
  '--message-duration': `${props.duration}ms`,
};
</script>

<template>
  <transition name="floating-message-fade">
    <div v-if="isVisible" class="floating-message-container" :style="props.customStyle">
      <div class="floating-message" :class="messageClass" :style="messageStyle">
        {{ message }}
      </div>
    </div>
  </transition>
</template>

<style scoped>
:root {
  --message-duration: 1500ms;
  --x-offest: 2rem
}

.floating-message-container {
  top: 50%;
  left: 50%;
  /* 確保在所有內容之上 */
  z-index: 5000;
  pointer-events: none; /* 讓點擊可以穿透 */
}

.floating-message {
  font-size: 2rem;
  font-weight: bold;
  padding: 0.5em 1em;
  color: var(#ffffff);
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  /* 使用 filter drop-shadow 模擬邊框光暈 */
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.8));

  /* 設置動畫 */
  animation: floating-move var(--message-duration) forwards, /* 處理移動和縮放 */ floating-fade-out var(--message-duration) forwards; /* 處理淡出 */
}

/* ---------------------------------------------------- */
/* 核心動畫: 向上移動 + 縮放 (縮小 -> 放大 -> 縮小) + 淡出 */
/* ---------------------------------------------------- */

@keyframes floating-move {
  /* ⭐️ 0%：起點向左偏移 */
  0% {
    transform: translate(-8rem, 5rem) scale(0.6);
  }

  /* 20%：向上移動並放大 */
  20% {
    transform: translate(-8rem, -1rem) scale(1.1);
  }

  /* 80%：保持大小，保持向左偏移 30px */
  80% {
    transform: translate(-8rem, -3rem) scale(1.0);
  }

  /* 100%：向上移動更遠並縮小淡出，保持向左偏移 30px */
  100% {
    transform: translate(-8rem, -5rem) scale(0.6);
  }
}

@keyframes floating-fade-out {
  0% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
  /* 最後 20% 淡出 */
}


/* ---------------------------------------------------- */
/* Vue Transition 輔助動畫 (可選，用於更平滑的移除) */
/* ---------------------------------------------------- */

.floating-message-fade-leave-active {
  transition: opacity 0.3s ease-in;
}

.floating-message-fade-leave-to {
  opacity: 0;
}
</style>