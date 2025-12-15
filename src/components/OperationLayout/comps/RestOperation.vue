<script setup lang="ts">


const emit = defineEmits(['rest', 'cancel']);
const props = defineProps({
  disabled: Boolean,
})
/**狀態紀錄**/
const rest = (): void => {
  emit('rest');
}

const cancel = (): void => {
  emit('cancel');
}
</script>

<template>
  <div class="flex">
    <el-button type="success" :disabled="props.disabled" @click="rest">
      休息一下
    </el-button>
    <el-button type="info" :disabled="props.disabled" @click="cancel">
      繼續趕路
    </el-button>
  </div>
</template>

<style scoped>
</style>