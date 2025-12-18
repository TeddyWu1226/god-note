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
  --message-duration: 800ms;
}

/* 確保容器可以被定位到目標位置 */
.floating-message-container {
  /* ⭐️ 核心修正：使用 fixed 定位，並確保容器本身不佔空間 */
  position: fixed;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  /* 確保動畫超出時不顯示捲軸 */
  overflow: visible;
  z-index: 5000;
  pointer-events: none;
}
.floating-message {
  /* ⭐️ 預設字體大小 (桌面/大螢幕) */
  font-size: 2rem;
  font-weight: bold;
  padding: 0.5em 1em;
  color: var(#ffffff); /* 注意：這裡的 var(#ffffff) 語法可能錯誤，應為 color: white; 或 color: #ffffff; */
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.8));

  /* 設置動畫 */
  animation:
      floating-move var(--message-duration) forwards,
      floating-fade-out var(--message-duration) forwards;
}

/* ---------------------------------------------------- */
/* 核心動畫 (桌面版本，若上面有 @media 則只在桌面生效) */
/* ---------------------------------------------------- */
@keyframes floating-move {
  /* ⭐️ 桌面版本的動畫保持不變或微調 */
  0% {
    transform: translate(-8rem, 5rem) scale(0.6);
  }
  20% {
    transform: translate(-8rem, -1rem) scale(1.1);
  }
  80% {
    transform: translate(-8rem, -3rem) scale(1.0);
  }
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
}

/* ---------------------------------------------------- */
/* ⭐️ RWD 修正：針對手機螢幕 (小於或等於 767px) 縮小字體 */
/* ---------------------------------------------------- */
@media (max-width: 767px) {
  .floating-message {
    /* 縮小字體到 1.5rem */
    font-size: 1.5rem;
    /* 調整 padding 使其看起來更協調 */
    padding: 0.4em 0.8em;
    /* ⭐️ 關鍵修正：強制文字不換行 */
    white-space: nowrap;
    /* ⭐️ 額外建議：確保元素是內聯塊級，以適應內容寬度 */
    display: inline-block;
  }

  /* ⭐️ 由於字體縮小，動畫的偏移量和縮放比例也應調整 */
  @keyframes floating-move {
    /* 0%：起點向左偏移 (距離縮小) */
    0% {
      transform: translate(-8rem, 3rem) scale(0.6);
    }

    /* 20%：向上移動並放大 */
    20% {
      transform: translate(-8rem, -1rem) scale(1.1);
    }

    /* 80%：保持大小 */
    80% {
      transform: translate(-8rem, -2rem) scale(1.0);
    }

    /* 100%：向上移動更遠並縮小淡出 */
    100% {
      transform: translate(-8rem, -4rem) scale(0.6);
    }
  }
}
/* ---------------------------------------------------- */
</style>