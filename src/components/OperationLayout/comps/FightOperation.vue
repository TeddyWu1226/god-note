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
const emit = defineEmits(['attack', 'run', 'skill']);
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
  <div v-if="Operation.current===operationStatusEnum.Skill" class="flex">
    <SkillButton
        v-for="skillKey in playerStore.info.skills"
        :key="skillKey"
        :skill-key="skillKey"
        @click="emit('skill',skillKey)"
    />
    <el-button type="info" plain :disabled="props.disabled" @click="changeStatus">
      返回
    </el-button>
  </div>
  <div v-else class="flex">
    <el-button type="primary" @click="emit('attack',true)">
      攻擊
    </el-button>
    <OffHandSkillButton @click="(skillKey)=>{emit('skill',skillKey)}"/>
    <el-button
        v-if="playerStore.info.skills?.length"
        type="success"
        :disabled="props.disabled"
        @click="changeStatus(operationStatusEnum.Skill)">
      技能
    </el-button>
    <el-button type="danger" :disabled="props.disabled" @click="emit('run',true)">
      逃跑({{ escapeRate }}%)
    </el-button>
  </div>
</template>

<style scoped>
</style>