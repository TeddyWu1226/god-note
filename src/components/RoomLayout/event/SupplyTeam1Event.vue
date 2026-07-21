<script setup lang="ts">
import '../room.css';
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import RoomTemplate from "@/components/RoomLayout/comps/RoomTemplate.vue";
import {GameState, SpecialEventEnum} from "@/enums/enums";
import {Usable} from "@/constants/items/usalbe-item/usable-info";
import {ref, computed} from "vue";

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
  <RoomTemplate title="前往前線的人們">
    <template #default>
      <div class="general-event">
        <div class="event-icon">👥👥</div>
        <div class="dialog-box">
          <template v-if="step === 0">
            <p>你在路上遇到了一支正要前往前線的補給隊。</p>
            <p class="talk-text">
              「沒想到在這裡可以遇見其他人類！看你能抵達這裡，想必也是要前往去斬殺魔族的一員吧？」
            </p>
          </template>

          <template v-else-if="step === 1">
            <p class="story-text">
              能在這荒山野嶺遇到人類真是開心! <br/>
              自從森林被可恨的德魯伊封印後，<br/>
              我們補給隊就跟前線的帝國軍以及勇士斷了聯繫，<br/>
              真沒想到以為是盟軍的他們會在這節骨眼上背叛我們!
              他們還派了須多邪獸攻擊鄰近村莊! <br/>
              果然魔物終究是魔物! 都是配合魔族的惡魔!
            </p>
          </template>

          <template v-else-if="step === 2">
            <p class="talk-text">
              時候不早了，<br/>
              我們該加緊前進了。<br/>
              諾，這個給你，你危險時可以使用。祝你武運昌隆！
            </p>
            <p class="special-item-text">
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
        <el-button type="success" @click="handleEnd">離開</el-button>
      </template>
    </template>
  </RoomTemplate>
</template>

<style scoped>
</style>
