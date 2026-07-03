<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import PhysicalImpact from './comps/PhysicalImpact.vue';
import MagicImpact from './comps/MagicImpact.vue';
import HealImpact from './comps/HealImpact.vue';
import BuffImpact from './comps/BuffImpact.vue';
import VerticalSlashImpact from './comps/VerticalSlashImpact.vue';
import HorizontalSlashImpact from './comps/HorizontalSlashImpact.vue';
import ThrustImpact from './comps/ThrustImpact.vue';
import AssassinateImpact from './comps/AssassinateImpact.vue';
import PoisonImpact from './comps/PoisonImpact.vue';

const props = defineProps({
  type: { type: String, default: 'physical' },
  positionStyle: { type: Object, required: true }
});

const emit = defineEmits(['unmount']);
const isActive = ref(true);

onMounted(() => {
  // 動畫總時長設為 1000ms，在 900ms 時啟動淡出，然後卸載元件
  setTimeout(() => {
    isActive.value = false;
    emit('unmount');
  }, 900);
});

const impactComponent = computed(() => {
  switch (props.type) {
    case 'physical':
      return PhysicalImpact;
    case 'magic':
      return MagicImpact;
    case 'heal':
      return HealImpact;
    case 'buff':
      return BuffImpact;
    case 'vertical-slash':
      return VerticalSlashImpact;
    case 'horizontal-slash':
      return HorizontalSlashImpact;
    case 'thrust':
      return ThrustImpact;
    case 'assassinate':
      return AssassinateImpact;
    case 'poison':
      return PoisonImpact;
    default:
      return PhysicalImpact;
  }
});
</script>

<template>
  <div v-if="isActive" class="card-impact-overlay" :style="positionStyle">
    <component :is="impactComponent" />
  </div>
</template>

<style scoped>
.card-impact-overlay {
  pointer-events: none;
  overflow: hidden;
  border-radius: 12px; /* 貼合一般卡片邊角 */
  box-sizing: border-box;
}
</style>
