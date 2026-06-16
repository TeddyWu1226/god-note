<script setup lang="ts">


import {RoomEnum} from "@/enums/room-enum";
import {GameState} from "@/enums/enums";

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