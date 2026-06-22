<script setup lang="ts">
import EncyclopediaMonsterTab from "@/components/Encyclopedia/component/EncyclopediaMonsterTab.vue";

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
    <el-tabs type="card" stretch>
      <el-tab-pane label="怪物">
        <EncyclopediaMonsterTab/>
      </el-tab-pane>
      <el-tab-pane label="裝備">
        測試
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<style scoped>
</style>

<style lang="scss">
.encyclopedia-dialog {
  background: rgba(20, 20, 20, 0.96) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 14px !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.85) !important;
  backdrop-filter: blur(12px);

  .el-dialog__header {
    margin-right: 0;
    padding: 16px 20px 12px !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .el-dialog__title {
      color: #f2f2f2;
      font-size: 1.1rem;
      font-weight: bold;
      letter-spacing: 0.5px;
    }

    .el-dialog__headerbtn {
      top: 0;
      position: relative;
      margin-left: auto;
      
      .el-dialog__close {
        color: #909399;
        transition: color 0.2s ease;
        
        &:hover {
          color: #f56c6c;
        }
      }
    }
  }

  .el-dialog__body {
    padding: 12px 20px 20px !important;
    background: transparent;
    color: #e0e0e0;
  }

  /* 卡片標籤樣式調優 */
  .el-tabs--card > .el-tabs__header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    margin-bottom: 12px;

    .el-tabs__nav {
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-bottom: none;
      border-radius: 8px 8px 0 0;
      background: rgba(255, 255, 255, 0.01);
      overflow: hidden;
    }

    .el-tabs__item {
      border-left: 1px solid rgba(255, 255, 255, 0.08);
      color: #909399;
      font-size: 0.85rem;
      height: 38px;
      line-height: 38px;
      transition: all 0.2s ease;

      &:first-child {
        border-left: none;
      }

      &:hover {
        color: #409eff;
        background: rgba(255, 255, 255, 0.02);
      }

      &.is-active {
        background: rgba(64, 158, 255, 0.1);
        color: #409eff;
        border-bottom: 1px solid transparent;
        font-weight: bold;
      }
    }
  }
}
</style>
