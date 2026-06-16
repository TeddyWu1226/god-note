<script setup lang="ts">
import './boss-animation.css'
import './god-animation.css'
import {computed, PropType, ref, watch} from 'vue';
import {BattleOutcome, MonsterType} from "@/types";
import {HpProgress} from "@/components/Shared/Progress";
import {getEffectiveStats, useGameStateStore} from "@/store/game-state-store";
import {
  applyAttackDamage,
  triggerDamageEffect
} from "@/constants/fight-func";
import {MonsterModel} from "@/models/monster-model";
import {usePlayerStore} from "@/store/player-store";
import {useLogStore} from "@/store/log-store";

const props = defineProps({
  info: {type: Object as PropType<MonsterModel>},
  index: {type: Number},
  isSelected: {type: Boolean, default: false} //選中狀態,

});
const emit = defineEmits(['select', 'monsterDie']);
const handleClick = () => {
  emit('select', props.info);
};

const playerStore = usePlayerStore()
const gameStateStore = useGameStateStore()
const logStore = useLogStore()
const finalStats = computed(() => getEffectiveStats(props.info));

// 新增狀態：用於控制抖動動畫
const isShaking = ref(false);

const isDead = computed(() => props.info?.hp === 0)

const isImageIcon = computed(() => {
  const icon = props.info?.icon;
  if (!icon) return false;
  return icon.includes('/') || icon.includes('.') || icon.startsWith('data:image');
});

const resolveIconPath = (icon: string) => {
  if (!icon) return '';
  if (icon.startsWith('http') || icon.startsWith('data:image')) {
    return icon;
  }
  const cleanIcon = icon.startsWith('/') ? icon.slice(1) : icon;
  const baseUrl = import.meta.env.BASE_URL || '/';
  const formattedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${formattedBase}${cleanIcon}`;
};

/**
 * 外部調用：啟動卡片抖動動畫
 */
const shake = (time = 500) => {
  // 1. 啟動抖動狀態
  isShaking.value = true;

  // 2. 在動畫結束後移除抖動類別
  setTimeout(() => {
    isShaking.value = false;
  }, time);
};


const valueClass = (valueKey: string) => {
  if (finalStats.value[valueKey] > props.info[valueKey]) {
    return 'buff'
  }
  if (finalStats.value[valueKey] < props.info[valueKey]) {
    return 'debuff'
  }
}
const CardRef = ref(null);

/**
 * 怪物行動
 */

const monsterMove = () => {
  // 被暈眩
  if (props.info.status?.some(stats => stats.type === 'stuck')) {
    return
  }
  if (props.info.hp <= 0) {
    return;
  }
  monsterAttack()
}

// 怪物攻擊
const monsterAttack = () => {

  // 特殊效果
  if (props.info instanceof MonsterModel) {
    props.info.triggerOnAttack({
      monsterIndex: props.index,
      playerStore: playerStore,
      gameStateStore: gameStateStore,
      logStore: logStore,
      targetElement: CardRef.value
    });
  }
  // 傷害計算
  applyAttackDamage(getEffectiveStats(props.info), playerStore.finalStats, gameStateStore.currentEnemy[props.index]);
}
/**
 * 怪物被攻擊
 */
const onMonsterAttacked = (damageOutput: BattleOutcome) => {
  if (props.info instanceof MonsterModel) {
    props.info.triggerOnAttacked({
      gameStateStore: gameStateStore,
      playerStore: playerStore,
      targetElement: CardRef.value?.$el,
      logStore: logStore,
      damage: damageOutput,
    });
  }
}
/**
 * 怪物死亡
 */
const onMonsterDie = () => {
  // 觸發死亡被動
  if (props.info instanceof MonsterModel) {
    props.info.triggerOnDead({
      playerStore: playerStore,
      gameStateStore: gameStateStore,
      logStore: logStore,
      targetElement: CardRef.value
    });
  }
  if (props.info.hp > 0) {
    return
  }
  // 確實死亡後觸發
  emit('monsterDie', props.index)
}

// 監控是否死亡
watch(() => props.info?.hp, (newResult) => {
  if (props.info?.hp <= 0) {
    onMonsterDie()
  }
}, {deep: true});

defineExpose({
  shake,
  monsterMove,
  monsterAttack
});

// 監控是否受到傷害
watch(() => props.info.lastDamageResult, (newResult) => {
  if (newResult && CardRef.value) {
    triggerDamageEffect(newResult, CardRef.value.$el);
    if (newResult.isHit) {
      onMonsterAttacked(newResult);
      if (newResult.totalDamage > newResult.baseDamage * 0.5) {
        shake()
      }
    }
  }
}, {deep: true});


</script>

<template>
  <el-card
      ref="CardRef"
      class="monster-card"
      :class="[
          props.info.class,
          {
            'is-selected': props.isSelected,
            'is-shaking': isShaking,
          }
      ]"
      shadow="hover"
      @click="handleClick"
  >
    <!-- 狀態欄 -->
    <div class="status-bar">
      <el-tooltip
          v-for="eff in info.status"
          :key="eff.name"
          :content="`${eff.name}: ${eff.description} (${eff.duration === -1 ? '∞' : eff.duration + '回'})`"
      >
        <div class="status-icon" :class="{ 'is-debuff': !eff.isBuff }">
          <span>{{ eff.icon }}</span>
          <small v-if="eff.duration !== -1">{{ eff.duration }}</small>
        </div>
      </el-tooltip>
    </div>

    <!-- 卡片內容排版 -->
    <div class="monster-card-body" :class="{ 'is-dead': isDead }">
      <!-- 頭像與圖示區 -->
      <div class="monster-avatar-container">
        <template v-if="isDead">
          <span class="death-emoji">🪦</span>
        </template>
        <template v-else>
          <img v-if="isImageIcon" :src="resolveIconPath(props.info.icon)" class="monster-image-icon"
               alt="monster icon"/>
          <span v-else class="monster-icon">{{ props.info.icon }}</span>
        </template>
      </div>

      <!-- 名字與狀態文字區 -->
      <div class="monster-name-container">
        <span class="monster-name">{{ props.info.name }}</span>
        <span v-if="isDead" class="death-text">死亡</span>
      </div>

      <!-- 屬性數值區 (死亡時隱藏) -->
      <div v-if="!isDead" class="monster-stats-row">
        <div class="stat-col" :class="valueClass('ad')">
          <span class="stat-icon-label">⚔️</span>
          <span class="stat-value-label">{{ finalStats.ad }}</span>
        </div>
        <div class="stat-col" :class="valueClass('adDefend')">
          <span class="stat-icon-label">🛡️</span>
          <span class="stat-value-label">{{ finalStats.adDefend }}</span>
        </div>
        <div v-if="finalStats.apDefend" class="stat-col" :class="valueClass('apDefend')">
          <span class="stat-icon-label">🌐</span>
          <span class="stat-value-label">{{ finalStats.apDefend }}</span>
        </div>
      </div>

      <!-- 血量條區 -->
      <div class="monster-hp-container">
        <HpProgress :current-value="props.info.hp" :total-value="finalStats.hpLimit"/>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.monster-card {
  position: relative; /* 為了讓狀態欄絕對定位參考卡片 */
  flex: 1 1 9rem;
  min-width: 7.5rem;
  max-width: 8.5rem;
  height: 100%;
  max-height: 12.5rem;
  font-size: 0.95rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}

:deep(.el-card__body) {
  padding: 0.5rem;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.monster-card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  height: 100%;
  min-height: 0; /* 允許自由收縮 */
  box-sizing: border-box;
}

/* 狀態欄不佔空間地定選在卡片上方 */
.status-bar {
  position: absolute;
  top: 4px;
  left: 4px;
  z-index: 10;
  display: flex;
  gap: 2px;
}

.status-icon {
  position: relative;
  font-size: 0.95rem;
}

.status-icon small {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 50%;
  padding: 0 3px;
  font-size: 9px;
}

.is-debuff {
  filter: drop-shadow(0 0 2px red);
}

/* 頭像區與圖示 */
.monster-avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  min-height: 0;
  width: 100%;
}

.monster-icon {
  font-size: 2.2rem;
  line-height: 1;
  display: inline-block;
  transition: font-size 0.2s ease;
}

.monster-image-icon {
  max-width: 100%;
  max-height: 3.5rem;
  height: auto;
  object-fit: contain;
  image-rendering: pixelated;
  display: inline-block;
  transition: max-height 0.2s ease;
}

.death-emoji {
  font-size: 2.2rem;
  line-height: 1;
  display: inline-block;
  transition: font-size 0.2s ease;
}

/* 名字區 */
.monster-name-container {
  width: 100%;
  text-align: center;
  margin: 0.15rem 0;
  flex-shrink: 0;
}

.monster-name {
  font-size: 0.82rem;
  font-weight: bold;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #fff;
  transition: font-size 0.2s ease;
}

.death-text {
  font-size: 0.72rem;
  color: var(--el-color-danger);
  font-weight: bold;
  display: block;
  margin-top: 1px;
}

/* 屬性數值區 */
.monster-stats-row {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  font-size: 0.8rem;
  margin: 0.15rem 0;
  flex-shrink: 0;
  transition: font-size 0.2s ease;
}

.stat-col {
  display: flex;
  align-items: center;
  gap: 2px;
}

.stat-icon-label {
  opacity: 0.95;
}

.stat-value-label {
  font-weight: bold;
}

/* 血量條 */
.monster-hp-container {
  width: 100%;
  flex-shrink: 0;
  margin-top: 0.15rem;
}

/* 高亮與選中特效 */
.monster-card.is-selected {
  border: 2px solid #00f3ff !important;
  box-shadow: 0 0 12px rgba(0, 243, 255, 0.9), 0 0 4px rgba(0, 243, 255, 0.5);
  transform: scale(1.02);
  cursor: pointer;
}

.monster-card:hover:not(.is-selected) {
  box-shadow: 0 0 8px rgba(120, 255, 255, 0.4);
}

.buff {
  color: var(--el-color-success);
}

.debuff {
  color: var(--el-color-danger);
}

/* ------------------- 容器查詢響應式設計 ------------------- */

/* 1. 當房間主體高度較矮時 (例如 <= 240px) */
@container room-body (max-height: 240px) {
  .monster-card {
    max-height: 8.5rem;
  }

  :deep(.el-card__body) {
    padding: 0.35rem 0.4rem;
  }

  .monster-icon {
    font-size: 1.6rem;
  }

  .monster-image-icon {
    max-height: 2.5rem;
  }

  .death-emoji {
    font-size: 1.6rem;
  }

  .monster-name {
    font-size: 0.76rem;
  }

  .monster-stats-row {
    font-size: 0.72rem;
    margin: 0.05rem 0;
  }

  .monster-hp-container {
    margin-top: 0.05rem;
  }
}

/* 2. 當房間主體高度極矮時 (例如 <= 165px) */
@container room-body (max-height: 165px) {
  .monster-card {
    max-height: 6.8rem;
    min-width: 6.5rem;
  }

  :deep(.el-card__body) {
    padding: 0.2rem 0.3rem;
  }

  .status-bar {
    top: 2px;
    left: 2px;
    gap: 1px;
  }

  .status-icon {
    font-size: 0.75rem;
  }

  .monster-icon {
    font-size: 1.25rem;
  }

  .monster-image-icon {
    max-height: 1.8rem;
  }

  .death-emoji {
    font-size: 1.25rem;
  }

  .monster-name {
    font-size: 0.7rem;
    margin: 0;
  }

  .death-text {
    font-size: 0.65rem;
    margin-top: 0;
  }

  .monster-stats-row {
    font-size: 0.65rem;
    margin: 0;
  }

  .monster-hp-container {
    margin-top: 0;
  }
}

/* 3. 當房間主體高度微缩到極限時 (例如 <= 125px) */
@container room-body (max-height: 125px) {
  .monster-card {
    max-height: 5.2rem;
    min-width: 5.8rem;
  }

  :deep(.el-card__body) {
    padding: 0.1rem 0.2rem;
  }

  .monster-icon {
    font-size: 0.95rem;
  }

  .monster-image-icon {
    max-height: 1.2rem;
  }

  .death-emoji {
    font-size: 0.95rem;
  }

  .monster-name {
    font-size: 0.65rem;
  }

  /* 極限高度下隱藏數值圖標，僅保留文字或精簡以防溢出 */
  .monster-stats-row {
    font-size: 0.6rem;
  }

  .stat-col {
    gap: 0px;
  }
}

/* ------------------- 抖動特效 ------------------- */
.monster-card.is-shaking {
  animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-3px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(3px, 0, 0);
  }
}
</style>