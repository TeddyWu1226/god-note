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
import {createDoubleTapHandler} from "@/utils/touch";

const playerStore = usePlayerStore();

/**
 * 拖曳圖示功能
 */
const fabRef = ref<HTMLElement | null>(null);
const isShowStats = ref(false);
const {position, isDragging, isSnapping, handleStart} = useDraggable(fabRef, {
  onSelect: () => isShowStats.value = true
});


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
const onTouchUnequip = createDoubleTapHandler((slotKey: keyof Equipment) => {
  handleUnequip(slotKey);
}, 350)

const isUpgradeable = (statValue: string) => {
  return ['hp', 'sp', 'ad', 'ap'].includes(statValue);
};

const allocatePoint = (statValue: string) => {
  let targetKey = statValue;
  if (statValue === 'hp') targetKey = 'hpLimit';
  if (statValue === 'sp') targetKey = 'spLimit';
  playerStore.allocateStatPoint(targetKey as any);
};

</script>

<template>
  <div
      ref="fabRef"
      class="floating-bag"
      :class="{ 
        'is-snapping': isSnapping,
        'has-points': playerStore.info.statPoints && playerStore.info.statPoints > 0
      }"
      :style="{
      left: `${position.x}px`,
      top: `${position.y}px`
    }"
      @mousedown.stop="handleStart"
      @touchstart.stop="handleStart"
  >
    <el-progress type="circle" :percentage="playerStore.currentExpPercentage">
      <template #default>
        <span style="font-size: 0.6rem;font-weight: bold">Lv.</span>
        <span style="font-size: 1rem;font-weight: bold">{{ playerStore.info.level}}</span>
      </template>
    </el-progress>
    <!-- 升級提示標章 -->
    <div
        v-if="playerStore.info.statPoints && playerStore.info.statPoints > 0"
        class="upgrade-badge"
    >
      !
    </div>
  </div>
  <el-dialog
      v-model="isShowStats"
      :title="`角色狀態 (${getEnumColumn(CharEnum,playerStore.info.char)})`"
      class="user-detail"
      append-to-body
  >
    <div class="stats-container">
      <div v-if="playerStore.info.statPoints && playerStore.info.statPoints > 0" class="stat-points-banner">
        <span>你有 <strong>{{ playerStore.info.statPoints }}</strong> 點未分配的屬性點</span>
      </div>
      <div class="stats-grid">
        <div v-for="stat in StatEnum" :key="stat.value" class="stat-item">
          <div class="stat-info">
            {{ stat.icon }} {{ stat.label }}:
            <template v-if="(stat as any)?.maxKey">
              {{ playerStore.finalStats[stat.value] }} / {{ playerStore.info[(stat as any).maxKey] }}
              <span 
                  v-if="playerStore.totalBonus[(stat as any).maxKey]" 
                  class="stat-bonus" 
                  :class="{ 'is-positive': playerStore.totalBonus[(stat as any).maxKey] > 0, 'is-negative': playerStore.totalBonus[(stat as any).maxKey] < 0 }"
              >
                ({{ playerStore.totalBonus[(stat as any).maxKey] > 0 ? '+' : '' }}{{ playerStore.totalBonus[(stat as any).maxKey] }})
              </span>
            </template>
            <template v-else>
              {{ playerStore.info[stat.value] || 0 }}{{ stat.unit }}
              <span 
                  v-if="playerStore.totalBonus[stat.value]" 
                  class="stat-bonus" 
                  :class="{ 'is-positive': playerStore.totalBonus[stat.value] > 0, 'is-negative': playerStore.totalBonus[stat.value] < 0 }"
              >
                ({{ playerStore.totalBonus[stat.value] > 0 ? '+' : '' }}{{ playerStore.totalBonus[stat.value] }}{{ stat.unit }})
              </span>
            </template>
          </div>
          <el-button
              v-if="playerStore.info.statPoints && playerStore.info.statPoints > 0 && isUpgradeable(stat.value)"
              size="small"
              type="warning"
              circle
              class="upgrade-btn"
              @click="allocatePoint(stat.value)"
          >
            +
          </el-button>
        </div>
      </div>

      <el-divider>當前裝備</el-divider>

      <div class="equipment-slots">
        <div
            v-for="pos in EquipmentEnum"
            class="equip-slot"
            :style="{ borderColor: getBackgroundColor(pos.value) }"
            @dblclick="handleUnequip(pos.value)"
            @touchend="onTouchUnequip(pos.value)"
        >
          <el-tooltip
              v-if="playerStore.info.equips?.[pos.value as keyof typeof playerStore.info.equips]"
              effect="light"
              :disabled="isDragging"
          >
            <template #content>
              <ItemInfo :item="playerStore.info.equips[pos.value as keyof typeof playerStore.info.equips]"/>
              <div style="font-size: 0.8rem; color: #999; text-align: center; margin-top: 5px;min-width: 10rem">
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
</template>

<style scoped>
.floating-bag {
  position: absolute;
  width: 54px;
  height: 54px;
  background: #2c3e50;
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

/* 升級發光與驚嘆號小紅點樣式 */
.floating-bag.has-points {
  animation: bag-glow 2s infinite ease-in-out;
}

@keyframes bag-glow {
  0%, 100% {
    box-shadow: 0 0 8px rgba(230, 162, 60, 0.4), 0 4px 10px rgba(0, 0, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(230, 162, 60, 0.8), 0 4px 10px rgba(0, 0, 0, 0.3);
  }
}

.floating-bag .upgrade-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  background: #f56c6c;
  color: white;
  border-radius: 50%;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 8px rgba(245, 108, 108, 0.8);
  animation: badge-pulse 1.5s infinite ease-in-out;
}

@keyframes badge-pulse {
  0% {
    transform: scale(0.9);
    box-shadow: 0 0 0 0 rgba(245, 108, 108, 0.7);
  }
  70% {
    transform: scale(1.1);
    box-shadow: 0 0 0 6px rgba(245, 108, 108, 0);
  }
  100% {
    transform: scale(0.9);
    box-shadow: 0 0 0 0 rgba(245, 108, 108, 0);
  }
}

:deep(.el-progress-circle) {
  height: 55px !important;
  width: 55px !important;
}

/* 只有在貼邊狀態時才啟用平滑動畫 */
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  font-size: 0.95rem;
  border-left: 3px solid #e6a23c;
}

.stat-info {
  flex-grow: 1;
}

.upgrade-btn {
  margin-left: 8px;
  font-weight: bold;
}

.stat-points-banner {
  background: rgba(230, 162, 60, 0.15);
  border: 1px dashed #e6a23c;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 0.95rem;
  color: #e6a23c;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 10px rgba(230, 162, 60, 0.2);
  }
  100% {
    opacity: 0.8;
  }
}

.equipment-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  padding: 5px 2px;
  margin-top: 10px;
  width: 100%;
  box-sizing: border-box;
}

.equip-slot {
  flex: 1 0 calc(16.66% - 12px);
  min-width: 48px;
  max-width: 65px;
  height: 58px;
  background: #1a1a1a;
  border: 2px solid #444;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: transform 0.2s;
}

.stat-bonus {
  font-size: 0.85rem;
  font-weight: bold;
  margin-left: 4px;
}
.stat-bonus.is-positive {
  color: #67c23a;
}
.stat-bonus.is-negative {
  color: #f56c6c;
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