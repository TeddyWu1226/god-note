<script setup lang="ts">

import {RoomEnum} from "@/enums/room-enum";
import {MonsterCardExposed} from "@/components/RoomLayout/comps/types";
import MonsterCard from "@/components/RoomLayout/comps/MonsterCard.vue";
import {useGameStateStore} from "@/store/game-state-store";
import {computed, onMounted, Reactive, ref} from "vue";
import {MonsterType} from "@/types";
import {createMonster, Monster} from "@/assets/monster-info";
import {applyDamage, applyRandomFloatAndRound, triggerDamageEffect} from "@/assets/fight-func";
import {UserInfo} from "@/storage/userinfo-storage";
import {ElMessage} from "element-plus";

const emit = defineEmits(['playerDead'])
const gameStateStore = useGameStateStore()

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
 * 生成對應怪物
 */
const genMonster = (layer: number) => {
  // 緩存召喚的怪物
  // gameStateStore.setCurrentEnemy(['Slime'])
  monsters.value.push(createMonster(Monster.Slime))
}
const selectedMonsterIndex = ref<number | null>(null);

/**
 * 處理 MonsterCard 的點擊事件，實現單選邏輯。
 * @param index 被點擊怪物的索引
 */
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
  const damageOutput = applyDamage(selectedMonster, UserInfo.value);
  triggerDamageEffect(damageOutput)
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
  const damageOutput = applyDamage(UserInfo.value, selectedMonster);
  const targetElement = monsterCardRefs.value[selectedMonsterIndex.value];
  console.log('targetElement', targetElement)
  triggerDamageEffect(damageOutput, targetElement.$el)
  if (damageOutput.isHit) {
    targetElement?.shake()
  }

  // 怪物是否死亡
  // 判斷條件：怪物的 hp 必須 > 0
  const livingMonsters = monsters.value.filter(monster => monster.hp > 0);
  monsters.value = livingMonsters as Reactive<MonsterType>[];

  // 確保選中狀態同步：如果選中的怪物被移除了，則取消選中
  if (selectedMonsterIndex.value >= monsters.value.length) {
    selectedMonsterIndex.value = null;
  }
  // 怪物全部死亡
  if (monsters.value.length === 0) {
    gameStateStore.setBattleWon(true)
    UserInfo.value.gold += monsterDropGold.value
  }

  // 怪物行動
  if (!damageOutput.isKilled) {
    monsterDropGold.value += applyRandomFloatAndRound(selectedMonster.dropGold ?? 0)
    monsterMove(selectedMonster)
  }
}


defineExpose({
  onAttack
})

// 初始化
const init = () => {
  const layer = gameStateStore.getCurrentRoom[0]
  // 切換房間時清空怪物列表
  clearMonsters();
  // 切換房間時，清除選中狀態
  selectedMonsterIndex.value = null;
  switch (currentRoomValue.value) {
    case RoomEnum.Fight.value:
      genMonster(layer)
      break
    case RoomEnum.EliteFight.value:
      genMonster(layer)
      genMonster(layer)
      break
  }
}
init()
onMounted(() => {
  console.log('u偶喔')
})
</script>

<template>
  <div class="fight"
       v-if="currentRoomValue === RoomEnum.Fight.value ||
         currentRoomValue === RoomEnum.EliteFight.value"
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
      <span class="victory-message">勝利!</span>
      <span v-if="monsterDropGold">你獲得了 {{ monsterDropGold }} G!</span>
    </div>
  </div>
</template>

<style scoped>
.fight {
  padding: 2rem;
  display: flex;
  justify-content: space-around;
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
</style>