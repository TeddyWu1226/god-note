<script setup lang="tsx">
import './event-room.css'
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import EventTemplate from "@/components/RoomLayout/event/EventTemplate.vue";
import {computed, ref} from "vue";
import {GameState, SpecialEventEnum} from "@/enums/enums";
import {UserStatus} from "@/constants/status/user-status";
import {ElMessage} from 'element-plus';
import {getRandomFromArray} from "@/utils/create";

/**
 * 狀態控制 (eventAction)
 * 0: 初始, 2: 離開, 3: 結果
 */

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();

// 計算費用：第一層免費，之後每層 50 rem (16px 基準下建議金額)
const cost = computed(() => {
  const stage = gameStateStore.currentStage;
  return stage <= 1 ? 0 : stage * 50;
});

// BOSS 資訊庫
const bossHints: Record<number, string> = {
  1: "「深處是兇惡的森林之主，唯有武裝是致勝的出路~」",
  2: "「在腐敗的叢林中惡化的魔物，唯有適時收手才能突破~」",
  3: "「外來的獵手凶狠無比，畏懼火光的他選擇在此棲息~」",
  4: "「排外的種族依舊堅守，精準的目光以及充裕的補品才是你的保命符~」",
  5: "「祂仍在跳著那支未完的舞，攻勢隨節奏而凌厲。打斷他的節奏吧!順便打斷他的夢~」",
  6: "「潛藏在沙漠隘口的毒獸，他的毒若不在及時解除，你將葬身於沙海之中~」",
  7: "「迷霧中的邪惡之物~四面楚歌的情境下~如何識破真身?」",
  8: "「堅硬的鎧甲保護著它~易燃的尖刺是他的反擊~所以燃燒吧!」",
};

const resultMsg = ref("聽完歌曲你隨之一振,繼續征途吧!");

const onLeave = () => {
  gameStateStore.eventAction = 2;
  gameStateStore.transitionToNextState();
};

const listenToStory = () => {
  // 檢查金幣
  if (playerStore.info.gold < cost.value) {
    ElMessage.warning("金幣不足，詩人禮貌地拒絕了你的請求。");
    return;
  }

  // 扣除費用
  playerStore.info.gold -= cost.value;

  // 立即生成結果與 BUFF
  const stage = gameStateStore.currentStage;
  const hint = bossHints[stage] || "前方是一片未知的混沌，連琴弦也無法預測其危險...";
  // 移除舊的BUFF
  playerStore.statusEffects = playerStore.statusEffects.filter(status => !status.name.includes('悠揚'))
  // 獲得BUFF
  const rewardStatus = getRandomFromArray([UserStatus.SongHeal, UserStatus.SongDefend, UserStatus.SongAgile])
  playerStore.addStatus(rewardStatus);

  resultMsg.value = `
    <p>詩人撥弄了一下琴弦，你感到精神一振！</p>
    <p style="margin: 0.5rem 0; color: #f1c40f; font-weight: bold;text-align: center">${hint}</p>
    <p style="font-size: 0.875rem; color: #2ecc71;">✨ 獲得狀態：${rewardStatus.name} (${rewardStatus.description})</p>
  `;

  // 4. 直接跳轉至結果畫面
  gameStateStore.eventAction = 3;
  gameStateStore.transitionToNextState();
};
const init = () => {
  gameStateStore.recordThisStageAppear(SpecialEventEnum.Storyteller)
}
init()
</script>

<template>
  <EventTemplate title="吟遊詩人出現">
    <template #default>
      <div class="general-event">
        <template v-if="gameStateStore.eventAction === 0">
          <div class="event-icon bard-static">👨🏾‍🎤🪕</div>
          <div class="dialog-box">
            <p>在你睡醒時身旁多了一個吟遊詩人。</p>
            <p>「登塔者,我是遊歷四處的吟遊詩人,是否有興趣聽我高歌一曲?」</p>
            <p>支付金幣即可得知說不定有用的情報與詩人的祝福。</p>
            <p class="cost-tag" v-if="cost > 0">💰 消耗金幣: {{ cost }}</p>
            <p class="cost-tag free" v-else>本次免費</p>
          </div>
        </template>

        <template v-else-if="gameStateStore.eventAction === 2">
          <div class="event-icon" style="opacity: 0.3">👨🏾‍🎤🪕</div>
          <div class="dialog-box">
            <p>你禮貌地謝絕了邀請。</p>
          </div>
        </template>

        <template v-else-if="gameStateStore.eventAction === 3">
          <div class="result-display">
            <div class="result-icon-large">🎼</div>
            <div class="dialog-box">
              <div class="hint-content" v-html="resultMsg"></div>
            </div>
          </div>
        </template>
      </div>
    </template>

    <template #button v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      <template v-if="gameStateStore.eventAction === 0">
        <el-button
            type="warning"
            size="large"
            @click="listenToStory"
            :disabled="playerStore.info.gold < cost"
        >
          {{ cost === 0 ? '免費傾聽' : `支付 ${cost}G` }}
        </el-button>
        <el-button type="info" @click="onLeave">
          離開
        </el-button>
      </template>
    </template>
  </EventTemplate>
</template>

<style scoped>
.bard-static {
  font-size: 3rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 0.5rem rgba(241, 196, 15, 0.4));
}

.cost-tag {
  margin-top: 1rem;
  font-size: 0.875rem;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  display: inline-block;
}

.cost-tag.free {
  color: #2ecc71;
  border: 0.0625rem solid #2ecc71;
}

.result-icon-large {
  font-size: 3.5rem;
  margin-bottom: 0.75rem;
  animation: bounce 2s infinite;
}

.hint-content {
  text-align: left;
  line-height: 1.5;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-0.5rem);
  }
}

:deep(.hint-content span) {
  text-shadow: 0 0 0.5rem rgba(241, 196, 15, 0.5);
}
</style>