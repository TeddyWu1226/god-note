<script setup lang="ts">
import {computed} from "vue";
import {usePlayerStore} from "@/store/player-store";
import {SkillModel} from "@/models/skill-model";
import {isImageIcon, resolveIconPath} from "@/utils/ui-helper";

const emit = defineEmits(['click'])
const props = defineProps({
  skill: {type: Object, required: true},
})

const playerStore = usePlayerStore();
const skill = computed<SkillModel>(() => props.skill as SkillModel);

// 判斷是否可用與冷卻狀態
const canAfford = computed(() => playerStore.info.sp >= (skill.value?.costSp || 0) && skill.value.currentCd === 0);

</script>

<template>
  <div class="skill-container">
    <el-button
        class="skill-btn"
        :type="skill.currentCd > 0 ? 'info' : !canAfford ? 'info' : skill?.costHp?'danger':'primary'"
        :disabled="!canAfford || skill.currentCd > 0"
        plain
        @click="emit('click')"
    >
      <span class="skill-icon">
        <img v-if="isImageIcon(skill?.icon)" :src="resolveIconPath(skill?.icon)" class="skill-image-icon"
             alt="skill icon"/>
        <template v-else>{{ skill?.icon }}</template>
      </span>
      <div class="skill-info">
        <span class="skill-name">
          {{ skill?.name }}
          <span v-if="skill.currentCd > 0" class="skill-cd-text">({{ skill.currentCd }}回)</span>
        </span>
        <span v-if="skill?.costSp" class="skill-cost">SP: {{ skill.costSp }}</span>
        <span v-if="skill?.costHp" class="skill-cost">HP: {{ skill.costHp }}</span>
      </div>
    </el-button>

    <el-popover
        placement="top"
        :title="skill.name"
        :width="200"
        trigger="hover"
    >
      <template #reference>
        <div class="info-trigger">i</div>
      </template>
      <div class="skill-desc">
        <div v-if="skill.proficiencyGain">{{ skill.proficiencyText }}</div>
        <div v-html="skill.description(playerStore)"/>
      </div>
    </el-popover>
  </div>
</template>

<style scoped>
.skill-container {
  position: relative;
  width: 100%;
}

.skill-container .el-button {
  width: 100%;
}

.info-trigger {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 1.5rem;
  height: 1.5rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 50%;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #fff;
  z-index: 10;
  cursor: help;
}

.skill-desc {
  font-size: 14px;
  line-height: 1.4;
}

.skill-icon {
  font-size: 1.5rem;
  margin-right: 10px;
  /* 讓圖示看起來更有立體感 */
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3));
}

.skill-image-icon {
  width: 1.5rem;
  height: 1.5rem;
  object-fit: contain;
  image-rendering: pixelated;
  display: inline-block;
  vertical-align: middle;
}

.skill-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}

.skill-name {
  font-weight: bold;
  font-size: 0.95rem;
  margin-bottom: 2px;
}

.skill-cost {
  font-size: 0.7rem;
  font-family: 'Courier New', Courier, monospace;
}

.skill-cd-text {
  font-size: 0.7rem;
  color: #ff9f43;
  margin-left: 4px;
}
</style>