<script setup lang="ts">

import {getEnumColumn} from "@/utils/enum";
import {QualityEnum} from "@/enums/quality-enum";
import {EquipmentType, ItemType, statLabels, UsableType} from "@/types";
import {computed, PropType} from "vue";
import {StatEnum} from "@/enums/enums";
import {SkillFactory} from "@/constants/skill/learned-skill";


const props = defineProps({
  item: {
    type: Object as PropType<ItemType | EquipmentType | UsableType>,
  }
})

const skill = computed(() => {
  if (!props.item) return undefined;
  return (props.item as any)['learned-skill'] || (props.item as any).skill;
})

const skillInstance = computed(() => {
  if (!skill.value) return undefined;
  return SkillFactory.createSkill(skill.value);
})
</script>

<template>
  <div class="detail-container">
    <div class="detail-icon">{{ props.item.icon }}</div>
    <p class="item-name" :style="{ color: getEnumColumn(QualityEnum, props.item.quality, 'color', '#fff') }">
      {{ props.item.name }}{{
        props.item.enhanceLevel ? ' +' + props.item.enhanceLevel : ''
      }}{{ props.item.usable ? '(消耗品)' : '' }}
    </p>
    <template v-if="skillInstance && skillInstance.itemDescription">
      <el-divider content-position="left">
        武技
      </el-divider>
      <div
          style="font-size: 0.85rem; color: #ff9f43; line-height: 1.4; text-align: center; word-break: break-word; white-space: normal; width: 100%;">
        {{ skillInstance.itemDescription }}
      </div>
    </template>
    <el-divider v-if="props.item.usable || props.item['position']" content-position="left">
      {{ props.item.usable ? '可使用' : '裝備屬性' }}
    </el-divider>
    <p class="detail-desc" v-if="(props.item as EquipmentType)?.isTwoHanded">
      此為雙手武器, 無法裝備副手
    </p>

    <div class="detail-stats">
      <template v-for="(val, key) in props.item" :key="key">
        <div v-if="statLabels[key] && val" class="stat-row">
          <span class="stat-label">{{ statLabels[key] }}</span>
          <span class="stat-value" :class="{ 'plus': (val as number) > 0, 'minus': (val as number) < 0 }">
            {{ (val as number) > 0 ? '+' : '' }}{{ val }}
           {{ getEnumColumn(StatEnum, key, 'unit', '') }}
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
  min-width: 10rem;
  max-width: 14rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 12px 6px 12px 10px;
  word-break: break-word;
}

/* 輕量微型捲動條 */
.detail-container::-webkit-scrollbar {
  width: 4px;
}

.detail-container::-webkit-scrollbar-track {
  background: transparent;
}

.detail-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.detail-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}

.item-name {
  margin-top: 0.5rem;
  font-size: 1rem;
}

.detail-icon {
  font-size: 3rem;
  margin-top: 0.5rem;
  margin-bottom: 4px;
}

.detail-desc {
  color: #888;
  font-size: 0.85rem;
  line-height: 1.4;
  margin: 6px 0;
  white-space: normal;
  word-break: break-word;
  text-align: center;
}

.detail-stats {
  width: 100%;
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