<script setup lang="ts">
import '../room.css';
import { useGameStateStore } from "@/store/game-state-store";
import { usePlayerStore } from "@/store/player-store";
import RoomTemplate from "@/components/RoomLayout/comps/RoomTemplate.vue";
import { GameState, SpecialEventEnum } from "@/enums/enums";
import { SpecialItem } from "@/constants/items/special-item-info";

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();

const handleEnter = () => {
  gameStateStore.eventAction = 1;
};

const handleLeave = () => {
  gameStateStore.eventAction = 0;
  gameStateStore.transitionToNextState();
};

const handleTouch = () => {
  gameStateStore.eventAction = 2;
};

const handleNext = () => {
  // 扣除破碎的古代項鍊
  playerStore.removeItem(SpecialItem.AvelynNecklace.name);
  // 獲得「背叛」刻印/遺物
  playerStore.gainItem(SpecialItem.Betray, 1);

  // 標記該事件永久關閉
  gameStateStore.addEventProcess(SpecialEventEnum.EndlessBetrayal, true);

  gameStateStore.eventAction = 3;
};

const handleFinish = () => {
  gameStateStore.transitionToNextState();
};
</script>

<template>
  <RoomTemplate title="森林小徑">
    <template #default>
      <div class="general-event">
        <!-- 階段 0：幽暗的小徑入口 -->
        <template v-if="gameStateStore.eventAction === 0">
          <div class="event-icon">🌲🌲🌲</div>
          <div class="dialog-box">
            <p>沒有迷霧的影響，你注意到了一條神秘的森林小徑。</p>
            <p>你懷中的 <span class="necklace-name">[{{ SpecialItem.AvelynNecklace.name }}]</span> 突然開始微微發熱，似乎在與深處的某個存在共鳴……</p>
          </div>
        </template>

        <!-- 階段 1：凋零的守護者 -->
        <template v-else-if="gameStateStore.eventAction === 1">
          <div class="event-image-container">
            <img src="/monsters/dead_guardian_tree.png" alt="化作樹木死亡的代理者" class="guardian-tree-img" />
          </div>
          <div class="dialog-box">
            <p>昔日的森林守護者，如今已徹底木化，化作一棵枯萎木化的模樣矗立在那。</p>
            <p>此時，你懷中的項鍊散發陣陣魔力，冥冥之中，有一個聲音在引導你...</p>
          </div>
        </template>

        <!-- 階段 2：代理者的自白 -->
        <template v-else-if="gameStateStore.eventAction === 2">
          <div class="dialog-box">
            <p>項鍊與木化的守護者接觸，光芒交織，一陣聲音腦海中響起：</p>
            <div class="story-text">
              <p>「吾...背叛了始祖。」</p>
              <p>「為了苟延殘喘，吾跪伏於入侵者的腳下...」</p>
              <p>「明知那名女子只是祂們派來的監視者，卻又無可救藥地愛上她。」</p>
              <p>「卻又因為我的失職造成她的死亡。」</p>
              <p>「是吾造成的一切，是吾的執迷不悟，背叛了森林。」</p>
            </div>
          </div>
        </template>

        <!-- 階段 3：項鍊的昇華 -->
        <template v-else-if="gameStateStore.eventAction === 3">
          <div class="event-icon shine">≠</div>
          <div class="dialog-box">
            <p>項鍊與其中殘存最後的能量融合，最終在強光中碎裂、重組。</p>
            <p>執迷不悟的妄為情感充斥著你的心中。</p>
            <p>你手中出現了神祕符文-<span class="special-item-text">背叛</span></p>
          </div>
        </template>
      </div>
    </template>

    <template #button>
      <template v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
        <template v-if="gameStateStore.eventAction === 0">
          <el-button type="warning" @click="handleEnter">走入小徑</el-button>
          <el-button type="info" @click="handleLeave">快步離開</el-button>
        </template>

        <template v-else-if="gameStateStore.eventAction === 1">
          <el-button type="danger" @click="handleTouch">將項鍊貼在樹幹上</el-button>
        </template>

        <template v-else-if="gameStateStore.eventAction === 2">
          <el-button type="warning" @click="handleNext">繼續</el-button>
        </template>

        <template v-else-if="gameStateStore.eventAction === 3">
          <el-button type="primary" @click="handleFinish">離開</el-button>
        </template>
      </template>
    </template>
  </RoomTemplate>
</template>

<style scoped>
.necklace-name {
  color: #e6a23c;
  font-weight: bold;
}

.event-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.guardian-tree-img {
  height: 5rem;
  width: 5rem;
  object-fit: contain;
  filter: drop-shadow(0 0 12px rgba(0, 188, 212, 0.5));
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
</style>
