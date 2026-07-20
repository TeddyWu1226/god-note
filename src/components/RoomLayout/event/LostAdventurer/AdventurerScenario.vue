<script setup lang="ts">
import {computed, onMounted} from "vue";
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {SpecialEventEnum} from "@/enums/enums";
import {Potions} from "@/constants/items/usalbe-item/potion-info";
import {POTION_BASE_PRICE} from "@/components/RoomLayout/room/ShopRoom/useShopLogic";
const props = defineProps({
  view: {
    type: String, // 'content' | 'button'
    required: true
  }
});

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();

// 初始化需要的道具
onMounted(() => {
  if (!gameStateStore.otherRecord['ADVENTURER_NEED_ITEM']) {
    const stageIndex = Math.max(0, Math.min(5, gameStateStore.currentStage - 1));
    const isHeal = Math.random() < 0.5;
    const potionKey = `${isHeal ? 'Heal' : 'Magic'}${stageIndex}`;
    const potion = (Potions as Record<string, any>)[potionKey];

    if (potion) {
      gameStateStore.otherRecord['ADVENTURER_NEED_ITEM'] = potion.name;
      gameStateStore.otherRecord['ADVENTURER_REWARD_GOLD'] = (POTION_BASE_PRICE[stageIndex] || 0) * 2;
    } else {
      gameStateStore.otherRecord['ADVENTURER_NEED_ITEM'] = Potions.Heal5.name;
      gameStateStore.otherRecord['ADVENTURER_REWARD_GOLD'] = 2000;
    }
  }
});

const needItemName = computed(() => gameStateStore.otherRecord['ADVENTURER_NEED_ITEM'] || '');
const rewardGold = computed(() => gameStateStore.otherRecord['ADVENTURER_REWARD_GOLD'] || 0);
const isResolved = computed(() => !!gameStateStore.otherRecord['ADVENTURER_RESOLVED']);
const hasNeedItem = computed(() => playerStore.hasItem(needItemName.value)[0]);

const handleGive = () => {
  if (playerStore.removeItem(needItemName.value, 1)) {
    playerStore.info.gold += rewardGold.value;
    gameStateStore.otherRecord['ADVENTURER_RESOLVED'] = true;
    gameStateStore.transitionToNextState();
  }
};

const handleLeave = () => {
  gameStateStore.transitionToNextState();
};
</script>

<template>
  <!-- 內容視圖 -->
  <template v-if="props.view === 'content'">
    <div class="general-event">
      <template v-if="!isResolved">
        <div class="event-icon">🤕</div>
        <div class="dialog-box">
          <p>走近一看，這是一名在戰鬥中受了重傷的冒險者，倒在地上痛苦地呻吟。</p>
          <p>他用微弱的聲音請求：</p>
          <p class="talk-text">
            「求求你... 能給我一個 <span class="special-item-text" style="text-decoration: underline;">{{
              needItemName
            }}</span> 嗎？我快撐不下去了...」
          </p>
        </div>
      </template>

      <template v-else>
        <div class="event-icon shine">💰</div>
        <div class="dialog-box">
          <p>冒險者接過道具使用，臉色逐漸恢復了紅潤。</p>
          <p class="talk-text">「謝謝你！這是我報酬，請務必收下。」</p>
          <p class="hint" style="font-weight: bold; margin-top: 1rem; text-align: center;">
            你獲得了 <span  style="color: #ffd700">{{
              rewardGold
            }} 金幣</span>！
          </p>
        </div>
      </template>
    </div>
  </template>

  <!-- 按鈕視圖 -->
  <template v-else-if="props.view === 'button'">
    <template v-if="!isResolved">
      <el-button type="success" :disabled="!hasNeedItem" @click="handleGive">
        給予 {{ needItemName }}
      </el-button>
      <el-button type="info" @click="handleLeave">
        拒絕並離開
      </el-button>
    </template>
  </template>
</template>
