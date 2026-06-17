<script setup lang="ts">
import {computed, watch} from "vue";
import {operationStatusEnum} from "@/enums/enums";
import {Operation} from "@/storage/operation-storage";
import {escapePercent} from "@/constants/fight-func";
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import OffHandSkillButton from "@/components/RoomLayout/room/FightRoom/comps/OffHandSkillButton.vue";

const gameStateStore = useGameStateStore()
const playerStore = usePlayerStore()
const emit = defineEmits(['attack', 'run', 'learned-skill', 'endTurn', 'skill']);
const props = defineProps({
  disabled: Boolean,
})
/**狀態紀錄**/
const changeStatus = (value: operationStatusEnum = operationStatusEnum.Default): void => {
  Operation.value.current = value
}
/**逃跑機率**/
const escapeRate = computed((): number => escapePercent(playerStore.finalStats, gameStateStore.currentEnemy))

/**行動點數計算**/
const maxActionPoints = computed((): number => {
  return Math.max(1, Math.floor((playerStore.finalStats.actionValue ?? 50) / 50));
})

watch(
    () => gameStateStore.days,
    () => {
      changeStatus(operationStatusEnum.Default)
    },
    {
      immediate: true,
      deep: true
    }
)
</script>

<template>
  <el-button type="primary" @click="emit('attack',true)">
    攻擊
  </el-button>
  <OffHandSkillButton @click="(skillKey)=>{emit('skill',skillKey)}"/>

  <!-- 補給與技能按鈕共用位置，按下方版面狀態進行切換 -->
  <el-button
      v-if="gameStateStore.bottomPanelMode === 'skills'"
      type="success"
      :disabled="props.disabled"
      @click="gameStateStore.bottomPanelMode = 'backpack'"
  >
    補給
  </el-button>
  <el-button
      v-else-if="playerStore.info.skills?.filter((skill)=>skill.type === 'active').length"
      type="success"
      :disabled="props.disabled"
      @click="gameStateStore.bottomPanelMode = 'skills'"
  >
    技能
  </el-button>
  <el-button type="danger" :disabled="props.disabled" @click="emit('run',true)">
    逃跑({{ escapeRate }}%)
  </el-button>
  <el-button type="warning" :disabled="props.disabled" @click="emit('endTurn')">
    跳過({{gameStateStore.playerActionPoints}}/{{maxActionPoints}})
  </el-button>
</template>

<style scoped>
</style>