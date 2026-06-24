<script setup lang="ts">
import '../../room.css'
import {computed, ref} from "vue";
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {GameState} from "@/enums/enums";
import RoomTemplate from "@/components/RoomLayout/comps/RoomTemplate.vue";
import RestOperation from "@/components/RoomLayout/room/RestRoom/RestOperation.vue";
import {StageEnum} from "@/enums/stage-enum";

const playerStore = usePlayerStore();
const gameStateStore = useGameStateStore()

const isRested = ref<boolean>(false)
const onRest = () => {
  isRested.value = true
  playerStore.healFull()
  gameStateStore.transitionToNextState()
}
const emit = defineEmits(['cancel']);

const onCancel = () => {
  emit('cancel')
}

// Stage Introduction Logic
const isStageIntro = computed(() => {
  return gameStateStore.currentStage > 1 && gameStateStore.stageDays === 0;
});

const currentStageObj = computed(() => {
  return Object.values(StageEnum).find(s => s.value === gameStateStore.currentStage);
});

const stageLabel = computed(() => {
  return currentStageObj.value ? currentStageObj.value.label : `第 ${gameStateStore.currentStage} 區域`;
});

const roomTitle = computed(() => {
  if (isStageIntro.value) {
    return `進入新區域：${stageLabel.value}`;
  }
  return "平靜的地方";
});

const stageIntro = computed(() => {
  switch (gameStateStore.currentStage) {
    case 2:
      return {
        icon: "⛰️",
        desc: "你已來到赤之山脈。攀登的路上充斥著嚴寒與風雪，直到接近山頂時才開始有熱氣浮現，而在山脈的極深處，滾燙的岩漿正奔流不息。",
        tips: "在冰與火的雙重考驗中前行，注意寒冷與燃燒。"
      };
    case 3:
      return {
        icon: "🗿",
        desc: "你已來到大荒地。受到星球磁場的強烈影響，魔力在此徹底暴走狂飆，時常有破壞力驚人的魔沙塵暴席捲而來。",
        tips: "小心隨時降臨的魔沙塵暴，裝備不好千萬不要踏入。"
      };
    case 4:
      return {
        icon: "🌓",
        desc: "你已來到裂變之谷。暴走的魔沙塵暴經由磁場匯聚，形成了具有強大切割力的魔法光束，將大地與天空一分為二。在此地，天色每日都在極光與極暗之間劇烈交替。",
        tips: "穿梭於光暗交錯的深谷，適應每日劇變的天色。"
      };
    case 5:
      return {
        icon: "🌌",
        desc: "你已來到終焉深淵。匯聚的魔力光束在此打穿地表、直達地心，是前往「星核 - 眾神的迴廊」的必經之路。此地棲息著星球上最強大的生物，也是直面最終魔王的宿命之地。",
        tips: "要阻止諸神黃昏的降臨，唯有挑戰神"
      };
    case 6:
      return {
        icon: "⚖️",
        desc: "你已來到審判之日。迎接命運的最終裁決，證明你的力量吧！",
        tips: "無路可退，唯有迎接命運的審判。"
      };
    default:
      return {
        icon: "🗺️",
        desc: "全新的未知區域在前方展開。",
        tips: "做好準備，開始冒險！"
      };
  }
});

const onEnterStage = () => {
  gameStateStore.transitionToNextState();
};

defineExpose({
  onRest
})
</script>

<template>
  <RoomTemplate :title="roomTitle">
    <template #default>
      <div class="general-event">
        <!-- Stage Introduction Mode -->
        <template v-if="isStageIntro">
          <div class="event-icon">{{ stageIntro.icon }}</div>
          <div class="dialog-box" style="padding: 1.5rem 1rem;">
            <p style="margin: 0.5rem 0; font-weight: bold; color: var(--el-color-primary-light-3); font-size: 1.1rem;">
              {{ stageIntro.desc }}
            </p>
            <p style="margin: 0.5rem 0; font-style: italic; color: #909399;">
              {{ stageIntro.tips }}
            </p>
          </div>
        </template>

        <!-- Original Rest Room Mode -->
        <template v-else>
          <template v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
            <div class="event-icon">💤</div>
            <div class="dialog-box">
              <p>這邊好像很適合休息...</p>
              <p>選擇...?</p>
            </div>
          </template>
          <template v-else>
            <template v-if="isRested">
              <div class="event-icon">💤</div>
              <div style="color: var(--el-color-success);text-align: center" class="dialog-box">
                休息了一會,<br/>你的HP跟SP完全恢復外,身上暫時的負面效果也消除了!
              </div>
            </template>
            <div v-else class="dialog-box">
              趕路吧...
            </div>
          </template>
        </template>

      </div>
    </template>
    <template #button>
      <el-button
          v-if="isStageIntro"
          type="primary"
          style="width: 100%; height: 3.5rem; font-weight: bold; font-size: 1.1rem;"
          @click="onEnterStage"
      >
        開始挑戰 🧭
      </el-button>
      <RestOperation v-else @rest="onRest" @cancel="onCancel"/>
    </template>

  </RoomTemplate>

</template>

<style scoped>
</style>