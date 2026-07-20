<script setup lang="tsx">
import '../../room.css'
import {computed} from "vue";
import {useGameStateStore} from "@/store/game-state-store";
import RoomTemplate from "@/components/RoomLayout/comps/RoomTemplate.vue";

const gameStateStore = useGameStateStore();

const roomTitle = computed(() => {
  return `階層冒險結束`;
});

const stageStory = computed(() => {
  switch (gameStateStore.currentStage) {
    case 1:
      return {
        title: "迷霧散去之後",
        icon: "📜",
        desc: "籠罩四周的重重迷霧終於漸漸消散，前方通往其他區域的道路隨之變得清晰可見。原本因大霧阻撓而被迫停擺的人們，如今正加緊重組與開通 <span class=\"special-item-text\">補給線路</span>，全力支援已踏上征途、前去討伐魔王的勇者們。"
      };
    case 2:
      return {
        title: "末裔",
        icon: "🌋",
        desc: "赤之山脈上那暴虐惡劣的天候終於逐漸轉為溫和，空氣中肆虐的 <span class=\"special-item-text\">魔素量</span> 隨之大幅下降。那些被阻隔在前的人類隊伍與後援冒險者，終於能夠安全前行、繼續深入這片被遺忘的土地。"
      };
    case 3:
      return {
        title: "大荒地的沉寂",
        icon: "🗿",
        desc: "肆虐大地的魔沙塵暴終於止息，狂暴的魔力再次歸於沉靜。在大地的裂隙中，古老石碑上隱約浮現出指向神明居所的 <span class=\"special-item-text\">神秘印記</span>，默默見證著這片荒蕪之地的和平。"
      };
    case 4:
      return {
        title: "裂變之谷的極光",
        icon: "🌌",
        desc: "光暗交錯的深谷守護者已被悉數擊退，虛空中的裂縫正緩緩合攏。極光璀璨灑下，照亮了通向 <span class=\"special-item-text\">終焉深淵</span> 的崎嶇道路，最後的命運抉擇已在眼前。"
      };
    case 5:
      return {
        title: "終焉深淵的彼方",
        icon: "🏛️",
        desc: "星核深處發出了最後的悲鳴，深淵主宰徹底消散在虛空中。封印千年的 <span class=\"special-item-text\">眾神之廊</span> 終於重見天日，你踏出的每一步，都在改寫凡人挑戰神明的歷史。"
      };
    case 6:
      return {
        title: "審判落幕",
        icon: "⚖️",
        desc: "天平傾斜，審判終結。在命運交織的星河深處，你以不屈的意志傲立於諸神之上，開創了屬於凡人的 <span class=\"special-item-text\">全新紀元</span>。"
      };
    default:
      return {
        title: "未知的終點",
        icon: "🧭",
        desc: "這片未知區域的考驗已經順利度過，前方那神秘的 <span class=\"special-item-text\">時空之門</span> 正等待著你踏入，開始全新的旅程。"
      };
  }
});

const onGoToOtherStage = () => {
  gameStateStore.openStageSelectDialog(false);
};
</script>

<template>
  <RoomTemplate :title="roomTitle">
    <template #default>
      <div class="general-event">
        <div class="event-icon shine">{{ stageStory.icon }}</div>
        <div class="dialog-box" style="padding: 1.5rem 1rem;">
          <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; color: var(--el-color-primary); text-align: center;">
            {{ stageStory.title }}
          </h3>
          <p class="story-text" v-html="stageStory.desc"></p>
        </div>
      </div>
    </template>
    <template #button>
      <el-button
          type="primary"
          style="width: 100%; height: 3.5rem; font-weight: bold; font-size: 1.1rem;"
          @click="onGoToOtherStage"
      >
        前往其他區域 🗺️
      </el-button>
    </template>
  </RoomTemplate>
</template>

<style scoped>
/* 故事相關 */
.story-text {
  text-align: left;
  color: #e6a23c;
  font-size: 0.9rem;
  font-style: italic;
  margin: 1rem 0;
  line-height: 1.6;
}

:deep(.special-item-text) {
  color: #f56c6c;
  font-weight: bold;
  font-size: 1.1em;
}

.shine {
  animation: shine-glow 2s infinite alternate;
}

@keyframes shine-glow {
  from {
    filter: drop-shadow(0 0 2px #fff);
  }
  to {
    filter: drop-shadow(0 0 10px #f56c6c);
  }
}
</style>
