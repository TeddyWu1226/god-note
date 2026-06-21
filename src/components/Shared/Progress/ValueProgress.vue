<script setup lang="ts">
import {computed} from "vue";

const props = defineProps({
  currentValue: {required: false, type: Number, default: 100},
  totalValue: {required: false, type: Number, default: 100},
  color: String,
})

const percent = computed(() => {
  if (props.totalValue === 0) return 0;
  return Math.min(100, Math.max(0, (props.currentValue / props.totalValue) * 100));
});
</script>

<template>
  <div class="custom-progress-container">
    <div class="progress-bar-track">
      <div 
        class="progress-segment" 
        :style="{ 
          width: percent + '%', 
          background: props.color || '#3498db'
        }"
      ></div>
    </div>
    <div class="progress-text">
      <span>{{ currentValue }}</span>
      <span class="px-1">/</span>
      <span>{{ totalValue }}</span>
    </div>
  </div>
</template>

<style scoped>
.custom-progress-container {
  position: relative;
  width: 100%;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.45);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
}

.progress-bar-track {
  width: 100%;
  height: 100%;
  position: relative;
}

.progress-segment {
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.25);
}

.progress-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.9);
  pointer-events: none;
  font-family: 'Courier New', Courier, monospace;
}

.px-1 {
  padding-left: 2px;
  padding-right: 2px;
}
</style>