<script setup lang="ts">
import {computed, nextTick, ref, watch} from "vue";
import {getEnumColumn} from "@/utils/enum";
import {QualityEnum} from "@/enums/quality-enum";
import {EquipmentEnum, StatEnum} from "@/enums/enums";
import {usePlayerStore} from "@/store/player-store";
import {useGameStateStore} from "@/store/game-state-store";
import {ItemInfo} from "@/components/Shared/itemInfo";
import {ElMessage} from "element-plus";
import {useDraggable} from "@/components/DetailInfo/useDraggble";
import type {Equipment} from "@/types";
import {CharEnum} from "@/enums/char-enum";
import {createDoubleTapHandler} from "@/utils/touch";
import {SkillModel} from "@/models/skill-model";
import {SKILL_TEMPLATES, SkillFactory, EVOLUTION_RULES} from "@/constants/skill/learned-skill";
import {useTrackerStore} from "@/store/track-store";
import {isImageIcon, resolveIconPath} from "@/utils/ui-helper";


const playerStore = usePlayerStore();

/**
 * 拖曳圖示功能
 */
const fabRef = ref<HTMLElement | null>(null);
const isShowStats = ref(false);
const {position, isDragging, isSnapping, handleStart} = useDraggable(fabRef, {
  onSelect: () => isShowStats.value = true
});


/**
 * 裝備背景顏色計算 (統一調淡)
 */
const getBackgroundColor = (slotKey: string) => {
  const equips = playerStore.info?.equips;
  if (!equips || !equips[slotKey as keyof typeof equips]) {
    return "rgba(255, 255, 255, 0.01)";
  }
  const quality = equips[slotKey as keyof typeof equips]?.quality;
  return getEnumColumn(QualityEnum, quality, 'color', '#ffffff')
};

/**
 * 脫下裝備邏輯
 */
const handleUnequip = (slotKey: keyof Equipment) => {
  playerStore.equipItem(null, null, slotKey)
  // 如果在戰鬥中，自動關閉狀態彈窗以顯示受傷
  const gameStateStore = useGameStateStore();
  const inBattle = gameStateStore.currentEnemy.length > 0 &&
      !gameStateStore.isBattleWon &&
      !gameStateStore.isDead;
  if (inBattle) {
    isShowStats.value = false;
  }
};
const onTouchUnequip = createDoubleTapHandler((slotKey: keyof Equipment) => {
  handleUnequip(slotKey);
}, 350)

const isUpgradeable = (statValue: string) => {
  return ['hp', 'sp', 'ad', 'ap', 'hit', 'dodge'].includes(statValue);
};

const availableUpgradeStat = computed(() => Object.values(StatEnum).filter((stat) => isUpgradeable(stat.value)))
const otherUpgradeStat = computed(() => Object.values(StatEnum).filter((stat) => !isUpgradeable(stat.value)))
const showOther = ref(false);
const allocatePoint = (statValue: string) => {
  let targetKey = statValue;
  if (statValue === 'hp') targetKey = 'hpLimit';
  if (statValue === 'sp') targetKey = 'spLimit';
  playerStore.allocateStatPoint(targetKey as any);
};

/**
 * 學習新技能與技能管理邏輯
 */
const isShowLearnSkill = ref(false);
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

const openLearnSkill = () => {
  const currentSkillIds = playerStore.info.skills ? playerStore.info.skills.map((s: any) => s.id) : [];
  const trackerStore = useTrackerStore();

  const candidates = Object.keys(SKILL_TEMPLATES).filter(id => {
    // 1. 玩家不能已經擁有此技能
    if (currentSkillIds.includes(id)) return false;

    // 2. 玩家不能已經擁有此技能的進化後版本 (例如有了 SwordExpert 就不能再抽 SwordProficiency)
    const hasEvolvedVersion = Object.values(EVOLUTION_RULES).some(rule =>
        (rule.baseSkillId === id || rule.fuseSkillIds?.includes(id)) &&
        currentSkillIds.includes(rule.evolvedSkillId)
    );
    if (hasEvolvedVersion) return false;

    // 3. 檢查可學習條件
    const evoRule = EVOLUTION_RULES[id];
    if (evoRule) {
      // 進化/融合技能：必須滿足解鎖/前置條件
      return evoRule.checkEligible(playerStore, trackerStore);
    } else {
      // 基礎技能：目前不能擁有相同[唯一字段]的相關技能
      const skillUniqueFields = SKILL_TEMPLATES[id]?.uniqueFields || [];
      if (skillUniqueFields.length > 0) {
        const hasOverlap = playerStore.info.skills?.some(currSkill => {
          const currFields = currSkill.uniqueFields || [];
          return currFields.some(f => skillUniqueFields.includes(f));
        });
        if (hasOverlap) return false;
      }
      return true;
    }
  });

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

      // 2. 如果是融合（有額外需要移除的技能，如橫擊與刺擊），一併從技能欄中清除
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
  <div
      ref="fabRef"
      class="floating-bag"
      :class="{ 
        'is-snapping': isSnapping,
        'has-points': (playerStore.info.statPoints && playerStore.info.statPoints > 0) || (playerStore.info.pendingSkillPoints && playerStore.info.pendingSkillPoints > 0)
      }"
      :style="{
      left: `${position.x}px`,
      top: `${position.y}px`
    }"
      @mousedown.stop="handleStart"
      @touchstart.stop="handleStart"
  >
    <el-progress type="circle" :percentage="playerStore.currentExpPercentage">
      <template #default>
        <span style="font-size: 0.6rem;font-weight: bold">Lv.</span>
        <span style="font-size: 1rem;font-weight: bold">{{ playerStore.info.level }}</span>
      </template>
    </el-progress>
    <!-- 升級提示標章 -->
    <div
        v-if="(playerStore.info.statPoints && playerStore.info.statPoints > 0) || (playerStore.info.pendingSkillPoints && playerStore.info.pendingSkillPoints > 0)"
        class="upgrade-badge"
    >
      !
    </div>
  </div>
  <el-dialog
      v-model="isShowStats"
      class="user-detail"
      append-to-body
      top="5vh"
  >
    <template #title>
      <div class="flex items-center">
        <span>
        角色狀態 ({{ getEnumColumn(CharEnum, playerStore.info.char) }})
      </span>
        <div v-if="playerStore.info.statPoints && playerStore.info.statPoints > 0" class="stat-points-banner">
          <span>有 <strong>{{ playerStore.info.statPoints }}</strong> 點未分配的屬性點</span>
        </div>
      </div>

    </template>
    <div class="stats-container">

      <div class="main-stats-grid">
        <div v-for="stat in availableUpgradeStat" :key="stat.value" class="stat-item">
          <div class="stat-info">
            {{ stat.icon }} {{ stat.label }}:
            <template v-if="(stat as any)?.maxKey">
              {{ playerStore.finalStats[stat.value] }} / {{ playerStore.info[(stat as any).maxKey] }}
              <span
                  v-if="playerStore.totalBonus[(stat as any).maxKey]"
                  class="stat-bonus"
                  :class="{ 'is-positive': playerStore.totalBonus[(stat as any).maxKey] > 0, 'is-negative': playerStore.totalBonus[(stat as any).maxKey] < 0 }"
              >
                ({{
                  playerStore.totalBonus[(stat as any).maxKey] > 0 ? '+' : ''
                }}{{ playerStore.totalBonus[(stat as any).maxKey] }})
              </span>
            </template>
            <template v-else>
              {{ playerStore.info[stat.value] || 0 }}{{ stat.unit }}
              <span
                  v-if="playerStore.totalBonus[stat.value]"
                  class="stat-bonus"
                  :class="{ 'is-positive': playerStore.totalBonus[stat.value] > 0, 'is-negative': playerStore.totalBonus[stat.value] < 0 }"
              >
                ({{ playerStore.totalBonus[stat.value] > 0 ? '+' : '' }}{{
                  playerStore.totalBonus[stat.value]
                }}{{ stat.unit }})
              </span>
            </template>
          </div>
          <el-button
              v-if="playerStore.info.statPoints && playerStore.info.statPoints > 0"
              size="small"
              type="warning"
              circle
              class="upgrade-btn"
              @click="allocatePoint(stat.value)"
          >
            +
          </el-button>
        </div>
      </div>
      <div v-if="showOther" class="other-stats-grid">
        <div v-for="stat in otherUpgradeStat" :key="stat.value" class="stat-item">
          <div class="stat-info">
            {{ stat.icon }} {{ stat.label }}:
            <template v-if="(stat as any)?.maxKey">
              {{ playerStore.finalStats[stat.value] }} / {{ playerStore.info[(stat as any).maxKey] }}
              <span
                  v-if="playerStore.totalBonus[(stat as any).maxKey]"
                  class="stat-bonus"
                  :class="{ 'is-positive': playerStore.totalBonus[(stat as any).maxKey] > 0, 'is-negative': playerStore.totalBonus[(stat as any).maxKey] < 0 }"
              >
                ({{
                  playerStore.totalBonus[(stat as any).maxKey] > 0 ? '+' : ''
                }}{{ playerStore.totalBonus[(stat as any).maxKey] }})
              </span>
            </template>
            <template v-else>
              {{ playerStore.info[stat.value] || 0 }}{{ stat.unit }}
              <span
                  v-if="playerStore.totalBonus[stat.value]"
                  class="stat-bonus"
                  :class="{ 'is-positive': playerStore.totalBonus[stat.value] > 0, 'is-negative': playerStore.totalBonus[stat.value] < 0 }"
              >
                ({{ playerStore.totalBonus[stat.value] > 0 ? '+' : '' }}{{
                  playerStore.totalBonus[stat.value]
                }}{{ stat.unit }})
              </span>
            </template>
          </div>
        </div>
      </div>
      <el-button
          type="primary"
          plain
          style="width: 100%;height: 1.5rem"
          @click="()=>{
        showOther = !showOther
      }
">
        其他數據
      </el-button>
      <el-divider>當前裝備</el-divider>

      <div class="equipment-slots">
        <div
            v-for="pos in EquipmentEnum"
            class="equip-slot"
            :style="{ borderColor: getBackgroundColor(pos.value) }"
            @dblclick="handleUnequip(pos.value)"
            @touchend="onTouchUnequip(pos.value)"
        >
          <el-tooltip
              v-if="playerStore.info.equips?.[pos.value as keyof typeof playerStore.info.equips]"
              effect="light"
              :disabled="isDragging"
          >
            <template #content>
              <ItemInfo :item="playerStore.info.equips[pos.value as keyof typeof playerStore.info.equips]"/>
              <div style="font-size: 0.8rem; color: #999; text-align: center; margin-top: 5px;min-width: 10rem">
                ( 雙擊卸下裝備 )
              </div>
            </template>
            <span class="equip-item-icon">
                {{ playerStore.info.equips[pos.value as keyof typeof playerStore.info.equips]?.icon }}
              </span>
          </el-tooltip>
          <span v-else class="equip-placeholder-icon">
            <template v-if="pos.value ==='offhand' && playerStore.info.equips?.weapon?.isTwoHanded">
              🚫
            </template>
            <template v-else>
               {{ pos.icon }}
            </template>
          </span>
        </div>
      </div>

      <el-divider>技能欄位</el-divider>

      <div class="skills-section">
        <div class="skills-grid">
          <div v-for="i in 6" :key="i" class="skill-slot-card">
            <template v-if="playerStore.info.skills?.[i-1]">
              <el-tooltip placement="top" effect="light" :disabled="isDragging">
                <template #content>
                  <div class="skill-detail-tooltip">
                    <div class="tooltip-header">
                      <strong class="tooltip-name">{{ playerStore.info.skills[i - 1].name }}</strong>
                      <span class="skill-tooltip-rarity"
                            :style="{ color: getRarityColor(playerStore.info.skills[i-1].rarity) }">
                        [{{ getRarityName(playerStore.info.skills[i - 1].rarity) }}]
                      </span>
                    </div>
                    <div class="skill-tooltip-type">
                      類型: {{ playerStore.info.skills[i - 1].type === 'active' ? '主動技能' : '被動技能' }}
                    </div>
                    <div v-if="playerStore.info.skills[i - 1].type === 'active'" class="skill-tooltip-proficiency">
                      {{ playerStore.info.skills[i - 1].proficiencyText }}
                    </div>
                    <div class="skill-tooltip-desc" v-html="playerStore.info.skills[i-1].description(playerStore)"/>
                  </div>
                </template>
                <div class="skill-slot-inner"
                     :style="{ borderColor: getRarityColor(playerStore.info.skills[i-1].rarity) }">
                  <span class="skill-slot-icon">
                    <img v-if="isImageIcon(playerStore.info.skills[i - 1].icon)"
                         :src="resolveIconPath(playerStore.info.skills[i - 1].icon)" class="skill-slot-image-icon"
                         alt="skill icon"/>
                    <template v-else>{{ playerStore.info.skills[i - 1].icon }}</template>
                  </span>
                  <div class="skill-slot-info">
                    <span class="skill-slot-name">{{ playerStore.info.skills[i - 1].name }}</span>
                    <span v-if="playerStore.info.skills[i - 1].type === 'active'" class="skill-slot-level">
                      {{ playerStore.info.skills[i - 1].proficiencyText }}
                    </span>
                  </div>
                </div>
              </el-tooltip>
            </template>
            <template v-else>
              <div class="skill-slot-inner empty">
                <span class="skill-slot-placeholder">🔒 空置槽位</span>
              </div>
            </template>
          </div>
        </div>
      </div>

    </div>
  </el-dialog>

  <!-- 學習新技能 Dialog -->
  <el-dialog
      v-model="isShowLearnSkill"
      title="🔮 獲得新的感悟：學習新技能"
      width="620px"
      append-to-body
      top="5vh"
      custom-class="learn-skill-dialog"
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
      <div v-if="!replaceMode" class="drawn-skills-grid">
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

      <!-- 選擇不學習技能按鈕 -->
      <div v-if="!replaceMode" class="learn-actions">
        <el-button type="info" class="skip-learn-btn" @click="skipLearn" round plain>
          不學習技能
        </el-button>
      </div>

      <!-- 替換模式：顯示玩家現有的 6 個技能 -->
      <div v-else class="replacement-skills-grid">
        <div class="selected-new-skill-preview">
          新學習技能:
          <span class="preview-badge"
                :style="{ color: getRarityColor(selectedNewSkill.rarity), borderColor: getRarityColor(selectedNewSkill.rarity) }">
            <img v-if="isImageIcon(selectedNewSkill.icon)" :src="resolveIconPath(selectedNewSkill.icon)"
                 class="skill-image-icon-small" alt="skill icon"/>
            <template v-else>{{ selectedNewSkill.icon }}</template>
            {{ selectedNewSkill.name }}
          </span>
        </div>

        <div class="skills-to-replace-list">
          <div
              v-for="skill in playerStore.info.skills"
              :key="skill.id"
              class="replace-item-row"
              @click="confirmReplacement(skill.id)"
          >
            <span class="replace-icon">
              <img v-if="isImageIcon(skill.icon)" :src="resolveIconPath(skill.icon)" class="skill-image-icon-small"
                   alt="skill icon"/>
              <template v-else>{{ skill.icon }}</template>
            </span>
            <div class="replace-meta">
              <span class="replace-name">
                {{ skill.name }}
                <template v-if="skill.type === 'active'"> ({{ skill.proficiencyText }})</template>
              </span>
              <span class="replace-type">{{ skill.type === 'active' ? '主動' : '被動' }}</span>
            </div>
            <span class="replace-rarity" :style="{ color: getRarityColor(skill.rarity) }">
              {{ getRarityName(skill.rarity) }}
            </span>
            <el-button type="danger" size="small" class="replace-btn-trigger" plain>替換此技能</el-button>
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
:root {
  --rarity-color: ''
}

.floating-bag {
  position: absolute;
  width: 54px;
  height: 54px;
  background: #2c3e50;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
  z-index: 2000;
  user-select: none;
  /* 重要：禁用預設觸控行為，解決 Intervention 報錯 */
  touch-action: none;
  transition: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

/* 升級發光與驚嘆號小紅點樣式 */
.floating-bag.has-points {
  animation: bag-glow 2s infinite ease-in-out;
}

@keyframes bag-glow {
  0%, 100% {
    box-shadow: 0 0 8px rgba(230, 162, 60, 0.4), 0 4px 10px rgba(0, 0, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(230, 162, 60, 0.8), 0 4px 10px rgba(0, 0, 0, 0.3);
  }
}

.floating-bag .upgrade-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  background: #f56c6c;
  color: white;
  border-radius: 50%;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 8px rgba(245, 108, 108, 0.8);
  animation: badge-pulse 1.5s infinite ease-in-out;
}

@keyframes badge-pulse {
  0% {
    transform: scale(0.9);
    box-shadow: 0 0 0 0 rgba(245, 108, 108, 0.7);
  }
  70% {
    transform: scale(1.1);
    box-shadow: 0 0 0 6px rgba(245, 108, 108, 0);
  }
  100% {
    transform: scale(0.9);
    box-shadow: 0 0 0 0 rgba(245, 108, 108, 0);
  }
}

:deep(.el-progress-circle) {
  height: 55px !important;
  width: 55px !important;
}

/* 只有在貼邊狀態時才啟用平滑動畫 */
.floating-bag.is-snapping {
  transition: left 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.floating-bag:active {
  cursor: grabbing;
}

.icon-inner {
  font-size: 1.8rem;
}

/* 彈窗樣式 */
.main-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding-bottom: 12px;
}

.other-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 12px;
  padding-bottom: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  font-size: 0.95rem;
  border-left: 3px solid #e6a23c;
}

.stat-info {
  flex-grow: 1;
}

.upgrade-btn {
  margin-left: 8px;
  font-weight: bold;
}

.stat-points-banner {
  background: rgba(230, 162, 60, 0.15);
  border: 1px dashed #e6a23c;
  margin-left: 1rem;
  padding-right: 1rem;
  padding-left: 1rem;
  border-radius: 6px;
  text-align: center;
  font-size: 0.95rem;
  color: #e6a23c;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 10px rgba(230, 162, 60, 0.2);
  }
  100% {
    opacity: 0.8;
  }
}

.equipment-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-around;
  padding: 5px 2px;
  margin-top: 10px;
  width: 100%;
  box-sizing: border-box;
}

.equip-slot {
  flex: 1 0 calc(16.66% - 12px);
  min-width: 48px;
  max-width: 65px;
  height: 58px;
  background: #1a1a1a;
  border: 2px solid #444;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: transform 0.2s;
}

.stat-bonus {
  font-size: 0.85rem;
  font-weight: bold;
  margin-left: 4px;
}

.stat-bonus.is-positive {
  color: #67c23a;
}

.stat-bonus.is-negative {
  color: #f56c6c;
}

.equip-item-icon {
  font-size: 1.8rem;
  cursor: pointer;
}

.equip-placeholder-icon {
  font-size: 1.6rem;
  opacity: 0.2;
}

/* 技能欄位樣式 */
.skills-section {
  width: 100%;
  margin-top: 10px;
  box-sizing: border-box;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;
}

@media (max-width: 480px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }
}

.skill-slot-card {
  width: 100%;
}

.skill-slot-inner {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #1a1a1a;
  border: 1.5px solid #444;
  border-radius: 8px;
  height: 50px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.2s ease;
}

.skill-slot-inner:hover {
  background: #252525;
  transform: translateY(-2px);
}

.skill-slot-inner.empty {
  border-style: dashed;
  border-color: #333;
  background: transparent;
  cursor: default;
}

.skill-slot-inner.empty:hover {
  transform: none;
  background: transparent;
}

.skill-slot-icon {
  font-size: 1.5rem;
  margin-right: 10px;
}

.skill-slot-image-icon {
  width: 1.5rem;
  height: 1.5rem;
  object-fit: contain;
  image-rendering: pixelated;
  display: inline-block;
  vertical-align: middle;
}

.skill-slot-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.skill-slot-name {
  font-weight: bold;
  font-size: 0.9rem;
  color: #fff;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 130px;
}

.skill-slot-level {
  font-size: 0.75rem;
  color: #888;
}

.skill-slot-placeholder {
  font-size: 0.85rem;
  color: #444;
}

.learn-skill-banner {
  display: flex;
  justify-content: center;
  margin-top: 15px;
  width: 100%;
}

.learn-skill-btn {
  width: 90%;
  font-weight: bold;
  letter-spacing: 1px;
  box-shadow: 0 0 10px rgba(103, 194, 58, 0.4);
  animation: pulse-green 2s infinite ease-in-out;
}

@keyframes pulse-green {
  0%, 100% {
    box-shadow: 0 0 8px rgba(103, 194, 58, 0.4);
  }
  50% {
    box-shadow: 0 0 18px rgba(103, 194, 58, 0.8);
  }
}

/* 技能 Tooltip */
.skill-detail-tooltip {
  padding: 5px;
  max-width: 250px;
}

.tooltip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #555;
  padding-bottom: 4px;
  margin-bottom: 4px;
}

.tooltip-name {
  font-size: 0.95rem;
}

.skill-tooltip-rarity {
  font-size: 0.75rem;
  font-weight: bold;
}

.skill-tooltip-type {
  font-size: 0.75rem;
  color: #aaa;
  margin-bottom: 4px;
}

.skill-tooltip-desc {
  font-size: 0.8rem;
  line-height: 1.4;
  color: #ddd;
}

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
  border: 1px solid;
  padding: 2px 8px;
  border-radius: 6px;
  margin-left: 6px;
}

.skills-to-replace-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.replace-item-row {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.replace-item-row:hover {
  background: #282828;
  border-color: #f56c6c;
}

.replace-icon {
  font-size: 1.6rem;
  margin-right: 12px;
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
  font-size: 0.7rem;
  color: #888;
}

.replace-rarity {
  font-size: 0.8rem;
  font-weight: bold;
  margin-right: 15px;
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
</style>
<style>
/* 針對移動端 dialog 寬度優化 */
.user-detail {
  --el-dialog-width: 32rem;
}

@media (max-width: 768px) {
  .user-detail {
    --el-dialog-width: 95%;
  }
}
</style>