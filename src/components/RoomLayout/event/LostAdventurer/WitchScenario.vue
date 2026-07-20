<script setup lang="ts">
import {computed, onMounted} from "vue";
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {SpecialEventEnum} from "@/enums/enums";
import {MonsterCrystals} from "@/constants/items/material/material-info";

const props = defineProps({
  view: {
    type: String, // 'content' | 'button'
    required: true
  }
});

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();

// 初始化需要的晶石
onMounted(() => {
  if (!gameStateStore.otherRecord['WITCH_NEED_ITEM']) {
    const crystalIndex = Math.max(0, Math.min(6, gameStateStore.maxClearedStage - 1));
    const crystalList = [
      MonsterCrystals.BadNormal,
      MonsterCrystals.LowerNormal,
      MonsterCrystals.MediumNormal,
      MonsterCrystals.MediumUpperNormal,
      MonsterCrystals.MediumSuperiorNormal,
      MonsterCrystals.TopNormal,
      MonsterCrystals.DemonJewelry
    ];
    const crystal = crystalList[crystalIndex] || MonsterCrystals.BadNormal;

    gameStateStore.otherRecord['WITCH_NEED_ITEM'] = crystal.name;
    gameStateStore.otherRecord['WITCH_REWARD_EXP'] = crystal.price * 2;
  }
});

const needCrystalName = computed(() => gameStateStore.otherRecord['WITCH_NEED_ITEM'] || '');
const rewardExp = computed(() => gameStateStore.otherRecord['WITCH_REWARD_EXP'] || 0);
const isResolved = computed(() => !!gameStateStore.otherRecord['WITCH_RESOLVED']);
const hasNeedCrystal = computed(() => playerStore.hasItem(needCrystalName.value)[0]);

const handleGive = () => {
  if (playerStore.removeItem(needCrystalName.value, 1)) {
    playerStore.gainExp({amount: rewardExp.value});
    gameStateStore.otherRecord['WITCH_RESOLVED'] = true;
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
        <div class="event-icon">🧙🏻‍♀️</div>
        <div class="dialog-box">
          <p>神祕的人影緩緩抬頭，兜帽下露出一雙散發著紫色微光的眼眸，這是一位神祕的女巫。</p>
          <p class="story-text" style="color: #9c27b0;">
            「神秘的旅人，若你願意奉獻一顆 <span class="special-item-text"
                                               style="text-decoration: underline;">{{ needCrystalName }}</span>，我將給予你靈魂的強化。」
          </p>
        </div>
      </template>

      <template v-else>
        <div class="event-icon shine">🔮</div>
        <div class="dialog-box">
          <p>女巫伸出蒼白的手指接過晶石，晶石在她的掌心化為無數美麗的星塵隨風消逝。</p>
          <p>「明智的抉擇... 靈魂的智慧已與你同在。」</p>
          <p class="hint">
            你獲得了
            <span style="color: #409eff;">
              {{ rewardExp }} 點經驗值
            </span>
          </p>
        </div>
      </template>
    </div>
  </template>

  <!-- 按鈕視圖 -->
  <template v-else-if="props.view === 'button'">
    <template v-if="!isResolved">
      <el-button type="success" :disabled="!hasNeedCrystal" @click="handleGive">
        奉獻 {{ needCrystalName }}
      </el-button>
      <el-button type="info" @click="handleLeave">
        拒絕並離開
      </el-button>
    </template>
  </template>
</template>
