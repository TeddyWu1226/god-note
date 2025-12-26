<script setup lang="ts">
import {ref, computed} from 'vue'
import {usePlayerStore} from '@/store/player-store'
import {QualityEnum} from "@/enums/quality-enum"
import {getEnumColumn} from "@/utils/enum"
import {EquipmentEnum} from "@/enums/enums";
import {ItemInfo} from "@/components/Shared/itemInfo";
import {EquipmentType, PotionType, qualityType, statLabels} from "@/types";
import {ElMessage} from "element-plus";

const playerStore = usePlayerStore()
const activeName = ref('item')

const getItemDescriptionLine = (data: Partial<qualityType & PotionType>): string => {
  const descriptions: string[] = [];

  // 定義哪些欄位需要顯示百分比
  const percentStats = ['critRate', 'critIncrease', 'adIncrease', 'defendIncrease', 'apIncrease', 'lifeSteal'];

  // 遍歷我們定義好的標籤字典
  for (const [key, label] of Object.entries(statLabels)) {
    const value = data[key as keyof (qualityType & PotionType)];

    // 只有當數值存在且不為 0 時才顯示
    if (value !== undefined && value !== 0) {
      const prefix = (value as number) > 0 ? '+' : ''; // 正數顯示 +
      const suffix = percentStats.includes(key) ? '%' : ''; // 判斷是否加 %

      descriptions.push(`${label} ${prefix}${value}${suffix}`);
    }
  }

  return descriptions.join(', ');
};
// --- 分類邏輯 ---

// 1. 道具：具有 usable 屬性
// 聚合後的列表
const aggregatedConsumables = computed(() => {
  const map = new Map<string, { item: PotionType; count: number }>();
  playerStore.info.consumeItems.forEach((item) => {
    const key = item.name;
    if (map.has(key)) {
      map.get(key)!.count++;
    } else {
      map.set(key, {item: {...item}, count: 1});
    }
  });

  // 將 Array 轉出後進行排序
  return Array.from(map.values()).sort((a, b) => {
    // 1. 優先按品質排序 (高等級在前)
    if ((b.item.quality || 0) !== (a.item.quality || 0)) {
      return (b.item.quality || 0) - (a.item.quality || 0);
    }
    // 2. 品質相同時，按名稱字母排序
    return a.item.name.localeCompare(b.item.name);
  });
});

// 1. 其他素材
// 聚合後的列表
const aggregatedOthers = computed(() => {
  const map = new Map<string, { item: PotionType; count: number }>();
  playerStore.info.items.forEach((item) => {
    const key = item.name;
    if (map.has(key)) {
      map.get(key)!.count++;
    } else {
      map.set(key, {item: {...item}, count: 1});
    }
  });

  // 將 Array 轉出後進行排序
  return Array.from(map.values()).sort((a, b) => {
    // 1. 優先按品質排序 (高等級在前)
    if ((b.item.quality || 0) !== (a.item.quality || 0)) {
      return (b.item.quality || 0) - (a.item.quality || 0);
    }
    // 2. 品質相同時，按名稱字母排序
    return a.item.name.localeCompare(b.item.name);
  });
});


/**
 * 點擊物品的處理 (例如：使用藥水或穿上裝備)
 */
const handleUseConsume = (potion: any) => {
  if (!potion.usable) return;

  // 1. 執行效果（例如增加玩家 HP/MP）
  if (potion.heal) {
    playerStore.info.hp = Math.min(playerStore.finalStats.hpLimit, playerStore.info.hp + potion.heal);
  }
  if (potion.magic) {
    playerStore.info.sp = Math.min(playerStore.finalStats.spLimit, playerStore.info.sp + potion.magic);
  }

  // 2. 從原始背包中移除「一個」該道具
  const index = playerStore.info.consumeItems.findIndex(i => i.name === potion.name);
  if (index > -1) {
    playerStore.info.consumeItems.splice(index, 1);
  }
}
const handleEquipmentClick = (item: any, index: number) => {
  playerStore.equipItem(item, index)
  ElMessage.success(`裝備了 ${item.name}!`)
}


</script>

<template>
  <el-card class="inventory-card">
    <el-tabs v-model="activeName" stretch>
      <el-tab-pane label="道具" name="item">
        <el-scrollbar height="7rem">
          <div v-if="playerStore.info.consumeItems?.length > 0" class="potion-grid">
            <div
                v-for="entry in aggregatedConsumables"
                :key="entry.item.name"
                class="item-slot"
                @dblclick="handleUseConsume(entry.item)"
            >
              <el-tooltip
                  placement="top"
                  :fallback-placements="['bottom']"
                  effect="light"
              >
                <template #content>
                  <div class="tooltip-content">
                    <b :class="`text-quality-${entry.item.quality}`">{{ entry.item.name }}(雙擊消耗使用)</b>
                    <p class="desc">{{ entry.item.description }}</p>
                    <hr v-if="entry.item.heal || entry.item.magic" class="divider"/>
                    <span v-if="entry.item.heal" class="effect-text">❤️ 回復生命: {{ entry.item.heal }}</span>
                    <span v-if="entry.item.magic" class="effect-text">💧 回復魔力: {{ entry.item.magic }}</span>
                  </div>
                </template>

                <div class="icon-wrapper" :class="`quality-${entry.item.quality}`">
                  <span class="icon">{{ entry.item.icon }}</span>
                  <span v-if="entry.item.heal" class="heal-effect">+{{ entry.item.heal }}</span>
                  <span v-if="entry.item.magic" class="magic-effect">+{{ entry.item.magic }}</span>
                  <div class="item-count">{{ entry.count }}</div>
                </div>
              </el-tooltip>
              <div class="item-name">{{ entry.item.name }}</div>
            </div>
          </div>
          <span v-else class="empty">無任何道具</span>
        </el-scrollbar>
      </el-tab-pane>

      <el-tab-pane label="裝備" name="equipment">
        <el-scrollbar height="7rem">
          <div v-if="playerStore.info.equipments?.length > 0" class="item-grid">
            <el-tooltip
                v-for="(item, index) in playerStore.info.equipments"
                :key="index"
                effect="light"
            >
              <template #content>
                <ItemInfo :item="item"/>
              </template>
              <div
                  class="inventory-item"
                  :style="{
                  borderColor: getEnumColumn(QualityEnum, item.quality, 'color', '#444'),

                }"
                  @dblclick="handleEquipmentClick(item,index)"
              >
                <span class="item-icon">{{ item.icon }}</span>
                <div class="equip-info">
                  <div class="item-name"
                       :style="{color:getEnumColumn(QualityEnum, item.quality, 'color', '#444')}">
                    {{ item.name }}
                  </div>
                  <div class="pos-tag">
                    {{ getEnumColumn(EquipmentEnum, (item as EquipmentType).position) }}
                  </div>
                </div>
                <span>{{ getItemDescriptionLine(item) }}</span>
                <span class="equipment-hint">(雙擊可穿戴)</span>
              </div>
            </el-tooltip>

          </div>
          <span v-else class="empty">無任何裝備</span>
        </el-scrollbar>
      </el-tab-pane>

      <el-tab-pane label="其他" name="other">
        <el-scrollbar height="7rem">
          <div v-if="playerStore.info.items?.length > 0" class="potion-grid">
            <div
                v-for="entry in aggregatedOthers"
                :key="entry.item.name"
                class="item-slot"
            >
              <el-tooltip
                  placement="top"
                  :fallback-placements="['bottom']"
                  effect="light"
              >
                <template #content>
                  <div class="tooltip-content"
                       :style="{borderColor:getEnumColumn(QualityEnum,entry.item.quality,'color')}">
                    <b :class="`text-quality-${entry.item.quality}`"
                       :style="{color:getEnumColumn(QualityEnum,entry.item.quality,'color')}">
                      {{ entry.item.name }}
                    </b>
                    <p class="desc">{{ entry.item.description }}</p>
                  </div>
                </template>

                <div class="icon-wrapper" :class="`quality-${entry.item.quality}`">
                  <span class="icon">{{ entry.item.icon }}</span>
                  <span v-if="entry.item.heal" class="heal-effect">+{{ entry.item.heal }}</span>
                  <span v-if="entry.item.magic" class="magic-effect">+{{ entry.item.magic }}</span>
                  <div class="item-count">{{ entry.count }}</div>
                </div>
              </el-tooltip>
              <div class="item-name">{{ entry.item.name }}</div>
            </div>
          </div>
          <span v-else class="empty">無任何物品</span>
        </el-scrollbar>
      </el-tab-pane>

    </el-tabs>
  </el-card>
</template>

<style scoped>
.item-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
}

.inventory-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #444;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.inventory-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.item-icon {
  font-size: 1.5rem;
}

.item-name {
  font-size: 0.9rem;
  font-weight: bold;
}

.equip-info {
  display: flex;
  flex-direction: column;
}

.empty {
  text-align: center;
}

.pos-tag {
  font-size: 0.7rem;
  color: #888;
  text-transform: uppercase;
}

.equipment-hint {
  margin-left: auto;
}

:deep(.el-card__body) {
  padding: 0.5rem 1rem;
}

:deep(.el-tabs__item) {
  padding: 0;
}


.potion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
  padding: 0.5rem;
}

.item-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  user-select: none; /* 防止雙擊選中文字 */
  /* 平滑過渡效果 */
  transition: transform 0.2s ease-out;
}

/* Hover 效果：放大並變亮 */
.item-slot:hover {
  transform: scale(1.1);
  z-index: 10;
}

/* Hover 時邊框發光 */
.item-slot:hover .icon-wrapper {
  border-color: #fff;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  filter: brightness(1.2);
}

.icon-wrapper {
  position: relative; /* 關鍵：讓數量標籤相對於此定位 */
  width: 60px;
  height: 60px;
  background: #3c3f41;
  border: 2px solid #555;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
}

.heal-effect {
  position: absolute;
  color: #3ff149;
  top: 0;
  right: -2px;
  padding: 0 4px;
  font-size: 12px;
  font-family: 'Courier New', Courier, monospace;
  min-width: 18px;
  text-align: center;
}

.magic-effect {
  position: absolute;
  color: #268cef;
  top: 0;
  left: -2px;
  padding: 0 4px;
  font-size: 12px;
  font-family: 'Courier New', Courier, monospace;
  min-width: 18px;
  text-align: center;
}

.item-count {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background-color: rgba(0, 0, 0, 0.8);
  color: #00ff00; /* 綠色數量文字，更有遊戲感 */
  padding: 0 4px;
  border-radius: 4px;
  font-size: 12px;
  font-family: 'Courier New', Courier, monospace;
  border: 1px solid #444;
  min-width: 18px;
  text-align: center;
}

.item-name {
  margin-top: 4px;
  font-size: 12px;
  color: #eee;
  text-align: center;
}

</style>