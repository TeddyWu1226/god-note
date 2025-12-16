<script setup lang="ts">
import {ref} from 'vue'


const activeName = ref('equipment')
</script>

<template>
  <el-card>
    <el-tabs
        v-model="activeName"
        stretch
    >
      <el-tab-pane label="裝備" name="equipment">
        <el-scrollbar height="7rem">
          <el-form label-width="3rem">
            <el-form-item label="頭部">
              <span class="level">無</span>
            </el-form-item>
            <el-form-item label="身體">
              <span class="level">無</span>
            </el-form-item>
            <el-form-item label="武器">
              <span class="level">無</span>
            </el-form-item>
            <el-form-item label="副手">
              <span class="level">無</span>
            </el-form-item>
            <el-form-item label="飾品">
              <span class="level">無</span>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane label="道具" name="item">
        <span>無任何道具</span>
      </el-tab-pane>
      <el-tab-pane label="其他" name="other">
        <span>無任何雜物</span>
      </el-tab-pane>
    </el-tabs>
  </el-card>

</template>

<style scoped>

.level {
  font-size: 16px;
  font-weight: bold;
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-tabs__item) {
  padding: 0;
}


:deep(.el-card__body) {
  padding: 0.5rem 1rem;
}

</style>