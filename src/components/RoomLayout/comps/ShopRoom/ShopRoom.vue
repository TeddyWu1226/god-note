<script setup lang="ts">
import './shop.css'
import {ref, onMounted} from "vue";
import {useGameStateStore} from "@/store/game-state-store";
import {useShopLogic} from "./useShopLogic";
import {GameState} from "@/enums/enums";
import ShopBuyTab from "@/components/RoomLayout/comps/ShopRoom/ShopBuyTab.vue";
import ShopSellTab from "@/components/RoomLayout/comps/ShopRoom/ShopSellTab.vue";


const gameStateStore = useGameStateStore();
const {generateGoods} = useShopLogic(gameStateStore.currentStage);

const itemList = ref([]);
const activeTab = ref<'buy' | 'sell'>('buy');
const isExited = ref(false);

onMounted(() => {
  // 只有第一次進入 EventPhase 會初始化商品
  if (gameStateStore.stateIs(GameState.EVENT_PHASE)) {
    itemList.value = generateGoods();
    gameStateStore.transitionToNextState();
  } else {
    isExited.value = true;
  }
});
</script>

<template>
  <div class="shop-layout">
    <div style="width: 100%" v-if="!isExited">
      <div class="header">
        <h2>🧌 地精商店</h2>
        <el-radio-group
            v-model="activeTab"
            style="padding-left: 1rem"
            :fill="activeTab === 'sell'?'var(--el-color-danger)':''"
        >
          <el-radio-button label="buy">購買</el-radio-button>
          <el-radio-button label="sell">販賣</el-radio-button>
        </el-radio-group>
      </div>
      <keep-alive>
        <component :is="activeTab === 'buy' ? ShopBuyTab : ShopSellTab" :items="itemList"/>
      </keep-alive>
    </div>
    <div v-else class="run-text">商人已經離開了...</div>
  </div>
</template>
<style scoped>
.shop-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.header {
  margin-bottom: 1rem;
  text-align: center;
}

.run-text {
  font-size: 1.5rem;
  text-align: center
}
</style>