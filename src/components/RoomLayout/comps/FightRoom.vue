<script setup lang="ts">

import {RoomEnum} from "@/enums/room-enum";
import {MonsterCardExposed} from "@/components/RoomLayout/comps/types";
import MonsterCard from "@/components/RoomLayout/comps/MonsterCard.vue";
import {useGameStateStore} from "@/store/game-state-store";
import {computed, Reactive, ref} from "vue";
import {MonsterType} from "@/types";
import {Monster} from "@/constants/monster-info";
import {applyDamage, applyRandomFloatAndRound, canEscape, triggerDamageEffect} from "@/constants/fight-func";
import {ElMessage} from "element-plus";
import {LogView} from "@/components/LogView";
import {create} from "@/utils/create";
import {usePlayerStore} from "@/store/player-store";
import {StageEnum} from "@/enums/stage-enum";
import {BeginForestWeights} from "@/constants/stage-monster-weights";

const emit = defineEmits(['playerDead', 'runFailed'])
const gameStateStore = useGameStateStore()
const playerStore = usePlayerStore()
const currentRoomValue = computed(() => {
      return gameStateStore.currentRoomValue
    }
)
const monsterCardRefs = ref<MonsterCardExposed[]>([]);
const monsters = ref<MonsterType[]>([])
const monsterDropGold = ref(0)
const clearMonsters = () => {
  monsters.value = [];
  gameStateStore.setCurrentEnemy([])
}

/**
 * 根據權重隨機獲取一個怪物
 * @param weightMap 怪物 Key 與權重的對照表 (例如 { Slime: 70, Wolf: 30 })
 * @returns 隨機選出的怪物實例 (深拷貝)
 */
const getRandomMonsterByWeight = (weightMap: Record<string, number>): MonsterType => {
  const keys = Object.keys(weightMap);

  // 1. 計算總權重
  const totalWeight = keys.reduce((sum, key) => sum + weightMap[key], 0);

  // 2. 產生 0 到 總權重 之間的隨機數
  let randomNum = Math.random() * totalWeight;

  // 3. 尋找隨機數落在哪個區間
  for (const key of keys) {
    if (randomNum < weightMap[key]) {
      // 找到目標，回傳該怪物的深拷貝（避免戰鬥修改到原始設定）
      const targetMonster = (Monster as any)[key];
      return create(targetMonster)
    }
    randomNum -= weightMap[key];
  }

  // 兜底方案：萬一出錯回傳第一個
  return create((Monster as any)[keys[0]]);
}

/**
 * 核心生成函數
 * @param count 生成數量
 * @param weight 權重表
 * @param eliteBoost 是否進行菁英強化
 */
const spawnMonsters = (count: number, weight: Record<string, number>, eliteBoost = false) => {
  const newMonsters: MonsterType[] = [];

  for (let i = 0; i < count; i++) {
    let m = getRandomMonsterByWeight(weight);

    if (eliteBoost) {
      // 菁英強化
      m.name = `【菁英】${m.name}`;
      m.hpLimit = Math.round(m.hpLimit * 2);
      m.hp = m.hpLimit;
      m.ad = Math.round(m.ad * 1.5);
      m.adDefend = Math.round(m.adDefend * 1.5);
      m.dropGold = Math.round((m.dropGold || 10) * 3);
      m.level += 2;
    }

    newMonsters.push(m);
  }
  monsters.value = newMonsters;
  // 同步到 Store 做持久化緩存
  gameStateStore.setCurrentEnemy(newMonsters);
}


/**
 * 根據當前階層取得權重 (封裝重複代碼)
 */
const getWeightByStage = () => {
  switch (gameStateStore.currentStage) {
    case StageEnum.BeginForest.value:
      return BeginForestWeights;
    default:
      return null;
  }
}

/**
 * 生成菁英戰鬥
 */
const genEliteMonster = (layer: number) => {
  const useWeight = getWeightByStage();
  if (!useWeight) return;

  // 30~50% 機率生成 1 隻強化版菁英怪,其餘生成 2 隻普通怪，
  const isDouble = Math.random() > (0.3 + layer * 0.01);

  if (isDouble) {
    spawnMonsters(2, useWeight, false);
  } else {
    spawnMonsters(1, useWeight, true);
  }
}

/**
 * 處理 MonsterCard 的點擊事件，實現單選邏輯。
 * @param index 被點擊怪物的索引
 */
const selectedMonsterIndex = ref<number | null>(null);
const handleMonsterSelect = (index: number) => {
  // 如果點擊的是已經選中的怪物，則取消選中 (設為 null)
  if (selectedMonsterIndex.value === index) {
    selectedMonsterIndex.value = null;
  } else {
    // 否則，選中這個新的怪物索引
    selectedMonsterIndex.value = index;
  }
}


/**
 * 怪物行動
 */

const monsterMove = (selectedMonster: MonsterType) => {
  // 傷害計算
  const damageOutput = applyDamage(selectedMonster, playerStore.finalStats);
  // 判斷玩家是否死亡
  if (damageOutput.isKilled) {
    emit('playerDead', damageOutput.isKilled)
  }
}


/**
 * 玩家行動
 */
// 攻擊
const onAttack = () => {

  if (!selectedMonsterIndex.value) {
    selectedMonsterIndex.value = 0
  }
  const selectedMonster = monsters.value[selectedMonsterIndex.value];
  if (!selectedMonster) {
    ElMessage.warning('無攻擊目標!')
    return
  }
  // 傷害計算
  const damageOutput = applyDamage(playerStore.finalStats, selectedMonster);
  const targetElement = monsterCardRefs.value[selectedMonsterIndex.value];
  triggerDamageEffect(damageOutput, targetElement.$el)
  if (damageOutput.isHit) {
    targetElement?.shake()
  }

  // 怪物是否死亡
  if (!damageOutput.isKilled) {
    // 怪物行動
    monsterMove(selectedMonster)
  } else {
    monsterDropGold.value += applyRandomFloatAndRound(selectedMonster.dropGold ?? 0)
    // 移除死亡怪
    monsters.value.splice(selectedMonsterIndex.value, 1);
    gameStateStore.setCurrentEnemy(monsters.value); // 再次同步
    // 確保選中狀態同步：如果選中的怪物被移除了，則取消選中
    if (selectedMonsterIndex.value >= monsters.value.length) {
      selectedMonsterIndex.value = null;
    }
  }
  // 怪物全部死亡
  if (monsters.value.length === 0) {
    playerStore.addGold(monsterDropGold.value)
    gameStateStore.setCurrentEnemy([])
    gameStateStore.setBattleWon(true)

  }
}
const isEscape = ref(false)
const onRun = () => {
  if (!canEscape(playerStore.info, monsters.value)) {
    if (!selectedMonsterIndex.value) {
      selectedMonsterIndex.value = 0
    }
    const selectedMonster = monsters.value[selectedMonsterIndex.value];
    emit('runFailed', true)
    monsterMove(selectedMonster)
  } else {
    isEscape.value = true
    gameStateStore.setBattleWon(true)
    monsters.value = []
  }
}


defineExpose({
  onAttack,
  onRun
})

// --- 初始化邏輯 (讀檔機制) ---

const init = () => {
  const layer = gameStateStore.getCurrentRoom[0];
  isEscape.value = false;
  selectedMonsterIndex.value = null;

  // 1. 讀檔檢查：如果 Store 裡面已經有怪物資料，直接讀取
  if (gameStateStore.currentEnemy && gameStateStore.currentEnemy.length > 0) {
    monsters.value = gameStateStore.currentEnemy;
    return;
  }

  // 2. 若無緩存，則根據房間類型生成
  switch (currentRoomValue.value) {
    case RoomEnum.Fight.value:
      spawnMonsters(1, getWeightByStage() || {'Error': 1});
      break;
    case RoomEnum.EliteFight.value:
      genEliteMonster(layer);
      break;
  }
}

if(!gameStateStore.isWon){
  init()
}
</script>

<template>
  <div
      class="fight"
      v-if="currentRoomValue === RoomEnum.Fight.value ||currentRoomValue === RoomEnum.EliteFight.value"
  >
    <MonsterCard
        :ref="(el) => { if (el) monsterCardRefs[index] = el as MonsterCardExposed }"
        v-for="(monster,index) in monsters"
        :key="index"
        :info="monster"
        :is-selected="selectedMonsterIndex === index"
        @select="handleMonsterSelect(index)"
    />
    <div CLASS="victory-container" v-if="gameStateStore.isWon">
      <span v-if="isEscape" class="run-message">你成功逃跑了!</span>
      <span v-else class="victory-message">勝利!</span>
      <span v-if="monsterDropGold">你獲得了 {{ monsterDropGold }} G!</span>
    </div>
    <LogView class="log"></LogView>
  </div>
</template>

<style scoped>
.fight {
  padding: 2rem;
  display: flex;
  justify-content: space-around;
  position: relative;
}


.victory-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 50px;
  /* 設置高度，確保跳躍不會影響周圍元素 */
  height: 100px;
}

.victory-message {
  /* 確保元素是 inline-block 或 block 才能設置寬高和 overflow */
  display: inline-block;
  font-size: 2rem;
  font-weight: bold;
  color: gold;
  text-shadow: 0 0 10px #ffcc00, 0 0 20px #e69900;
}

.run-message {
  font-size: 2rem;
}

/* ---------------------------------------------------- */
/* ⭐️ 懸浮日誌視窗樣式 (無背景/邊框) */
/* ---------------------------------------------------- */

.log {
  position: absolute;
  left: 0;
  bottom: -5rem;
}

</style>