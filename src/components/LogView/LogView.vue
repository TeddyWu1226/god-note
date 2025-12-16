<script setup lang="ts">
import { useLogStore } from '@/store/log-store'; // 引入 Pinia Store
import {computed, nextTick, ref, watch} from 'vue';

const logStore = useLogStore();

// 獲取 Log 列表
const currentLogs = computed(() => logStore.logs);

// ------------------------------------------------------------------
// 讓 Log 列表自動滾動到最底部，以便顯示最新 Log
// ------------------------------------------------------------------
const logContentRef = ref<HTMLElement | null>(null);

// 監聽 Log 列表變化，並自動滾動到底部
watch(currentLogs.value, () => {
  // 使用 nextTick 確保 DOM 已經更新，再執行滾動
  nextTick(() => {
    if (logContentRef.value) {
      logContentRef.value.scrollTop = logContentRef.value.scrollHeight;
    }
  });
}, { deep: true });

// 透過 defineExpose 暴露清空方法 (可選，但讓組件本身也能控制)
defineExpose({
  clearLog: logStore.logger.clear
});

</script>

<template>
  <div class="floating-log-window">
    <div class="log-content-masked" ref="logContentRef">
      <p
          class="log-entry"
          v-for="log in currentLogs"
          :key="log.id"
      >
        {{ log.message }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* 保持您原有的樣式 */
.floating-log-window {
  /* 為了讓自動滾動生效，高度必須固定 */
  height: 6rem;
  background: transparent;
  border: none;
  overflow: hidden;
  z-index: 10;
}

.log-content-masked {
  width: 100%;
  height: 100%;
  padding: 10px;
  /* ⭐️ 確保滾動條在右側，以便觀察 */
  overflow-y: auto;

  color: #fff;
  font-size: 0.9rem;

  /* 核心修正：使用 mask-image 實現頂部內容漸變透明 */
  -webkit-mask-image: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0) 0%,   /* 頂部隱藏 */
      rgba(255, 255, 255, 1) 15%,
      rgba(255, 255, 255, 1) 100%  /* 底部可見 */
  );
  mask-image: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 1) 15%,
      rgba(255, 255, 255, 1) 100%
  );
}

.log-entry {
  color: #DDD;
  margin: 0.2rem 0;
  line-height: 1.2;
}
</style>