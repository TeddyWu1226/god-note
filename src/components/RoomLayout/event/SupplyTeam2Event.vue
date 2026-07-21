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

const handleChoice = (choice: 'yes' | 'no') => {
  gameStateStore.otherRecord['SUPPLY_TEAM_SECOND_CHOICE'] = choice === 'yes' ? 1 : 2;

  if (choice === 'yes') {
    step.value = 1; // 講述故事
  } else {
    step.value = 3; // 不願意聽，一時糊塗
  }
};

const handleContinue = () => {
  step.value = 2; // 給水晶
};

const handleEnd = () => {
  playerStore.gainItem(Usable.TeleportCrystal, 1);
  gameStateStore.addEventProcess(SpecialEventEnum.SupplyTeam2, true);
  gameStateStore.transitionToNextState();
};

const handleSimpleEnd = () => {
  gameStateStore.addEventProcess(SpecialEventEnum.SupplyTeam2, true);
  gameStateStore.transitionToNextState();
};
</script>

<template>
  <RoomTemplate title="前往前線的補給隊">
    <template #default>
      <div class="general-event">
        <div class="event-icon">🛡️</div>
        <div class="dialog-box">
          <!-- 初始對話 -->
          <template v-if="step === 0">
            <p class="talk-text">
              「好久不見，勇士！這地方可真險峻。我好幾個弟兄都死在路上，但為了大業，這點犧牲也是光榮的！」
            </p>
            <p class="talk-text" style="margin-top: 1rem;">
              「但... 你願意聽我說點故事嗎？」
            </p>
          </template>

          <!-- 聽故事 -->
          <template v-else-if="step === 1">
            <p class="talk-text">
              「謝謝你願意傾聽，這些事憋在我心裡很久了……」
            </p>
            <p class="story-text" style="margin-top: 1rem; color: #e6a23c;">
              <!-- 故事留空 -->
            </p>
          </template>

          <!-- 結束給水晶 -->
          <template v-else-if="step === 2">
            <p class="talk-text">
              「多謝你聽完。這個水晶你留著防身吧，願神明保佑你。」
            </p>
            <p style="margin-top: 1rem; font-weight: bold; color: #67c23a;">
              獲得 1 個 [轉移水晶]
            </p>
          </template>

          <!-- 不聽故事結束 -->
          <template v-else-if="step === 3">
            <p class="talk-text">
              「沒事，只是我一時糊塗，不阻撓勇士討伐魔族了。有緣再見！」
            </p>
          </template>
        </div>
      </div>
    </template>

    <template #button v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      <template v-if="step === 0">
        <el-button type="primary" @click="handleChoice('yes')">好</el-button>
        <el-button type="info" @click="handleChoice('no')">不好</el-button>
      </template>
      <template v-else-if="step === 1">
        <el-button type="primary" @click="handleContinue">繼續</el-button>
      </template>
      <template v-else-if="step === 2">
        <el-button type="success" @click="handleEnd">收下水晶</el-button>
      </template>
      <template v-else-if="step === 3">
        <el-button type="info" @click="handleSimpleEnd">再見</el-button>
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
