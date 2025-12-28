<script setup lang="ts">
import {ref} from "vue";
import {getEnumColumn} from "@/utils/enum";
import {QualityEnum} from "@/enums/quality-enum";
import {EquipmentEnum, StatEnum} from "@/enums/enums";
import {usePlayerStore} from "@/store/player-store";
import {ItemInfo} from "@/components/Shared/itemInfo";
import {ElMessage} from "element-plus";
import {useDraggable} from "@/components/DetailInfo/useDraggble";
import type {Equipment} from "@/types";
import {CharEnum} from "@/enums/char-enum";

const playerStore = usePlayerStore();

/**
 * 拖曳圖示功能
 */
const fabRef = ref<HTMLElement | null>(null);
const isShowStats = ref(false);
const {position, isDragging, isSnapping, handleStart} = useDraggable(fabRef, {
  onSelect: () => isShowStats.value = true
});
// 移動端雙擊判定優化
let lastTap = 0;
const handleTouchUnequip = (slotKey: keyof Equipment) => {
  const now = Date.now();
  if (now - lastTap < 300) handleUnequip(slotKey);
  lastTap = now;
};

/**
 * 裝備背景顏色計算 (統一調淡)
 */
const getBackgroundColor = (slotKey: string) => {
  const equips = playerStore.info?.equips;
  if (!equips || !equips[slotKey as keyof typeof equips]) {
    return "rgba(255, 255, 255, 0.01)";
  }
  const quality = equips[slotKey as keyof typeof equips]?.quality;
  return getEnumColumn(QualityEnum, quality, 'color', '#ffffff')
};

/**
 * 脫下裝備邏輯
 */
const handleUnequip = (slotKey: keyof Equipment) => {
  playerStore.equipItem(null, null, slotKey)
  ElMessage.success('脫下裝備')
};


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
      @mousedown.stop="handleStart"
      @touchstart.stop="handleStart"
  >
    <div class="icon-inner">{{ playerStore.info.icon }}</div>

    <el-dialog
        v-model="isShowStats"
        :title="`角色狀態 (${getEnumColumn(CharEnum,playerStore.info.char)})`"
        class="user-detail"
        append-to-body
    >
      <div class="stats-container">
        <div class="stats-grid">
          <div v-for="stat in StatEnum" :key="stat.value" class="stat-item">
            {{ stat.icon }} {{ stat.label }}:
            {{ playerStore.finalStats[stat.value] }}
            <template v-if="(stat as any)?.maxKey">
              / {{ playerStore.finalStats[(stat as any)?.maxKey] }}
            </template>
            {{ stat.unit }}
          </div>
        </div>

        <el-divider>當前裝備</el-divider>

        <div class="equipment-slots">
          <div
              v-for="pos in EquipmentEnum"
              class="equip-slot"
              :style="{ borderColor: getBackgroundColor(pos.value) }"
              @dblclick="handleUnequip(pos.value)"
              @touchend="handleTouchUnequip(pos.value)"
          >
            <el-tooltip
                v-if="playerStore.info.equips?.[pos.value as keyof typeof playerStore.info.equips]"
                effect="light"
                :disabled="isDragging"
            >
              <template #content>
                <ItemInfo :item="playerStore.info.equips[pos.value as keyof typeof playerStore.info.equips]"/>
                <div style="font-size: 0.8rem; color: #999; text-align: center; margin-top: 5px;">
                  ( 雙擊卸下裝備 )
                </div>
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
  cursor: pointer;
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