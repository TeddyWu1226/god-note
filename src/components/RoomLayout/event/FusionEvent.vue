<script setup lang="tsx">
import '../room.css'
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import EventTemplate from "@/components/RoomLayout/EventTemplate.vue";
import {ref} from "vue";
import {GameState, SpecialEventEnum} from "@/enums/enums";

/**
 * 狀態控制 (eventAction)
 * 0: 初始, 1: 結果
 */

const gameStateStore = useGameStateStore();

const readNote = () => {
  // 直接觸發結果，不進行中途動畫轉變
  // 你可以在這裡加入解鎖邏輯：playerStore.unlockCrafting();

  gameStateStore.eventAction = 1;
  gameStateStore.addEventProcess(SpecialEventEnum.Fusion, true)
  gameStateStore.transitionToNextState();
};

</script>

<template>
  <EventTemplate title="神祕的筆記">
    <template #default>
      <div class="general-event">
        <template v-if="gameStateStore.eventAction === 0">
          <div class="event-icon">📜</div>
          <div class="dialog-box">
            <p>你來到一個神祕的房間,桌上發現了一本散發著微光的殘破筆記。</p>
            <p>封面上繪製著複雜的圓陣，記載著關於物質重組的奧秘...</p>
          </div>
        </template>

        <template v-else-if="gameStateStore.eventAction === 1">
          <div class="result-display">
            <div class="event-icon">⚗️</div>
            <div class="dialog-box">
              <p>萬物的本質在你眼中變得清晰，你讀懂了筆記中的知識！<br/>
                你現在可以在「休息」回合中,選擇「合成」!
              </p>
              <div class="unlock-banner">
                <span class="unlock-label">系統解鎖</span>
                <span class="skill-name">【合成】</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>

    <template #button v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      <template v-if="gameStateStore.eventAction === 0">
        <el-button
            type="warning"
            @click="readNote"
        >
          解讀筆記內容
        </el-button>
      </template>
    </template>
  </EventTemplate>
</template>

<style scoped>


.result-icon-large {
  font-size: 5rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 20px rgba(155, 89, 182, 0.5));
}

.result-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.unlock-banner {
  margin-top: 1.25rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, rgba(46, 204, 113, 0), rgba(46, 204, 113, 0.2), rgba(46, 204, 113, 0));
  border-top: 1px solid #2ecc71;
  border-bottom: 1px solid #2ecc71;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.unlock-label {
  font-size: 0.75rem;
  color: #2ecc71;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.skill-name {
  color: #ffffff;
  font-weight: bold;
  font-size: 1.25rem;
  text-shadow: 0 0 10px #2ecc71;
}

</style>