<script setup lang="ts">
import {computed, ref} from "vue";
import {getEnumColumn} from "@/utils/enum";
import {QualityEnum} from "@/enums/quality-enum";
import {EquipmentEnum, StatEnum} from "@/enums/enums";
import {usePlayerStore} from "@/store/player-store";
import {useGameStateStore} from "@/store/game-state-store";
import {ItemInfo} from "@/components/Shared/itemInfo";
import {useDraggable} from "@/components/DetailInfo/useDraggble";
import type {Equipment} from "@/types";
import {CharEnum} from "@/enums/char-enum";
import {createDoubleTapHandler} from "@/utils/touch";
import LearnSkillDialog from "./LearnSkillDialog.vue";
import {isImageIcon, resolveIconPath} from "@/utils/ui-helper";


const playerStore = usePlayerStore();
const gameStateStore = useGameStateStore();

/**
 * 拖曳圖示功能
 */
const fabRef = ref<HTMLElement | null>(null);
const isShowStats = computed({
  get: () => gameStateStore.isShowStats,
  set: (val) => { gameStateStore.isShowStats = val; }
});
const {position, isDragging, isSnapping, handleStart} = useDraggable(fabRef, {
  onSelect: () => { gameStateStore.isShowStats = true; }
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
 * 技能稀有度樣式與名稱
 */
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
      <div class="stats-layout-row">
        <!-- 左側：角色頭像與經驗條 -->
        <div class="avatar-and-exp-container" v-if="playerStore.info.char">
          <div class="char-avatar-showcase">
            <img :src="resolveIconPath(getEnumColumn(CharEnum, playerStore.info.char, 'avatar')) + '?v=2'" class="char-avatar-img" alt="avatar" />
          </div>
          <div class="exp-bar-wrapper">
            <div class="exp-label">EXP: {{ playerStore.info.currentExp }} / {{ playerStore.nextLevelExp }}</div>
            <el-progress 
              :percentage="playerStore.currentExpPercentage" 
              :show-text="false"
              stroke-width="8"
              status="success"
            />
          </div>
        </div>

        <!-- 右側：素質資料 -->
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
          <div v-for="skill in playerStore.info.skills" :key="skill.id" class="skill-slot-card">
            <template v-if="skill">
              <el-tooltip placement="top" effect="light" :disabled="isDragging">
                <template #content>
                  <div class="skill-detail-tooltip">
                    <div class="tooltip-header">
                      <strong class="tooltip-name">{{ skill.name }}</strong>
                      <span class="skill-tooltip-rarity"
                            :style="{ color: getRarityColor(skill.rarity) }">
                        [{{ getRarityName(skill.rarity) }}]
                      </span>
                    </div>
                    <div class="skill-tooltip-type">
                      類型: {{ skill.type === 'active' ? '主動技能' : '被動技能' }}
                    </div>
                    <div v-if="skill.proficiencyGain" class="skill-tooltip-proficiency">
                      {{ skill.proficiencyText }}
                    </div>
                    <div class="skill-tooltip-desc" v-html="skill.description(playerStore)"/>
                  </div>
                </template>
                <div class="skill-slot-inner"
                     :style="{ borderColor: getRarityColor(skill.rarity) }">
                  <span class="skill-slot-icon">
                    <img v-if="isImageIcon(skill.icon)"
                         :src="resolveIconPath(skill.icon)" class="skill-slot-image-icon"
                         alt="skill icon"/>
                    <template v-else>{{ skill.icon }}</template>
                  </span>
                  <div class="skill-slot-info">
                    <span class="skill-slot-name">{{ skill.name }}</span>
                    <span v-if="skill.proficiencyGain" class="skill-slot-level">
                      {{ skill.proficiencyText }}
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
  <LearnSkillDialog />
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
  flex-grow: 1;
}

.other-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 12px;
  padding-bottom: 12px;
}

.stats-layout-row {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 1.5rem;
}

.char-avatar-showcase {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
  padding: 15px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.char-avatar-img {
  width: 96px;
  height: 96px;
  object-fit: contain;
  image-rendering: pixelated;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.3));
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

.avatar-and-exp-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  width: 126px;
}

.exp-bar-wrapper {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  padding: 6px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
}

.exp-label {
  font-size: 0.75rem;
  font-weight: bold;
  color: #e6a23c;
  text-align: center;
  margin-bottom: 4px;
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