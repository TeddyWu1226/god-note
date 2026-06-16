<script setup lang="ts">
import '../room.css'
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import RoomTemplate from "@/components/RoomLayout/comps/RoomTemplate.vue";
import {ref, reactive, computed} from "vue";
import {GameState} from "@/enums/enums";
import {ColdRegionFruits, NormalFruits} from "@/constants/items/usalbe-item/bush-info";
import {getRandomFromArray} from "@/utils/create";

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();

/**
 * eventAction 狀態控制
 * 0: 初始狀態 (還沒開始翻)
 * 1: 第一次翻找的結果
 * 2: 第二次翻找的結果
 * 3: 第三次翻找的結果
 */

const isRolling = ref(false);
const results = reactive<Record<number, { type: 'item' | 'empty' | 'hurt', msg: string }>>({});

const allowFruits = computed(
    () => {
      return {...NormalFruits, ...ColdRegionFruits}
    }
)

const startSearch = () => {
  const nextAction = (gameStateStore.eventAction as number) + 1;
  if (nextAction > 3) return;

  isRolling.value = true;

  // 模擬翻找動畫
  setTimeout(() => {
    const rand = Math.random();
    let type: 'item' | 'empty' | 'hurt';
    let msg = "";

    if (rand < 0.25) {
      type = 'empty';
      msg = "草叢裡只有幾隻驚慌的昆蟲飛出，什麼都沒有。";
    } else if (rand < 0.85) {
      type = 'item';
      msg = "你在草叢中發現了果實！";
      playerStore.gainItem(getRandomFromArray(Object.values(allowFruits.value)));
    } else {
      type = 'hurt';
      const damage = 15;
      playerStore.info.hp -= damage;
      msg = `哎呀！草叢裡躲著蛇！你被咬傷了（-${damage}HP）。`;
    }

    // 儲存該次 Action 的結果內容
    results[nextAction] = {type, msg};

    // 更新 eventAction，這會觸發緩存與 UI 切換
    gameStateStore.eventAction = nextAction;
    isRolling.value = false;
  }, 1000);
};

const onLeave = () => {
  gameStateStore.transitionToNextState();
};
</script>

<template>
  <RoomTemplate title="🌿神秘的草叢🌿">
    <template #default>
      <div class="general-event">
        <div v-if="isRolling" class="dice-container">
          <div class="dice rolling">🌿</div>
          <p>翻找草叢中...</p>
        </div>

        <template v-else>
          <div v-if="gameStateStore.eventAction === 0" class="result-display">
            <div class="event-icon">🌿🌿🌿</div>
            <div class="dialog-box">
              這片草叢看起來非常深，感覺裡面藏著東西。<br/>
              你要試著翻找看看嗎？（最多可翻找 3 次）
            </div>
          </div>

          <div v-else class="result-display">
            <template v-if="results[gameStateStore.eventAction]?.msg">
              <div class="event-icon">
                <span v-if="results[gameStateStore.eventAction]?.type === 'empty'">🦗</span>
                <span v-if="results[gameStateStore.eventAction]?.type === 'item'">🍐</span>
                <span v-if="results[gameStateStore.eventAction]?.type === 'hurt'">🐍</span>
              </div>
              <div class="dialog-box">
                <p class="step-label">第 {{ gameStateStore.eventAction }} 次翻找結果：</p>
                <p>{{ results[gameStateStore.eventAction]?.msg }}</p>

                <div v-if="results[gameStateStore.eventAction]?.type === 'item'">
                  <span class="unlock-label">(獲得果實)</span>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="dialog-box">
                繼續翻找?(剩餘次數: {{ 3 - gameStateStore.eventAction }}/3 次)
              </div>
            </template>
          </div>
        </template>
      </div>
    </template>

    <template #button v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      <template v-if="!isRolling">
        <el-button
            v-if="gameStateStore.eventAction < 3"
            type="warning"
            @click="startSearch"
        >
          {{ gameStateStore.eventAction === 0 ? '搜查草叢' : '再翻一次' }}
        </el-button>

        <el-button type="info" @click="onLeave">
          {{ gameStateStore.eventAction === 3 ? '已經翻完了，離開' : '離開' }}
        </el-button>
      </template>
    </template>
  </RoomTemplate>
</template>

<style scoped>
.result-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.step-label {
  font-size: 0.8rem;
  color: #909399;
  margin-bottom: 0.5rem;
}


.unlock-label {
  font-size: 0.75rem;
  color: #f1c40f;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* 翻找動畫 */
.rolling {
  font-size: 4rem;
  animation: shake 0.3s infinite ease-in-out;
}

@keyframes shake {
  0% {
    transform: rotate(0deg) scale(1);
  }
  25% {
    transform: rotate(5deg) scale(1.1);
  }
  75% {
    transform: rotate(-5deg) scale(1.1);
  }
  100% {
    transform: rotate(0deg) scale(1);
  }
}
</style>