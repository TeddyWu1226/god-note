<script setup lang="ts">


const emit = defineEmits(['rest']);
const props = defineProps({
  disabled: Boolean,
})
/**狀態紀錄**/
const rest = (): void => {
  emit('rest');
}
</script>

<template>
  <div class="flex">
    <el-button type="success" :disabled="props.disabled" @click="rest">
      呼!休息一下!
    </el-button>
  </div>
</template>

<style scoped>
</style>