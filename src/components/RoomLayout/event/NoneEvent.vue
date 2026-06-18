<script setup lang="ts">
import {useGameStateStore} from "@/store/game-state-store";
import RoomTemplate from "@/components/RoomLayout/comps/RoomTemplate.vue";
import {GameState} from "@/enums/enums";

const gameStateStore = useGameStateStore()
gameStateStore.currentState = GameState.SELECTION_PHASE;

</script>

<template>
  <RoomTemplate class="weird" title="一個空空如也的地方...">
    <div class="ghost-room">
      來到一個空無一物的地方<br/>
      但這裡不詳的氣息彷彿生人勿近...
    </div>
  </RoomTemplate>
</template>

<style scoped>
.weird {
  background: #070007;
}

.ghost-room {
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #c7f2f1; /* 蒼白色/微藍綠色 */
  letter-spacing: 0.1em;

  /* 初始微光效果 */
  text-shadow: 0 0 5px #4afffc,
  0 0 10px #4afffc;

  /* 應用動畫 */
  animation: breathing-glow 4s infinite ease-in-out alternate, /* 緩慢呼吸效果 */ flicker 0.2s infinite step-end; /* 微弱快速閃爍 */
}


/* 🅰️ 幽靈呼吸：改變光暈強度 */
@keyframes breathing-glow {
  0% {
    text-shadow: 0 0 4px #4afffc,
    0 0 8px #4afffc; /* 呼吸弱時 */
  }
  100% {
    text-shadow: 0 0 8px #4afffc,
    0 0 15px #4afffc,
    0 0 25px rgba(74, 255, 252, 0.5); /* 呼吸強時，光暈擴散 */
  }
}

/* 🅱️ 微弱閃爍：改變透明度 */
/* 使用 step-end 讓變化是瞬間的，而不是平滑過渡 */
@keyframes flicker {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.98; /* 幾乎不變，但足以產生微小的不穩定感 */
  }
  52% {
    opacity: 0.95; /* 偶爾的小閃爍 */
  }
  80% {
    opacity: 0.99;
  }
}

</style>