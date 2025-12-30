<script setup lang="ts">
import './event-room.css'
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import EventTemplate from "@/components/RoomLayout/event/EventTemplate.vue";
import {computed, ref} from "vue";
import {GameState, SpecialEventEnum} from "@/enums/enums";
import {ElMessage} from "element-plus";
import {Weapon} from "@/constants/items/equipment/weapon-info";
import {Potions} from "@/constants/items/usalbe-item/potion-info";
import {getRandomElements} from "@/utils/math";
import {RoomEnum} from "@/enums/room-enum";
import {SpecialBoss} from "@/constants/monsters/special-boss-info";
import {create} from "@/utils/create";

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();

/**
 * eventAction 狀態控制
 * 0: 初始, 1: 提交需求, 2: 結果
 */

/**
 * eventProcess 事件進度
 * 0: 提交物品(可拆樹)
 * 1: 獻祭
 * 2: 提交物品
 * 3. 獻祭
 * 4: 提交物品
 * 5. 獻祭/強制戰鬥
 */
const finalText = ref("");

const isAdvanced = computed(() => {
  return gameStateStore.getEventProcess(SpecialEventEnum.GetFruit) === 1 ||
      gameStateStore.getEventProcess(SpecialEventEnum.GetFruit) == 3
})

const handleChoice = (type: 'herb' | 'juice' | 'destroy' | 'sacrifice_hp' | 'sacrifice_sp' | 'sacrifice_all') => {
  gameStateStore.eventAction = 1;
  switch (type) {
    case 'herb':
      playerStore.removeItem(Potions.Heal0.name);
      break;
    case 'juice':
      playerStore.removeItem(Potions.Magic0.name);
      break;
  }
  setTimeout(() => {
    switch (type) {
      case 'herb':
        finalText.value = '枯樹吸收了草藥水，'
        const picked = getRandomElements(['ad', 'apIncrease', 'hit'])[0]
        if (picked === 'ad') {
          playerStore.info.ad += 3;
          finalText.value += "生長出一個咖啡色的果實，你吃下後攻擊力永久提升了！";
        } else if (picked === 'apIncrease') {
          playerStore.info.apIncrease += 3;
          finalText.value += "生長出一個藍色的果實，你吃下後法術傷害永久提升了！";
        } else {
          playerStore.info.hit += 3;
          finalText.value += "生長出一個綠色的果實，你吃下後命中值永久提升了！";
        }
        break;
      case 'juice':
        finalText.value = '枯樹長出了嫩芽，'
        const picked2 = getRandomElements(['critRate', 'adDefend', 'dodge'])[0]
        if (picked2 === 'critRate') {
          playerStore.info.critRate += 3;
          finalText.value += "生長出一個鮮紅色的嫩葉，你吃下後爆擊率永久提升了！";
        } else if (picked2 === 'adDefend') {
          playerStore.info.adDefend += 1;
          finalText.value += "生長出一個鐵灰色的嫩葉，你吃下後物理防禦永久提升了！";
        } else {
          playerStore.info.dodge += 3;
          finalText.value += "生長出一個青綠色的嫩葉，你吃下後閃避值永久提升了！";
        }
        break;
      case 'destroy':
        playerStore.gainItem(Weapon.SpikeSpear);
        finalText.value = "你粗暴地拆下了最堅硬樹枝，削成了一把尖刺木槍。枯樹發出了最後的哀鳴後彻底枯萎了。";
        break;
      case 'sacrifice_hp':
        if (playerStore.info.hp <= 50) {
          ElMessage.error("你的血量不足以獻祭...");
          gameStateStore.eventAction = 0;
          return;
        }
        playerStore.info.hp -= 50;
        playerStore.info.hpLimit += 25;
        finalText.value = "古樹貪婪地吸食了你的鮮血，作為回報，你的生命上限增加了。";
        break;
      case 'sacrifice_sp':
        if (playerStore.info.sp < 50) {
          ElMessage.error("你的魔力不足以獻祭...");
          gameStateStore.eventAction = 0;
          return;
        }
        playerStore.info.sp -= 50;
        playerStore.info.spLimit += 25;
        finalText.value = "古樹吸取了你的魔力，你感到靈魂一顫，魔力上限提升了。";
        break;
      case 'sacrifice_all':
        // 第五階段：獻祭全部生命
        playerStore.info.hp = 0;
        finalText.value = "你獻祭所有生命...魔樹發出了滿足的震動，將龐大的生命能量灌注回你殘破的軀殼中。你的潛能徹底爆發了！";
        // todo:獲得物品
        break;
    }
    gameStateStore.eventAction = 2;
    gameStateStore.transitionToNextState();
    if (type === 'destroy' || 'sacrifice_all') {
      gameStateStore.addEventProcess(SpecialEventEnum.GetFruit, true)
    } else {
      gameStateStore.addEventProcess(SpecialEventEnum.GetFruit)
    }
  }, 1000);
};

const onLeave = () => {
  if (gameStateStore.getEventProcess(SpecialEventEnum.GetFruit) === 5) {
    const boss = create(SpecialBoss.EvilWoodMan)
    // 怪物強化
    boss.hpLimit += playerStore.finalStats.hpLimit
    boss.hp += playerStore.finalStats.hpLimit
    boss.ad += playerStore.finalStats.ad
    boss.adDefend += playerStore.finalStats.adDefend
    gameStateStore.setCurrentEnemy([boss])
    gameStateStore.setRoom(RoomEnum.SpecialBoss.value)
  } else {
    gameStateStore.transitionToNextState();
  }
}
</script>

<template>
  <EventTemplate title="🪾神祕魔樹">
    <template #default>
      <div class="event-room-without-btn general-event">
        <template v-if="gameStateStore.stateIs(GameState.SELECTION_PHASE) && gameStateStore.eventAction === 0">
          <div class="event-icon">🪾</div>
          <div class="dialog-box">
            你快步遠離了這個邪惡氣息的東西...
          </div>
        </template>


        <template v-else-if="gameStateStore.eventAction === 0">
          <div class="event-icon">🪾</div>
          <div class="dialog-box">
            <template v-if="!isAdvanced">
              一顆<b>邪惡氣息的枯樹</b>聳立在那，<br/>雖然沒有葉子，卻散發著奇異的波動。<br/>
              你感覺它似乎在渴望著某些水分...
            </template>
            <template v-else>
              魔樹再次出現，這一次它的枝幹變成了暗紅色，<br/>
              低沉的聲音在你腦海響起：「獻祭...獲得...更多...」
            </template>
          </div>
        </template>

        <div v-else-if="gameStateStore.eventAction === 1" class="processing">
          <div class="event-icon absorbing">🌳</div>
          <p>正在發生變化...</p>
        </div>

        <template v-else-if="gameStateStore.eventAction === 2">
          <div class="event-icon pulse">✨</div>
          <div class="dialog-box">
            {{ finalText }}
          </div>
        </template>


      </div>
    </template>

    <template #button v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      <template v-if="gameStateStore.eventAction === 0">
        <template v-if="!isAdvanced">
          <!--    提交物品     -->
          <el-button
              :disabled="!playerStore.hasItem(Potions.Heal0.name)[0]"
              type="success"
              @click="handleChoice('herb')">
            提供 [{{ Potions.Heal0.name }}]
          </el-button>
          <el-button
              :disabled="!playerStore.hasItem(Potions.Magic0.name)[0]"
              type="warning"
              @click="handleChoice('juice')">
            提供 [{{ Potions.Magic0.name }}]
          </el-button>
          <el-button
              v-if="gameStateStore.getEventProcess(SpecialEventEnum.GetFruit) === 0"
              type="danger"
              @click="handleChoice('destroy')">
            拆毀它
          </el-button>
        </template>
        <template v-else-if="gameStateStore.getEventProcess(SpecialEventEnum.GetFruit) === 5">
          <el-button
              type="danger"
              style="font-weight: bold; border: 2px solid black;"
              @click="handleChoice('sacrifice_all')">
            獻祭全部生命
          </el-button>
        </template>
        <template v-else>
          <el-button type="danger" @click="handleChoice('sacrifice_hp')">獻祭 50 HP</el-button>
          <el-button type="primary" @click="handleChoice('sacrifice_sp')">獻祭 50 SP</el-button>
        </template>
        <el-button type="info" @click="onLeave">快步離開</el-button>
      </template>
    </template>
  </EventTemplate>
</template>

<style scoped>

/* 吸收動畫 */
.absorbing {
  animation: absorb 1s infinite ease-in-out;
}

@keyframes absorb {
  0%, 100% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.1);
    filter: brightness(1.5) drop-shadow(0 0 15px green);
  }
}

/* 完成後的脈動動畫 */
.pulse {
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0% {
    filter: drop-shadow(0 0 5px gold);
  }
  50% {
    filter: drop-shadow(0 0 20px white);
  }
  100% {
    filter: drop-shadow(0 0 5px gold);
  }
}


</style>