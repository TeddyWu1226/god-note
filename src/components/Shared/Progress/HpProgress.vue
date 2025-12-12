<script setup lang="ts">
import {computed} from "vue";
import {calculatePercentageAsNumber} from "@/utils/math";
import ValueProgress from "@/components/Shared/Progress/ValueProgress.vue";

const props = defineProps({
  currentValue: {required: false, type: Number, default: 100},
  totalValue: {required: false, type: Number, default: 100},
  color: String,
})

const color = computed(() => {
  const per = calculatePercentageAsNumber(props.currentValue, props.totalValue)
  if (per > 50) {
    return 'var(--el-color-success)'
  } else if (per < 50 && per > 20) {
    return 'var(--el-color-warning)'
  } else {
    return 'var(--el-color-danger)'
  }
})
</script>

<template>
  <ValueProgress
      :current-value="props.currentValue"
      :total-value="props.totalValue"
      :color="color"/>
</template>

<style scoped>
</style>