<script setup lang="ts">
import './boss-animation.css'
import './god-animation.css'
import {computed, PropType, ref, watch} from 'vue';
import {BattleOutcome, MonsterType} from "@/types";
import {HpProgress} from "@/components/Shared/Progress";
import {getEffectiveStats, useGameStateStore} from "@/store/game-state-store";
import {
  applyAttackDamage,
  applyRandomFloatAndRound,
  getLootFromTable,
  triggerDamageEffect
} from "@/constants/fight-func";
import {MonsterOnAttacked} from "@/constants/monsters/monster-action/on-attacked";
import {usePlayerStore} from "@/store/player-store";
import {useLogStore} from "@/store/log-store";
import {MonsterOnAttack} from "@/constants/monsters/monster-action/on-attack";
import {MonsterOnDead} from "@/constants/monsters/monster-action/on-dead";

const props = defineProps({
  info: {type: Object as PropType<MonsterType>},
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
  if (props.info.onAttack && MonsterOnAttack[props.info.onAttack]) {
    // 執行對應的函式
    MonsterOnAttack[props.info.onAttack]({
      monster: props.info,
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
  if (props.info.onAttacked && MonsterOnAttacked[props.info.onAttacked]) {
    MonsterOnAttacked[props.info.onAttacked]({
      monster: props.info,
      gameStateStore: gameStateStore,
      playerStore: playerStore,
      targetElement: CardRef.value.$el,
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
  if (props.info.onDead && MonsterOnDead[props.info.onDead]) {
    // 執行對應的函式
    MonsterOnDead[props.info.onDead]({
      monster: props.info,
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
      :class="[
          props.info.class,
          {
      'monster-card': true,
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
    <el-tooltip>
      <template #content>
        <p>{{ props.info.name }} Lv.{{ props.info.level }}</p>
        <p>{{ props.info.description }}</p>
      </template>
      <el-row v-if="isDead" style="width: 100%" justify="center">
        <el-col style="text-align: center;font-size: 2rem" :span="24">
          <span>🪦</span>
        </el-col>
        <el-col style="text-align: center;" :span="24">
          <span class="monster-name">{{ props.info.name }}</span>
        </el-col>
        <el-col style="text-align: center;font-size: 20px;color:var(--el-color-danger)" :span="24">
          <span>死亡</span>
        </el-col>
      </el-row>
      <el-row v-else style="width: 100%" justify="space-between">
        <el-col style="text-align: center" :span="24">
          <span class="monster-icon">{{ props.info.icon }}</span>
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
    </el-tooltip>

  </el-card>
</template>

<style scoped>
.monster-icon {
  font-size: 1.8rem;
}

.monster-card {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 10rem;
  font-size: 1rem;
}

@media (max-width: 767px) {
  .monster-card {
    max-width: 13rem;
  }
}

/* 高亮特效樣式 */
.monster-card.is-selected {
  /* 改變邊框顏色或陰影來強調選中狀態 */
  border: 2px solid #00f3ff !important; /* 青藍色邊框 */
  box-shadow: 0 0 15px rgba(0, 243, 255, 0.9), /* 強烈外發光 */ 0 0 5px rgba(0, 243, 255, 0.5); /* 內部細微光暈 */
  transform: scale(1.02); /* 輕微放大以突出 */
  cursor: pointer;
  /* 確保過渡平滑 */
  transition: all 0.2s ease-in-out;
}

/* 確保 hover 效果依然存在 */
.monster-card:hover:not(.is-selected) {
  box-shadow: 0 0 8px rgba(120, 255, 255, 0.4);
}

.el-col {
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
}

p {
  line-height: 1;
}


/* ------------------- 抖動特效 (@keyframes) ------------------- */

/* ⭐️ 應用抖動動畫的類別 */
.monster-card.is-shaking {
  animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
  transform: translate3d(0, 0, 0); /* 啟用硬體加速 */
}

@keyframes shake {
  /* 輕微的、快速的水平位移 */
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}

.buff {
  color: var(--el-color-success);
}

.debuff {
  color: var(--el-color-danger);
}

/* ------------------- 狀態效果列 ------------------- */
.status-bar {
  position: relative;
  display: flex;
  gap: 4px;
  height: 24px;
}

.status-icon {
  position: relative;
  font-size: 1.2rem;
}

.status-icon small {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 50%;
  padding: 0 4px;
  font-size: 10px;
}

.is-debuff {
  filter: drop-shadow(0 0 2px red);
}

:deep(.el-card__body) {
  padding: 1rem;
}
</style>