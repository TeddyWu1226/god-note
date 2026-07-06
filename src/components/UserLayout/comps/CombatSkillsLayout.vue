<script setup lang="ts">
import {computed} from 'vue';
import {usePlayerStore} from '@/store/player-store';
import {useGameStateStore} from '@/store/game-state-store';
import {SkillModel} from '@/models/skill-model';
import {isImageIcon, resolveIconPath} from "@/utils/ui-helper";

const emit = defineEmits(['on-learned-skill']);
const playerStore = usePlayerStore();
const gameStateStore = useGameStateStore();

const sortedSkills = computed(() => {
  // 顯示所有技能：主動技能（0）排在前面，被動技能（1）排在後面
  const skills = playerStore.info.skills || [];
  return [...skills].sort((a, b) => {
    const valA = a.type === 'active' ? 0 : 1;
    const valB = b.type === 'active' ? 0 : 1;
    return valA - valB;
  });
});
const getRarityColor = (rarity: string) => {
  const colors: Record<string, string> = {
    common: '#b2bec3',
    rare: '#0984e3',
    perfect: '#9C27B0',
    legendary: '#a335ee',
    unique: '#ff8000'
  };
  return colors[rarity] || '#ffffff';
};

const getRarityName = (rarity: string) => {
  const names: Record<string, string> = {
    common: '普通',
    rare: '稀有',
    perfect: '完美',
    legendary: '傳奇',
    unique: '唯一'
  };
  return names[rarity] || '普通';
};

const canAfford = (skill: SkillModel | any) => {
  if (!gameStateStore.isPlayerTurn) return false;
  const spCost = skill.costSp || 0;
  const hpCost = skill.costHp || 0;
  try {
    const actionCost = skill.getActualCostAction(playerStore);
    return playerStore.info.sp >= spCost &&
        playerStore.info.hp > hpCost &&
        skill.currentCd === 0 &&
        gameStateStore.playerActionPoints >= actionCost;
  } catch (error) {
    console.error(error)
    return false;
  }

};

const clickSkill = (skill: SkillModel | any) => {
  if (!gameStateStore.isPlayerTurn) return;
  if (skill.type === 'passive') return;
  // 檢查是否足夠點數和冷卻
  if (!canAfford(skill)) {
    return;
  }
  emit('on-learned-skill', skill.id);
};
</script>

<template>
  <el-card class="skills-card">
    <el-scrollbar height="100%">
      <div class="skills-grid">
        <div
            v-for="skill in sortedSkills"
            :key="skill.id"
            class="skill-item-box"
            :class="{ 
              'passive-skill': skill.type === 'passive',
              'active-skill': skill.type === 'active',
              'disabled-skill': skill.type === 'active' && !canAfford(skill)
            }"
            :style="{ 
              borderColor: getRarityColor(skill.rarity),
              borderStyle: skill.type === 'passive' ? 'dashed' : 'solid'
            }"
            @click="clickSkill(skill)"
        >
          <el-tooltip placement="top" effect="light">
            <template #content>
              <div class="skill-tooltip-content">
                <div class="header">
                  <strong class="name">{{ skill.name }}</strong>
                  <span class="rarity" :style="{ color: getRarityColor(skill.rarity) }">
                    [{{ getRarityName(skill.rarity) }}]
                  </span>
                </div>
                <div class="type">
                  類型: {{ skill.type === 'active' ? '主動技能' : '被動技能' }}
                  <span v-if="skill.type === 'active'" style="margin-left: 8px">
                    消耗行動點: {{ skill.costMaxAction ? '最大' : (skill.costAction || 0) }}
                  </span>
                </div>
                <div class="costs">
                  <span v-if="skill.costSp">SP 消耗: {{ skill.costSp }}</span>
                  <span v-if="skill.costHp && skill.costSp" style="margin: 0 4px">|</span>
                  <span v-if="skill.costHp">HP 消耗: {{ skill.costHp }}</span>
                  <span v-if="skill.type === 'active' && (skill.costSp || skill.costHp) && skill.maxCd"
                        style="margin: 0 4px">|</span>
                  <template v-if="skill.type === 'active'">
                    <span v-if="skill.maxCd">冷卻: {{ skill.maxCd }} 回合</span>
                    <span v-if="skill.proficiencyGain" style="margin: 0 4px">|</span>
                    <span v-if="skill.proficiencyGain">{{ skill.proficiencyText }}</span>
                  </template>
                </div>
                <div class="desc" v-html="skill.description(playerStore)"/>
              </div>
            </template>

            <div class="skill-inner">
              <span class="icon">
                <img v-if="isImageIcon(skill.icon)" :src="resolveIconPath(skill.icon)" class="skill-image-icon"
                     alt="skill icon"/>
                <template v-else>{{ skill.icon }}</template>
              </span>
              <div class="info">
                <div class="name-row">
                  <span class="name">{{ skill.name }}</span>
                  <span v-if="skill.type === 'active' && skill.currentCd > 0" class="cd-badge">
                    {{ skill.currentCd }}回
                  </span>
                </div>
                <div class="sub-row">
                  <span class="lv" v-if="skill.proficiencyGain">{{ skill.proficiencyText }}</span>
                  <span v-if="skill.type === 'passive'" class="passive-tag">被動</span>
                  <span v-else-if="skill.costSp" class="cost-tag">SP:{{ skill.costSp }}</span>
                  <span v-else-if="skill.costHp" class="cost-tag hp">HP:{{ skill.costHp }}</span>
                </div>
              </div>
            </div>
          </el-tooltip>
        </div>
      </div>
    </el-scrollbar>
  </el-card>
</template>

<style scoped>
.skills-card {
}

.skills-card :deep(.el-card__body) {
  padding: 0.5rem !important;
  height: 100%;
  box-sizing: border-box;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  padding: 0.1rem;
}

.skill-item-box {
  background: #2d2f31;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 4px 8px;
  cursor: pointer;
  user-select: none;
  transition: transform 0.15s ease-out, filter 0.2s;
  box-sizing: border-box;
}

.skill-item-box.passive-skill {
  background: #1c242c;
  cursor: help;
  opacity: 0.9;
}

.skill-item-box.active-skill:hover:not(.disabled-skill) {
  transform: scale(1.01);
  filter: brightness(1.15);
}

.skill-item-box.disabled-skill {
  cursor: not-allowed;
  opacity: 0.4;
  filter: grayscale(0.85);
}

.skill-inner {
  display: flex;
  align-items: center;
  gap: 8px;
}

.skill-image-icon {
  width: 1.25rem;
  height: 1.25rem;
  object-fit: contain;
  image-rendering: pixelated;
  display: inline-block;
  vertical-align: middle;
}

.icon {
  font-size: 1.25rem;
}

.info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
}

.name {
  font-weight: bold;
  font-size: 0.8rem;
  color: #eee;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cd-badge {
  background: #e6a23c;
  color: #000;
  font-size: 10px;
  padding: 0 3px;
  border-radius: 3px;
  font-weight: bold;
  flex-shrink: 0;
}

.sub-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #999;
}

.passive-tag {
  background: rgba(144, 147, 153, 0.2);
  color: #909399;
  font-weight: bold;
  padding: 1px 4px;
  border-radius: 4px;
  font-size: 10px;
}

.cost-tag {
  color: #409eff;
  font-family: monospace;
}

.cost-tag.hp {
  color: #f56c6c;
}

.skill-tooltip-content {
  padding: 4px;
  max-width: 220px;
}

.skill-tooltip-content .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #555;
  padding-bottom: 4px;
  margin-bottom: 4px;
}

.skill-tooltip-content .type {
  font-size: 11px;
  color: #aaa;
  margin-bottom: 2px;
}

.skill-tooltip-content .costs {
  font-size: 11px;
  color: #ff9f43;
  margin-bottom: 4px;
}

.skill-tooltip-content .desc {
  font-size: 12px;
  line-height: 1.4;
  color: #ddd;
}
</style>
