<script setup lang="ts">
const dialogVisible = defineModel({type: Boolean})
</script>

<template>
  <el-dialog
      v-model="dialogVisible"
      title="📚 圖鑑"
      width="650px"
      custom-class="encyclopedia-dialog"
      :append-to-body="true"
      destroy-on-close
  >
    測試
  </el-dialog>
</template>

<style scoped>
</style>
