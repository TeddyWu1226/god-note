<script setup lang="ts">
import {useGameStateStore} from "@/store/game-state-store";
import RoomTemplate from "@/components/RoomLayout/comps/RoomTemplate.vue";
import {GameState, SpecialEventEnum} from "@/enums/enums";
import AdventurerScenario from "@/components/RoomLayout/event/LostAdventurer/AdventurerScenario.vue";
import WitchScenario from "@/components/RoomLayout/event/LostAdventurer/WitchScenario.vue";
import ThiefScenario from "@/components/RoomLayout/event/LostAdventurer/ThiefScenario.vue";

const gameStateStore = useGameStateStore();

const handleApproach = () => {
  // 隨機從三種情況中選擇一種
  // 3: 冒險者 (需要指定消耗品)
  // 4: 神秘女巫 (需要指定晶石)
  // 5: 盜賊 (強制進入戰鬥)
  const scenarios = [3, 4, 5];
  const chosen = scenarios[Math.floor(Math.random() * scenarios.length)];
  gameStateStore.eventAction = chosen;
};

const handleIgnore = () => {
  gameStateStore.eventAction = 2; // 敬而遠之
};

const handleFinish = () => {
  gameStateStore.addEventProcess(SpecialEventEnum.LostAdventurer, true);
  gameStateStore.transitionToNextState();
};
</script>

<template>
  <RoomTemplate title="神祕的人影">
    <template #default>
      <!-- 初始狀態 -->
      <div v-if="gameStateStore.eventAction === 0" class="general-event">
        <div class="event-icon">👤</div>
        <div class="dialog-box">
          <p>在不遠處你隱約看見了模糊的身影晃動。</p>
          <p>在這種幽暗幽深的地方迷路，對方的身份必定不簡單。</p>
          <p class="question-text">你是否要走上前去靠近看看？</p>
        </div>
      </div>

      <!-- 敬而遠之 -->
      <div v-else-if="gameStateStore.eventAction === 2" class="general-event">
        <div class="event-icon">🚶</div>
        <div class="dialog-box">
          <p>出於謹慎，你決定不打擾他們，默默地繞過這群神祕的人影繼續趕路...</p>
        </div>
      </div>

      <!-- 三種拆分注入的情況 -->
      <AdventurerScenario v-else-if="gameStateStore.eventAction === 3" view="content"/>
      <WitchScenario v-else-if="gameStateStore.eventAction === 4" view="content"/>
      <ThiefScenario v-else-if="gameStateStore.eventAction === 5" view="content"/>
    </template>

    <template #button v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      <!-- 初始選擇 -->
      <template v-if="gameStateStore.eventAction === 0">
        <el-button type="primary" @click="handleApproach">
          靠近看看
        </el-button>
        <el-button type="info" @click="handleIgnore">
          繞道避開
        </el-button>
      </template>

      <!-- 敬而遠之的結束 -->
      <template v-else-if="gameStateStore.eventAction === 2">
        <el-button type="primary" @click="handleFinish">
          繼續前進
        </el-button>
      </template>

      <!-- 注入對應情況的按鈕 -->
      <AdventurerScenario v-else-if="gameStateStore.eventAction === 3" view="button"/>
      <WitchScenario v-else-if="gameStateStore.eventAction === 4" view="button"/>
      <ThiefScenario v-else-if="gameStateStore.eventAction === 5" view="button"/>
    </template>
  </RoomTemplate>
</template>

<style scoped>
.question-text {
  margin-top: 1rem;
  font-weight: bold;
  color: #409eff;
}
</style>
