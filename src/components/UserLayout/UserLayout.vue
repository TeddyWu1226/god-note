<script setup lang="ts">
import {HpProgress, ValueProgress} from "@/components/Shared/Progress";
import {ref} from 'vue'
import {CharInfo} from "@/storage/userinfo-storage";


const activeName = ref('first')
</script>

<template>
  <el-card>
    <el-tabs
        v-model="activeName"
        stretch
    >
      <el-tab-pane label="角色狀態" name="first">
        <el-form title="角色資訊" label-width="3rem">
          <el-form-item label="HP">
            <HpProgress
                class="value-progress"
                :current-value="CharInfo.hp"
                :total-value="CharInfo.hpLimit"
            />
          </el-form-item>
          <el-form-item label="MP">
            <ValueProgress
                class="value-progress"
                :current-value="CharInfo.sp"
                :total-value="CharInfo.spLimit"
            />
          </el-form-item>
          <el-form-item label="等級">
            <span class="level">
              {{CharInfo.spLimit}}
              ({{ CharInfo.level}})
            </span>
          </el-form-item>
          <el-form-item label="狀態">
            測試
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-card>

</template>

<style scoped>
.value-progress {
  width: 100%
}

.level {
  font-size: 16px;
  font-weight: bold;
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

</style>