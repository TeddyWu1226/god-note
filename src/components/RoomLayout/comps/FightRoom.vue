<script setup lang="ts">

import {RoomEnum} from "@/enums/room-enum";
import {MonsterCardExposed} from "@/components/RoomLayout/comps/types";
import MonsterCard from "@/components/RoomLayout/comps/MonsterCard.vue";
import {useGameStateStore} from "@/store/game-state-store";
import {computed, nextTick, ref} from "vue";
import {ItemType, MonsterType} from "@/types";
import {Monster} from "@/constants/monster-info";
import {
  applyDamage,
  applyRandomFloatAndRound,
  canEscape, getLootFromTable,
  spawnMonsters,
  triggerDamageEffect
} from "@/constants/fight-func";
import {ElMessage} from "element-plus";
import {LogView} from "@/components/LogView";
import {create} from "@/utils/create";
import {usePlayerStore} from "@/store/player-store";
import {StageEnum} from "@/enums/stage-enum";
import {BeginForestWeights} from "@/constants/stage-monster-weights";
import {Boss} from "@/constants/boss-info";
import {getEnumColumn} from "@/utils/enum";
import {QualityEnum} from "@/enums/quilty-enum";
import {MonsterActions} from "@/constants/monster-attack-effect";
import {useLogStore} from "@/store/log-store";
import {useFloatingMessage} from "@/components/Shared/FloatingMessage/useFloatingMessage";
import {UnitStatus} from "@/constants/status-info";

const emit = defineEmits(['playerDead', 'runFailed'])
const gameStateStore = useGameStateStore()
const playerStore = usePlayerStore()
const logStore = useLogStore()
const currentRoomValue = computed(() => {
      return gameStateStore.currentRoomValue
    }
)
const monsterCardRefs = ref<MonsterCardExposed[]>([]);
const monsters = ref<MonsterType[]>([])
const monsterDropGold = ref(0)
const monsterDropItems = ref<ItemType[]>([])


// 怪物生成
const genMonsters = (count: number, weight: Record<string, number>, eliteBoost = false) => {
  const newMonsters = spawnMonsters(count, weight, eliteBoost);
  monsters.value = newMonsters;
  // 同步到 Store 做持久化緩存
  gameStateStore.setCurrentEnemy(newMonsters);

  // 額外
  nextTick().then(() => {
    monsters.value.forEach((monster, index) => {
      if (monster.name === Monster.FierceWolf.name) {
        //效果
        playerStore.addStatus(UnitStatus.WolfRoarWarning)
        //動畫
        useFloatingMessage(
            '啊嗚~',
            monsterCardRefs.value[index].$el,
            {
              duration: 1500, // 動畫時間保持不變
              color: 'red'
            }
        );
      }
    })
  })
}


const getWeightByStage = () => {
  switch (gameStateStore.currentStage) {
    case StageEnum.BeginForest.value:
      return BeginForestWeights;
    default:
      return null;
  }
}

//生成菁英戰鬥
const genEliteMonster = (layer: number) => {
  const useWeight = getWeightByStage();
  if (!useWeight) return;

  // 30~50% 機率生成 1 隻強化版菁英怪,其餘生成 2 隻普通怪，
  const isDouble = Math.random() > (0.3 + layer * 0.01);

  if (isDouble) {
    genMonsters(2, useWeight, false);
  } else {
    genMonsters(1, useWeight, true);
  }
}

// 生成BOSS
const createBoss = () => {
  let newMonsters: MonsterType[]
  switch (gameStateStore.currentStage) {
    case StageEnum.BeginForest.value:
      newMonsters = [create(Boss.BigBear)]
      break
    default:
      newMonsters = [create(Monster.Error)];
  }
  monsters.value = newMonsters;
  // 同步到 Store 做持久化緩存
  gameStateStore.setCurrentEnemy(newMonsters);
  nextTick().then(() => {
    // 額外動畫演示
    useFloatingMessage(
        '這裡不是你該闖入的地方!',
        monsterCardRefs.value[0].$el,
        {
          duration: 2000, // 動畫時間保持不變
          color: 'red'
        }
    );
  })
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
  // 特殊效果
  if (selectedMonster.onAttack && MonsterActions[selectedMonster.onAttack]) {
    // 執行對應的函式
    MonsterActions[selectedMonster.onAttack]({
      monster: selectedMonster,
      playerStore: playerStore,
      logStore: logStore,
      damage: damageOutput,
    });
  }
  // 判斷玩家是否死亡
  if (damageOutput.isKilled) {
    emit('playerDead', damageOutput.isKilled)
  }
}


/**
 * 玩家行動
 */
// 玩家回合結束
const onPlayerTurnEnd = () => {
  playerStore.nextTurnStatus()
}
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

  // 回合結束判定
  onPlayerTurnEnd()

  // 怪物是否死亡
  if (!damageOutput.isKilled) {
    // 怪物行動
    monsterMove(selectedMonster)
  } else {
    // 掉落金幣
    const dropMoney = applyRandomFloatAndRound(selectedMonster.dropGold ?? 0)
    playerStore.addGold(dropMoney)
    monsterDropGold.value += dropMoney

    // 掉落物品
    const earnedItems = getLootFromTable(selectedMonster.drop);
    earnedItems.forEach((item) => {
      playerStore.gainItem(item);
      monsterDropItems.value.push(item)
    });
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
    gameStateStore.setCurrentEnemy([])
    gameStateStore.setBattleWon(true)
  }

}

const isEscape = ref(false)
const onRun = () => {
  if (!canEscape(playerStore.finalStats, monsters.value)) {
    if (!selectedMonsterIndex.value) {
      selectedMonsterIndex.value = 0
    }
    let selectedMonster: MonsterType | null
    if (monsters.value.length >= 1) {
      const randomIndex = Math.floor(Math.random() * monsters.value.length);
      selectedMonster = monsters.value[randomIndex];
    } else {
      selectedMonster = monsters.value[selectedMonsterIndex.value];
    }
    emit('runFailed', true)
    monsterMove(selectedMonster)
  } else {
    isEscape.value = true
    gameStateStore.setBattleWon(true)
    monsters.value = []
  }
  // 回合結束判定
  onPlayerTurnEnd()
}


defineExpose({
  onAttack,
  onRun
})

// --- 初始化邏輯 (讀檔機制) ---

const init = () => {
  const layer = gameStateStore.currentRoom[0];
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
      genMonsters(1, getWeightByStage() || {'Error': 1});
      break;
    case RoomEnum.EliteFight.value:
      genEliteMonster(layer);
      break;
    case RoomEnum.Boss.value:
      createBoss()
      break

  }
}

if (!gameStateStore.isBattleWon) {
  init()
}
</script>

<template>
  <div class="fight">
    <MonsterCard
        :ref="(el) => { if (el) monsterCardRefs[index] = el as MonsterCardExposed }"
        v-for="(monster,index) in monsters"
        :key="index"
        :info="monster"
        :is-selected="selectedMonsterIndex === index"
        @select="handleMonsterSelect(index)"
    />
    <div CLASS="victory-container" v-if="gameStateStore.isBattleWon">
      <span v-if="isEscape" class="run-message">你成功逃跑了!</span>
      <span v-else class="victory-message">勝利!</span>
      <span v-if="monsterDropGold">獲得了 {{ monsterDropGold }} G!</span>
      <span v-for="(item,index) in monsterDropItems" :key="index">
        獲得了 <strong :style="{color:getEnumColumn(QualityEnum,item.quality,'color')}">{{ item.name }}</strong>
      </span>
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
  top: 14rem;
}

@media (max-width: 767px) {
  .log {
    top: 12rem;
  }
}

</style>