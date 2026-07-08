<script setup lang="ts">
import '../room.css';
import { useGameStateStore } from "@/store/game-state-store";
import { usePlayerStore } from "@/store/player-store";
import RoomTemplate from "@/components/RoomLayout/comps/RoomTemplate.vue";
import { GameState, SpecialEventEnum } from "@/enums/enums";
import { Material } from "@/constants/items/material/material-info";
import { SpecialItem } from "@/constants/items/special-item-info";
import { computed, ref } from "vue";

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();

const skeletonType = ref<'broken' | 'complete' | 'giant' | null>(null);

// 初始化骨骸類型，防止頁面重整時重隨機
const initEvent = () => {
  gameStateStore.recordThisStageAppear(SpecialEventEnum.DragonSkeleton);
  
  if (!gameStateStore.otherRecord['DRAGON_SKELETON_TYPE']) {
    const pool = ['broken', 'complete'];
    if (gameStateStore.stageDays > 50) {
      pool.push('giant');
    }
    const picked = pool[Math.floor(Math.random() * pool.length)];
    gameStateStore.otherRecord['DRAGON_SKELETON_TYPE'] = picked;
  }
  skeletonType.value = gameStateStore.otherRecord['DRAGON_SKELETON_TYPE'];
};

initEvent();

const hasDragonBlood = computed(() => {
  return playerStore.hasItem(SpecialItem.DragonBlood.name)[0];
});

const handleUseBlood = () => {
  if (!hasDragonBlood.value) return;
  
  // 扣除 1 個龍之血
  playerStore.removeItem(SpecialItem.DragonBlood.name, 1);
  
  // 根據骸骨類型給予獎勵或解鎖事件
  if (skeletonType.value === 'broken') {
    playerStore.gainItem(Material.MediumNormal, 3);
  } else if (skeletonType.value === 'complete') {
    playerStore.gainItem(Material.MediumNormal, 6);
  } else if (skeletonType.value === 'giant') {
    gameStateStore.otherRecord['ANCIENT_WRATH_UNLOCKED'] = true;
  }
  
  // 移除臨時變數
  delete gameStateStore.otherRecord['DRAGON_SKELETON_TYPE'];
  
  // 進度標記為 -1 (關閉) 並切換狀態
  gameStateStore.eventAction = 1;
  gameStateStore.addEventProcess(SpecialEventEnum.DragonSkeleton, true);
  gameStateStore.transitionToNextState();
};

const handleLeave = () => {
  // 離開時清除臨時骨骸類型，以便下次遇見時重新隨機
  delete gameStateStore.otherRecord['DRAGON_SKELETON_TYPE'];
  
  gameStateStore.eventAction = 2;
  gameStateStore.transitionToNextState();
};
</script>

<template>
  <RoomTemplate title="龍之骸骨">
    <template #default>
      <div class="general-event">
        <!-- 階段 0：初始選擇狀態 -->
        <template v-if="gameStateStore.eventAction === 0">
          <div class="event-icon">🐉</div>
          <div class="dialog-box">
            <template v-if="skeletonType === 'broken'">
              <p>你眼前聳立著一具<b>破碎的龍之骸骨</b>，巨大的白骨支離破碎地散落在地上，上面殘留的氣息極為微弱。</p>
              <p>你似乎可以感受到殘存古老力量對生命力的渴望。是否要將手中的「龍之血」灑在上面？</p>
            </template>
            <template v-else-if="skeletonType === 'complete'">
              <p>你眼前聳立著一具<b>完整的龍之骸骨</b>，雖然已經死去多年，但這具骸骨仍保持著匍匐的姿態，骨骼晶瑩如玉，流轉著淡淡的魔力光澤。</p>
              <p>是否要將手中的「龍之血」灑在上面？</p>
            </template>
            <template v-else-if="skeletonType === 'giant'">
              <p>你眼前聳立著一具<b>巨大的龍之骸骨</b>，其龐大的體積令人震撼，即使僅剩骨骸也散發著令人窒息的威壓。</p>
              <p>骨骼深處隱隱有紅光脈動，在向你傳達著不甘的呼喚。是否要將手中的「龍之血」灑在上面？</p>
            </template>
          </div>
        </template>

        <!-- 階段 1：使用龍之血的結果 -->
        <template v-else-if="gameStateStore.eventAction === 1">
          <div class="event-icon pulse">✨</div>
          <div class="dialog-box">
            <template v-if="skeletonType === 'broken'">
              <p>你將龍之血灑在破碎的龍之骸骨上，白骨發出微弱的紅光，隨後崩解為灰燼。</p>
              <p>在灰燼中，你發現了 <span class="crystal-text">3 個中級魔物晶石</span>。</p>
            </template>
            <template v-else-if="skeletonType === 'complete'">
              <p>你將龍之血灑在完整的龍之骸骨上，骨架突然爆發出奪目的血色光芒，骨骼深處殘留的靈魂發出一聲龍吟，隨後化作星光消散。</p>
              <p>你獲得了 <span class="crystal-text">6 個中級魔物晶石</span>。</p>
            </template>
            <template v-else-if="skeletonType === 'giant'">
              <p>你將龍之血灑在巨大的龍之骸骨上，血液順著骨骼的紋路迅速被完全吸收。</p>
              <p>忽然，大地傳來一陣沉悶的劇烈震動，骨骸發出憤怒且空洞的咆哮聲，隨後化為齏粉。</p>
              <p>你隱隱感覺到，世界的某個角落被這股震動震開了裂縫……</p>
            </template>
          </div>
        </template>

        <!-- 階段 2：直接離開的結果 -->
        <template v-else-if="gameStateStore.eventAction === 2">
          <div class="event-icon gray">🪨</div>
          <div class="dialog-box">
            <p>你決定不理會這具冰冷的骸骨，轉身繼續你的旅程。</p>
          </div>
        </template>
      </div>
    </template>

    <template #button v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      <template v-if="gameStateStore.eventAction === 0">
        <el-button 
          :disabled="!hasDragonBlood" 
          type="danger" 
          @click="handleUseBlood"
        >
          使用 [{{ SpecialItem.DragonBlood.name }}]
        </el-button>
        <el-button type="info" @click="handleLeave">離開</el-button>
      </template>
    </template>
  </RoomTemplate>
</template>

<style scoped>
.crystal-text {
  color: #67c23a;
  font-weight: bold;
}

.pulse {
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0% {
    filter: drop-shadow(0 0 5px gold);
  }
  50% {
    filter: drop-shadow(0 0 20px white);
  }
  100% {
    filter: drop-shadow(0 0 5px gold);
  }
}

.gray {
  filter: grayscale(100%);
  opacity: 0.6;
}
</style>
