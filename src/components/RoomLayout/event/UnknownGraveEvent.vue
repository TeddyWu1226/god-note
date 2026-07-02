<script setup lang="ts">
import '../room.css'
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {useRelicStore} from "@/store/relic-store";
import RoomTemplate from "@/components/RoomLayout/comps/RoomTemplate.vue";
import {GameState, SpecialEventEnum} from "@/enums/enums";
import {computed, ref} from "vue";

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();
const relicStore = useRelicStore();
const expGained = computed(() => (relicStore.lastLevel || 0) * 5);

// 解決重載頁面時本地臨時變數丟失的 Bug
const showExp = ref(0);
const showEquip = ref<any>(null);

if (gameStateStore.eventAction === 1) {
  // 已經刨開，如果重載，顯示預設文字
  showExp.value = (relicStore.lastLevel || 0) * 10;
  showEquip.value = relicStore.savedEquipment;
}

const handleDig = () => {
  // 暫存數值用於顯示，因為隨後會清除 relicStore
  showExp.value = expGained.value;
  showEquip.value = relicStore.savedEquipment;

  // 1. 給予經驗值
  if (showExp.value > 0) {
    playerStore.gainExp({amount: showExp.value});
  }

  // 2. 給予裝備
  if (showEquip.value) {
    playerStore.gainItem(showEquip.value);
  }

  // 3. 重置 relicStore
  relicStore.clearRelic();

  // 4. 更新狀態並進行下一步切換
  gameStateStore.eventAction = 1;
  gameStateStore.addEventProcess(SpecialEventEnum.UnknownGrave, true)
  gameStateStore.transitionToNextState();
};

const handleIgnore = () => {
  // 1. 重置 relicStore
  relicStore.clearRelic();

  // 2. 更新狀態並進行下一步切換
  gameStateStore.eventAction = 2;
  gameStateStore.addEventProcess(SpecialEventEnum.UnknownGrave, true)
  gameStateStore.transitionToNextState();
};
</script>

<template>
  <RoomTemplate title="不知名的墓">
    <template #default>
      <div class="general-event">
        <!-- 初始狀態 -->
        <template v-if="gameStateStore.eventAction === 0">
          <div class="event-icon">💀</div>
          <div class="dialog-box">
            <p>眼前聳立著一具荒廢的無名屍骨，早已在歲月中風化。</p>
            <p>然而，隱隱散發出一股微弱卻與你的靈魂極為契合的熟悉感...</p>
          </div>
        </template>

        <!-- 刨開墳墓的結果 -->
        <template v-else-if="gameStateStore.eventAction === 1">
          <div class="event-icon shine">✨</div>
          <div class="dialog-box">
            <p>你動手翻找了下這句遺體</p>
            <p>你獲得了 <span class="exp-text">{{ showExp }} 點經驗值</span>。</p>
            <p v-if="showEquip">
              並且在隨葬物中找到了：
              <span class="equip-text">[{{ showEquip.name }}]</span>！
            </p>
          </div>
        </template>

        <!-- 略過/拒絕的結果 -->
        <template v-else-if="gameStateStore.eventAction === 2">
          <div class="event-icon ghost">🪦</div>
          <div class="dialog-box">
            <p>你決定不打擾逝者的安寧，隨後轉身離去。</p>
          </div>
        </template>
      </div>
    </template>

    <template #button v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      <template v-if="gameStateStore.eventAction === 0">
        <!-- 只有在 relicStore 有有效資料時才顯示刨開選項 -->
        <el-button type="warning" @click="handleDig">
          翻找
        </el-button>
        <el-button type="info" @click="handleIgnore">
          離去
        </el-button>
      </template>
    </template>
  </RoomTemplate>
</template>

<style scoped>

.exp-text {
  color: #409eff;
  font-weight: bold;
}

.equip-text {
  color: #67c23a;
  font-weight: bold;
}

/* 簡單的微光效果 */
.shine {
  animation: shine-glow 2s infinite alternate;
}

@keyframes shine-glow {
  from {
    filter: drop-shadow(0 0 2px #fff);
  }
  to {
    filter: drop-shadow(0 0 8px #f1c40f);
  }
}
</style>
