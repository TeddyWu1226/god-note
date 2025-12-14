<script setup lang="ts">
import {ref} from "vue";
import {operationStatusEnum} from "@/enums/enums";
import {Operation} from "@/storage/operation-storage";

const emit = defineEmits(['attack']);
const props = defineProps({
  disabled: Boolean,
})
/**狀態紀錄**/
const changeStatus = (value: operationStatusEnum = operationStatusEnum.Default): void => {
  Operation.value.current = value
}
</script>

<template>
  <div v-if="Operation.current===operationStatusEnum.Skill" class="flex">
    <el-button type="info" plain :disabled="props.disabled" @click="changeStatus">
      返回
    </el-button>
  </div>
  <div v-else-if="Operation.current===operationStatusEnum.Package" class="flex">
    <el-button type="info" plain :disabled="props.disabled" @click="changeStatus">
      返回
    </el-button>
  </div>
  <div v-else class="flex">
    <el-button type="primary" @click="emit('attack',true)">
      攻擊
    </el-button>
    <el-button type="primary" :disabled="props.disabled" @click="changeStatus(operationStatusEnum.Skill)">
      技能
    </el-button>
    <el-button type="info" :disabled="props.disabled" @click="changeStatus(operationStatusEnum.Package)">
      背包
    </el-button>
    <el-button type="danger" :disabled="props.disabled">
      逃跑
    </el-button>
  </div>
</template>

<style scoped>
</style>