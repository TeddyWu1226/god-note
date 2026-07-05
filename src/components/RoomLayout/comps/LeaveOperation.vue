<script setup lang="ts">

const emit = defineEmits(['rest', 'cancel']);
const props = defineProps({
  disabled: Boolean,
})
/**狀態紀錄**/
const cancel = (): void => {
  emit('cancel');
}
</script>

<template>
  <el-button type="info" :disabled="props.disabled" @click="cancel">
    離開
  </el-button>
</template>
<style scoped>
</style>