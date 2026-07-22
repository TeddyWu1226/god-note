<script setup lang="ts">
import '../../room.css'
import {computed} from "vue";
import {useGameStateStore} from "@/store/game-state-store";
import RoomTemplate from "@/components/RoomLayout/comps/RoomTemplate.vue";
import {StageEnum} from "@/enums/stage-enum";

const gameStateStore = useGameStateStore();

const currentStageObj = computed(() => {
  return Object.values(StageEnum).find(s => s.value === gameStateStore.currentStage);
});

const stageLabel = computed(() => {
  return currentStageObj.value ? currentStageObj.value.label : `第 ${gameStateStore.currentStage} 區域`;
});

const roomTitle = computed(() => {
  return `進入 ${stageLabel.value}`;
});

const stageIntro = computed(() => {
  switch (gameStateStore.currentStage) {
    case 1:
      return {
        title: StageEnum.MistyForest.label,
        desc: "想要離開邊境必須穿越此片森林，但自從「魔獸暴走」事件後森林就瀰漫著大霧而使任何人都無法走出。",
        tips: "小心狼。"
      };
    case 2:
      return {
        title: StageEnum.RedMountain.label,
        desc: "眼前是赤之山脈。傳說是魔族的同伙-巨人與龍為阻撓人類而形成的巨大山巒，若想穿越必須透過深山中的古代坑道。",
        tips: "在冰與火的雙重考驗中前行，注意寒冷與燃燒。"
      };
    case 3:
      return {
        title: StageEnum.GiantsWasteland.label,
        desc: "你已來到大荒地。第一次人魔大戰的主戰場，當時殘餘的魔力在此暴走狂飆，時常有破壞力驚人的魔沙塵暴席捲而來。",
        tips: "小心隨時降臨的魔沙塵暴，防具不好千萬不要踏入。"
      };
    case 4:
      return {
        title: StageEnum.SplitCanyon.label,
        desc: "你已來到裂變之谷。曾經這是魔族領地，但在第二次人魔大戰受到神擊，神擊將大地與天空一分為二。在此地，天色每日都在神秘的極光與極暗之間劇烈交替。",
        tips: "光與暗、亢奮與妄想。"
      };
    case 5:
      return {
        title: StageEnum.EndAbyss.label,
        desc: "你已來到深淵。魔族城堡受神擊而陷落在此，魔族最後殘存之地。",
        tips: "完成你的使命。"
      };
    case 6:
      return {
        title: "⚖️",
        desc: "你已來到審判之日。迎接命運的最終裁決，證明你的力量吧！",
        tips: "無路可退，唯有迎接命運的審判。"
      };
    default:
      return {
        title: "🗺️",
        desc: "全新的未知區域在前方展開。",
        tips: "回頭是岸"
      };
  }
});

const onEnterStage = () => {
  gameStateStore.transitionToNextState();
};
</script>

<template>
  <RoomTemplate :title="roomTitle">
    <template #default>
      <div class="general-event">
        <div class="stage-title">{{ stageIntro.title }}</div>
        <div class="dialog-box" style="padding: 1.5rem 1rem;">
          <p style="margin: 0.5rem 0; font-weight: bold; color: var(--el-color-primary-light-3); font-size: 1.1rem;">
            {{ stageIntro.desc }}
          </p>
          <p style="margin: 0.5rem 0; font-style: italic; color: #909399;">
            {{ stageIntro.tips }}
          </p>
        </div>
      </div>
    </template>
    <template #button>
      <el-button
          type="primary"
          style="width: 100%; height: 3.5rem; font-weight: bold; font-size: 1.1rem;"
          @click="onEnterStage"
      >
        開始旅程
      </el-button>
    </template>
  </RoomTemplate>
</template>

<style scoped>
.stage-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-style: italic;
  font-weight: 700;
  letter-spacing: 0.05em;
}
</style>
