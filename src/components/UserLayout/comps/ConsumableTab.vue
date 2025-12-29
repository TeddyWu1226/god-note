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

const aggregatedConsumables = computed(() => {
  const map = new Map<string, { item: UsableType; count: number }>();
  playerStore.info.consumeItems?.forEach((item) => {
    const key = item.name;
    const entry = map.get(key) || {item: {...item}, count: 0};
    entry.count++;
    map.set(key, entry);
  });
  return Array.from(map.values()).sort((a, b) => (b.item.quality || 0) - (a.item.quality || 0));
});

const handleUse = async (potion: UsableType, event?: MouseEvent) => {
  if (!potion.usable) return;
  // 取得當前點擊的 DOM 元素
  const targetEl = event.currentTarget as HTMLElement;
  // 如果有技能邏輯，需要等待父組件判斷
  if (potion.skill) {
    const canUse = await new Promise<boolean>((resolve) => {
      // 傳送技能 key 和一個 resolve 函式
      emit('onItemSkill', {
        skillKey: potion.skill,
        callback: (result: boolean) => resolve(result),
        el: targetEl
      });
    });

    // 如果判定不符合（例如：當前不是玩家回合、法力不足等），直接結束
    if (!canUse) return;
  }

  // --- 判定通過或無技能，執行消耗邏輯 ---

  // 1. 數值恢復
  if (potion.heal) playerStore.info.hp = Math.min(playerStore.finalStats.hpLimit, playerStore.info.hp + potion.heal);
  if (potion.magic) playerStore.info.sp = Math.min(playerStore.finalStats.spLimit, playerStore.info.sp + potion.magic);

  // 2. 移除道具
  const index = playerStore.info.consumeItems.findIndex(i => i.name === potion.name);
  if (index > -1) {
    playerStore.info.consumeItems.splice(index, 1);
  }
};
const onTouchHandleUse = createDoubleTapHandler((potion: UsableType, event?: any) => {
  handleUse(potion, event);
}, 350)

</script>

<template>
  <el-scrollbar height="7rem">
    <div v-if="aggregatedConsumables.length > 0" class="potion-grid">
      <div
          v-for="entry in aggregatedConsumables"
          :key="entry.item.name"
          class="item-slot"
          @dblclick="handleUse(entry.item,$event)"
          @touchend="onTouchHandleUse(entry.item,$event)"
      >
        <el-tooltip placement="top" effect="light">
          <template #content>
            <div class="tooltip-content">
              <b :style="{color:getEnumColumn(QualityEnum,entry.item.quality,'color','white')}">
                {{ entry.item.name }}
                (雙擊使用)
              </b>
              <p class="desc">{{ entry.item.description }}</p>
              <span v-if="entry.item.heal" class="effect-text">❤️ 回復生命: {{ entry.item.heal }}</span>
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
    <span v-else class="empty">無任何道具</span>
  </el-scrollbar>
</template>