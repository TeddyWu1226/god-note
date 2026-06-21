<script setup lang="ts">
import {nextTick, ref, watch} from "vue";
import {usePlayerStore} from "@/store/player-store";
import {useTrackerStore} from "@/store/track-store";
import {SKILL_TEMPLATES, SkillFactory} from "@/constants/skill/learned-skill";
import {EVOLUTION_RULES} from "@/constants/skill/learned-skill/evolution-rule";
import {SkillModel} from "@/models/skill-model";
import {ElMessage} from "element-plus";
import {isImageIcon, resolveIconPath} from "@/utils/ui-helper";

const playerStore = usePlayerStore();

const isShowLearnSkill = ref(false);
const isShowOwnedSkillsInDialog = ref(false);
const drawnSkills = ref<SkillModel[]>([]);
const replaceMode = ref(false);
const selectedNewSkill = ref<SkillModel | null>(null);

const getRarityColor = (rarity: string) => {
  const colors: Record<string, string> = {
    common: '#b2bec3',
    rare: '#0984e3',
    legendary: '#a335ee',
    unique: '#ff8000'
  };
  return colors[rarity] || '#ffffff';
};

const getRarityName = (rarity: string) => {
  const names: Record<string, string> = {
    common: '普通',
    rare: '稀有',
    legendary: '傳奇',
    unique: '唯一'
  };
  return names[rarity] || '普通';
};

const getEvolutionText = (skillId: string) => {
  const rule = EVOLUTION_RULES[skillId];
  if (!rule) return '';
  const getSkillName = (id: string) => SKILL_TEMPLATES[id]?.name || id;

  if (rule.baseSkillId && rule.fuseSkillIds && rule.fuseSkillIds.length > 0) {
    const ingredients = [rule.baseSkillId, ...rule.fuseSkillIds].map(getSkillName).join(' + ');
    return `${ingredients}`;
  } else if (rule.fuseSkillIds && rule.fuseSkillIds.length > 0) {
    const ingredients = rule.fuseSkillIds.map(getSkillName).join(' + ');
    return `${ingredients}`;
  } else if (rule.baseSkillId) {
    return `${getSkillName(rule.baseSkillId)}`;
  }
  return '';
};

// 遞迴檢查某技能是否進化自/衍生自另一技能
const isEvolvedFrom = (evolvedId: string, baseId: string): boolean => {
  const rule = EVOLUTION_RULES[evolvedId];
  if (!rule) return false;
  if (rule.baseSkillId === baseId) return true;
  if (rule.fuseSkillIds?.includes(baseId)) return true;
  if (rule.baseSkillId && isEvolvedFrom(rule.baseSkillId, baseId)) return true;
  if (rule.fuseSkillIds) {
    for (const fuseId of rule.fuseSkillIds) {
      if (isEvolvedFrom(fuseId, baseId)) return true;
    }
  }
  return false;
};

const openLearnSkill = () => {
  const currentSkillIds = playerStore.info.skills ? playerStore.info.skills.map((s: any) => s.id) : [];
  const learnSillUniqueSet = new Set(
      playerStore.info.skills.flatMap(skill => skill.uniqueFields || [])
  );
  const trackerStore = useTrackerStore();

  const candidates = Object.keys(SKILL_TEMPLATES).filter(id => {
    // 玩家不能已經擁有此技能
    if (currentSkillIds.includes(id)) return false;

    // 1. 檢查可學習條件 (如果是進化技能)
    const evoRule = EVOLUTION_RULES[id];
    if (evoRule) {
      const isEligible = evoRule.checkEligible(playerStore, trackerStore);
      if (!isEligible) return false;
    }

    // 2. 玩家是否有學習相同[唯一字段]的技能
    const uniqueFields = SKILL_TEMPLATES[id].uniqueFields;
    if (uniqueFields) {
      const hasSameUnique = uniqueFields.some(field => learnSillUniqueSet.has(field));
      if (hasSameUnique) return false;
    }

    // 3. 玩家不能已經擁有此技能的進化後版本
    const hasEvolvedVersion = currentSkillIds.some(ownedId => isEvolvedFrom(ownedId, id));
    return !hasEvolvedVersion;
  });

  console.log('可學技能列', candidates)
  if (candidates.length === 0) {
    ElMessage.warning('您已經學會了所有可用的技能！');
    return;
  }

  // 隨機選出最多三個
  const shuffled = candidates.sort(() => 0.5 - Math.random());
  const selectedIds = shuffled.slice(0, Math.min(3, shuffled.length));

  // 轉化為 SkillModel 類別實例
  drawnSkills.value = selectedIds.map(id => SkillFactory.createSkill(id));

  replaceMode.value = false;
  selectedNewSkill.value = null;
  isShowLearnSkill.value = true;
};

// 💡 監聽 pendingSkillPoints，若有未分配的點數則自動彈出學習技能對話框（含 F5 重整）
watch(
    () => playerStore.info.pendingSkillPoints,
    (newPoints) => {
      if (newPoints && newPoints > 0 && !isShowLearnSkill.value) {
        nextTick(() => {
          openLearnSkill();
        });
      }
    },
    {immediate: true}
);

watch(isShowLearnSkill, (newVal) => {
  if (!newVal) {
    isShowOwnedSkillsInDialog.value = false;
  }
});

const skipLearn = () => {
  playerStore.info.pendingSkillPoints = Math.max(0, (playerStore.info.pendingSkillPoints || 1) - 1);
  isShowLearnSkill.value = false;
  ElMessage.info('您放棄了本次學習新技能的機會。');
};

const selectSkill = (skill: any) => {
  if (!playerStore.info.skills) {
    playerStore.info.skills = [];
  }

  // 檢查是否為進化/融合技能
  const evoRule = EVOLUTION_RULES[skill.id];
  if (evoRule) {
    // 進化/融合邏輯
    const index = playerStore.info.skills.findIndex((s: any) => s.id === evoRule.baseSkillId);
    if (index > -1) {
      // 1. 替換基礎技能
      playerStore.info.skills[index] = skill;

      // 2. 如果是融合，一併從技能欄中清除
      if (evoRule.fuseSkillIds) {
        playerStore.info.skills = playerStore.info.skills.filter((s: any) =>
            !evoRule.fuseSkillIds!.includes(s.id)
        );
      }

      // 3. 扣減點數與提示
      playerStore.info.pendingSkillPoints = (playerStore.info.pendingSkillPoints || 1) - 1;
      ElMessage.success(`技能進化！成功獲得：${skill.name}！`);
      isShowLearnSkill.value = false;
    } else {
      ElMessage.error('找不到進化所需的基礎技能，無法學習！');
    }
    return;
  }

  // 常規學習邏輯
  if (playerStore.info.skills.length < 6) {
    // 還有空位，直接學習
    playerStore.info.skills.push(skill);
    playerStore.info.pendingSkillPoints = (playerStore.info.pendingSkillPoints || 1) - 1;
    ElMessage.success(`學會了新技能：${skill.name}！`);
    isShowLearnSkill.value = false;
  } else {
    // 欄位已滿，進入替換模式
    selectedNewSkill.value = skill;
    replaceMode.value = true;
  }
};

const confirmReplacement = (oldSkillId: string) => {
  if (!selectedNewSkill.value) return;

  const oldSkill = playerStore.info.skills.find((s: any) => s.id === oldSkillId);
  const oldName = oldSkill ? oldSkill.name : oldSkillId;

  const index = playerStore.info.skills.findIndex((s: any) => s.id === oldSkillId);
  if (index > -1) {
    playerStore.info.skills[index] = selectedNewSkill.value;
    playerStore.info.pendingSkillPoints = (playerStore.info.pendingSkillPoints || 1) - 1;
    ElMessage.success(`學會了新技能：${selectedNewSkill.value.name}，並替換了：${oldName}！`);
  }

  isShowLearnSkill.value = false;
  replaceMode.value = false;
  selectedNewSkill.value = null;
};

const cancelReplaceMode = () => {
  replaceMode.value = false;
  selectedNewSkill.value = null;
};
</script>

<template>
  <!-- 學習新技能 Dialog -->
  <el-dialog
      v-if="isShowLearnSkill"
      v-model="isShowLearnSkill"
      title="🔮學習新技能"
      width="620px"
      append-to-body
      top="5vh"
      class="learn-skill-dialog-wrapper"
      :close-on-click-modal="false"
      :show-close="false"
  >
    <div class="learn-skill-container">
      <div v-if="!replaceMode" class="learn-intro">
        請從以下三個隨機技能中選擇一個學習：
      </div>
      <div v-else class="learn-intro warn">
        ⚠️ 技能欄位已滿！請點擊下方的<strong>現有技能</strong>，將其替換為 <strong>{{ selectedNewSkill?.name }}</strong>：
      </div>

      <!-- 候選技能列表 -->
      <template v-if="!replaceMode">
        <div class="drawn-skills-grid">
          <div
              v-for="skill in drawnSkills"
              :key="skill.id"
              class="drawn-skill-card"
              :style="{ '--rarity-color': getRarityColor(skill.rarity) }"
              @click="selectSkill(skill)"
          >
            <div class="rarity-tag"
                 :style="{ borderColor: getRarityColor(skill.rarity), color: getRarityColor(skill.rarity) }">
              {{ getRarityName(skill.rarity) }}
            </div>
            <div class="card-icon">
              <img v-if="isImageIcon(skill.icon)" :src="resolveIconPath(skill.icon)" class="skill-image-icon"
                   alt="skill icon"/>
              <template v-else>{{ skill.icon }}</template>
            </div>
            <div class="card-name">{{ skill.name }}</div>
            <div class="card-type">{{ skill.type === 'active' ? '主動' : '被動' }}</div>
            <div v-if="getEvolutionText(skill.id)" class="card-evo-info">
              {{ getEvolutionText(skill.id) }}
            </div>
            <div class="card-desc" v-html="skill.description(playerStore)"/>
          </div>
        </div>
        <!-- 延伸顯示目前玩家有的技能 -->
        <div v-if="isShowOwnedSkillsInDialog" class="owned-skills-extend-section"
             style="margin-top: 20px; border-top: 1px dashed rgba(255,255,255,0.15); padding-top: 15px; width: 100%;">
          <div v-if="playerStore.info.skills && playerStore.info.skills.length > 0" class="skills-to-replace-list"
               style="max-height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
            <div
                v-for="skill in playerStore.info.skills"
                :key="skill.id"
                class="replace-item-row"
                style="cursor: default; display: flex; align-items: center; padding: 8px 12px; background: rgba(255,255,255,0.02); border-radius: 6px;"
            >
            <span class="replace-icon"
                  style="margin-right: 10px; font-size: 1.2rem; display: flex; align-items: center;">
              <img v-if="isImageIcon(skill.icon)" :src="resolveIconPath(skill.icon)" class="skill-image-icon-small"
                   alt="skill icon" style="width: 20px; height: 20px;"/>
              <template v-else>{{ skill.icon }}</template>
            </span>
              <div class="replace-meta" style="display: flex; flex-direction: column; width: 120px; flex-shrink: 0;">
              <span class="replace-name" style="font-weight: bold; font-size: 0.85rem; color: #fff;">
                {{ skill.name }}
                <template v-if="skill.proficiencyGain"> ({{ skill.proficiencyText }})</template>
              </span>
                <span class="replace-type"
                      style="font-size: 0.75rem; color: #888;">{{ skill.type === 'active' ? '主動' : '被動' }}</span>
              </div>
              <span class="replace-rarity"
                    :style="{ color: getRarityColor(skill.rarity), width: '60px', fontSize: '0.8rem', flexShrink: 0 }">
              {{ getRarityName(skill.rarity) }}
            </span>
              <div class="owned-skill-desc-small"
                   style="font-size: 0.75rem; color: #bbb; flex: 1; text-align: left; padding-left: 10px; line-height: 1.3;"
                   v-html="skill.description(playerStore)"></div>
            </div>
          </div>
          <div v-else style="text-align: center; color: #888; padding: 10px; font-size: 0.85rem;">
            目前尚未擁有任何技能
          </div>
        </div>
      </template>
      <!-- 選擇不學習技能按鈕 -->
      <div v-if="!replaceMode" class="learn-actions" style="gap: 15px;">
        <el-button type="primary" class="view-owned-skills-btn"
                   @click="isShowOwnedSkillsInDialog = !isShowOwnedSkillsInDialog" round plain>
          {{ isShowOwnedSkillsInDialog ? '隱藏現有技能' : '查看現有技能' }}
        </el-button>
        <el-button type="info" class="skip-learn-btn" @click="skipLearn" round plain>
          不學習技能
        </el-button>
      </div>
      <!-- 替換模式：顯示玩家現有的 6 個技能 -->
      <div v-else class="replacement-skills-grid">
        <div class="selected-new-skill-preview">
          新學習技能:
          <span class="preview-badge"
                :style="{ color: getRarityColor(selectedNewSkill?.rarity), borderColor: getRarityColor(selectedNewSkill?.rarity) }">
            <img v-if="isImageIcon(selectedNewSkill?.icon)" :src="resolveIconPath(selectedNewSkill?.icon)"
                 class="skill-image-icon-small" alt="skill icon"/>
            <template v-else>{{ selectedNewSkill?.icon }}</template>
            {{ selectedNewSkill?.name }}
          </span>
        </div>

        <div class="skills-to-replace-list">
          <div
              v-for="skill in playerStore.info.skills"
              :key="skill.id"
              class="replace-item-row"
          >
            <span class="replace-icon">
              <img v-if="isImageIcon(skill.icon)" :src="resolveIconPath(skill.icon)" class="skill-image-icon-small"
                   alt="skill icon"/>
              <template v-else>{{ skill.icon }}</template>
            </span>
            <div class="replace-meta">
              <span class="replace-name">
                {{ skill.name }}
                <template v-if="skill.proficiencyGain"> ({{ skill.proficiencyText }})</template>
              </span>
              <span class="replace-type">{{ skill.type === 'active' ? '主動' : '被動' }}</span>
            </div>
            <span class="replace-rarity" :style="{ color: getRarityColor(skill.rarity) }">
              {{ getRarityName(skill.rarity) }}
            </span>
            <el-button type="danger" size="small" class="replace-btn-trigger" plain
                       @click="confirmReplacement(skill.id)">
              替換此技能
            </el-button>
          </div>
        </div>

        <div class="replace-footer">
          <el-button type="info" class="cancel-replace-btn" @click="cancelReplaceMode">返回選擇</el-button>
        </div>
      </div>


    </div>
  </el-dialog>
</template>

<style scoped>
/* 學習技能對話框 */
.learn-skill-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.learn-intro {
  font-size: 1rem;
  color: #ccc;
  margin-bottom: 20px;
  text-align: center;
}

.learn-intro.warn {
  color: #e6a23c;
  background: rgba(230, 162, 60, 0.1);
  padding: 8px 16px;
  border-radius: 4px;
  border-left: 4px solid #e6a23c;
}

/* 隨機抽技能卡片 */
.drawn-skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  width: 100%;
}

@media (max-width: 600px) {
  .drawn-skills-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.drawn-skill-card {
  position: relative;
  background: #181818;
  border: 2px solid var(--rarity-color);
  border-radius: 12px;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
}

.drawn-skill-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.8), 0 0 15px var(--rarity-color);
  background: #202020;
}

.rarity-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 0.65rem;
  font-weight: bold;
  border: 1px solid;
  padding: 1px 6px;
  border-radius: 4px;
  text-transform: uppercase;
}

.card-icon {
  font-size: 3rem;
  margin-top: 10px;
  margin-bottom: 10px;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.5));
  display: flex;
  justify-content: center;
  align-items: center;
}

.skill-image-icon {
  width: 3rem;
  height: 3rem;
  object-fit: contain;
  image-rendering: pixelated;
  display: inline-block;
}

.skill-image-icon-small {
  width: 1.25rem;
  height: 1.25rem;
  object-fit: contain;
  image-rendering: pixelated;
  display: inline-block;
  vertical-align: middle;
}

.card-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 4px;
}

.card-type {
  font-size: 0.75rem;
  color: #888;
  margin-bottom: 8px;
}

.card-evo-info {
  font-size: 0.7rem;
  color: #f1c40f;
  background: rgba(241, 196, 15, 0.1);
  border: 1px solid rgba(241, 196, 15, 0.3);
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 12px;
  font-weight: 500;
  display: inline-block;
}

.card-desc {
  font-size: 0.8rem;
  line-height: 1.4;
  color: #bbb;
  border-top: 1px solid #2d2d2d;
  padding-top: 10px;
  width: 100%;
  flex-grow: 1;
}

/* 替換模式樣式 */
.replacement-skills-grid {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.selected-new-skill-preview {
  font-size: 1.05rem;
  color: #fff;
  background: #252525;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
}

.preview-badge {
  font-weight: bold;
  padding: 2px 8px;
  margin-left: 6px;
}

.skills-to-replace-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.replace-item-row {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 6px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.replace-item-row:hover {
  background: #282828;
  border-color: #f56c6c;
}

.replace-icon {
  font-size: 1.5rem;
  margin-right: 15px;
  width: 1.5rem;
  text-align: center;
}

.replace-meta {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  text-align: left;
}

.replace-name {
  font-weight: bold;
  font-size: 0.95rem;
  color: #fff;
}

.replace-type {
  font-size: 0.75rem;
  color: #888;
  margin-top: 2px;
}

.replace-rarity {
  font-size: 0.85rem;
  font-weight: bold;
  margin-right: 20px;
}

.replace-btn-trigger {
  opacity: 0.8;
}

.replace-item-row:hover .replace-btn-trigger {
  opacity: 1;
}

.replace-footer {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.cancel-replace-btn {
  width: 150px;
}

.learn-actions {
  display: flex;
  justify-content: center;
  margin-top: 25px;
  width: 100%;
}

.skip-learn-btn {
  width: 180px;
  font-weight: bold;
}

.view-owned-skills-btn {
  width: 180px;
  font-weight: bold;
}
</style>

<style>
/* 針對移動端 dialog 寬度優化 */
.learn-skill-dialog-wrapper {
  --el-dialog-width: 620px;
}

@media (max-width: 768px) {
  .learn-skill-dialog-wrapper {
    --el-dialog-width: 95% !important;
  }
}
</style>
