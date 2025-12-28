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

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();

// 0: 初始, 1: 吸收中, 2: 完成
const answer = ref(0);
const finalText = ref("");

const isAdvanced = computed(() => {
  return gameStateStore.getEventProcess(SpecialEventEnum.GetFruit) == 1
})

const handleChoice = (type: 'herb' | 'juice' | 'destroy' | 'sacrifice_hp' | 'sacrifice_sp') => {
  answer.value = 1;
  switch (type) {
    case 'herb':
      playerStore.removeItem(Potions.heal0.name);
      break;
    case 'juice':
      playerStore.removeItem(Potions.magic0.name);
      break;
  }
  setTimeout(() => {
    switch (type) {
      case 'herb':
        playerStore.info.ad += 5;
        finalText.value = "枯樹吸收了草藥水，生長出一個咖啡色的小果實，你吃下後攻擊力永久提升了！";
        break;
      case 'juice':
        playerStore.info.hpLimit += 30;
        playerStore.info.hp += 30; // 上限增加時同時補血
        finalText.value = "枯樹長出了嫩芽，生長出一個鮮紅色的嫩葉，你吃下後生命上限提升了！";
        break;
      case 'destroy':
        playerStore.gainItem(Weapon.SpikeSpear);
        finalText.value = "你粗暴地拆下了最堅硬樹枝，削成了一把尖刺木槍。枯樹發出了最後的哀鳴後彻底枯萎了。";
        break;
      case 'sacrifice_hp':
        if (playerStore.info.hp <= 50) {
          ElMessage.error("你的血量不足以獻祭...");
          answer.value = 0;
          return;
        }
        playerStore.info.hp -= 50;
        playerStore.info.hpLimit += 25;
        finalText.value = "古樹貪婪地吸食了你的鮮血，作為回報，你的生命上限增加了。";
        break;
      case 'sacrifice_sp':
        if (playerStore.info.sp < 50) {
          ElMessage.error("你的魔力不足以獻祭...");
          answer.value = 0;
          return;
        }
        playerStore.info.sp -= 50;
        playerStore.info.spLimit += 25;
        finalText.value = "古樹吸取了你的魔力，你感到靈魂一顫，魔力上限提升了。";
        break;
    }
    answer.value = 2;
    gameStateStore.transitionToNextState();
    if (type === 'destroy') {
      gameStateStore.addEventProcess(SpecialEventEnum.GetFruit, true)
    } else {
      gameStateStore.addEventProcess(SpecialEventEnum.GetFruit)
    }
  }, 1000);
};

const onLeave = () => {
  gameStateStore.transitionToNextState();
}
</script>

<template>
  <EventTemplate title="🪾神祕魔樹">
    <template #default>
      <div class="event-room-without-btn general-event">
        <template v-if="gameStateStore.stateIs(GameState.SELECTION_PHASE) && answer === 0">
          <div class="event-icon">🪾</div>
          <div class="dialog-box">
            這裡只剩下一截普通的樹樁。
          </div>
        </template>


        <template v-else-if="answer === 0">
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

        <div v-else-if="answer === 1" class="processing">
          <div class="tree-icon absorbing">🌳</div>
          <p>正在發生變化...</p>
        </div>

        <template v-else-if="answer === 2">
          <div class="tree-icon pulse">✨</div>
          <div class="dialog-box">
            {{ finalText }}
          </div>
        </template>


      </div>
    </template>

    <template #button v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      <template v-if="answer === 0">
        <template v-if="!isAdvanced">
          <el-button
              :disabled="!playerStore.hasItem(Potions.heal0.name)[0]"
              type="success"
              @click="handleChoice('herb')">
            提供 [{{ Potions.heal0.name }}]
          </el-button>
          <el-button
              :disabled="!playerStore.hasItem(Potions.magic0.name)[0]"
              type="warning"
              @click="handleChoice('juice')">
            提供 [{{ Potions.magic0.name }}]
          </el-button>
          <el-button
              type="danger"
              @click="handleChoice('destroy')">
            拆毀枯樹
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