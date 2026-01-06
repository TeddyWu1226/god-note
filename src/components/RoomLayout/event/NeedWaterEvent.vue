<script setup lang="ts">
import './event-room.css'
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import EventTemplate from "@/components/RoomLayout/event/EventTemplate.vue";
import {computed, ref} from "vue";
import {GameState, SpecialEventEnum} from "@/enums/enums";
import {create} from "@/utils/create";
import {SpecialBoss} from "@/constants/monsters/special-boss-info";
import {RoomEnum} from "@/enums/room-enum";

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();

/**
 * eventAction 狀態控制
 * 0: 初始
 * 1: 幫忙
 * 2: 搶劫
 * 3: 給水
 */

// 用來紀錄玩家剛才按下了哪個按鈕，以便在結果頁面顯示對應文字
const choiceType = ref<'get_bottle' | 'give_water' | 'rob' | null>(null);

const currentProcess = computed(() => gameStateStore.getEventProcess(SpecialEventEnum.NeedWater));
const hasWater = computed(() => !!gameStateStore.otherRecord['WATER'] && gameStateStore.otherRecord['WATER'] > 1);

const handleChoice = (type: 'get_bottle' | 'give_water' | 'rob') => {
  choiceType.value = type;

  if (type === 'get_bottle') {
    gameStateStore.addEventProcess(SpecialEventEnum.NeedWater);
    gameStateStore.otherRecord['WATER'] = 1
    gameStateStore.eventAction = 1;
    gameStateStore.transitionToNextState()
  } else if (type === 'rob') {
    playerStore.info.gold += 200;
    gameStateStore.eventAction = 2;
    gameStateStore.addEventProcess(SpecialEventEnum.NeedWater, true);
    gameStateStore.transitionToNextState()
  } else if (type === 'give_water') {
    gameStateStore.addEventProcess(SpecialEventEnum.NeedWater);
    if (gameStateStore.otherRecord['WATER'] === 2) {
      gameStateStore.eventAction = 3;
      gameStateStore.transitionToNextState()
      gameStateStore.addEventProcess(SpecialEventEnum.NeedWater, true)
    } else {
      gameStateStore.switchToFightRoom(RoomEnum.SpecialBoss.value, [create(SpecialBoss.AtreidesMan)])
      gameStateStore.addEventProcess(SpecialEventEnum.NeedWater, true)
    }
  }
};

const onLeave = () => {
  gameStateStore.transitionToNextState();
};

const init = () => {
  gameStateStore.recordThisStageAppear(SpecialEventEnum.NeedWater)
}
init()
</script>

<template>
  <EventTemplate title="👦🏼 倒地的陌生男子">
    <template #default>
      <div class="general-event">
        <template v-if="gameStateStore.eventAction === 0">
          <div class="event-icon">👦🏼</div>
          <div class="dialog-box">
            <template v-if="currentProcess === 0">
              一名身受重傷的陌生男子倒在路邊，手上握著一個空瓶，他的喉嚨因脫水而發出沙啞的聲音：<br/>
              「水...不管是誰...請救救我...」
            </template>
            <template v-else-if="currentProcess === 1">
              又是那名陌生男子，他看起來比上次更加虛弱了：<br/>
              「你...找到水了嗎？我快...撐不住了...」
            </template>
            <template v-else>
              陌生男子已經恢復了精神，他對你點了點頭，隨後消失在陰影中。
            </template>
          </div>
        </template>

        <template v-else>
          <div class="event-icon pulse">🫙</div>
          <div class="dialog-box">
            <template v-if="gameStateStore.eventAction === 1">
              陌生男子顫抖地遞給你一個空瓶：「拜託了...附近應該有水源...」
            </template>
            <template v-else-if="gameStateStore.eventAction === 2">
              你冷酷地搜颳了受傷的陌生男子，拿走了他的金幣。他在憤恨中消失在沙塵之中...
            </template>
            <template v-else-if="gameStateStore.eventAction === 3">
              陌生男子一飲而盡，臉色瞬間恢復了點血色。<br/>他感激地說：「大恩大德，亞崔迪家族會感謝你！」
            </template>
            <template v-else-if="gameStateStore.eventAction === 4">
              陌生男子一飲而盡，臉色瞬間大驚失色。<br/>「操！你給我喝了啥?」
            </template>
          </div>
        </template>
      </div>
    </template>

    <template #button v-if="gameStateStore.stateIs(GameState.EVENT_PHASE)">
      <template v-if="gameStateStore.eventAction == 0">
        <el-button v-if="currentProcess === 0" type="primary" @click="handleChoice('get_bottle')">
          拿走空瓶並幫忙
        </el-button>
        <el-button
            v-if="currentProcess === 1"
            :disabled="!hasWater"
            type="success"
            @click="handleChoice('give_water')">
          遞出裝好的水
        </el-button>

        <el-button v-if="currentProcess < 2" type="danger" @click="handleChoice('rob')">
          搜刮他的財物
        </el-button>

        <el-button type="info" @click="onLeave">快步離開</el-button>
      </template>
    </template>
  </EventTemplate>
</template>