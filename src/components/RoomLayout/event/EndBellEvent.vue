<script setup lang="ts">
import '../room.css'
import {useGameStateStore} from "@/store/game-state-store";
import RoomTemplate from "@/components/RoomLayout/comps/RoomTemplate.vue";
import {GameState, SpecialEventEnum} from "@/enums/enums";
import {useEpicSubtitle} from "@/components/Shared/EpicSubtitle/useEpicSubtitle";

const gameStateStore = useGameStateStore();
useEpicSubtitle("天空裂開了一道口，不可名狀的光自虛無之中灑落...", 3000);
const handleLeave = () => {
  gameStateStore.eventAction = 1;
  gameStateStore.addEventProcess(SpecialEventEnum.EndBell, true);
  gameStateStore.transitionToNextState();
};
</script>

<template>
  <RoomTemplate title="末鐘響起">
    <template #default>
      <div class="general-event">
        <div class="event-icon shine">🔔</div>
        <div class="dialog-box">
          <p>天空裂開了一道口，不可名狀的光自虛無之中灑落...</p>
          <p class="story-text-italic">你心中喃喃自語：「時候到了嗎...」</p>
        </div>
      </div>
    </template>

    <template #button v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      <template v-if="gameStateStore.eventAction === 0">
        <el-button type="primary" @click="handleLeave" style="width: 100%; height: 3.5rem; font-weight: bold; font-size: 1.1rem;">
          繼續 ➡️
        </el-button>
      </template>
    </template>
  </RoomTemplate>
</template>

<style scoped>
.story-text-italic {
  font-style: italic;
  color: #a0a0a0;
  text-align: center;
  margin-top: 1rem;
}

.shine {
  animation: shine-glow 2s infinite alternate;
}

@keyframes shine-glow {
  from {
    filter: drop-shadow(0 0 2px #fff);
  }
  to {
    filter: drop-shadow(0 0 10px #e6a23c);
  }
}
</style>
