<script setup lang="ts">
import {useGameStateStore} from "@/store/game-state-store";
import {RoomEnum} from "@/enums/room-enum";
import {SpecialEventEnum} from "@/enums/enums";

const props = defineProps({
  view: {
    type: String, // 'content' | 'button'
    required: true
  }
});

const gameStateStore = useGameStateStore();

const handleFight = () => {
  // 記錄此事件已處理
  gameStateStore.addEventProcess(SpecialEventEnum.LostAdventurer, true);

  // 進入與 EventThief 的戰鬥
  gameStateStore.switchToFightRoom(RoomEnum.Fight.value, [gameStateStore.createMonster('EventThief')]);
};
</script>

<template>
  <!-- 內容視圖 -->
  <template v-if="props.view === 'content'">
    <div class="general-event">
      <div class="event-icon shine">🥷</div>
      <div class="dialog-box">
        <p>神祕的人影突然轉過身來，露出了猙嚀而貪婪的笑容！</p>
        <p>他一把拔出腰間寒光閃閃的匕首，狠狠地朝著你刺過來：</p>
        <p class="warning-text">「嘿嘿，沒想到在這種鬼地方還能碰到肥羊！把你的財寶交出來！」</p>
      </div>
    </div>
  </template>

  <!-- 按鈕視圖 -->
  <template v-else-if="props.view === 'button'">
    <el-button type="danger" @click="handleFight">
      準備迎戰 ⚔️
    </el-button>
  </template>
</template>

<style scoped>
.warning-text {
  font-weight: bold;
  color: #f56c6c;
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
    filter: drop-shadow(0 0 10px #f56c6c);
  }
}
</style>
