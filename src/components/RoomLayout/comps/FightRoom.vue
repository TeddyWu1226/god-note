<script setup lang="ts">
import {getEnumColumn} from "@/utils/enum";
import {QualityEnum} from "@/enums/quality-enum";
import {RoomEnum} from "@/enums/room-enum";
import {MonsterCardExposed} from "@/components/RoomLayout/comps/types";
import MonsterCard from "@/components/RoomLayout/comps/MonsterCard.vue";
import {getEffectiveStats, useGameStateStore} from "@/store/game-state-store";
import {computed, nextTick, ref} from "vue";
import {ItemType, MonsterType, SkillType} from "@/types";
import {
  applyAttackDamage,
  applyRandomFloatAndRound,
  canEscape,
  getLootFromTable,
  spawnMonsters
} from "@/constants/fight-func";
import {ElMessage} from "element-plus";
import {LogView} from "@/components/LogView";
import {create} from "@/utils/create";
import {usePlayerStore} from "@/store/player-store";
import {StageEnum} from "@/enums/stage-enum";
import {EndlessWeights} from "@/constants/stage-monster-weights";
import {Boss} from "@/constants/monsters/boss-info";
import {useLogStore} from "@/store/log-store";
import {MonsterOnStart} from "@/constants/monsters/monster-action/on-start";
import {useFloatingMessage} from "@/components/Shared/FloatingMessage/useFloatingMessage";
import {stageMonsterWeightsMap} from "@/constants/stage-weights";
import {useTrackerStore} from "@/store/track-store";
import {ItemSkill} from "@/constants/skill/item-skill";
import {Skills} from "@/constants/skill/skill";
import {checkProbability} from "@/utils/math";
import {SpecialItem} from "@/constants/items/special-item-info";
import {Monster} from "@/constants/monsters/monster-info";

const emit = defineEmits(['runFailed'])
const gameStateStore = useGameStateStore()
const playerStore = usePlayerStore()
const logStore = useLogStore()
const trackStore = useTrackerStore()
const currentRoomValue = computed(() => {
      return gameStateStore.currentRoomValue
    }
)

const MonsterCardRefs = ref<MonsterCardExposed[]>([]);
const monsterDropGold = ref(0)
const monsterDropItems = ref<ItemType[]>([])
// 特殊掉落
const specialExtraDrop = () => {
  // 特殊掉落道具
  if (gameStateStore.currentRoomValue === RoomEnum.Boss.value) {
    return
  }
  switch (gameStateStore.currentStage) {
    case 5:
      if (!playerStore.hasItem(SpecialItem.TwilightKey.name)[0]) {
        const percent = 0.05 + (gameStateStore.days * 0.01)
        if (checkProbability(percent)) {
          playerStore.gainItem(SpecialItem.TwilightKey);
          monsterDropItems.value.push(SpecialItem.TwilightKey)
        }
      }
      break;
    case 7:
      if (!playerStore.hasItem(SpecialItem.ClearMirror.name)[0] && !(playerStore.hasItem(SpecialItem.ClearMirrorFragment.name)[1] >= 10)) {
        const percent = gameStateStore.days * 0.01
        if (checkProbability(percent)) {
          playerStore.gainItem(SpecialItem.ClearMirrorFragment);
          monsterDropItems.value.push(SpecialItem.ClearMirrorFragment)
        }
      }
      break
    default:
      break;
  }

}

// 怪物生成
const genMonsters = (count: number, weight: Record<string, number>, eliteBoost = false) => {
  const strengthening = 1 + gameStateStore.days * 0.01
  const newMonsters = spawnMonsters(count, weight, strengthening, eliteBoost);
  // 同步到 Store 做持久化緩存
  gameStateStore.setCurrentEnemy(newMonsters);
}


const getWeightByStage = () => {
  const monsterMap = stageMonsterWeightsMap[gameStateStore.currentStage] || EndlessWeights;
  if (trackStore.getKillCount(Monster.DuneBeast.name, 'total') > 0) {
    delete monsterMap.DuneBeast;
  }
  return monsterMap || EndlessWeights;
}

//生成菁英戰鬥
const genEliteMonster = () => {
  const useWeight = getWeightByStage();
  if (!useWeight) return;

  // 50% 機率生成 1 隻強化版菁英怪,其餘生成 2 隻普通怪，
  const isDouble = Math.random() > 0.5;

  if (isDouble) {
    genMonsters(2, useWeight, false);
  } else {
    genMonsters(1, useWeight, true);
  }
}

// 生成BOSS
// 建立一個反向查找的地圖 (在文件初始化時執行一次)
const StageValueMap = Object.fromEntries(
    Object.entries(StageEnum).map(([key, data]) => [data.value, key])
);

/**
 * 高效率查詢
 */
const getStageKeyByValue = (value: number): string | undefined => {
  return StageValueMap[value];
};
const createBoss = () => {
  let newMonsters: MonsterType[]
  const currentStageKey = getStageKeyByValue(gameStateStore.currentStage)
  const boss = Boss[currentStageKey] ?? Boss.Error
  newMonsters = [create(boss)]
  // 同步到 Store 做持久化緩存
  gameStateStore.setCurrentEnemy(newMonsters);
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

const monsterMove = () => {
  Object.values(MonsterCardRefs.value).forEach((card) => {
    card?.monsterMove()
  })
}

const whenMonsterDead = (monsterIndex: number) => {
  const selectedMonster = gameStateStore.currentEnemy[monsterIndex]
  if (!selectedMonster) {
    console.error('找不到對應的怪物資訊', monsterIndex)
    return
  }
  // 紀錄擊殺
  trackStore.recordKill(selectedMonster.name)
  // 經驗取得
  playerStore.gainExp({monsterLevel: selectedMonster.level})
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
  // 特殊掉落道具
  specialExtraDrop()
  // 移除死亡怪
  gameStateStore.currentEnemy.splice(monsterIndex, 1);
  MonsterCardRefs.value.splice(monsterIndex, 1);
  // 確保選中狀態同步：如果選中的怪物被移除了，則取消選中
  if (monsterIndex >= gameStateStore.currentEnemy.length) {
    monsterIndex = null;
  }
  // 檢查怪物是否都死亡
  checkAllMonsterDead()
}

const checkAllMonsterDead = () => {
  // 怪物全部死亡
  if (gameStateStore.currentEnemy.length === 0) {
    gameStateStore.setBattleWon(true)
  }
}


/**
 * 玩家行動
 */
const isPlayerStuck = () => {
  const isStuck = playerStore.statusEffects.some((eff) => eff.type === 'stuck')
  if (isStuck) {
    useFloatingMessage(
        '動不了!',
        null,
        {
          duration: 1500,
          color: 'red'
        }
    );
  }
  return isStuck
}
// 玩家回合結束
const onPlayerTurnEnd = () => {
  playerStore.nextTurnStatus()
}
// 攻擊
const onAttack = () => {
  // 指定怪物
  if (!selectedMonsterIndex.value) {
    selectedMonsterIndex.value = 0
  }
  const selectedMonster = gameStateStore.currentEnemy[selectedMonsterIndex.value];
  if (!selectedMonster) {
    ElMessage.warning('無攻擊目標!')
    return
  }
  // 傷害計算
  if (!isPlayerStuck()) {
    selectedMonster.lastDamageResult = applyAttackDamage(playerStore.finalStats,
        getEffectiveStats(selectedMonster), selectedMonster)
  }

  // 怪物行動
  monsterMove()
  // 回合結束判定
  gameStateStore.tickAllMonsters()
  onPlayerTurnEnd()
}
// 物品使用
const onItemSkill = ({skillKey, callback, el}) => {
  // 指定怪物
  if (!selectedMonsterIndex.value) {
    selectedMonsterIndex.value = 0
  }
  const selectedMonster = gameStateStore.currentEnemy[selectedMonsterIndex.value];
  ItemSkill[skillKey](
      {
        monster: selectedMonster,
        monsterIndex: selectedMonsterIndex.value,
        playerStore: playerStore,
        gameStateStore: gameStateStore,
        callback: callback,
        targetElement: el
      }
  )
}
const isUsing = ref(false)
// 技能使用
const onSkill = async (skillKey: string) => {
  if (selectedMonsterIndex.value === null) selectedMonsterIndex.value = 0;
  const selectedMonster = gameStateStore.currentEnemy[selectedMonsterIndex.value];
  if (isUsing.value) return
  isUsing.value = true
  if (!isPlayerStuck()) {
    const targetElement = MonsterCardRefs.value[selectedMonsterIndex.value];
    // 加上 await 確保技能動作執行完畢
    const useSkill = Skills[skillKey] as SkillType
    const success = await useSkill.use({
      monster: selectedMonster,
      monsterIndex: selectedMonsterIndex.value,
      targetElement: targetElement?.$el,
      playerStore: playerStore,
      gameStateStore: gameStateStore
    });
    // 施展不生效就中斷
    if (!success) {
      isUsing.value = false
      return
    }
    // 熟練度增加
    playerStore.addSkillProficiency(useSkill.id, useSkill?.proficiency ?? 1)
    if (useSkill?.costSp) {
      const newSP = playerStore.info.sp - useSkill.costSp;
      playerStore.info.sp = Math.max(0, newSP)
    }
    if (useSkill?.costHp) {
      const newHP = playerStore.info.hp - useSkill.costHp;
      playerStore.info.hp = Math.max(0, newHP)
    }
  }
  // 怪物行動
  monsterMove()
  gameStateStore.tickAllMonsters()
  // 玩家回合結束判定
  onPlayerTurnEnd()
  isUsing.value = false
};
// 逃跑
const isEscape = ref(false)
const onRun = () => {
  if (isPlayerStuck() || !canEscape(playerStore.finalStats, gameStateStore.currentEnemy)) {
    emit('runFailed', true)
    monsterMove()
    gameStateStore.tickAllMonsters()
  } else {
    isEscape.value = true
    gameStateStore.setBattleWon(true)
  }
  // 回合結束判定
  onPlayerTurnEnd()
}


defineExpose({
  onAttack,
  onSkill,
  onRun,
  onItemSkill
})

// --- 初始化邏輯 (讀檔機制) ---

const init = () => {
  isEscape.value = false;
  selectedMonsterIndex.value = null;

  // 讀檔檢查：如果 Store 裡面已經有怪物資料，直接讀取
  if (gameStateStore.currentEnemy && gameStateStore.currentEnemy.length > 0) {
    return;
  }

  // 檢查是否有突襲怪物
  if (gameStateStore.switchEnemy && gameStateStore.switchEnemy.length > 0) {
    gameStateStore.setCurrentEnemy(gameStateStore.takeSwitchEnemy());
  } else {
    switch (currentRoomValue.value) {
      case RoomEnum.Fight.value:
        genMonsters(1, getWeightByStage() || {'Error': 1});
        break;
      case RoomEnum.EliteFight.value:
        genEliteMonster();
        break;
      case RoomEnum.Boss.value:
        createBoss()
        break
    }
  }
  // 回合開始的觸發
  nextTick().then(() => {
    gameStateStore.currentEnemy.forEach((monster, index) => {
      if (monster.onStart && MonsterOnStart[monster.onStart]) {
        // 執行對應的函式
        MonsterOnStart[monster.onStart]({
          monster: monster,
          playerStore: playerStore,
          gameStateStore: gameStateStore,
          logStore: logStore,
          targetElement: MonsterCardRefs.value[index].$el,
        });
      }
    })
  })
}

if (!gameStateStore.isBattleWon) {
  init()
}
</script>

<template>
  <div class="fight">
    <MonsterCard
        :ref="(el) => { if (el) MonsterCardRefs[index] = el as MonsterCardExposed }"
        v-for="(monster,index) in gameStateStore.currentEnemy"
        :key="index"
        :info="monster"
        :index="index"
        :is-selected="selectedMonsterIndex === index"
        @select="handleMonsterSelect(index)"
        @monster-die="whenMonsterDead(index)"
    />
    <div CLASS="victory-container" v-if="gameStateStore.isBattleWon">
      <span v-if="isEscape" class="run-message">你成功逃跑了!</span>
      <span
          v-else-if="gameStateStore.roomIs(RoomEnum.Boss.value)"
          class="victory-message">
        通關 {{ getEnumColumn(StageEnum, gameStateStore.currentStage) }}!
      </span>
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