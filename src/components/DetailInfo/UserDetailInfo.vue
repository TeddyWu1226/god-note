<script setup lang="ts">
import {ref, computed} from "vue";
import {getEnumColumn} from "@/utils/enum";
import {QualityEnum} from "@/enums/quilty-enum";
import {EquipmentEnum} from "@/enums/enums";
import {usePlayerStore} from "@/store/player-store";
import {ItemInfo} from "@/components/Shared/itemInfo";

const fabRef = ref<HTMLElement | null>(null);
const position = ref({x: 0, y: 100});
const isDragging = ref(false);
const isShowStats = ref(false);

const onDragStart = (e: MouseEvent | TouchEvent) => {
  if (!fabRef.value) return;

  // 取得父層組件的資訊
  const parent = fabRef.value.offsetParent as HTMLElement;
  if (!parent) return;

  isDragging.value = false;
  const parentRect = parent.getBoundingClientRect();
  const fabRect = fabRef.value.getBoundingClientRect();

  const startX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  const startY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

  // 點擊位置相對於 Icon 內部的偏移
  const offsetX = startX - fabRect.left;
  const offsetY = startY - fabRect.top;

  const onMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
    isDragging.value = true;
    const currentX = moveEvent instanceof MouseEvent ? moveEvent.clientX : moveEvent.touches[0].clientX;
    const currentY = moveEvent instanceof MouseEvent ? moveEvent.clientY : moveEvent.touches[0].clientY;

    // 計算相對於父層內部的座標
    let newX = currentX - parentRect.left - offsetX;
    let newY = currentY - parentRect.top - offsetY;

    // 🚩 限制在父層範圍內
    const maxX = parent.clientWidth - fabRef.value!.clientWidth;
    const maxY = parent.clientHeight - fabRef.value!.clientHeight;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    position.value.x = newX;
    position.value.y = newY;
  };

  const onMouseUp = () => {
    // 🚩 自動貼邊邏輯
    const parentWidth = parent.clientWidth;
    const fabWidth = fabRef.value?.clientWidth || 0;

    if (position.value.x + fabWidth / 2 < parentWidth / 2) {
      position.value.x = 5; // 貼左邊
    } else {
      position.value.x = parentWidth - fabWidth - 5; // 貼右邊
    }

    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("touchmove", onMouseMove);
    window.removeEventListener("touchend", onMouseUp);
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("touchmove", onMouseMove, {passive: false});
  window.addEventListener("touchend", onMouseUp);
};

// 處理點擊 (防止拖曳結束觸發點擊)
const handleClick = () => {
  if (!isDragging.value) {
    isShowStats.value = true;
  }
};


// 欄位資訊

const playerStore = usePlayerStore()
const playerStats = computed(() => playerStore.finalStats);


// 淡色底
const getBackgroundColor = (value: string) => {
  if (!playerStore.info?.equips) {
    return `color-mix(in srgb, #fffff, white 1%)`
  }
  return `color-mix(in srgb, ${getEnumColumn(QualityEnum, playerStore.info?.equips[value]?.quality, 'color')}, white 1%)`
}
</script>

<template>
  <div
      ref="fabRef"
      class="floating-bag"
      :style="{
      left: `${position.x}px`,
      top: `${position.y}px`
    }"
      @mousedown.prevent="onDragStart"
      @touchstart.prevent="onDragStart"
      @click="handleClick"
  >
    <div class="icon-inner">{{ playerStore.info.icon }}</div>

    <el-dialog v-model="isShowStats" title="角色狀態" width="350px" append-to-body>
      <div class="stats-container">
        <div class="stats-grid">
          <div class="stat-item">❤️ 生命: {{ playerStats.hp }} / {{ playerStats.hpLimit }}</div>
          <div class="stat-item">✨ 法力: {{ playerStats.sp }} / {{ playerStats.spLimit }}</div>
          <div class="stat-item">⚔️ 攻擊: {{ playerStats.ad }}</div>
          <div class="stat-item">🛡️ 防禦: {{ playerStats.adDefend }}</div>
          <div class="stat-item">💥 爆擊率: {{ playerStats.critRate }}%</div>
          <div class="stat-item">💢 爆擊傷害: {{ playerStats.critIncrease }}%</div>
          <div class="stat-item">🎯 命中值: {{ playerStats.hit }}</div>
          <div class="stat-item">💨 閃避值: {{ playerStats.dodge }}</div>
        </div>
        <el-divider>當前裝備</el-divider>
        <div class="equipment-slots">
          <div
              v-for="pos in EquipmentEnum"
              :key="pos.value"
              class="equip-slot"
              :style="{backgroundColor: getBackgroundColor(pos.value)}"
          >
            <el-tooltip v-if="playerStore.info.equips?.[pos.value]" effect="light">
              <template #content>
                <ItemInfo :item="playerStore.info.equips?.[pos.value]"></ItemInfo>
              </template>
              <span style="font-size: 1.5rem;">
                {{ playerStore.info.equips?.[pos.value]?.icon }}
              </span>
            </el-tooltip>
            <span v-else class="equip-icon">{{ pos.icon }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.floating-bag {
  position: absolute; /* 核心：相對於最近的 relative 父層 */
  width: 50px;
  height: 50px;
  background: #2c3e50;
  border: 2px solid #e6a23c;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
  z-index: 1000;
  user-select: none;
  /* 增加過渡動畫，僅限於貼邊時生效 */
  transition: left 0.3s cubic-bezier(0.25, 1, 0.5, 1), top 0.1s linear;
}

.floating-bag:active {
  cursor: grabbing;
  transition: none; /* 拖曳時必須關閉 transition */
}

.icon-inner {
  font-size: 1.5rem;
}

/* 彈窗內樣式 */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.stat-item {
  padding: 8px;
  border-radius: 4px;
  font-weight: bold;
}

.equipment-slots {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  justify-items: center;
}

.equip-slot {
  width: 60px;
  height: 60px;
  background: var(--el-card-bg-color);
  border: 2px solid #ccc;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.equip-icon {
  font-size: 1.5rem;
  opacity: 0.3;

}


</style>