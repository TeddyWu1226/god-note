<script setup lang="ts">
import '../room.css';
import { useGameStateStore } from "@/store/game-state-store";
import { usePlayerStore } from "@/store/player-store";
import RoomTemplate from "@/components/RoomLayout/comps/RoomTemplate.vue";
import { GameState, SpecialEventEnum } from "@/enums/enums";
import { Usable } from "@/constants/items/usalbe-item/usable-info";
import { ref, computed } from "vue";

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();

const step = computed({
  get: () => gameStateStore.eventAction,
  set: (val: number) => {
    gameStateStore.eventAction = val;
  }
});

const handleChoice = (choice: 'yes') => {
  step.value = 1;
};

const handleContinue = () => {
  step.value = 2;
};

const handleEnd = () => {
  // 記錄第一次相遇發生的關卡（2 或 3）
  gameStateStore.otherRecord['SUPPLY_TEAM_FIRST_STAGE'] = gameStateStore.currentStage;
  // 關閉第一次相遇事件
  gameStateStore.addEventProcess(SpecialEventEnum.SupplyTeam1, true);
  // 給予2個轉移水晶
  playerStore.gainItem(Usable.TeleportCrystal, 2);
  gameStateStore.transitionToNextState();
};
</script>

<template>
  <RoomTemplate title="前往前線的補給隊">
    <template #default>
      <div class="general-event">
        <div class="event-icon">📦</div>
        <div class="dialog-box">
          <template v-if="step === 0">
            <p>你在路上遇到了一支正要前往前線的補給隊。</p>
            <p class="talk-text">
              「沒想到在這裡可以遇見其他人類！看你身手不凡，想必也是要前往去斬殺魔族的一員吧？」
            </p>
          </template>

          <template v-else-if="step === 1">
            <p class="talk-text">
              「既然你也是同道中人，那我就跟你聊聊吧……」
            </p>
            <p class="story-text" style="margin-top: 1rem; color: #e6a23c;">
              <!-- 故事留空 -->
            </p>
          </template>

          <template v-else-if="step === 2">
            <p class="talk-text">
              「時候不早了，我們該繼續前進了。這個給你，你危險時可以使用。祝你武運昌隆！」
            </p>
            <p style="margin-top: 1rem; font-weight: bold; color: #67c23a;">
              獲得 2 個 [轉移水晶]
            </p>
          </template>
        </div>
      </div>
    </template>

    <template #button v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      <template v-if="step === 0">
        <el-button type="primary" @click="handleChoice('yes')">是的</el-button>
      </template>
      <template v-else-if="step === 1">
        <el-button type="primary" @click="handleContinue">繼續</el-button>
      </template>
      <template v-else-if="step === 2">
        <el-button type="success" @click="handleEnd">祝你武運昌隆</el-button>
      </template>
    </template>
  </RoomTemplate>
</template>

<style scoped>
.talk-text {
  font-style: italic;
  font-weight: bold;
}
.story-text {
  white-space: pre-wrap;
}
</style>
