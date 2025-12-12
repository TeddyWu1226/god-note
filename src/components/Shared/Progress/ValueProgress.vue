<script setup lang="ts">
import {computed} from "vue";
import {calculatePercentageAsNumber} from "@/utils/math";

const props = defineProps({
  currentValue: {required: false, type: Number, default: 100},
  totalValue: {required: false, type: Number, default: 100},
  color:String,
})

const percent = computed(() => calculatePercentageAsNumber(props.currentValue, props.totalValue))
</script>

<template>
  <el-progress
      :text-inside="true"
      :stroke-width="20"
      :percentage="percent"
      :color="props.color"
  >
    <span>{{props.currentValue}}</span>
    <span class="px-1">/</span>
    <span>{{ props.totalValue}}</span>
  </el-progress>
</template>

<style scoped>
.px-1{
  padding-left: 2px;
  padding-right: 2px;
}
</style>