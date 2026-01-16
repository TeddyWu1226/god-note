<script setup lang="ts">
import './item.css'
import {computed} from 'vue'
import {usePlayerStore} from '@/store/player-store'
import {getEnumColumn} from "@/utils/enum"
import {QualityEnum} from "@/enums/quality-enum"

const playerStore = usePlayerStore()

// 🌟 修正：不再需要透過 Map 進行 count 累加，資料結構已經是聚合好的了
const sortedOthers = computed(() => {
  const items = playerStore.info.items || [];

  // 直接進行排序即可
  return [...items].sort((a, b) => {
    // 1. 品質降序
    const qualityDiff = (b.item.quality || 0) - (a.item.quality || 0);
    // 2. 名稱升序 (當品質相同時)
    return qualityDiff || a.item.name.localeCompare(b.item.name, 'zh-Hans-CN');
  });
});
</script>

<template>
  <el-scrollbar height="7rem">
    <div v-if="sortedOthers.length > 0" class="potion-grid">
      <div
          v-for="entry in sortedOthers"
          :key="entry.item.name"
          class="item-slot"
      >
        <el-tooltip placement="top" effect="light">
          <template #content>
            <div class="tooltip-content">
              <b :style="{ color: getEnumColumn(QualityEnum, entry.item.quality, 'color', 'white') }">
                {{ entry.item.name }}
              </b>
              <p class="desc">{{ entry.item.description }}</p>
            </div>
          </template>

          <div
              class="icon-wrapper"
              :style="{ borderColor: getEnumColumn(QualityEnum, entry.item.quality, 'color') }"
          >
            <span class="icon">{{ entry.item.icon }}</span>
            <div class="item-count">{{ entry.count }}</div>
          </div>
        </el-tooltip>
        <div class="item-name">{{ entry.item.name }}</div>
      </div>
    </div>
    <span v-else class="empty">目前沒有任何素材</span>
  </el-scrollbar>
</template>