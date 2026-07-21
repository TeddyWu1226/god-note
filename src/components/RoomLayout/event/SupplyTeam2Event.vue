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
  <RoomTemplate title="前往前線的人們">
    <template #default>
      <div class="general-event">
        <div class="event-icon">👥</div>
        <div class="dialog-box">
          <!-- 初始對話 -->
          <template v-if="step === 0">
            <p class="talk-text">
              「好久不見，勇士，沒想到你還活著!」
            </p>
            <p class="talk-text" style="margin-top: 1rem;">
              「這天氣挺不好的，要在在這裡跟我們一起休息一會兒嗎?」
            </p>
          </template>

          <!-- 聽故事 -->
          <template v-else-if="step === 1">
            <p class="story-text">
              那座山傳說是以前古代魔物為了囚禁人類而創造的，<br/>
              兇惡的天氣以及危險深谷岩漿也是讓許多兄弟喪命...<br/>
              話說當時在暴風雪中聽到龍吼聲的時候，我都以為我要死了!<br/>
              好在穿越古道的路上沒見到那東西，想必只是我的錯覺吧...<br/>
              不知道前線的救世主們還好嗎? 擊敗魔王的希望全靠他們了<br/>
              就算要賠上我們的老命也在所不惜!
            </p>
          </template>

          <!-- 結束給水晶 -->
          <template v-else-if="step === 2">
            <p class="talk-text">
              「話說你的水晶還有嗎? 我這現在多了幾個，再給你一個留著防身吧，願神保佑你。」
            </p>
            <p class="special-item-text">
              獲得 1 個 [轉移水晶]
            </p>
          </template>

          <!-- 不聽故事結束 -->
          <template v-else-if="step === 3">
            <p class="talk-text">
              「那我就不阻饒你了。勇士，有緣再見！」
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
</style>
