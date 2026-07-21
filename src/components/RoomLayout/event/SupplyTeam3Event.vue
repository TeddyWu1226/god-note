<script setup lang="ts">
import '../room.css';
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import RoomTemplate from "@/components/RoomLayout/comps/RoomTemplate.vue";
import {GameState, SpecialEventEnum} from "@/enums/enums";
import {RoomEnum} from "@/enums/room-enum";
import {Usable} from "@/constants/items/usalbe-item/usable-info";
import {computed} from "vue";

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();

const scenario = computed(() => {
  const isSecondClose = gameStateStore.isEventClose(SpecialEventEnum.SupplyTeam2);
  const secondChoice = gameStateStore.otherRecord['SUPPLY_TEAM_SECOND_CHOICE'] || 0;

  // 如果第二次相遇已完成/關閉，且玩家選擇了聽故事 (1)，則是瘋癲隊長
  if (isSecondClose && secondChoice === 1) {
    return 'CRAZY_CAPTAIN';
  }
  // 如果無遇見過、或是已關閉但非聽故事，均是屍體結局
  return 'CORPSE';
});

const step = computed({
  get: () => gameStateStore.eventAction,
  set: (val: number) => {
    gameStateStore.eventAction = val;
  }
});

const closeAllSupplyEvents = () => {
  gameStateStore.addEventProcess(SpecialEventEnum.SupplyTeam1, true);
  gameStateStore.addEventProcess(SpecialEventEnum.SupplyTeam2, true);
  gameStateStore.addEventProcess(SpecialEventEnum.SupplyTeam3, true);
};

const handleCrazyChoice = (action: 'approach' | 'leave') => {
  if (action === 'approach') {
    step.value = 1;
  } else {
    closeAllSupplyEvents();
    gameStateStore.transitionToNextState();
  }
};

const handleCrazyFight = () => {
  closeAllSupplyEvents();

  const leader = gameStateStore.createMonster('SupplyLeader');
  gameStateStore.switchToFightRoom(RoomEnum.Fight.value, [leader]);
};

const handleCorpseChoice = (action: 'search' | 'leave') => {
  if (action === 'search') {
    step.value = 1;
  } else {
    closeAllSupplyEvents();
    gameStateStore.transitionToNextState();
  }
};

const handleCorpseEnd = () => {
  playerStore.gainItem(Usable.TeleportCrystal, 1);
  closeAllSupplyEvents();
  gameStateStore.transitionToNextState();
};
</script>

<template>
  <RoomTemplate title="前往前線的人們">
    <template #default>
      <div class="general-event">
        <!-- 瘋癲隊長 -->
        <template v-if="scenario === 'CRAZY_CAPTAIN'">
          <div class="event-icon">👤</div>
          <div class="dialog-box">
            <template v-if="step === 0">
              <p>你看到了之前那位補給隊長，此時他只剩孤身一人，神色瘋癲，嘴裡不停神神叨叨地自言自語...</p>
            </template>

            <template v-else-if="step === 1">
              <p class="story-text">
                啊啊啊... 大家都死了... <br/>
                為什麼帝國軍要對我們拔刀相向... <br/>
                這地方是咋回事...好可怕...神啊...
              </p>
              <p class="special-item-text">
                「神為何要拋棄我?!」
              </p>
            </template>
          </div>
        </template>

        <!-- 屍體 -->
        <template v-else-if="scenario === 'CORPSE'">
          <div class="event-icon">💀</div>
          <div class="dialog-box">
            <template v-if="step === 0">
              <p>路邊躺著一具剛死不久的屍體，行囊散落在地。</p>
            </template>

            <template v-else-if="step === 1">
              <p>你仔細搜尋了屍體與散落的行李，在暗格裡找到了未受損的物資。</p>
              <p class="special-item-text">
                獲得 1 個 [轉移水晶]
              </p>
            </template>
          </div>
        </template>
      </div>
    </template>

    <template #button v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      <!-- 瘋癲隊長按鈕 -->
      <template v-if="scenario === 'CRAZY_CAPTAIN'">
        <template v-if="step === 0">
          <el-button type="warning" @click="handleCrazyChoice('approach')">靠近</el-button>
          <el-button type="info" @click="handleCrazyChoice('leave')">離開</el-button>
        </template>
        <template v-else-if="step === 1">
          <el-button type="danger" @click="handleCrazyFight">繼續 (進入戰鬥 ⚔️)</el-button>
        </template>
      </template>

      <!-- 屍體按鈕 -->
      <template v-else-if="scenario === 'CORPSE'">
        <template v-if="step === 0">
          <el-button type="warning" @click="handleCorpseChoice('search')">搜</el-button>
          <el-button type="info" @click="handleCorpseChoice('leave')">不搜</el-button>
        </template>
        <template v-else-if="step === 1">
          <el-button type="success" @click="handleCorpseEnd">收下物資</el-button>
        </template>
      </template>
    </template>
  </RoomTemplate>
</template>

<style scoped>
</style>
