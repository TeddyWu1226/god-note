<script setup lang="ts">
import {computed, PropType, ref, watch} from "vue";
import {MonsterModel} from "@/models/monster-model";
import {useEncyclopediaStore} from "@/store/encyclopedia-store";
import {resolveIconPath} from "@/utils/ui-helper";
import {getEnumColumn} from "@/utils/enum";
import {QualityEnum} from "@/enums/quality-enum";
import {StatEnum} from "@/enums/enums";

const props = defineProps({
  monsterList: {type: Array as PropType<MonsterModel[]>, default: () => []},
})

const encyclopediaStore = useEncyclopediaStore()
const isUnlocked = (monsterName: string) => {
  // return true
  return encyclopediaStore.unlockedMonsters.includes(monsterName);
}

// 當前選擇的魔物索引
const selectedIndex = ref<number>(0);

const selectedMonster = computed<MonsterModel | null>(() => {
  if (!props.monsterList || props.monsterList.length === 0) return null;
  if (selectedIndex.value >= props.monsterList.length) return props.monsterList[0];
  return props.monsterList[selectedIndex.value] as MonsterModel;
})

// 當切換關卡標籤，更換 monsterList 時，重設選擇索引為 0
watch(() => props.monsterList, () => {
  selectedIndex.value = 0;
}, {immediate: true});

const getQualityColor = (quality?: number) => {
  return getEnumColumn(QualityEnum, quality, 'color')
}
const isImageIcon = (icon: string) => {
  if (!icon) return false;
  return icon.includes('/') || icon.includes('.') || icon.startsWith('data:image');
};

const monsterStats = Object.values(StatEnum).filter((stat) => {
  return !['apIncrease', 'ap', 'sp', 'spRegen', 'actionValue', 'shieldLimit'].includes(stat.value);
})
</script>

<template>
  <div class="monster-encyclopedia">
    <!-- 左側欄：魔物選擇清單 -->
    <div class="monster-list-container scrollable">
      <div
          v-for="(monster, index) in props.monsterList"
          :key="monster.name || index"
          class="monster-list-item"
          :class="{ active: selectedIndex === index, locked: !isUnlocked(monster.name) }"
          @click="selectedIndex = index"
      >
        <template v-if="isUnlocked(monster.name)">
          <span class="monster-avatar">
            <img v-if="isImageIcon(monster.icon)" :src="resolveIconPath(monster.icon)" class="monster-image-icon"
                 alt="monster icon"/>
            <span v-else class="monster-icon">{{ monster.icon }}</span>
          </span>
          <span class="monster-name">
          {{ monster.name }}
          </span>
        </template>
        <template v-else>
          <span class="monster-avatar">❓</span>
          <span class="monster-name">
          {{ '未知魔物' }}
          </span>
        </template>


      </div>
    </div>

    <!-- 右側欄：魔物詳細資訊面板 -->
    <div class="monster-detail-container">
      <div v-if="!selectedMonster" class="empty-state">
        <div class="empty-icon">📖</div>
        <div>請選擇左側的魔物以查看詳細資訊</div>
      </div>

      <!-- 未解鎖狀態 -->
      <div v-else-if="!isUnlocked(selectedMonster.name)" class="locked-state">
        <div class="lock-graphic">
          <div class="lock-glow"></div>
          <span class="lock-icon">🔒</span>
        </div>
        <h3 class="lock-title">未知魔物</h3>
        <p class="lock-subtitle">此魔物檔案尚未解鎖</p>
        <p class="lock-desc">在冒險中擊敗該魔物即可解鎖完整的屬性、技能以及掉落物資訊。</p>
      </div>

      <!-- 已解鎖狀態 -->
      <div v-else class="unlocked-details">
        <!-- 頭部橫幅區 -->
        <div :class="{'monster-header':true,
  'boss':selectedMonster.class?.includes('boss'),
  'elite':selectedMonster.class?.includes('elite'),
    'mystery':selectedMonster.class?.includes('mystery')
}">
          <div class="avatar-glow-wrapper">
            <div class="avatar-glow"></div>
            <img
                v-if="isImageIcon(selectedMonster.icon)"
                :src="resolveIconPath(selectedMonster.icon)"
                class="avatar-image"
                alt="monster icon"/>
            <span v-else class="avatar-emoji">{{ selectedMonster.icon }}</span>
          </div>
          <div class="header-info">
            <div class="title-row">
              <h2 class="monster-title-name">{{ selectedMonster.name }}</h2>
              <span class="level-tag">Lv.{{ selectedMonster.level }}</span>
            </div>
            <div class="class-tags">
              <span v-if="selectedMonster.class?.includes('boss')" class="class-badge boss">☠️ 首領魔物</span>
              <span v-else-if="selectedMonster.class?.includes('elite')" class="class-badge elite">🔥 菁英魔物</span>
              <span v-else-if="selectedMonster.class?.includes('mystery')" class="class-badge mystery">📜 神話魔物</span>
            </div>
          </div>
        </div>

        <!-- 詳細身體資訊區 (滾動) -->
        <div class="detail-body scrollable">
          <!-- 故事介紹 -->
          <div v-if="selectedMonster.description" class="flavor-block">
            <span class="quote-mark left">“</span>
            <p class="flavor-text">{{ selectedMonster.description }}</p>
            <span class="quote-mark right">”</span>
          </div>

          <!-- 屬性網格 -->
          <div class="section-title-wrap">
            <span class="title-icon">📊</span>
            <span class="title-text">戰鬥屬性</span>
          </div>
          <div class="stats-grid">

            <div class="stat-card" v-for="stat in monsterStats" :key="stat.label">
              <div class="stat-header">
                <span class="stat-icon">{{ stat.icon }}</span>
                <span class="stat-label">{{ stat.label }}</span>
              </div>
              <span class="stat-value">
                {{ selectedMonster[stat.value] }} {{ stat.unit }}
              </span>
            </div>
          </div>

          <!-- 掉落物戰利品 -->
          <div class="section-title-wrap">
            <span class="title-icon">🎁</span>
            <span class="title-text">戰利品掉落</span>
          </div>
          <div class="loot-section">
            <div v-if="selectedMonster.dropGold" class="gold-item">
              <span class="gold-icon">🪙</span>
              <span class="gold-label">基礎掉落金幣：</span>
              <span class="gold-value">~ {{ selectedMonster.dropGold }}</span>
            </div>

            <div v-if="selectedMonster.drop && selectedMonster.drop.length > 0" class="drops-grid">
              <div
                  v-for="(dropItem, dIndex) in selectedMonster.drop"
                  :key="dIndex"
                  class="drop-card"
                  :style="{ borderColor: getQualityColor(dropItem.item?.quality) + '33' }"
              >
                <div class="drop-left">
                  <div class="drop-item-icon-wrap"
                       :style="{ backgroundColor: getQualityColor(dropItem.item?.quality) + '1a' }">
                    <span class="drop-item-icon">{{ dropItem.item?.icon || '📦' }}</span>
                  </div>
                  <div class="drop-details">
                    <span class="drop-name" :style="{ color: getQualityColor(dropItem.item?.quality) }">
                      {{ dropItem.item?.name }}
                    </span>
                    <span class="drop-desc" v-if="dropItem.item?.description">
                      {{ dropItem.item?.description }}
                    </span>
                  </div>
                </div>
                <div class="drop-right">
                  <span class="drop-rate" :style="{ color: getQualityColor(dropItem.item?.quality) }">
                    {{ Math.round(dropItem.chance * 100) }}%
                  </span>
                  <span class="drop-rate-label">機率</span>
                </div>
              </div>
            </div>
            <div v-else-if="!selectedMonster.dropGold" class="no-loot">
              💀 該魔物沒有常規攜帶的任何寶石或金幣戰利品。
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.monster-encyclopedia {
  display: flex;
  gap: 12px;
  height: 460px;
  color: #e0e0e0;
  font-family: inherit;
}

/* 自訂精緻滾動條 */
.scrollable {
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;

    &:hover {
      background: rgba(255, 255, 255, 0.25);
    }
  }
}

/* 左側欄：魔物列表 */
.monster-list-container {
  width: 160px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 4px;
}

.monster-list-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateX(2px);
  }

  &.active {
    background: rgba(64, 158, 255, 0.15);
    border-color: rgba(64, 158, 255, 0.4);
    box-shadow: inset 0 0 8px rgba(64, 158, 255, 0.1);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #409eff;
      border-radius: 0 4px 4px 0;
    }
  }

  &.locked {
    opacity: 0.55;
    background: rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 255, 255, 0.02);

    &:hover {
      opacity: 0.8;
      border-color: rgba(255, 255, 255, 0.1);
    }

    .monster-name {
      color: #8c8c8c;
      font-style: italic;
    }
  }
}

.monster-avatar {
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.monster-name {
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.badge-dot {
  font-size: 0.65rem;
  padding: 1px 4px;
  border-radius: 4px;
  line-height: 1;
  font-weight: bold;

  &.boss {
    background: rgba(245, 108, 108, 0.2);
    color: #f56c6c;
    border: 1px solid rgba(245, 108, 108, 0.3);
  }

  &.elite {
    background: rgba(230, 162, 60, 0.2);
    color: #e6a23c;
    border: 1px solid rgba(230, 162, 60, 0.3);
  }

  &.mystery {
    background: rgba(245, 108, 108, 0.2);
    color: #7307cc;
    border: 1px solid rgba(245, 108, 108, 0.3);
  }
}

/* 右側欄：詳細資訊面板 */
.monster-detail-container {
  flex: 1;
  min-width: 0;
  background: rgba(18, 18, 18, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #7c7c7c;
  font-size: 0.9rem;

  .empty-icon {
    font-size: 2.5rem;
    opacity: 0.5;
  }
}

/* 未解鎖的鎖定面板 */
.locked-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  text-align: center;

  .lock-graphic {
    position: relative;
    width: 64px;
    height: 64px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;

    .lock-icon {
      font-size: 1.8rem;
      z-index: 1;
    }

    .lock-glow {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(140, 140, 140, 0.15) 0%, transparent 70%);
      animation: lockPulse 2s infinite ease-in-out;
    }
  }

  .lock-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #e0e0e0;
    margin: 0 0 4px 0;
  }

  .lock-subtitle {
    font-size: 0.75rem;
    color: #8c8c8c;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0 0 12px 0;
  }

  .lock-desc {
    font-size: 0.8rem;
    color: #6a6a6a;
    max-width: 240px;
    line-height: 1.5;
    margin: 0;
  }
}

@keyframes lockPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.15);
    opacity: 1;
  }
}

/* 已解鎖資訊面 */
.unlocked-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 橫幅樣式 */
.monster-header {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  overflow: hidden;

  // 各種品質/類別的漸層背景
  &.mystery {
    background: linear-gradient(135deg, rgb(41 26 67) 0%, rgba(0, 0, 0, 0) 100%);

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 100px;
      background: radial-gradient(circle, rgb(157 80 239 / 0.08) 0%, transparent 70%);
    }

    .avatar-glow {
      background: radial-gradient(circle, rgb(138 80 239 / 0.4) 0%, transparent 70%);
      animation: pulseBoss 2s infinite ease-in-out;
    }

    .monster-title-name {
      color: #b175e8;
      text-shadow: 0 0 8px rgba(239, 83, 80, 0.3);
    }
  }

  &.boss {
    background: linear-gradient(135deg, rgba(239, 83, 80, 0.12) 0%, rgba(0, 0, 0, 0) 100%);

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 100px;
      background: radial-gradient(circle, rgba(239, 83, 80, 0.08) 0%, transparent 70%);
    }

    .avatar-glow {
      background: radial-gradient(circle, rgba(239, 83, 80, 0.4) 0%, transparent 70%);
      animation: pulseBoss 2s infinite ease-in-out;
    }

    .monster-title-name {
      color: #ff7675;
      text-shadow: 0 0 8px rgba(239, 83, 80, 0.3);
    }
  }

  &.elite {
    background: linear-gradient(135deg, rgba(255, 167, 38, 0.12) 0%, rgba(0, 0, 0, 0) 100%);

    .avatar-glow {
      background: radial-gradient(circle, rgba(255, 167, 38, 0.35) 0%, transparent 70%);
      animation: pulseElite 2s infinite ease-in-out;
    }

    .monster-title-name {
      color: #ffeaa7;
    }
  }

  &.normal {
    background: linear-gradient(135deg, rgba(66, 165, 245, 0.08) 0%, rgba(0, 0, 0, 0) 100%);

    .avatar-glow {
      background: radial-gradient(circle, rgba(66, 165, 245, 0.2) 0%, transparent 70%);
    }
  }
}

.avatar-glow-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.avatar-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  pointer-events: none;
}

@keyframes pulseBoss {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

@keyframes pulseElite {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.08);
  }
}

.avatar-emoji {
  font-size: 1.8rem;
  z-index: 1;
}

.avatar-image {
  height: 2rem;
  width: 2rem;
  z-index: 1;
}

.header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 8px;

  h2 {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 600;
  }
}

.level-tag {
  font-size: 0.75rem;
  padding: 1px 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  color: #a8abb2;
  font-family: monospace;
}

.class-tags {
  display: flex;
  align-items: center;
  gap: 8px;
}

.class-badge {
  font-size: 0.7rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;

  &.mystery {
    background: rgb(199 108 245 / 0.15);
    color: #b175e8;
  }

  &.boss {
    background: rgba(245, 108, 108, 0.15);
    color: #f56c6c;
  }

  &.elite {
    background: rgba(230, 162, 60, 0.15);
    color: #e6a23c;
  }

  &.normal {
    background: rgba(103, 194, 58, 0.15);
    color: #67c23a;
  }
}


/* 內容體區 */
.detail-body {
  flex: 1;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 魔物介紹 */
.flavor-block {
  background: rgba(255, 255, 255, 0.02);
  border-left: 2px solid rgba(255, 255, 255, 0.15);
  padding: 8px 12px;
  border-radius: 0 6px 6px 0;
  position: relative;
  margin-top: 4px;

  .quote-mark {
    font-family: Georgia, serif;
    font-size: 1.6rem;
    color: rgba(255, 255, 255, 0.1);
    position: absolute;
    line-height: 1;

    &.left {
      top: -2px;
      left: 4px;
    }

    &.right {
      bottom: -12px;
      right: 4px;
    }
  }

  .flavor-text {
    margin: 0;
    font-size: 0.78rem;
    color: #b0b0b0;
    font-style: italic;
    line-height: 1.45;
  }
}

/* 分區標題 */
.section-title-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 4px;
  margin-top: 4px;

  .title-icon {
    font-size: 0.9rem;
  }

  .title-text {
    font-size: 0.8rem;
    font-weight: bold;
    color: #909399;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
}

/* 屬性格點 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;

  > :first-child {
    grid-column: 1 / -1;
  }
}

.stat-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 6px;
  padding: 6px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.08);
  }
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-icon {
  font-size: 0.85rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #999;
}

.stat-value {
  font-size: 0.8rem;
  font-weight: bold;
  font-family: monospace, sans-serif;
  color: #f2f2f2;
}


/* 掉落物戰術 */
.loot-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gold-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(241, 196, 15, 0.06);
  border: 1px dashed rgba(241, 196, 15, 0.2);
  padding: 6px 10px;
  border-radius: 6px;

  .gold-icon {
    font-size: 0.9rem;
  }

  .gold-label {
    font-size: 0.75rem;
    color: #999;
  }

  .gold-value {
    font-size: 0.8rem;
    font-weight: bold;
    color: #f1c40f;
  }
}

.drops-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.drop-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid;
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
  }
}

.drop-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.drop-item-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.drop-item-icon {
  font-size: 1.1rem;
}

.drop-details {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.drop-name {
  font-size: 0.8rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.drop-desc {
  font-size: 0.68rem;
  color: #7a7a7a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 1px;
}

.drop-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  flex-shrink: 0;
}

.drop-rate {
  font-size: 0.9rem;
  font-weight: bold;
  font-family: monospace;
}

.drop-rate-label {
  font-size: 0.58rem;
  color: #7a7a7a;
  text-transform: uppercase;
}

.no-loot {
  font-size: 0.75rem;
  color: #6a6a6a;
  font-style: italic;
  padding: 4px;
}

.monster-image-icon {
  width: 1rem;
  height: 1rem;
}
</style>