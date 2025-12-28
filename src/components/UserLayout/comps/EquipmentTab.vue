<script setup lang="ts">
import './item.css'
import {usePlayerStore} from '@/store/player-store'
import {QualityEnum} from "@/enums/quality-enum"
import {EquipmentEnum} from "@/enums/enums"
import {getEnumColumn} from "@/utils/enum"
import {statLabels, UsableType} from "@/types"
import {ElMessage} from "element-plus"
import {ItemInfo} from "@/components/Shared/itemInfo";
import {createDoubleTapHandler} from "@/utils/touch";

const playerStore = usePlayerStore()

const getItemDescriptionLine = (item: any): string => {
  const percentStats = ['critRate', 'critIncrease', 'adIncrease', 'defendIncrease', 'apIncrease', 'lifeSteal'];
  return Object.entries(statLabels)
      .map(([key, label]) => {
        const value = item[key];
        if (!value) return null;
        const suffix = percentStats.includes(key) ? '%' : '';
        return `${label} ${value > 0 ? '+' : ''}${value}${suffix}`;
      })
      .filter(Boolean).join(', ');
};

const handleEquip = (item: any, index: number) => {
  playerStore.equipItem(item, index);
  ElMessage.success(`裝備了 ${item.name}!`);
};
const onTouchHandleEquip = createDoubleTapHandler((item: any, index: number) => {
  handleEquip(item, index);
}, 350)
</script>

<template>
  <el-scrollbar height="7rem">
    <div v-if="playerStore.info.equipments?.length > 0" class="item-grid">
      <el-tooltip v-for="(item, index) in playerStore.info.equipments" :key="index" effect="light" trigger="click">
        <template #content>
          <ItemInfo :item="item"/>
        </template>
        <div
            class="inventory-item"
            :style="{ borderColor: getEnumColumn(QualityEnum, item.quality, 'color') }"
            @dblclick="handleEquip(item, index)"
            @touchend="onTouchHandleEquip(item, index)"
        >
          <span style="font-size: 1.2rem">{{ item.icon }}</span>
          <div class="equip-info">
            <div class="item-name" :style="{ color: getEnumColumn(QualityEnum, item.quality, 'color') }">{{
                item.name
              }}
            </div>
            <div class="pos-tag">{{ getEnumColumn(EquipmentEnum, item.position) }}</div>
          </div>
          <span class="stat-line">{{ getItemDescriptionLine(item) }}</span>
          <span class="equipment-hint">(雙擊穿戴)</span>
        </div>
      </el-tooltip>
    </div>
    <span v-else class="empty">無任何裝備</span>
  </el-scrollbar>
</template>