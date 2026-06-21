<script setup lang="ts">
import '../room.css'
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import RoomTemplate from "@/components/RoomLayout/comps/RoomTemplate.vue";
import {ref} from "vue";
import {GameState} from "@/enums/enums";
import {useShopLogic} from "@/components/RoomLayout/room/ShopRoom/useShopLogic";
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
 * 0: 初始, 2: 離開, 3: 結果
 */

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();
const isOpening = ref(false);
const resultType = ref<'treasure' | 'trap' | 'mimic' | 'equip' | null>(null);
const resultMsg = ref("這個地方剩下一個空空如也的寶箱。");

const {getEquipWeightedQuality} = useShopLogic(gameStateStore.currentStage);

const onLeave = () => {
  gameStateStore.eventAction = 2;
  gameStateStore.transitionToNextState();
};

const openChest = () => {
  // 動畫啟動，但不切換 eventAction
  isOpening.value = true;

  setTimeout(() => {
    const rnd = Math.random() * 100;
    const stage = gameStateStore.currentStage;

    // 金幣計算公式：基礎 30 + (層數*25)，範圍 80%~120%
    const baseGold = 30 + (stage * 25);
    const goldFound = Math.floor(baseGold * (Math.random() * (1.2 - 0.8) + 0.8));

    if (rnd < 40) {
      // 40% 機率：獲得裝備 (Equip)
      resultType.value = 'equip';
      const equip = getRandomItemsByQuality(
          1,
          getEquipWeightedQuality(),
          false,
          Armor, Head, Offhand, Weapon, Accessory1, Accessory2
      )[0];

      playerStore.gainItem(equip);
      const color = getEnumColumn(QualityEnum, equip.quality, 'color');
      resultMsg.value = `在裡頭找到了 <span style="color: ${color}; font-weight: bold;">[${equip.name}]</span>!`;

    } else if (rnd < 60) {
      // 20% 機率：陷阱 (Trap)
      resultType.value = 'trap';
      const dmg = 10 + (stage * 5);
      const result = playerStore.takeDamage(dmg);
      if (result.shieldAbsorbed > 0) {
        if (result.hpDamage > 0) {
          resultMsg.value = `咔噠！觸發了箭矢陷阱！護盾吸收了 <span style="color: #ffffff; font-weight: bold;">${result.shieldAbsorbed}</span> 點傷害，受到 <span style="color: #f56c6c; font-weight: bold;">${result.hpDamage}</span> 點傷害`;
        } else {
          resultMsg.value = `咔噠！觸發了箭矢陷阱！但被護盾吸收了全部的 <span style="color: #ffffff; font-weight: bold;">${result.shieldAbsorbed}</span> 點傷害！`;
        }
      } else {
        resultMsg.value = `咔噠！觸發了箭矢陷阱！受到 <span style="color: #f56c6c; font-weight: bold;">${dmg}</span> 點傷害`;
      }
    } else {
      resultType.value = 'treasure';
      playerStore.addGold(goldFound);
      resultMsg.value = `發現了金幣！獲得了 <span style="color: #ffca28; font-weight: bold;">${goldFound} G</span>`;
    }

    // 動畫結束，切換到結果狀態
    isOpening.value = false;
    gameStateStore.eventAction = 3;
    gameStateStore.transitionToNextState();
  }, 1500);
};
</script>

<template>
  <RoomTemplate title="神秘寶箱">
    <template #default>
      <div class="general-event">
        <template v-if="gameStateStore.eventAction === 0">
          <div :class="['event-icon', { 'opening-animation': isOpening }]">📦</div>
          <div class="dialog-box">
            <p v-if="!isOpening">有一個佈滿灰塵的寶箱...</p>
            <p v-else class="shaking-text">正在小心翼翼地開啟...</p>
          </div>
        </template>

        <template v-else-if="gameStateStore.eventAction === 2">
          <div class="event-icon" style="opacity: 0.5">📦</div>
          <div class="dialog-box">
            <p>謹慎為上。不打開這個寶箱，繼續前進。</p>
          </div>
        </template>

        <template v-else-if="gameStateStore.eventAction === 3">
          <div class="result-display">
            <div v-if="resultType === 'treasure'" class="result-icon treasure">💰</div>
            <div v-else-if="resultType === 'trap'" class="result-icon trap">🏹</div>
            <div v-else-if="resultType === 'equip'" class="result-icon equip">⚔️</div>

            <div class="dialog-box">
              <p :class="resultType" v-html="resultMsg"></p>
            </div>
          </div>
        </template>
      </div>
    </template>

    <template #button v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      <template v-if="gameStateStore.eventAction === 0">
        <el-button
            type="primary"
            @click="openChest"
            :loading="isOpening"
        >
          打開寶箱
        </el-button>
        <el-button
            type="info"
            @click="onLeave"
            :disabled="isOpening"
        >
          離開
        </el-button>
      </template>
    </template>
  </RoomTemplate>
</template>

<style scoped>
/* 震動動畫 */
.opening-animation {
  animation: shake 0.2s infinite;
}

.shaking-text {
  color: #ffca28;
  font-style: italic;
  animation: pulse 1s infinite;
}

.result-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

/* 狀態顏色與特效 */
.treasure {
  color: #ffca28;
  text-shadow: 0 0 1rem rgba(255, 202, 40, 0.4);
}

.trap {
  color: #f56c6c;
}

.equip {
  color: #a335ee;
  text-shadow: 0 0 1.2rem rgba(163, 53, 238, 0.5);
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
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

.result-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

:deep(.dialog-box span) {
  text-shadow: 0 0 0.5rem currentColor;
}
</style>