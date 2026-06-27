<script setup lang="ts">
import {computed} from "vue";
import {calculatePercentageAsNumber} from "@/utils/math";

const props = defineProps({
  currentValue: {required: false, type: Number, default: 100},
  totalValue: {required: false, type: Number, default: 100},
  shield: {required: false, type: Number, default: 0},
  shieldLimit: {required: false, type: Number, default: 0},
  color: String,
})

// The max scale represents the highest value reached (either max HP or current shield if it exceeds max HP)
const maxScale = computed(() => Math.max(props.totalValue, props.shield));

const hpPercent = computed(() => {
  if (maxScale.value === 0) return 0;
  if (props.currentValue <= 0) return 0;
  return (props.currentValue / maxScale.value) * 100;
});

const shieldPercent = computed(() => {
  if (maxScale.value === 0) return 0;
  return (props.shield / maxScale.value) * 100;
});

// The shield overlay starts at HP - Shield (clamped to >= 0) and ends at HP (or Shield if Shield > HP)
const shieldLeft = computed(() => {
  return Math.max(0, hpPercent.value - shieldPercent.value);
});

const computedHpColor = computed(() => {
  if (props.color) return props.color;
  const per = calculatePercentageAsNumber(props.currentValue, props.totalValue);
  const yellowLine = 75;
  const redLine = 25;

  if (per > yellowLine) {
    // Vibrant green gradient
    return 'linear-gradient(90deg, #2ecc71, #27ae60)';
  } else if (per > redLine) {
    // Orange/yellow gradient
    return 'linear-gradient(90deg, #f1c40f, #e67e22)';
  } else {
    // Crimson/red gradient
    return 'linear-gradient(90deg, #e74c3c, #c0392b)';
  }
});
</script>

<template>
  <div class="custom-progress-container">
    <div class="progress-bar-track">
      <!-- HP Segment -->
      <div
          class="progress-segment hp-segment"
          :style="{
          width: hpPercent + '%', 
          background: computedHpColor 
        }"
      ></div>
      <!-- Shield Segment (Overlay) -->
      <div
          v-if="shield > 0"
          class="progress-segment shield-segment"
          :style="{
          width: shieldPercent + '%',
          left: shieldLeft + '%'
        }"
      ></div>
    </div>
    <!-- Combined text overlay -->
    <div class="progress-text">
      <span class="hp-text">{{ currentValue > 0 ? currentValue : 0 }}</span>
      <span class="px-1">/</span>
      <span class="hp-text">{{ totalValue }}</span>
      <span v-if="shield > 0" class="shield-text"> (+{{ shield }} 🛡️)</span>
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
  position: absolute;
  top: 0;
  border-radius: 10px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.25);
}

.hp-segment {
  left: 0;
  z-index: 1;
}

.shield-segment {
  z-index: 2;
  /* Beautiful glowing white/silver striped design with opacity to show underlying green HP */
  background: repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.65),
      rgba(255, 255, 255, 0.65) 6px,
      rgba(220, 220, 220, 0.75) 6px,
      rgba(220, 220, 220, 0.75) 12px
  );
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.4),
  0 0 6px rgba(255, 255, 255, 0.7);
  border-left: 1px solid rgba(255, 255, 255, 0.4);
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
  z-index: 3;
  font-family: 'Courier New', Courier, monospace;
}

.shield-text {
  color: #ffffff;
  margin-left: 4px;
}

.px-1 {
  padding-left: 2px;
  padding-right: 2px;
}
</style>