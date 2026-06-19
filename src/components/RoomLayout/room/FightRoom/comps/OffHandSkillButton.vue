<script setup lang="ts">
import {computed} from "vue";
import {usePlayerStore} from "@/store/player-store";
import {SkillModel} from "@/models/skill-model";
import {SkillFactory} from "@/constants/skill/learned-skill";
import {isImageIcon, resolveIconPath} from "@/utils/ui-helper";

const emit = defineEmits(['click'])
const props = defineProps({
  disabled: Boolean
})

const playerStore = usePlayerStore();

const offhandSkillKey = computed<string | undefined>(() => {
  if (playerStore.info.equips?.offhand?.skill) {
    return playerStore.info.equips.offhand.skill;
  }
  if (playerStore.info.equips?.weapon?.isTwoHanded && playerStore.info.equips.weapon.skill) {
    return playerStore.info.equips.weapon.skill;
  }
  return undefined;
});

const skill = computed<SkillModel | undefined>(() => offhandSkillKey.value ? SkillFactory.createSkill(offhandSkillKey.value) : undefined);

// 判斷是否可用以及冷卻狀態
const canAfford = computed(() => playerStore.info.sp >= (skill.value?.costSp || 0) && (skill.value?.currentCd ?? 0) === 0);

</script>

<template>
  <el-popover
      v-if="skill"
      placement="top"
      :title="skill.name"
      :width="200"
      trigger="hover"
  >
    <template #reference>
      <el-button
          class="skill-btn"
          :type="(skill?.currentCd ?? 0) > 0 ? 'info' : !canAfford ? 'info' : 'warning'"
          :disabled="props.disabled || !canAfford || (skill?.currentCd ?? 0) > 0"
          @click="emit('click',skill?.id)"
      >
        <span class="skill-icon">
          <img v-if="isImageIcon(skill?.icon)" :src="resolveIconPath(skill?.icon)" class="skill-image-icon"
               alt="skill icon"/>
          <template v-else>{{ skill?.icon }}</template>
        </span>
        <div class="skill-info">
          <span class="skill-name">{{ skill?.name }}</span>
          <span v-if="skill.currentCd > 0" class="skill-cd-status">冷卻: {{ skill.currentCd }} 回合</span>
          <template v-else>
            <span v-if="skill?.costSp" class="skill-cost">SP: {{ skill.costSp }}</span>
            <span v-if="skill?.costHp" class="skill-cost">HP: {{ skill.costHp }}</span>
          </template>
        </div>
      </el-button>
    </template>
    <div class="skill-desc">
      <div v-html="skill.description(playerStore)"/>
    </div>
  </el-popover>
</template>

<style scoped>
.skill-image-icon {
  width: 1.5rem;
  height: 1.5rem;
  object-fit: contain;
  image-rendering: pixelated;
  display: inline-block;
  vertical-align: middle;
}

.skill-icon {
  font-size: 1.5rem;
  margin-right: 10px;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3));
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

.skill-cd-status {
  font-size: 0.7rem;
  color: #ff9f43;
  font-weight: bold;
}
</style>