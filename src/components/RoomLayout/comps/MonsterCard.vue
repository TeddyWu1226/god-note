<script setup lang="ts">
import {computed, PropType, ref} from 'vue'; // 引入 ref 和 computed
import {MonsterType} from "@/types";
import {HpProgress} from "@/components/Shared/Progress";

const props = defineProps({
  info: {type: Object as PropType<MonsterType>},
  isSelected: {type: Boolean, default: false} // ⭐️ 新增：接收選中狀態
});
const emit = defineEmits(['select']);
const handleClick = () => {
  emit('select', props.info);
};

// ⭐️ 新增狀態：用於控制抖動動畫
const isShaking = ref(false);
// 設置動畫持續時間 (需與 CSS @keyframes shake 的時間匹配)
const SHAKE_DURATION = 500;

const isDead = computed(() => props.info?.hp === 0)

/**
 * 外部調用：啟動卡片抖動動畫
 */
const shake = () => {
  // 1. 啟動抖動狀態
  isShaking.value = true;

  // 2. 在動畫結束後移除抖動類別
  setTimeout(() => {
    isShaking.value = false;
  }, SHAKE_DURATION);
};

// ⭐️ 將 shake 方法暴露給父組件
defineExpose({
  shake
});

</script>

<template>
  <el-card
      :class="{'monster-card': true, 'is-selected': props.isSelected, 'is-shaking': isShaking}"
      shadow="hover"
      @click="handleClick"
  >
    <el-tooltip>
      <template #content>
        <p>{{ props.info.name }}</p>
        <p>{{ props.info.description }}</p>
      </template>
      <el-row v-if="isDead" style="width: 100%" justify="center">
        <el-col style="text-align: center;font-size: 2rem" :span="24">
          <span>🪦</span>
        </el-col>
        <el-col style="text-align: center;" :span="24">
          <span>{{ props.info.name }}</span>
        </el-col>
        <el-col style="text-align: center;font-size: 20px;color:var(--el-color-danger)" :span="24">
          <span>死亡</span>
        </el-col>
      </el-row>
      <el-row v-else style="width: 100%" justify="center">
        <el-col style="text-align: center;font-size: 2rem" :span="24">
          <span>{{ props.info.icon }}</span>
        </el-col>
        <el-col style="text-align: center;" :span="24">
          <span>{{ props.info.name }}</span>
        </el-col>
        <el-col :span="12">
          <span>⚔️</span>
          <span>{{ props.info.ad }}</span>
        </el-col>
        <el-col :span="12">
          <span>🛡️</span>
          <span>{{ props.info.adDefend }}</span>
        </el-col>
        <el-col :span="24">
          <HpProgress :current-value="props.info.hp" :total-value="props.info.hpLimit"/>
        </el-col>
      </el-row>
    </el-tooltip>
  </el-card>
</template>

<style scoped>
.monster-card {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 10rem;
  font-size: 1rem;
  padding: 0;
}

.el-col {
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
}

p {
  line-height: 0.5;
}

/* ⭐️ 關鍵修改點 3: 高亮特效樣式 */
.monster-card.is-selected {
  /* 改變邊框顏色或陰影來強調選中狀態 */
  border: 2px solid #00f3ff; /* 青藍色邊框 */
  box-shadow: 0 0 15px rgba(0, 243, 255, 0.9), /* 強烈外發光 */ 0 0 5px rgba(0, 243, 255, 0.5); /* 內部細微光暈 */
  transform: scale(1.02); /* 輕微放大以突出 */
  cursor: pointer;
  /* 確保過渡平滑 */
  transition: all 0.2s ease-in-out;
}

/* 確保 hover 效果依然存在 */
.monster-card:hover:not(.is-selected) {
  box-shadow: 0 0 8px rgba(120, 255, 255, 0.4);
}

/* ------------------- 抖動特效 (@keyframes) ------------------- */

/* ⭐️ 應用抖動動畫的類別 */
.monster-card.is-shaking {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  transform: translate3d(0, 0, 0); /* 啟用硬體加速 */
}

@keyframes shake {
  /* 輕微的、快速的水平位移 */
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>