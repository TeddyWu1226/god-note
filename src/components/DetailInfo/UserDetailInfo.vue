<script setup lang="ts">
import {ref, computed, onBeforeUnmount} from "vue";
import {getEnumColumn} from "@/utils/enum";
import {QualityEnum} from "@/enums/quilty-enum";
import {EquipmentEnum} from "@/enums/enums";
import {usePlayerStore} from "@/store/player-store";
import {ItemInfo} from "@/components/Shared/itemInfo";

// --- 狀態控制 ---
const fabRef = ref<HTMLElement | null>(null);
const position = ref({x: 0, y: 100});
const isDragging = ref(false);
const isShowStats = ref(false);
const isSnapping = ref(false);

// --- 內部變數 (不需要響應式) ---
let startTime = 0;
let startX = 0;
let startY = 0;

const playerStore = usePlayerStore();
const playerStats = computed(() => playerStore.finalStats);

/**
 * 核心：開始拖拽/點擊
 */
const onDragStart = (e: MouseEvent | TouchEvent) => {
  if (!fabRef.value) return;

  const parent = fabRef.value.offsetParent as HTMLElement;
  if (!parent) return;

  // 1. 初始化狀態
  isSnapping.value = false;
  isDragging.value = false;
  startTime = Date.now();

  const parentRect = parent.getBoundingClientRect();
  const fabRect = fabRef.value.getBoundingClientRect();

  // 取得初始座標
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

  startX = clientX;
  startY = clientY;

  // 計算手指在 Icon 內的相對位置偏移
  const offsetX = clientX - fabRect.left;
  const offsetY = clientY - fabRect.top;

  const onMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
    const curX = moveEvent instanceof MouseEvent ? moveEvent.clientX : moveEvent.touches[0].clientX;
    const curY = moveEvent instanceof MouseEvent ? moveEvent.clientY : moveEvent.touches[0].clientY;

    // 🚩 判定閾值：位移超過 5px 才算拖拽
    const distance = Math.sqrt(Math.pow(curX - startX, 2) + Math.pow(curY - startY, 2));
    if (!isDragging.value && distance > 5) {
      isDragging.value = true;
    }

    if (isDragging.value) {
      // 拖拽中阻止捲動
      if (moveEvent.cancelable) moveEvent.preventDefault();

      let newX = curX - parentRect.left - offsetX;
      let newY = curY - parentRect.top - offsetY;

      // 邊界限制
      const maxX = parent.clientWidth - fabRef.value!.clientWidth;
      const maxY = parent.clientHeight - fabRef.value!.clientHeight;

      position.value.x = Math.max(0, Math.min(newX, maxX));
      position.value.y = Math.max(0, Math.min(newY, maxY));
    }
  };

  const onMouseUp = () => {
    const duration = Date.now() - startTime;

    // 🚩 核心：手動判定點擊
    // 如果位移極小 (!isDragging) 且 按壓時間短，視為點擊
    if (!isDragging.value && duration < 250) {
      isShowStats.value = true;
    } else if (isDragging.value) {
      // 執行貼邊動畫
      isSnapping.value = true;
      const parentWidth = parent.clientWidth;
      const fabWidth = fabRef.value?.clientWidth || 0;
      // 貼靠最近的左右邊緣
      position.value.x = (position.value.x + fabWidth / 2 < parentWidth / 2) ? 5 : (parentWidth - fabWidth - 5);
    }

    removeEvents(onMouseMove, onMouseUp);
  };

  // 綁定全域監聽
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("touchmove", onMouseMove, {passive: false});
  window.addEventListener("touchend", onMouseUp);
};

// 移除監聽函數
const removeEvents = (moveFn: any, upFn: any) => {
  window.removeEventListener("mousemove", moveFn);
  window.removeEventListener("mouseup", upFn);
  window.removeEventListener("touchmove", moveFn);
  window.removeEventListener("touchend", upFn);
};

/**
 * 裝備背景顏色計算 (統一調淡)
 */
const getBackgroundColor = (slotKey: string) => {
  const equips = playerStore.info?.equips;
  if (!equips || !equips[slotKey as keyof typeof equips]) {
    return "rgba(255, 255, 255, 0.05)";
  }
  const quality = equips[slotKey as keyof typeof equips]?.quality;
  const qColor = getEnumColumn(QualityEnum, quality, 'color', '#ffffff');
  // 混入 80% 白色達成淡化效果
  return `color-mix(in srgb, ${qColor}, white 80%)`;
};

// 元件卸載前清理
onBeforeUnmount(() => {
  // 確保沒有殘留的監聽
});
</script>

<template>
  <div
      ref="fabRef"
      class="floating-bag"
      :class="{ 'is-snapping': isSnapping }"
      :style="{
      left: `${position.x}px`,
      top: `${position.y}px`
    }"
      @mousedown.stop="onDragStart"
      @touchstart.stop="onDragStart"
  >
    <div class="icon-inner">{{ playerStore.info.icon }}</div>

    <el-dialog
        v-model="isShowStats"
        title="角色狀態"
        class="user-detail"
        append-to-body
    >
      <div class="stats-container">
        <div class="stats-grid">
          <div class="stat-item">❤️ 生命: {{ playerStats.hp }} / {{ playerStats.hpLimit }}</div>
          <div class="stat-item">✨ 法力: {{ playerStats.sp }} / {{ playerStats.spLimit }}</div>
          <div class="stat-item">⚔️ 攻擊: {{ playerStats.ad }}</div>
          <div class="stat-item">🛡️ 防禦: {{ playerStats.adDefend }}</div>
          <div class="stat-item">💥 爆擊: {{ playerStats.critRate }}%</div>
          <div class="stat-item">💢 爆傷: {{ playerStats.critIncrease }}%</div>
          <div class="stat-item">🎯 命中: {{ playerStats.hit }}</div>
          <div class="stat-item">💨 閃避: {{ playerStats.dodge }}</div>
        </div>

        <el-divider>當前裝備</el-divider>

        <div class="equipment-slots">
          <div
              v-for="pos in EquipmentEnum"
              :key="pos.value"
              class="equip-slot"
              :style="{ backgroundColor: getBackgroundColor(pos.value) }"
          >
            <el-tooltip
                v-if="playerStore.info.equips?.[pos.value as keyof typeof playerStore.info.equips]"
                effect="light"
            >
              <template #content>
                <ItemInfo :item="playerStore.info.equips[pos.value as keyof typeof playerStore.info.equips]"/>
              </template>
              <span class="equip-item-icon">
                {{ playerStore.info.equips[pos.value as keyof typeof playerStore.info.equips]?.icon }}
              </span>
            </el-tooltip>
            <span v-else class="equip-placeholder-icon">{{ pos.icon }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.floating-bag {
  position: absolute;
  width: 54px;
  height: 54px;
  background: #2c3e50;
  border: 2px solid #e6a23c;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
  z-index: 2000;
  user-select: none;
  /* 重要：禁用預設觸控行為，解決 Intervention 報錯 */
  touch-action: none;
  transition: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

/* 🚩 只有在貼邊狀態時才啟用平滑動畫 */
.floating-bag.is-snapping {
  transition: left 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.floating-bag:active {
  cursor: grabbing;
}

.icon-inner {
  font-size: 1.8rem;
}

/* 彈窗樣式 */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-item {
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  font-size: 0.95rem;
  border-left: 3px solid #e6a23c;
}

.equipment-slots {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  justify-items: center;
  margin-top: 10px;
}

.equip-slot {
  width: 65px;
  height: 65px;
  background: #1a1a1a;
  border: 2px solid #444;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: transform 0.2s;
}

.equip-item-icon {
  font-size: 1.8rem;
}

.equip-placeholder-icon {
  font-size: 1.6rem;
  opacity: 0.2;
}


</style>
<style>
/* 針對移動端 dialog 寬度優化 */
.user-detail {
  --el-dialog-width: 32rem;
}

@media (max-width: 768px) {
  .user-detail {
    --el-dialog-width: 95%;
  }
}
</style>