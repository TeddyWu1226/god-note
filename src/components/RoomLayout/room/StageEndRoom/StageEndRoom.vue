<script setup lang="ts">
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
        title: "迷霧深處的低語",
        icon: "📜",
        desc: "【在此填寫第一大關（迷霧森林）通關後的劇情故事文字】\n例如：你成功擊敗了守護森林的強大魔物，四周的迷霧漸漸散去。然而，空氣中卻傳來一股奇特的低語聲，似乎在警告你這僅僅是個開始..."
      };
    case 2:
      return {
        title: "赤之山脈的餘燼",
        icon: "🌋",
        desc: "【在此填寫第二大關（赤之山脈）通關後的劇情故事文字】\n例如：山脈深處的熱浪與風雪歸於平靜，魔王的僕從在岩漿中灰飛煙滅。通往更高層的通道已然開啟，滾燙的餘燼指引著你的前路..."
      };
    case 3:
      return {
        title: "大荒地的沉寂",
        icon: "🗿",
        desc: "【在此填寫第三大關（大荒地）通關後的劇情故事文字】\n例如：肆虐的魔沙塵暴終於止息，狂暴的魔力重新歸於沉寂。在大地的裂隙中，古代石碑上隱約浮現出指向神明居所的古老圖騰..."
      };
    case 4:
      return {
        title: "裂變之谷的極光",
        icon: "🌌",
        desc: "【在此填寫第四大關（分裂之谷）通關後的劇情故事文字】\n例如：光與暗的交錯在此處凝聚成永恆的極光。隨著深谷守衛的倒下，命運的光芒刺破虛空，為你展現出終焉深淵的輪廓..."
      };
    case 5:
      return {
        title: "終焉深淵的彼方",
        icon: "🏛️",
        desc: "【在此填寫第五大關（終焉深淵）通關後的劇情故事文字】\n例如：星核的核心劇烈震顫，不可一世的深淵主宰化為星塵。迴廊彼方的命運之門已經敞開，你已完成了凡人無可比擬的壯舉..."
      };
    case 6:
      return {
        title: "審判落幕",
        icon: "⚖️",
        desc: "【在此填寫第六大關（審判之日）通關後的劇情故事文字】\n例如：天平傾斜，神明失色。在命運的審判之日，你以凡人之軀傲立於星穹之上，書寫了屬於你自己的神話..."
      };
    default:
      return {
        title: "未知的終點",
        icon: "🧭",
        desc: "【在此填寫未知關卡（預設）通關後的劇情故事文字】\n例如：這片區域的考驗已經結束，新的篇章正等待著你前去探索..."
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
        <div class="event-icon">{{ stageStory.icon }}</div>
        <div class="dialog-box" style="padding: 1.5rem 1rem;">
          <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; color: var(--el-color-primary); text-align: center;">
            {{ stageStory.title }}
          </h3>
          <p style="margin: 0.5rem 0; line-height: 1.6; font-size: 1.05rem; white-space: pre-line; color: var(--el-text-color-primary);">
            {{ stageStory.desc }}
          </p>
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
</style>
