<script setup lang="ts">
import './event-room.css'
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import EventTemplate from "@/components/RoomLayout/event/EventTemplate.vue";
import {ref} from "vue";
import {GameState} from "@/enums/enums";
import {useShopLogic} from "@/components/RoomLayout/comps/ShopRoom/useShopLogic";
import {getRandomItemsByQuality} from "@/utils/create";
import {Armor} from "@/constants/items/equipment/armor-info";
import {Head} from "@/constants/items/equipment/head-info";
import {Offhand} from "@/constants/items/equipment/offhand-info";
import {Weapon} from "@/constants/items/equipment/weapon-info";
import {Accessory1, Accessory2} from "@/constants/items/equipment/accessories-info";
import {getEnumColumn} from "@/utils/enum";
import {QualityEnum} from "@/enums/quality-enum";

/**
 * 狀態控制 (eventAction)
 * 0: 初始, 1: 動畫中, 2: 離開, 3: 結果
 */

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();
const isOpening = ref(false);
const resultType = ref<'treasure' | 'trap' | 'mimic' | 'equip' | null>(null);
const resultMsg = ref("這個地方剩下一個空空如也的寶箱。");
const {getWeightedQuality} = useShopLogic(gameStateStore.currentStage);
const onLeave = () => {
  gameStateStore.eventAction = 2;
  gameStateStore.transitionToNextState();
};

const openChest = () => {
  isOpening.value = true;
  gameStateStore.eventAction = 1;

  setTimeout(() => {
    const rnd = Math.random() * 100;

    // 金幣計算公式
    const baseGold = 30 + (gameStateStore.currentStage * 25);
    const goldFound = Math.floor(baseGold * (Math.random() * (1.2 - 0.8) + 0.8));

    if (rnd < 10) {
      // 10% 機率：獲得裝備 (Equip)
      resultType.value = 'equip';

      const equip = getRandomItemsByQuality(1, getWeightedQuality(), false, Armor, Head, Offhand, Weapon, Accessory1, Accessory2)[0];
      playerStore.gainItem(equip)

      resultMsg.value = `你在裡頭找到了<span style="color: ${getEnumColumn(QualityEnum, equip.quality, 'color')}; font-weight: bold;">${equip.name}</span>}!`;

    } else if (rnd < 40) {
      // 30% 機率：陷阱 (Trap)
      resultType.value = 'trap';
      const dmg = 10 + (gameStateStore.currentStage * 10);
      resultMsg.value = `咔噠！你觸發了陷阱！受到 <span style="color: #f56c6c;">${dmg}</span> 傷害`;
      playerStore.info.hp -= dmg;
    } else {
      // 60% 機率：金幣 (Treasure)
      resultType.value = 'treasure';
      playerStore.addGold(goldFound);
      resultMsg.value = `你發現了金幣！獲得了 <span style="color: #ffca28;">${goldFound} G</span>`;
    }

    isOpening.value = false;
    gameStateStore.eventAction = 3;
    gameStateStore.transitionToNextState();
  }, 1500);
};
</script>

<template>
  <EventTemplate title="神秘寶箱">
    <template #default>
      <div class="event-room-without-btn general-event">
        <template v-if="gameStateStore.eventAction === 0">
          <div class="event-icon">📦</div>
          <div class="dialog-box">
            <p>在房間的角落，你發現了一個佈滿灰塵的寶箱...</p>
            <p>它靜靜地待在那裡，似乎在誘惑著冒險者前去開啟。</p>
          </div>
        </template>

        <div v-else-if="isOpening" class="chest-container">
          <div class="chest-icon opening">📦</div>
          <p class="shaking-text">正在小心翼翼地開啟...</p>
        </div>

        <template v-else-if="gameStateStore.eventAction === 2">
          <div class="dialog-box">
            <p>謹慎為上。你選擇繞過這個寶箱，繼續前進。</p>
          </div>
        </template>

        <template v-else-if="gameStateStore.eventAction === 3">
          <div class="result-display">
            <div v-if="resultType === 'treasure'" class="result-icon treasure">💰</div>
            <div v-else-if="resultType === 'trap'" class="result-icon trap">🏹</div>
            <div v-else-if="resultType === 'mimic'" class="result-icon mimic">👾</div>

            <div class="dialog-box">
              <p :class="resultType" v-html="resultMsg"></p>
            </div>
          </div>
        </template>
      </div>
    </template>

    <template #button v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      <template v-if="gameStateStore.eventAction === 0">
        <el-button type="primary" @click="openChest">打開寶箱</el-button>
        <el-button type="info" @click="onLeave">離開</el-button>
      </template>
    </template>
  </EventTemplate>
</template>

<style scoped>
/* 寶箱晃動動畫 */
.chest-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.chest-icon {
  font-size: 4.5rem;
  margin-bottom: 1rem;
}

.opening {
  animation: shake 0.2s infinite;
}

.shaking-text {
  color: #aaa;
  font-style: italic;
}

.result-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

/* 各種結果的顏色 */
.treasure {
  color: #ffca28;
  text-shadow: 0 0 10px rgba(255, 202, 40, 0.5);
}

.trap {
  color: #f56c6c;
}

.mimic {
  color: #a335ee;
  animation: pulse 1s infinite;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  20% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  40% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  60% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  80% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  100% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.result-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
</style>