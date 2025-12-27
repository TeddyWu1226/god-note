<script setup lang="ts">
import './item.css'
import { computed } from 'vue'
import { usePlayerStore } from '@/store/player-store'
import { getEnumColumn } from "@/utils/enum"
import { QualityEnum } from "@/enums/quality-enum"

const playerStore = usePlayerStore()
const aggregatedOthers = computed(() => {
  const map = new Map<string, { item: any; count: number }>();
  playerStore.info.items?.forEach(item => {
    const entry = map.get(item.name) || { item: { ...item }, count: 0 };
    entry.count++;
    map.set(item.name, entry);
  });
  return Array.from(map.values()).sort((a, b) => (b.item.quality || 0) - (a.item.quality || 0));
});
</script>

<template>
  <el-scrollbar height="7rem">
    <div v-if="aggregatedOthers.length > 0" class="potion-grid">
      <div v-for="entry in aggregatedOthers" :key="entry.item.name" class="item-slot">
        <el-tooltip placement="top" effect="light">
          <template #content>
            <div class="tooltip-content">
              <b :style="{ color: getEnumColumn(QualityEnum, entry.item.quality, 'color') }">{{ entry.item.name }}</b>
              <p class="desc">{{ entry.item.description }}</p>
            </div>
          </template>
          <div class="icon-wrapper" :class="`quality-${entry.item.quality}`">
            <span class="icon">{{ entry.item.icon }}</span>
            <div class="item-count">{{ entry.count }}</div>
          </div>
        </el-tooltip>
        <div class="item-name">{{ entry.item.name }}</div>
      </div>
    </div>
  </el-scrollbar>
</template>
