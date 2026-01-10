<script setup lang="ts">
import './event-room.css'
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import EventTemplate from "@/components/RoomLayout/event/EventTemplate.vue";
import {GameState, SpecialEventEnum} from "@/enums/enums";
import {RoomEnum} from "@/enums/room-enum";
import {create} from "@/utils/create";
import {Monster} from "@/constants/monsters/monster-info";
import {onUnmounted} from "vue";
import {SpecialItem} from "@/constants/items/special-item-info";
import {useTrackerStore} from "@/store/track-store";

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();
const trackerStore = useTrackerStore();

/**
 * 流程控制說明：
 * Process 0: 初次見面取得清單
 * Process 1: 狩獵進行中（等待玩家合成炸彈並擊殺巨獸）
 * Process 2: 傳說終結（領取最後獎勵）
 */
// 第0階段
const takeList = () => {
  gameStateStore.eventAction = 3
  playerStore.gainItem(SpecialItem.DuneBeastBombCenter)
  gameStateStore.addEventProcess(SpecialEventEnum.HuntDuneBeast)
  gameStateStore.transitionToNextState();
}

// 第1階段
const goFight = () => {
  gameStateStore.switchToFightRoom(RoomEnum.Fight.value, [create(Monster.DuneBeast)])
}
const finishQuest = () => {
  playerStore.addGold(1000)
  gameStateStore.transitionToNextState();
  gameStateStore.addEventProcess(SpecialEventEnum.HuntDuneBeast, true)
}

const onLeave = () => {
  gameStateStore.transitionToNextState();
};

const init = () => {
  gameStateStore.recordThisStageAppear(SpecialEventEnum.HuntDuneBeast)
  if (trackerStore.getKillCount(Monster.DuneBeast.name, 'current') >= 1) {
    gameStateStore.eventProcess[SpecialEventEnum.HuntDuneBeast] = 2
  }
}
init()

onUnmounted(() => {

})
</script>

<template>
  <EventTemplate title="🏜️神秘的沙之民">
    <template #default>
      <div class="general-event">
        <div class="event-icon">👤</div>
        <div class="dialog-box">
          <template v-if="gameStateStore.stateIs(GameState.SELECTION_PHASE)">
            <span v-if="gameStateStore.isEventClose(SpecialEventEnum.HuntDuneBeast)">「謝謝你。」</span>
            <span v-else>
              「等你準備好後，我會再來找你的。」
            </span>
          </template>
          <template v-else-if="gameStateStore.getEventProcess(SpecialEventEnum.HuntDuneBeast) === 0">
            <template v-if="gameStateStore.eventAction === 0">
              一名披著斗篷的跛腳獵人攔住了你，眼神盯著你行囊中閃爍的碎片：<br/>
              「那是...巨獸的鱗片？沒想到有人如此魯莽到會去挑戰它。」
            </template>
            <template v-else-if="gameStateStore.eventAction === 1">
              「當然知道!它是這片土地上的霸主，我們沙之民只能在陰影之中存活也是因為他的存在...」
              「但現在不一樣了!因為你出現了!你－－偉大的登塔者，能替我們解決它。」
            </template>
            <template v-else-if="gameStateStore.eventAction === 2">
              「我研究那頭怪物多年了!成功研究了一個可以弱化它的辦法，但最後的戰鬥仍需要你出手解決它」<br/>
              「我還欠缺點材料，給你這個裝置以及這是需求清單，只要製作出這個必定能在戰鬥中派上用場!」<br/>
              <p class="hint">(你獲得了巨獸炸彈核心以及巨獸炸彈的合成清單)</p>
            </template>
          </template>
          <template v-else-if="gameStateStore.getEventProcess(SpecialEventEnum.HuntDuneBeast) === 1">
            「我們又見面了，英勇的登塔者，看你準備好了」
            <br/><br/>
            「我正掌握他的行蹤，你想要現在出發狩獵它嗎?記得在戰鬥中使用那枚炸彈!」
            <p class="hint">(選擇出發後立即觸發戰鬥)</p>
          </template>
          <template v-else-if="gameStateStore.getEventProcess(SpecialEventEnum.HuntDuneBeast) === 2">
            獵人看著遠方逐漸平息的沙塵暴，顫抖地摘下了斗篷，露出了佈滿風霜的笑容：
            <br/>
            「風沙...停了。數百年的詛咒終於在今日終結。沒錯，這陣風沙正是它帶來的風暴，如今因為你而平息，感謝你，登塔者，這是一點我的謝禮。」
            <p class="hint">(你獲得了 1000 G)</p>
          </template>
        </div>
      </div>
    </template>

    <template #button v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      <template v-if="gameStateStore.getEventProcess(SpecialEventEnum.HuntDuneBeast) === 0">
        <template v-if="gameStateStore.eventAction == 0">
          <el-button type="primary" @click="gameStateStore.eventAction = 1">你知道那頭怪物?</el-button>
          <el-button type="info" @click="onLeave">不理他</el-button>
        </template>
        <template v-if="gameStateStore.eventAction == 1">
          <el-button type="primary" @click="gameStateStore.eventAction = 2">我?我怎麼解決?</el-button>
        </template>
        <template v-if="gameStateStore.eventAction == 2">
          <el-button type="warning" @click="takeList">收下清單並出發</el-button>
        </template>
      </template>

      <template v-else-if="gameStateStore.getEventProcess(SpecialEventEnum.HuntDuneBeast) === 1">
        <el-button type="danger" @click="goFight">出發</el-button>
        <el-button type="info" @click="onLeave">我正在準備中</el-button>
      </template>

      <template v-else-if="gameStateStore.getEventProcess(SpecialEventEnum.HuntDuneBeast) === 2">
        <el-button type="success" @click="finishQuest">接過謝禮</el-button>
      </template>
    </template>
  </EventTemplate>
</template>