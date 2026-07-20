<script setup lang="ts">
import { computed, PropType } from "vue";
import { getEnumColumn } from "@/utils/enum";
import { QualityEnum } from "@/enums/quality-enum";
import { EquipmentEnum } from "@/enums/enums";
import { StatEnum } from "@/enums/enums";
import { SkillFactory } from "@/constants/skill/learned-skill";
import { EquipmentType, ItemType, statLabels, UsableType } from "@/types";

const props = defineProps({
  item: {
    type: Object as PropType<any>,
    required: true,
  },
  context: {
    type: String as PropType<'tooltip' | 'dialog'>,
    default: 'tooltip',
  }
});

// 獲取品質屬性顏色
const qualityColor = computed(() => {
  if (!props.item) return '#fff';
  return getEnumColumn(QualityEnum, props.item.quality, 'color', '#fff');
});

// 判斷物品分類
const isEquipment = computed(() => {
  return !!(props.item && 'position' in props.item);
});

const isUsable = computed(() => {
  return !!(props.item && 'usable' in props.item && props.item.usable);
});

const isMisc = computed(() => {
  return !isEquipment.value && !isUsable.value;
});

// 裝備部位資訊
const positionInfo = computed(() => {
  if (!isEquipment.value || !props.item.position) return null;
  return Object.values(EquipmentEnum).find(e => e.value === props.item.position);
});

// 武技技能實例
const skill = computed(() => {
  if (!props.item) return undefined;
  return props.item['learned-skill'] || props.item.skill;
});

const skillInstance = computed(() => {
  if (!skill.value) return undefined;
  try {
    return SkillFactory.createSkill(skill.value);
  } catch (e) {
    return undefined;
  }
});

// 篩選有效的裝備屬性 (排出已單獨處理的 heal/magic 屬性)
const itemStats = computed(() => {
  if (!props.item) return [];
  return Object.entries(props.item)
    .filter(([key, val]) => statLabels[key as keyof typeof statLabels] && val && key !== 'heal' && key !== 'magic' && key !== 'price')
    .map(([key, val]) => ({
      key,
      label: statLabels[key as keyof typeof statLabels],
      value: val as number,
      unit: getEnumColumn(StatEnum, key, 'unit', '')
    }));
});
</script>

<template>
  <div :class="['item-info-card', `context-${context}`]" v-if="props.item">
    <!-- 1. 頭部區域 -->
    <div class="item-header">
      <!-- 物品圖標 (邊框使用 QualityEnum 顏色) -->
      <div 
        class="item-icon-box" 
        :style="{ borderColor: qualityColor }"
      >
        <span class="item-icon-emoji">{{ props.item.icon || '📦' }}</span>
      </div>

      <!-- 物品名稱與標籤 -->
      <div class="item-meta">
        <!-- 物品名稱 (顏色使用 QualityEnum 顏色) -->
        <h3 class="item-title" :style="{ color: qualityColor }">
          {{ props.item.name }}
          <span v-if="props.item.enhanceLevel" class="enhance-tag">+{{ props.item.enhanceLevel }}</span>
        </h3>
        
        <div class="item-badges">
          <!-- 分類標籤 -->
          <span v-if="isEquipment" class="badge type-badge equipment">
            {{ positionInfo ? positionInfo.icon : '⚔️' }} {{ positionInfo ? positionInfo.label : '裝備' }}
          </span>
          <span v-else-if="isUsable" class="badge type-badge usable">
            🧪 消耗品
          </span>
          <span v-else class="badge type-badge misc">
            📦 素材 / 雜物
          </span>

          <!-- 雙手武器標籤 -->
          <span v-if="isEquipment && props.item.isTwoHanded" class="badge type-badge two-handed">
            👐 雙手武器
          </span>
        </div>
      </div>
    </div>

    <div class="divider-line"></div>

    <!-- 2. 內容主體區 -->
    <div class="item-body">
      <!-- 描述文字 (裝備不顯示 description) -->
      <p v-if="props.item.description && !isEquipment" class="item-desc">
        {{ props.item.description }}
      </p>

      <!-- 情況 1: 裝備屬性與武技 -->
      <template v-if="isEquipment">

        <!-- 屬性列表 -->
        <div v-if="itemStats.length > 0" class="equipment-stats-section">
          <div class="section-title">🛡️ 屬性加成</div>
          <div class="stats-grid">
            <div 
              v-for="stat in itemStats" 
              :key="stat.key" 
              class="stat-pill"
            >
              <span class="stat-label">{{ stat.label }}</span>
              <span class="stat-value" :class="{ 'plus': stat.value > 0, 'minus': stat.value < 0 }">
                {{ stat.value > 0 ? '+' : '' }}{{ stat.value }}{{ stat.unit }}
              </span>
            </div>
          </div>
        </div>

        <!-- 專屬武技 -->
        <div v-if="skillInstance && skillInstance.itemDescription" class="martial-art-section">
          <div class="section-title">🔥 專屬武技</div>
          <div class="skill-card">
            <div class="skill-header">
              <span class="skill-icon">⚡</span>
              <span class="skill-name">{{ skillInstance.name }}</span>
            </div>
            <p class="skill-desc">{{ skillInstance.itemDescription }}</p>
          </div>
        </div>
      </template>

      <!-- 情況 2: 可使用物品 (消耗品效果) -->
      <template v-else-if="isUsable">
        <div v-if="props.item.heal || props.item.magic" class="usable-effects-section">
          <div class="section-title">✨ 使用效果</div>
          <div class="effects-list">
            <div v-if="props.item.heal" class="effect-row heal">
              <span class="effect-icon">❤️</span>
              <span class="effect-label">回復生命</span>
              <span class="effect-value">+{{ props.item.heal }}</span>
            </div>
            <div v-if="props.item.magic" class="effect-row magic">
              <span class="effect-icon">✨</span>
              <span class="effect-label">回復法力</span>
              <span class="effect-value">+{{ props.item.magic }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- 情況 3: 純物品 / 雜物 / 素材 -->
      <template v-else>
        <!-- 可以顯示素材類型或簡要提示 -->
        <div class="misc-info-section">
          <div class="info-tag">
            📌 此物品可用於特定事件、委託或做為合成素材。
          </div>
        </div>
      </template>

      <!-- 價格顯示 (如果有配置 price 且大於 0 且非為 dialog 的二次確認覆蓋) -->
      <div v-if="props.item.price && context === 'tooltip' && !props.item.unsellable" class="price-section">
        <span class="price-icon">🪙</span>
        <span class="price-label">基礎價值：</span>
        <span class="price-value">{{ props.item.price }} 金幣</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.item-info-card {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  color: #e0e0e0;
  text-align: left;
  font-family: inherit;

  /* 針對 Tooltip 的緊湊佈局 */
  &.context-tooltip {
    width: 14rem;
    max-width: 14rem;
    max-height: 320px;
    overflow-y: auto;
    padding: 4px;
    
    .item-header {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .item-meta {
      align-items: center;
      margin-left: 0;
      margin-top: 8px;
    }

    .item-desc {
      text-align: center;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .skill-card {
      padding: 6px 8px;
    }
  }

  /* 針對 Dialog 的寬鬆佈局 */
  &.context-dialog {
    width: 100%;
    padding: 8px 12px;
    background: transparent;
    
    .item-header {
      flex-direction: row;
      align-items: flex-start;
      gap: 16px;
    }

    .item-icon-box {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      
      .item-icon-emoji {
        font-size: 2.4rem;
      }
    }
    
    .item-meta {
      align-items: flex-start;
      text-align: left;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
  }
}

/* 輕量微型捲動條 */
.item-info-card::-webkit-scrollbar {
  width: 4px;
}

.item-info-card::-webkit-scrollbar-track {
  background: transparent;
}

.item-info-card::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
}

.item-info-card::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.item-header {
  display: flex;
  width: 100%;
}

.item-icon-box {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1.5px solid;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.03);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  
  .item-icon-emoji {
    font-size: 1.8rem;
    line-height: 1;
  }
}

.item-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.item-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  
  .enhance-tag {
    color: #67c23a;
    font-weight: bold;
    font-size: 0.9rem;
  }
}

.item-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.badge {
  font-size: 0.65rem;
  font-weight: bold;
  padding: 1px 5px;
  border-radius: 4px;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.type-badge {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #d1d5db;

  &.equipment {
    background: rgba(230, 162, 60, 0.1);
    border-color: rgba(230, 162, 60, 0.25);
    color: #e6a23c;
  }
  &.usable {
    background: rgba(64, 158, 255, 0.10);
    border-color: rgba(64, 158, 255, 0.25);
    color: #409eff;
  }
  &.misc {
    background: rgba(156, 39, 176, 0.1);
    border-color: rgba(156, 39, 176, 0.25);
    color: #d1a3ff;
  }
  &.two-handed {
    background: rgba(255, 159, 67, 0.1);
    border-color: rgba(255, 159, 67, 0.25);
    color: #ff9f43;
  }
}

.divider-line {
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
  margin: 8px 0;
  width: 100%;
}

.item-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.item-desc {
  margin: 0;
  font-size: 0.78rem;
  color: #9ca3af;
  line-height: 1.4;
  white-space: normal;
  word-break: break-word;
}

.section-title {
  font-size: 0.7rem;
  font-weight: bold;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}



.stats-grid {
  display: grid;
  gap: 4px;
  width: 100%;
}

.stat-pill {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  
  .stat-label {
    color: #9ca3af;
  }

  .stat-value {
    font-weight: bold;
    font-family: monospace;

    &.plus {
      color: #67c23a;
    }
    
    &.minus {
      color: #f56c6c;
    }
  }
}

.martial-art-section {
  width: 100%;
}

.skill-card {
  background: rgba(255, 159, 67, 0.03);
  border: 1px solid rgba(255, 159, 67, 0.15);
  border-radius: 6px;
  padding: 6px 8px;
  width: 100%;
  box-sizing: border-box;
  
  .skill-header {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 2px;
    
    .skill-name {
      font-size: 0.78rem;
      font-weight: bold;
      color: #ff9f43;
    }
    
    .skill-icon {
      font-size: 0.75rem;
    }
  }

  .skill-desc {
    margin: 0;
    font-size: 0.72rem;
    color: #d1d5db;
    line-height: 1.35;
  }
}

.effects-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.effect-row {
  display: flex;
  align-items: center;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  
  .effect-icon {
    margin-right: 4px;
  }
  
  .effect-label {
    flex: 1;
    color: #9ca3af;
  }
  
  .effect-value {
    font-weight: bold;
  }

  &.heal {
    background: rgba(103, 194, 58, 0.05);
    border: 1px solid rgba(103, 194, 58, 0.12);
    
    .effect-value {
      color: #67c23a;
    }
  }
  
  &.magic {
    background: rgba(64, 158, 255, 0.05);
    border: 1px solid rgba(64, 158, 255, 0.12);
    
    .effect-value {
      color: #409eff;
    }
  }
}

.misc-info-section {
  width: 100%;
  .info-tag {
    font-size: 0.72rem;
    color: #9ca3af;
    background: rgba(255, 255, 255, 0.01);
    border: 1px dashed rgba(255, 255, 255, 0.08);
    border-radius: 4px;
    padding: 5px 8px;
    line-height: 1.35;
  }
}

.price-section {
  display: flex;
  align-items: center;
  background: rgba(230, 162, 60, 0.04);
  border: 1px dashed rgba(230, 162, 60, 0.15);
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 0.72rem;
  margin-top: 2px;
  
  .price-icon {
    margin-right: 4px;
  }
  
  .price-label {
    color: #9ca3af;
  }
  
  .price-value {
    font-weight: bold;
    color: #e6a23c;
  }
}
</style>