<script setup lang="ts">

import {getEnumColumn} from "@/utils/enum";
import {QualityEnum} from "@/enums/quilty-enum";
import {EquipmentType, ItemType, PotionType, statLabels} from "@/types";
import {PropType} from "vue";

const props = defineProps({
  item: {
    type: Object as PropType<ItemType | EquipmentType | PotionType>,
  }
})
</script>

<template>
  <div v-if="props.item" class="detail-container">
    <div class="detail-icon">{{ props.item.icon }}</div>
    <h3 :style="{ color: getEnumColumn(QualityEnum, props.item.quality, 'color', '#fff') }">
      {{ props.item.name }}
    </h3>

    <p class="detail-desc">{{ props.item.description }}</p>

    <el-divider content-position="left"></el-divider>

    <div class="detail-stats">
      <template v-for="(val, key) in props.item" :key="key">
        <div v-if="statLabels[key] && val" class="stat-row">
          <span class="stat-label">{{ statLabels[key] }}</span>
          <span class="stat-value" :class="{ 'plus': (val as number) > 0, 'minus': (val as number) < 0 }">
                {{ (val as number) > 0 ? '+' : '' }}{{ val }}
              </span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.detail-icon {
  font-size: 3rem;
}

.detail-desc {
  color: #888;
  font-size: 0.9rem;
}

.detail-stats {
  width: 100%;
  margin-bottom: 1.5rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.05);
  margin-bottom: 4px;
  border-radius: 4px;
  font-size: 1rem;
}

.stat-label {
  color: #aaa;
}

.stat-value.plus {
  color: #67c23a;
}

.stat-value.minus {
  color: #f56c6c;
}


.detail-price span {
  color: #e6a23c;
}


</style>