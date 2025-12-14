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
  const yellowLine = 75
  const redLine = 25
  const deadLine = 5
  if (per > yellowLine) {
    return 'var(--el-color-success)'
  } else if (per <= yellowLine && per > redLine) {
    return 'var(--el-color-warning)'
  } else if (per <= redLine && per > deadLine) {
    return 'var(--el-color-danger)'
  }else {
    return 'red'
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