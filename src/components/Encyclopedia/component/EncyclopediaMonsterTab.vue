<script setup lang="ts">
import {MistyForestMonster} from "@/constants/monsters/monster-info/1-misty-forest-monster";
import {StageEnum} from "@/enums/stage-enum";
import {useGameStateStore} from "@/store/game-state-store";
import MonsterEncyclopedia from "@/components/Encyclopedia/component/MonsterEncyclopedia.vue";
import {RedMountainMonster} from "@/constants/monsters/monster-info/2-red-mountain-monster";
import {GiantsWastelandMonster} from "@/constants/monsters/monster-info/3-giants-wasteland-monster";
import {SplitCanyonMonster} from "@/constants/monsters/monster-info/4-split-canyon-monster";
import {EndAbyssMonster} from "@/constants/monsters/monster-info/5-end-abyss-monster";
import {JudgmentStageMonster} from "@/constants/monsters/monster-info/6-judgment-stage-monster";
import {Boss} from "@/constants/monsters/monster-info/99-boss-info";
import {computed} from "vue";

const gameStateStore = useGameStateStore();

const unlocked = (val: number) => {
  // return true
  return gameStateStore.maxClearedStage >= val || gameStateStore.currentStage >= val
}
const monsterInfoMapping = {
  1: MistyForestMonster,
  2: RedMountainMonster,
  3: GiantsWastelandMonster,
  4: SplitCanyonMonster,
  5: EndAbyssMonster,
  6: JudgmentStageMonster,
}

const allowInEncyclopediaBoss = computed(() => {
  return Object.values(Boss).filter((boss) => !boss.code.startsWith('FallenKnight'))
})

</script>

<template>
  <el-tabs tab-position="left">
    <el-tab-pane
        v-for="stage in StageEnum"
        :key="stage.value"
        :label="unlocked(stage.value)?stage.label:'???'"
        :disabled="!unlocked(stage.value)"
    >
      <MonsterEncyclopedia :monster-list="Object.values(monsterInfoMapping[stage.value])"></MonsterEncyclopedia>
    </el-tab-pane>
    <el-tab-pane
        label="BOSS☠️"
    >
      <MonsterEncyclopedia :monster-list="allowInEncyclopediaBoss"></MonsterEncyclopedia>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped lang="scss">
:deep(.el-tabs) {
  height: 460px;
  background: transparent;
  border: none;
}

:deep(.el-tabs__header.is-left) {
  margin-right: 0px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

:deep(.el-tabs__item.is-left) {
  text-align: right;
  font-size: 0.85rem;
  color: #909399;
  height: 40px;
  line-height: 40px;
  transition: all 0.2s ease;
  padding: 0 16px;

  &:hover {
    color: #409eff;
    background: rgba(255, 255, 255, 0.02);
  }

  &.is-active {
    color: #409eff;
    font-weight: bold;
    background: rgba(64, 158, 255, 0.05);
  }

  &.is-disabled {
    color: #4c4d4f;
    cursor: not-allowed;

    &:hover {
      color: #4c4d4f;
      background: transparent;
    }
  }
}

:deep(.el-tabs__active-bar.is-left) {
  width: 2px;
  background-color: #409eff;
}

:deep(.el-tabs__content) {
  height: 100%;
  padding-left: 12px;
  overflow: visible;
}

:deep(.el-tab-pane) {
  height: 100%;
}
</style>