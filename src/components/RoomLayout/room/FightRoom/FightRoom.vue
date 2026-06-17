<script setup lang="ts">
import {getEnumColumn} from "@/utils/enum";
import {QualityEnum} from "@/enums/quality-enum";
import {RoomEnum} from "@/enums/room-enum";
import {MonsterCardExposed} from "@/components/RoomLayout/comps/types";
import MonsterCard from "@/components/RoomLayout/comps/MonsterCard.vue";
import {getEffectiveStats, useGameStateStore} from "@/store/game-state-store";
import {computed, nextTick, ref, watch} from "vue";
import {ItemType, MonsterType} from "@/types";
import {
  applyAttackDamage,
  applyRandomFloatAndRound,
  canEscape,
  getLootFromTable,
  spawnMonsters
} from "@/constants/fight-func";
import {ElMessage} from "element-plus";
import {usePlayerStore} from "@/store/player-store";
import {StageEnum} from "@/enums/stage-enum";
import {EndlessWeights} from "@/constants/stage-monster-weights";
import {Boss, StageBosses} from "@/constants/monsters/monster-info/99-boss-info";
import {useLogStore} from "@/store/log-store";
import {MonsterModel as MonsterClass, GenericMonster} from "@/models/monster-model";
import {MonsterFactory} from "@/constants/monsters/monster-factory";
import {useFloatingMessage} from "@/components/Shared/FloatingMessage/useFloatingMessage";
import {stageMonsterWeightsMap} from "@/constants/stage-weights";
import {useTrackerStore} from "@/store/track-store";
import {SkillModel} from "@/models/skill-model";
import {SkillFactory} from "@/constants/skill/learned-skill";
import {ItemSkill} from "@/constants/skill/item-skill";
import RoomTemplate from "@/components/RoomLayout/comps/RoomTemplate.vue";
import FightOperation from "@/components/RoomLayout/room/FightRoom/FightOperation.vue";

const emit = defineEmits(['runFailed'])
const gameStateStore = useGameStateStore()
const playerStore = usePlayerStore()
const logStore = useLogStore()
const trackStore = useTrackerStore()

const showLogDialog = ref(false)
const logScrollRef = ref<HTMLElement | null>(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (logScrollRef.value) {
      logScrollRef.value.scrollTop = logScrollRef.value.scrollHeight
    }
  })
}

watch(showLogDialog, (newVal) => {
  if (newVal) {
    scrollToBottom()
  }
})

watch(() => logStore.logs.length, () => {
  if (showLogDialog.value) {
    scrollToBottom()
  }
})
const currentRoomValue = computed(() => {
      return gameStateStore.currentRoomValue
    }
)


const MonsterCardRefs = ref<Record<string, MonsterCardExposed>>({});
const monsterDropGold = ref(0)
const monsterDropItems = ref<ItemType[]>([])
// 怪物生成
const genMonsters = (count: number, weight: Record<string, number>, eliteBoost = false) => {
  const strengthening = 1 + gameStateStore.days * 0.005
  const newMonsters = spawnMonsters(count, weight, strengthening, eliteBoost);
  // 同步到 Store 做持久化緩存
  gameStateStore.setCurrentEnemy(newMonsters);
}


const getWeightByStage = () => {
  const day = Math.max(1, gameStateStore.stageDays)
  const subZoneIdx = Math.min(4, Math.floor((day - 1) / 20))
  const oldStageIndex = (gameStateStore.currentStage - 1) * 5 + 1 + subZoneIdx
  const originalMap = stageMonsterWeightsMap[oldStageIndex] || EndlessWeights
  const monsterMap = {...originalMap}
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


/**
 * 高效率查詢
 */

const createBoss = () => {
  let newMonsters: MonsterClass[]

  if (gameStateStore.currentStage === 6) {
    let boss: MonsterType
    if (gameStateStore.stageDays === 5) {
      boss = Boss.GodsRealm
    } else if (gameStateStore.stageDays === 10) {
      boss = Boss.TowerVoid
    } else {
      boss = Boss.TowerVoid
    }
    newMonsters = [MonsterFactory.createMonster(boss.class || boss.name, boss)]
  } else {
    const stageBoss = StageBosses[gameStateStore.currentStage]
    let boss: MonsterType
    if (stageBoss) {
      if (gameStateStore.stageDays === 50) {
        boss = stageBoss.mini
      } else if (gameStateStore.stageDays === 100) {
        boss = stageBoss.main
      } else {
        boss = stageBoss.main
      }
    } else {
      boss = Boss.Error
    }
    newMonsters = [MonsterFactory.createMonster(boss.class || boss.name, boss)]
  }

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
  // 移除死亡怪
  gameStateStore.currentEnemy.splice(monsterIndex, 1);
  // 確保選中狀態同步
  if (selectedMonsterIndex.value === monsterIndex) {
    selectedMonsterIndex.value = null;
  } else if (selectedMonsterIndex.value !== null && selectedMonsterIndex.value > monsterIndex) {
    selectedMonsterIndex.value--;
  }
  // 檢查怪物是否都死亡
  checkAllMonsterDead()
}

const checkAllMonsterDead = () => {
  // 怪物全部死亡
  if (gameStateStore.currentEnemy.length === 0) {
    if (gameStateStore.currentStage === 6 && gameStateStore.stageDays === 10) {
      gameStateStore.isVictory = true
    } else {
      gameStateStore.setBattleWon(true)
    }
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

const resolveRoundEnd = () => {
  // 怪物行動
  monsterMove()
  // 回合結束判定
  gameStateStore.tickAllMonsters()
  // 記錄後續回合日誌
  logStore.logger.add(`<div style="color: #409eff; font-weight: bold; margin-top: 8px;">⚔️ === 第 ${gameStateStore.battleRound} 回合 ===</div>`);
  // 玩家狀態結算
  onPlayerTurnEnd()
  // 補滿行動點數
  gameStateStore.refillActionPoints()
}

const onEndTurn = () => {
  resolveRoundEnd()
}

// 攻擊
const onAttack = () => {
  if (gameStateStore.playerActionPoints < 1) {
    ElMessage.warning('行動點數不足！')
    return
  }

  // 指定怪物
  if (!selectedMonsterIndex.value) {
    selectedMonsterIndex.value = 0
  }
  const selectedMonster = gameStateStore.currentEnemy[selectedMonsterIndex.value];
  if (!selectedMonster) {
    ElMessage.warning('無攻擊目標!')
    return
  }

  // 扣除行動點數
  gameStateStore.playerActionPoints -= 1

  // 傷害計算
  if (!isPlayerStuck()) {
    selectedMonster.lastDamageResult = applyAttackDamage(playerStore.finalStats,
        getEffectiveStats(selectedMonster), selectedMonster)
  }

  // 檢查是否回合結束
  if (gameStateStore.playerActionPoints <= 0) {
    resolveRoundEnd()
  }
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

  const useSkill = playerStore.info.skills.find((s: any) => s.id === skillKey) || SkillFactory.createSkill(skillKey);
  const costAction = useSkill?.costAction ?? 1

  if (gameStateStore.playerActionPoints < costAction) {
    ElMessage.warning('行動點數不足！')
    return
  }

  isUsing.value = true
  if (!isPlayerStuck()) {
    const monsterId = selectedMonsterIndex.value !== null ? gameStateStore.currentEnemy[selectedMonsterIndex.value]?.id : null;
    const targetElement = monsterId ? MonsterCardRefs.value[monsterId] : null;
    // 加上 await 確保技能動作執行完畢
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

    // 扣除行動點數
    gameStateStore.playerActionPoints -= costAction

    // 熟練度增加
    playerStore.addSkillProficiency(useSkill.id)
    if (useSkill?.costSp) {
      const newSP = playerStore.info.sp - useSkill.costSp;
      playerStore.info.sp = Math.max(0, newSP)
    }
    if (useSkill?.costHp) {
      const newHP = playerStore.info.hp - useSkill.costHp;
      playerStore.info.hp = Math.max(0, newHP)
    }
  }

  isUsing.value = false

  // 檢查是否回合結束
  if (gameStateStore.playerActionPoints <= 0) {
    resolveRoundEnd()
  }
};
// 逃跑
const isEscape = ref(false)
const onRun = () => {
  if (isPlayerStuck() || !canEscape(playerStore.finalStats, gameStateStore.currentEnemy)) {
    emit('runFailed', true)
    monsterMove()
    gameStateStore.tickAllMonsters()
    // 記錄後續回合日誌
    logStore.logger.add(`<div style="color: #409eff; font-weight: bold; margin-top: 8px;">⚔️ === 第 ${gameStateStore.battleRound} 回合 ===</div>`);
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
  onItemSkill,
  onEndTurn
})

// --- 初始化邏輯 (讀檔機制) ---

const init = () => {
  isEscape.value = false;
  selectedMonsterIndex.value = null;

  // 💡 重置技能冷卻時間
  if (playerStore.info.skills) {
    playerStore.info.skills.forEach((skill: any) => {
      if (skill instanceof SkillModel) {
        skill.currentCd = 0;
      }
    });
  }

  // 讀檔檢查：如果 Store 裡面已經有怪物資料，直接讀取
  if (gameStateStore.currentEnemy && gameStateStore.currentEnemy.length > 0) {
    if (gameStateStore.playerActionPoints <= 0) {
      gameStateStore.refillActionPoints();
    }
    return;
  }

  // 初始化行動點數
  gameStateStore.refillActionPoints();

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
      if (monster instanceof MonsterClass) {
        monster.triggerOnStart({
          playerStore: playerStore,
          gameStateStore: gameStateStore,
          logStore: logStore,
          targetElement: MonsterCardRefs.value[monster.id]?.$el,
        });
      }
    })
  })

  // 新戰鬥開始，寫入第一回合日誌
  logStore.logger.clear();
  logStore.logger.add('<div style="color: #409eff; font-weight: bold; margin-top: 4px;">⚔️ === 第 1 回合 ===</div>');
}

if (!gameStateStore.isBattleWon) {
  init()
}

</script>

<template>
  <RoomTemplate>
    <template #title>
      <div class="flex items-center">
        <span style="padding-right: 1rem">
          {{ getEnumColumn(RoomEnum, currentRoomValue) }}
        </span>
        <div
            class="battle-round-badge"
            @click="showLogDialog = true"
            style="cursor: pointer;"
        >
          <span>第 {{ gameStateStore.battleRound }} 回合 📜</span>
        </div>
      </div>
    </template>
    <template #default>
      <div class="fight">
        <MonsterCard
            :ref="(el) => { if (el) { MonsterCardRefs[monster.id] = el as MonsterCardExposed } else { delete MonsterCardRefs[monster.id] } }"
            v-for="(monster,index) in gameStateStore.currentEnemy"
            :key="monster.id"
            :info="monster"
            :index="index"
            :is-selected="selectedMonsterIndex === index"
            @select="handleMonsterSelect(index)"
            @monster-die="whenMonsterDead(index)"
        />
        <div class="victory-container" v-if="gameStateStore.isBattleWon">
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
      </div>

      <!-- 戰鬥日誌 Dialog -->
      <el-dialog
          v-model="showLogDialog"
          title="📜 戰鬥詳細日誌"
          width="500px"
          append-to-body
          destroy-on-close
      >
        <div class="combat-log-container">
          <div v-if="logStore.logs.length === 0" class="no-logs">
            暫無戰鬥日誌
          </div>
          <div v-else class="combat-log-scroll" ref="logScrollRef">
            <div
                v-for="log in logStore.logs"
                :key="log.id"
                class="log-item"
            >
              <span class="log-text" v-html="log.message"></span>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" size="small" @click="showLogDialog = false">關閉</el-button>
          </div>
        </template>
      </el-dialog>
    </template>
    <template #button>
      <FightOperation
          ref="FightOperationRef"
          @skill="onSkill"
          @attack="onAttack"
          @run="onRun"
          @end-turn="onEndTurn"
      />
    </template>

  </RoomTemplate>

</template>

<style scoped>
.fight {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  position: relative;
  flex-grow: 1;
  width: 100%;
  height: auto;
  min-height: 90%;
  padding: 0.8rem 0;
  box-sizing: border-box;
}

.battle-round-badge {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid var(--el-color-primary);
  border-radius: 20px;
  padding: 2px 14px;
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--el-color-primary);
  box-shadow: 0 0 10px rgba(64, 158, 255, 0.3);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.battle-round-badge:hover {
  background: var(--el-color-primary);
  color: #fff;
  box-shadow: 0 0 15px rgba(64, 158, 255, 0.6);
  transform: scale(1.05);
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
/* ⭐️ 戰鬥日誌 Dialog 內容樣式 */
/* ---------------------------------------------------- */
.combat-log-container {
  padding: 5px 0;
}

.no-logs {
  text-align: center;
  color: #888;
  padding: 20px;
  font-size: 0.95rem;
}

.combat-log-scroll {
  max-height: 380px;
  overflow-y: auto;
  padding: 12px;
  background-color: #121214;
  border: 1px solid #30303b;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  scrollbar-width: thin;
}

.log-item {
  padding: 4px 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.log-item:last-child {
  border-bottom: none;
}

.log-text {
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.9rem;
  line-height: 1.4;
  word-break: break-all;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>