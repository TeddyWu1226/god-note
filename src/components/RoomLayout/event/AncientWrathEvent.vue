<script setup lang="ts">
import '../room.css';
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import RoomTemplate from "@/components/RoomLayout/comps/RoomTemplate.vue";
import {GameState, SpecialEventEnum} from "@/enums/enums";
import {SpecialItem} from "@/constants/items/special-item-info";
import {ref} from "vue";

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();

// 記錄本次前進受到的傷害
const lastDamageTaken = ref(0);

const handleAdvance = (nextState: number, damage: number) => {
  lastDamageTaken.value = damage;
  playerStore.takeDamage(damage);

  if (playerStore.info.hp <= 0) {
    // 玩家已死亡，將由系統自動處理跳轉到死亡畫面
    return;
  }

  gameStateStore.eventAction = nextState;
};

const handleTouchStatue = () => {
  gameStateStore.eventAction = 4;
};

const handleNext = () => {
  // 獲得「憤怒」道具
  playerStore.gainItem(SpecialItem.Wrath, 1);

  // 標記該事件已徹底完成 (關閉)
  gameStateStore.addEventProcess(SpecialEventEnum.AncientWrath, true);

  gameStateStore.eventAction = 5;
};

const handleLeave = () => {
  // 離開事件，將進度重置為 0，下次遇到需要重新開始
  gameStateStore.eventAction = 0;
  gameStateStore.transitionToNextState();
};

const handleFinish = () => {
  gameStateStore.transitionToNextState();
};
</script>

<template>
  <RoomTemplate title="神秘的地穴">
    <template #default>
      <div class="general-event">
        <!-- 階段 0：發現神祕洞窟 -->
        <template v-if="gameStateStore.eventAction === 0">
          <div class="event-icon">🕳️</div>
          <div class="dialog-box">
            <p>你發現了一個神祕的洞窟。</p>
            <p>洞窟內散發著令人心悸的可怕氣息，是否要前進？</p>
          </div>
        </template>

        <!-- 階段 1：灼熱小徑 -->
        <template v-else-if="gameStateStore.eventAction === 1">
          <div class="event-icon">🪨🪨🪨</div>
          <div class="dialog-box">
            <p>進入後，坍塌的落石造成了你<span class="damage-text">50 點傷害</span></p>
            <p>眼前是充滿熱氣的地穴，是否要繼續深入？</p>
          </div>
        </template>

        <!-- 階段 2：灼熱地穴 -->
        <template v-else-if="gameStateStore.eventAction === 2">
          <div class="event-icon">🔥💨🔥</div>
          <div class="dialog-box">
            <p>爬行時，旁邊岩壁上突然噴出滾燙的蒸氣，造成了你<span class="damage-text">100 點傷害</span></p>
            <p>你忍著痛繼續爬行，</p>
            <p>來到了一個稍加空曠的地方，但印入眼簾的是充滿岩漿的路，是否前進？</p>
          </div>
        </template>

        <!-- 階段 3：龍之雕像 -->
        <template v-else-if="gameStateStore.eventAction === 3">
          <div class="event-icon">🌋🐉🌋</div>
          <div class="dialog-box">
            <p>路上滾燙的岩漿噴濺於你，造成了你<span class="damage-text">200 點傷害</span></p>
            <p>來到了洞窟的盡頭，眼前出現一個龍之雕像</p>
            <p>手上的龍之血在沸騰，引導你...</p>
          </div>
        </template>

        <!-- 階段 4：故事播放（龍之自白） -->
        <template v-else-if="gameStateStore.eventAction === 4">
          <div class="dialog-box">
            <p>觸碰它後，腦袋出現了一段文字與畫面：</p>
            <div class="story-text">
              <p>「吾在此與巨人族締結契約，為阻止外神的侵略。」</p>
              <p>「以吾等組人的遺骸堆疊屍山，並引爆始祖給予最後的能量造就此屏障」</p>
              <p>「只為抵禦那個可怕造物的侵害，為保全始祖的後裔能安穩生存」</p>
              <p>「若此段訊息還有人能聆聽，代表吾等族人尚未絕後」</p>
              <p>「此等屈辱與憤怒，就由龍族最後的子嗣--你來傳承」</p>
            </div>
          </div>
        </template>

        <!-- 階段 5：獲得道具 -->
        <template v-else-if="gameStateStore.eventAction === 5">
          <div class="event-icon shine">∑</div>
          <div class="dialog-box">
            <p>聽完這些話，你感到胸中湧現出一股難以平息的古老怨憤。</p>
            <p>你手中出現了神祕符文-<span class="special-item-text">憤怒</span></p>
          </div>
        </template>
      </div>
    </template>

    <template #button>
      <template v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
        <!-- 按鈕控制 -->
        <template v-if="gameStateStore.eventAction === 0">
          <el-button type="warning" @click="handleAdvance(1, 50)">前進</el-button>
          <el-button type="info" @click="handleLeave">離開</el-button>
        </template>

        <template v-else-if="gameStateStore.eventAction === 1">
          <el-button type="warning" @click="handleAdvance(2, 100)">繼續前進</el-button>
          <el-button type="info" @click="handleLeave">離開</el-button>
        </template>

        <template v-else-if="gameStateStore.eventAction === 2">
          <el-button type="warning" @click="handleAdvance(3, 200)">繼續前進</el-button>
          <el-button type="info" @click="handleLeave">離開</el-button>
        </template>

        <template v-else-if="gameStateStore.eventAction === 3">
          <el-button type="danger" @click="handleTouchStatue">觸碰它</el-button>
        </template>

        <template v-else-if="gameStateStore.eventAction === 4">
          <el-button type="warning" @click="handleNext">繼續</el-button>
        </template>

        <template v-else-if="gameStateStore.eventAction === 5">
          <el-button type="primary" @click="handleFinish">離開</el-button>
        </template>
      </template>
    </template>
  </RoomTemplate>
</template>

<style scoped>
.damage-text {
  color: #f56c6c;
  font-weight: bold;
  margin-bottom: 1rem;
}
</style>
