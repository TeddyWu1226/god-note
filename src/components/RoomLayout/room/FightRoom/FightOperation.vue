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
  <el-button type="primary" :disabled="props.disabled" @click="emit('attack',true)">
    攻擊
  </el-button>
  <OffHandSkillButton :disabled="props.disabled" @click="(skillKey)=>{emit('skill',skillKey)}"/>

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
      v-else-if="playerStore.info.skills?.length"
      type="success"
      :disabled="props.disabled"
      @click="gameStateStore.bottomPanelMode = 'skills'"
  >
    技能
  </el-button>
  <el-button type="danger" :disabled="props.disabled" @click="emit('run',true)">
    逃跑({{ escapeRate }}%)
  </el-button>
  <el-tooltip
      effect="dark"
      content="點擊就跳過此回合"
      placement="top"
  >
    <el-button type="warning" :disabled="props.disabled" @click="emit('endTurn')">
      <template v-if="maxActionPoints >1">
        行動次數 ({{ gameStateStore.playerActionPoints }}/{{ maxActionPoints }})
      </template>
      <template v-else>
        跳過
      </template>
    </el-button>
  </el-tooltip>
</template>

<style scoped>
</style>