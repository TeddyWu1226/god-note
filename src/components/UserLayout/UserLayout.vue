<script setup lang="ts">
import {ref, watch} from 'vue'
import {usePlayerStore} from '@/store/player-store'
import ConsumableTab from "@/components/UserLayout/comps/ConsumableTab.vue"
import EquipmentTab from "@/components/UserLayout/comps/EquipmentTab.vue"
import MaterialTab from "@/components/UserLayout/comps/MaterialTab.vue"

const emit = defineEmits(['onSkill']); // 聲明要轉發的事件
const playerStore = usePlayerStore()
const activeName = ref('item')

// 紀錄哪些分頁有新東西
const hasNew = ref({
  item: false,
  equipment: false,
  other: false
})

// 監聽背包變動
// 監聽道具
watch(() => playerStore.info.consumeItems?.length, (newLen, oldLen) => {
  if (newLen > oldLen && activeName.value !== 'item') {
    hasNew.value.item = true
  }
})

// 監聽裝備
watch(() => playerStore.info.equipments?.length, (newLen, oldLen) => {
  if (newLen > oldLen && activeName.value !== 'equipment') {
    hasNew.value.equipment = true
  }
})

// 監聽其他素材
watch(() => playerStore.info.items?.length, (newLen, oldLen) => {
  if (newLen > oldLen && activeName.value !== 'other') {
    hasNew.value.other = true
  }
})

// 當切換分頁時，消除該分頁的紅點
watch(activeName, (val) => {
  hasNew.value[val as keyof typeof hasNew.value] = false
})
</script>

<template>
  <el-card class="inventory-card">
    <el-tabs v-model="activeName" stretch>

      <el-tab-pane name="item">
        <template #label>
          <el-badge class="tab-badge" :hidden="!hasNew.item" is-dot :offset="[10, 5]">消耗</el-badge>
        </template>
        <ConsumableTab @on-skill="payload => emit('onSkill', payload)"/>
      </el-tab-pane>

      <el-tab-pane name="equipment">
        <template #label>
          <el-badge class="tab-badge" :hidden="!hasNew.equipment" is-dot :offset="[10, 5]">裝備</el-badge>
        </template>
        <EquipmentTab/>
      </el-tab-pane>

      <el-tab-pane name="other">
        <template #label>
          <el-badge class="tab-badge" :hidden="!hasNew.other" is-dot :offset="[10, 5]">其他</el-badge>
        </template>
        <MaterialTab/>
      </el-tab-pane>

    </el-tabs>
  </el-card>
</template>

<style scoped>
.inventory-card :deep(.el-card__body) {
  padding: 0 !important;
}
</style>