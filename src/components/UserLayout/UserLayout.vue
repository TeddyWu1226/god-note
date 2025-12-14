<script setup lang="ts">
import {HpProgress, ValueProgress} from "@/components/Shared/Progress";
import {ref} from 'vue'
import {UserInfo} from "@/storage/userinfo-storage";
import {getEnumColumn} from "@/utils/enum";
import {CharEnum} from "@/enums/char-enum";


const activeName = ref('status')
</script>

<template>
  <el-card>
    <el-tabs
        v-model="activeName"
        stretch
    >
      <el-tab-pane label="狀態" name="status">
        <el-form label-width="3rem">
          <el-form-item label="HP">
            <HpProgress
                class="value-progress"
                :current-value="UserInfo.hp"
                :total-value="UserInfo.hpLimit"
            />
          </el-form-item>
          <el-form-item label="MP">
            <ValueProgress
                class="value-progress"
                :current-value="UserInfo.sp"
                :total-value="UserInfo.spLimit"
            />
          </el-form-item>
          <el-form-item label="等級">
            <span class="level">
              {{ getEnumColumn(CharEnum, UserInfo.char) }}
              ({{ UserInfo.level }})
            </span>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="⚔️">
            <span class="level">
              {{ UserInfo.ad }}
            </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="🛡️">
            <span class="level">
              {{ UserInfo.adDefend }}
            </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="狀態">
            測試
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="裝備" name="equipment">
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

:deep(.el-tabs__item) {
  padding: 0;
}

</style>