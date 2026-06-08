<script setup lang="ts">
import {computed, watch} from "vue";
import {operationStatusEnum} from "@/enums/enums";
import {Operation} from "@/storage/operation-storage";
import {escapePercent} from "@/constants/fight-func";
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import SkillButton from "@/components/OperationLayout/comps/SkillButton.vue";
import OffHandSkillButton from "@/components/OperationLayout/comps/OffHandSkillButton.vue";

const gameStateStore = useGameStateStore()
const playerStore = usePlayerStore()
const emit = defineEmits(['attack', 'run', 'skill', 'endTurn']);
const props = defineProps({
  disabled: Boolean,
})
/**狀態紀錄**/
const changeStatus = (value: operationStatusEnum = operationStatusEnum.Default): void => {
  Operation.value.current = value
}
/**逃跑機率**/
const escapeRate = computed((): number => escapePercent(playerStore.finalStats, gameStateStore.currentEnemy))

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
  <div class="flex">
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

    <el-button type="warning" plain :disabled="props.disabled" @click="emit('endTurn')">
      結束回合
    </el-button>
    <el-button type="danger" :disabled="props.disabled" @click="emit('run',true)">
      逃跑({{ escapeRate }}%)
    </el-button>
  </div>
</template>

<style scoped>
</style>