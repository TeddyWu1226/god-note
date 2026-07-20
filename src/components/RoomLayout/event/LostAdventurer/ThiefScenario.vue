<script setup lang="ts">
import {computed} from "vue";
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {RoomEnum} from "@/enums/room-enum";
import {SpecialEventEnum} from "@/enums/enums";

const props = defineProps({
  view: {
    type: String, // 'content' | 'button'
    required: true
  }
});

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();
const canSurrender = computed(() => playerStore.info.gold >= 100);
const isSurrendered = computed(() => !!gameStateStore.otherRecord['THIEF_SURRENDERED']);

const handleFight = () => {
  const stage = gameStateStore.currentStage;
  const count = Math.floor(Math.random() * 3) + 1; // 隨機 1 ~ 3 個
  const thieves = [];

  for (let i = 0; i < count; i++) {
    const thief = gameStateStore.createMonster('EventThief');

    // 如果有多個強盜，給予後綴編號以利區分
    if (count > 1) {
      thief.name = `${thief.name} ${String.fromCharCode(65 + i)}`;
    }

    if (stage === 1) {
      thief.ad = 15;
      thief.critRate = 10;
      thief.adDefend = 6;
      thief.dodge = 20;
      thief.hit = 20;
      thief.hp = 100;
      thief.hpLimit = 100;
      thief.level = 5;
      thief.dropGold = 50;
    } else if (stage === 2) {
      // 緋紅鱷強度
      thief.ad = 25;
      thief.critRate = 10;
      thief.adDefend = 12;
      thief.dodge = 40;
      thief.hit = 40;
      thief.hp = 100;
      thief.hpLimit = 100;
      thief.level = 15;
      thief.dropGold = 100;
    } else {
      // 第三階段及以上（異變血蟲強度）
      thief.ad = 35;
      thief.critRate = 10;
      thief.adDefend = 18;
      thief.dodge = 60;
      thief.hit = 60;
      thief.hp = 150;
      thief.hpLimit = 150;
      thief.level = 30;
      thief.dropGold = 150;
    }
    thieves.push(thief);
  }

  gameStateStore.switchToFightRoom(RoomEnum.Fight.value, thieves);
};

const handleSurrender = () => {
  playerStore.info.gold = 0;
  gameStateStore.otherRecord['THIEF_SURRENDERED'] = true;
  gameStateStore.transitionToNextState();
};

</script>

<template>
  <!-- 內容視圖 -->
  <template v-if="props.view === 'content'">
    <div class="general-event">
      <template v-if="!isSurrendered">
        <div class="event-icon shine">🥷</div>
        <div class="dialog-box">
          <p>神祕的人影突然轉過身來，露出了猙嚀而貪婪的笑容！</p>
          <p class="talk-text" style="color: var(--el-color-danger)">
            「嘿嘿，沒想到在這種鬼地方還能碰到肥羊！把你的財寶交出來！」
          </p>
        </div>
      </template>
      <template v-else>
        <div class="event-icon">💸</div>
        <div class="dialog-box">
          <p>你無奈地面向強盜，交出了身上所有的金幣...</p>
          <p class="story-text" style="font-weight: bold; margin-top: 1rem; text-align: center;">
            強盜們大笑著數完金幣後，滿意地轉身離去。
          </p>
        </div>
      </template>
    </div>
  </template>

  <!-- 按鈕視圖 -->
  <template v-else-if="props.view === 'button'">
    <template v-if="!isSurrendered">
      <el-button type="danger" @click="handleFight">
        迎戰 ⚔️
      </el-button>
      <el-button type="warning" :disabled="!canSurrender" @click="handleSurrender">
        求饒 🙇‍♂️ (交出所有金幣)
      </el-button>
    </template>
  </template>
</template>
