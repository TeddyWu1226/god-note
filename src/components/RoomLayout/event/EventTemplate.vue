<script setup lang="ts">
import './event-room.css'

const props = defineProps({
  title: {type: String, required: true},
  titleClass: {type: String, required: false},
  class: {type: String, required: false},
})
</script>

<template>
  <el-card :class="props.class">
    <div class="title" :class="props.titleClass">
      {{ props.title }}
    </div>
    <slot name="default"></slot>
  </el-card>
  <div v-if="$slots.button" class="flex operation-layout">
    <slot name="button"></slot>
  </div>
</template>

<style scoped>
.title {
  font-size: 1.2rem;
}

.flex > * {
  flex: 1;
}

.operation-layout {
  height: 5vh
}
</style>