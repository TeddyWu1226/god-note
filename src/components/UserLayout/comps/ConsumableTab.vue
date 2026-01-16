<script setup lang="ts">
import './item.css'
import {computed} from 'vue'
import {usePlayerStore} from '@/store/player-store'
import {UsableType} from "@/types"
import {getEnumColumn} from "@/utils/enum";
import {QualityEnum} from "@/enums/quality-enum";
import {createDoubleTapHandler} from "@/utils/touch";

const playerStore = usePlayerStore()
const emit = defineEmits(['onItemSkill'])

// 🌟 修正 1：現在不需要手動計算聚合，直接從 store 取出排序即可
const sortedConsumables = computed(() => {
  const consumeItems = playerStore.info.consumeItems || [];

  // 複製一份進行排序，避免影響原資料（或直接使用，取決於你是否希望背包自動排序）
  return [...consumeItems].sort((a, b) => {
    // 1. 第一優先：品質 (由高到低)
    const qualityDiff = (b.item.quality || 0) - (a.item.quality || 0);
    // 2. 第二優先：名稱
    return qualityDiff || a.item.name.localeCompare(b.item.name, 'zh-Hans-CN');
  });
});

const handleUse = async (item: UsableType, event?: MouseEvent) => {
  if (!item.usable) return;
  const targetEl = event?.currentTarget as HTMLElement;

  if (item.skill) {
    const canUse = await new Promise<boolean>((resolve) => {
      emit('onItemSkill', {
        skillKey: item.skill,
        callback: (result: boolean) => resolve(result),
        el: targetEl
      });
    });
    if (!canUse) return;
  }

  // --- 執行消耗邏輯 ---

  // 1. 數值恢復
  if (item.heal) playerStore.info.hp = Math.min(playerStore.finalStats.hpLimit, playerStore.info.hp + item.heal);
  if (item.magic) playerStore.info.sp = Math.min(playerStore.finalStats.spLimit, playerStore.info.sp + item.magic);

  // 🌟 修正 2：使用我們新寫的 removeItem Action
  // 這樣會自動處理 count 減少、若歸零則從陣列中刪除的邏輯
  playerStore.removeItem(item.name, 1);
};

const onTouchHandleUse = createDoubleTapHandler((potion: UsableType, event?: any) => {
  handleUse(potion, event);
}, 350)

</script>

<template>
  <el-scrollbar height="7rem">
    <div v-if="sortedConsumables.length > 0" class="potion-grid">
      <div
          v-for="entry in sortedConsumables"
          :key="entry.item.name"
          class="item-slot"
          @dblclick="handleUse(entry.item, $event)"
          @touchend="onTouchHandleUse(entry.item, $event)"
      >
        <el-tooltip placement="top" effect="light">
          <template #content>
            <div class="tooltip-content">
              <b :style="{color:getEnumColumn(QualityEnum, entry.item.quality, 'color', 'white')}">
                {{ entry.item.name }}
                (雙擊使用)
              </b>
              <p class="desc">{{ entry.item.description }}</p>
              <span v-if="entry.item.heal" class="effect-text">❤️ 回復生命: {{ entry.item.heal }}</span>
              <span v-if="entry.item.magic" class="effect-text">✨ 回復法力: {{ entry.item.magic }}</span>
            </div>
          </template>
          <div class="icon-wrapper" :style="{borderColor:getEnumColumn(QualityEnum, entry.item.quality, 'color')}">
            <span class="icon">{{ entry.item.icon }}</span>
            <div class="item-count">{{ entry.count }}</div>
          </div>
        </el-tooltip>
        <div class="item-name">{{ entry.item.name }}</div>
      </div>
    </div>
    <span v-else class="empty">無任何道具</span>
  </el-scrollbar>
</template>