<script setup lang="ts">
import './event-room.css'
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import EventTemplate from "@/components/RoomLayout/event/EventTemplate.vue";
import {computed, ref} from "vue";
import {GameState, SpecialEventEnum} from "@/enums/enums";
import {Accessory2} from "@/constants/items/equipment/accessories-info";
import {MATERIAL} from "@/constants/items/material/material-info";

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();

/**
 * eventAction 狀態控制
 * 0: 初始對話
 * 1: 接受委託 (拿到指南)
 * 2: 交付物資 (拿到對獸道具)
 * 3: 完成傳說 (拿到強力飾品)
 */


// 檢查玩家是否有巨獸碎片 (假設碎片 ID 或 Key 為 'BEAST_SHARD')
const hasBeastShard = computed(() => playerStore.hasItem(MATERIAL.BehemothScales.name));
// 檢查玩家是否有修復材料 (例如 5 個鐵礦)
const hasMaterials = computed(() => playerStore.getItemCount('IRON_ORE') >= 5);
// 檢查是否擊敗了巨獸 (假設存放在 global 變數或成就系統)
const isBeastDefeated = computed(() => gameStateStore.otherRecord['BEAST_DEFEATED'] === true);

const currentProcess = computed(() => gameStateStore.getEventProcess(SpecialEventEnum.HuntDuneBeast));

const handleChoice = (action: 'ask' | 'accept' | 'deliver' | 'complete') => {
  if (action === 'accept') {
    gameStateStore.eventAction = 1;
    gameStateStore.addEventProcess(SpecialEventEnum.HuntDuneBeast);
    // playerStore.gainItem(Material.HuntGuide); // 獲得狩獵指南
    gameStateStore.transitionToNextState();
  } else if (action === 'deliver') {
    gameStateStore.eventAction = 2;
    // playerStore.removeItem('IRON_ORE', 5);
    // playerStore.gainItem(Consumable.BeastTrap); // 獲得對獸專用陷阱
    gameStateStore.addEventProcess(SpecialEventEnum.HuntDuneBeast);
    gameStateStore.transitionToNextState();
  } else if (action === 'complete') {
    gameStateStore.eventAction = 3;
    playerStore.gainItem(Accessory2.SandSpiritBlessing); // 獲得強力道具：沙靈祝福
    gameStateStore.addEventProcess(SpecialEventEnum.HuntDuneBeast, true); // 標記事件完全終結
    gameStateStore.transitionToNextState();
  }
};

const onLeave = () => {
  gameStateStore.transitionToNextState();
};

const init = () => {
  gameStateStore.recordThisStageAppear(SpecialEventEnum.HuntDuneBeast)
}
init()
</script>

<template>
  <EventTemplate title="🏜️神秘的沙之民">
    <template #default v-if="gameStateStore.getEventProcess(SpecialEventEnum.HuntDuneBeast) === 0">
      <div class="general-event">
        <template>
          <div class="event-icon">👤</div>
          <div class="dialog-box">
            <template v-if="gameStateStore.eventAction === 0">
              一名披著斗篷的跛腳獵人攔住了你，眼神盯著你行囊中閃爍的碎片：<br/>
              「那是...巨獸的鱗片？沒想到有人如此魯莽到會去挑戰它。」
            </template>
            <template v-else-if="gameStateStore.eventAction === 1">
              「當然知道!它是這片土地上的霸主，我們沙之民只能在陰影之中存活也是因為他的存在...」
              「但現在不一樣了!看得出來你能解決它。」
            </template>
            <template v-else-if="gameStateStore.eventAction === 2">
              「給你!這個是狩獵那頭怪物道具所需的合成表!」
              「只要你準備好這個,我會在」
            </template>
          </div>
        </template>

        <!--          <template v-else>-->
        <!--            <div class="event-icon pulse">📦</div>-->
        <!--            <div class="dialog-box">-->
        <!--              <template v-if="gameStateStore.eventAction === 1">-->
        <!--                獵人給了你一張清單：「收集 5 份鐵礦回來找我，我會幫你製作專門對付巨獸的陷阱。」-->
        <!--              </template>-->
        <!--              <template v-else-if="gameStateStore.eventAction === 2">-->
        <!--                他熟練地敲打著金屬，將材料組合成複雜的機械裝置：<br/>-->
        <!--                「拿去吧，這是在戰鬥中削弱巨獸力量的關鍵。」-->
        <!--              </template>-->
        <!--              <template v-else-if="gameStateStore.eventAction === 3">-->
        <!--                他將一枚由巨獸核心打造的項鍊交給你：<br/>-->
        <!--                「沙漠會記住你的名字。願風沙引導你的前進。」-->
        <!--              </template>-->
        <!--            </div>-->
        <!--          </template>-->
      </div>
    </template>
    <template #button v-if="gameStateStore.getEventProcess(SpecialEventEnum.HuntDuneBeast) === 0">
      <template v-if="gameStateStore.eventAction == 0">
        <el-button
            type="primary"
            @click="()=>{
              gameStateStore.eventAction = 1
            }">
          你知道那頭怪物?
        </el-button>
        <el-button type="info" @click="onLeave">不理他</el-button>
      </template>
      <template v-if="gameStateStore.eventAction == 1">
        <el-button
            type="primary"
            @click="()=>{
              gameStateStore.eventAction = 2
            }">
          我?我怎麼解決?
        </el-button>
      </template>
    </template>
  </EventTemplate>
</template>