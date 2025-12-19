<script setup lang="ts">
import {ref, computed} from 'vue'
import {usePlayerStore} from '@/store/player-store'
import {QualityEnum} from "@/enums/quilty-enum"
import {getEnumColumn} from "@/utils/enum"
import {EquipmentEnum} from "@/enums/enums";

const playerStore = usePlayerStore()
const activeName = ref('item')

// --- 分類邏輯 ---

// 1. 道具：具有 usable 屬性
const consumableItems = computed(() => {
  return playerStore.info.items?.filter(i => 'usable' in i && i.usable) || []
})

// 2. 裝備：具有 position 屬性
const equipmentItems = computed(() => {
  return playerStore.info.items?.filter(i => 'position' in i) || []
})

// 3. 其他：既不是道具也不是裝備的物品
const otherItems = computed(() => {
  return playerStore.info.items?.filter(i => !('usable' in i && i.usable) && !('position' in i)) || []
})

/**
 * 點擊物品的處理 (例如：使用藥水或穿上裝備)
 */
const handleItemClick = (item: any) => {
  console.log('點擊了物品:', item.name)
}
const handleEquipmentClick = (item: any, index: number) => {
  console.log('點擊了裝備:', item.name)
  playerStore.equipItem(item, index)
}
</script>

<template>
  <el-card class="inventory-card">
    <el-tabs v-model="activeName" stretch>
      <el-tab-pane label="道具" name="item">
        <el-scrollbar height="7rem">
          <div v-if="consumableItems.length > 0" class="item-grid">
            <div
                v-for="(item, index) in consumableItems"
                :key="index"
                class="inventory-item"
                @click="handleItemClick(item)"
            >
              <span class="item-icon">{{ item.icon }}</span>
              <span class="item-name">{{ item.name }}</span>
            </div>
          </div>
          <span v-else class="empty">無任何道具</span>
        </el-scrollbar>
      </el-tab-pane>

      <el-tab-pane label="裝備" name="equipment">
        <el-scrollbar height="7rem">
          <div v-if="equipmentItems.length > 0" class="item-grid">
            <div
                v-for="(item, index) in equipmentItems"
                :key="index"
                class="inventory-item"
                :style="{
                  borderColor: getEnumColumn(QualityEnum, item.quality, 'color', '#444'),
                  color:getEnumColumn(QualityEnum, item.quality, 'color', '#444')
                }"
                @click="handleEquipmentClick(item,index)"
            >
              <span class="item-icon">{{ item.icon }}</span>
              <div class="equip-info">
                <div class="item-name">{{ item.name }}</div>
                <div class="pos-tag">{{ getEnumColumn(EquipmentEnum, item.position) }}</div>
              </div>
            </div>
          </div>
          <span v-else class="empty">無任何裝備</span>
        </el-scrollbar>
      </el-tab-pane>

      <el-tab-pane label="其他" name="other">
        <el-scrollbar height="7rem">
          <div v-if="otherItems.length > 0" class="item-grid">
            <div v-for="(item, index) in otherItems" :key="index" class="inventory-item">
              <span class="item-icon">{{ item.icon }}</span>
              <span class="item-name">{{ item.name }}</span>
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

:deep(.el-card__body) {
  padding: 0.5rem 1rem;
}

:deep(.el-tabs__item) {
  padding: 0;
}
</style>