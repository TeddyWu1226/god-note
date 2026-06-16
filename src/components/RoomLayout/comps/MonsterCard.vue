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
import {Monster} from "@/models/monster";
import {usePlayerStore} from "@/store/player-store";
import {useLogStore} from "@/store/log-store";

const props = defineProps({
  info: {type: Object as PropType<Monster>},
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
  if (props.info instanceof Monster) {
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
  if (props.info instanceof Monster) {
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
  if (props.info instanceof Monster) {
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
    }]"
      shadow="hover"
      @click="handleClick"
  >
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
    <el-row v-if="isDead" style="width: 100%" justify="center">
      <el-col style="text-align: center" class="death-emoji" :span="24">
        <span>🪦</span>
      </el-col>
      <el-col style="text-align: center;" :span="24">
        <span class="monster-name">{{ props.info.name }}</span>
      </el-col>
      <el-col style="text-align: center;" class="death-text" :span="24">
        <span>死亡</span>
      </el-col>
    </el-row>
    <el-row v-else style="width: 100%" justify="space-between">
      <el-col style="text-align: center" :span="24">
        <img v-if="isImageIcon" :src="resolveIconPath(props.info.icon)" class="monster-image-icon" alt="monster icon" />
        <span v-else class="monster-icon">{{ props.info.icon }}</span>
      </el-col>
      <el-col style="text-align: center;" :span="24">
        <span class="monster-name">{{ props.info.name }}</span>
      </el-col>
      <el-col :span="8" :class="valueClass('ad')">
        <span>⚔️</span>
        <span>{{ finalStats.ad }}</span>
      </el-col>
      <el-col :span="8" :class="valueClass('adDefend')">
        <span>🛡️</span>
        <span>{{ finalStats.adDefend }}</span>
      </el-col>
      <el-col v-if="finalStats.apDefend" :span="8" :class="valueClass('apDefend')">
        <span>🌐</span>
        <span>{{ finalStats.apDefend }}</span>
      </el-col>
      <el-col :span="24">
        <HpProgress :current-value="props.info.hp" :total-value="finalStats.hpLimit"/>
      </el-col>
    </el-row>

  </el-card>
</template>

<style scoped>
.monster-card {
  position: relative; /* 為了讓狀態欄絕對定位參考卡片 */
  flex: 1 1 9rem;
  min-width: 7.5rem;
  max-width: 8rem;
  height: auto;
  max-height: 10rem;
  font-size: 0.95rem;
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

.monster-icon {
  font-size: 1.4rem;
  display: inline-block;
  margin-top: 0.2rem;
}

.monster-image-icon {
  width: 2.2rem;
  height: 2.2rem;
  object-fit: contain;
  image-rendering: pixelated;
  display: inline-block;
  margin-top: 0.2rem;
}

.monster-name {
  font-size: 0.85rem;
  font-weight: bold;
  display: block;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0.2rem 0;
}

/* 高亮特效樣式 */
.monster-card.is-selected {
  border: 2px solid #00f3ff !important;
  box-shadow: 0 0 12px rgba(0, 243, 255, 0.9), 0 0 4px rgba(0, 243, 255, 0.5);
  transform: scale(1.02);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.monster-card:hover:not(.is-selected) {
  box-shadow: 0 0 8px rgba(120, 255, 255, 0.4);
}

.el-col {
  margin-top: 0.05rem;
  margin-bottom: 0.05rem;
}

:deep(.el-card__body) {
  padding: 0.4rem 0.5rem;
  box-sizing: border-box;
}

.buff {
  color: var(--el-color-success);
}

.debuff {
  color: var(--el-color-danger);
}

.death-emoji {
  font-size: 1.5rem !important;
  margin-top: 0.5rem;
}

.death-text {
  font-size: 13px !important;
  color: var(--el-color-danger);
}

/* ------------------- 抖動特效 ------------------- */
.monster-card.is-shaking {
  animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
  40%, 60% { transform: translate3d(3px, 0, 0); }
}
</style>