<script setup lang="ts">
import {useGameStateStore} from "@/store/game-state-store";
import {StageEnum} from "@/enums/stage-enum";

const gameStateStore = useGameStateStore();
const noShow = (stage: number) => {
  return stage >= gameStateStore.maxClearedStage
}
</script>

<template>
  <!-- 大關選擇彈窗 (Dialog) - 全域唯一實例 -->
  <el-dialog
      v-model="gameStateStore.showStageSelectDialog"
      title="🌌 選擇前往的區域"
      width="90%"
      align-center
      :close-on-click-modal="gameStateStore.isStageSelectClosable"
      :close-on-press-escape="gameStateStore.isStageSelectClosable"
      :show-close="gameStateStore.isStageSelectClosable"
      destroy-on-close
  >
    <div class="stage-select-container flex flex-column gap-3">
      <div class="stage-select-tip text-center" style="margin-bottom: 1rem; color: var(--el-text-color-secondary);">
        通過前一區域即可解鎖下一區域。您可以自由選擇回到已通關的區域刷取資源。
      </div>

      <div
          v-for="(stage, key) in StageEnum"
          :key="key"
          style="width: 100%; margin-bottom: 8px;"
      >
        <!-- 只列出 1 到 5 大關供選擇 (審判之關卡 6 為天數強制進入) -->
        <template v-if="stage.value <= 5">
          <el-button
              style="width: 100%; height: 3.5rem; text-align: left; display: flex; justify-content: space-between; align-items: center;"
              :type="stage.value < gameStateStore.maxClearedStage ? 'primary' : 'info'"
              :disabled="noShow(stage.value)"
              @click="gameStateStore.selectStage(stage.value)"
              plain
          >
              <span style="font-size: 1rem; font-weight: bold;padding-right: 0.5rem">
                第 {{ stage.value }} 區: {{ noShow(stage.value) ? '???' : stage.label }}
              </span>
            <el-tag
                v-if="stage.value < gameStateStore.maxClearedStage"
                type="success"
                size="small"
                effect="dark"
            >
              已通關
            </el-tag>
            <el-tag
                v-else-if="stage.value === gameStateStore.maxClearedStage"
                type="danger"
                size="small"
                effect="dark"
            >
              NEW
            </el-tag>
            <el-tag
                v-else
                type="info"
                size="small"
                effect="dark"
            >
              🔒未發現
            </el-tag>
          </el-button>
        </template>
      </div>
    </div>
  </el-dialog>
</template>

<style>
.stage-select-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stage-select-container.flex-column {
  flex-direction: column;
}

.stage-select-container.gap-3 {
  gap: 12px;
}

.stage-select-container .text-center {
  text-align: center;
}
</style>
