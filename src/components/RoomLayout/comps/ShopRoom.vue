<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useGameStateStore} from "@/store/game-state-store";
import {EquipmentType, ItemType, PotionType} from "@/types";
import {getRandomItemsByQuality} from "@/utils/create";
import {QualityEnum} from "@/enums/quilty-enum";
import {Armor} from "@/constants/equipment/armor-info";
import {Head} from "@/constants/equipment/head-info";
import {Offhand} from "@/constants/equipment/offhand-info";
import {Weapon} from "@/constants/equipment/weapon-info";
import {ElMessage} from "element-plus";
import {getEnumColumn} from "@/utils/enum";
import {Potions} from "@/constants/potion-info";
import {usePlayerStore} from "@/store/player-store";
import {GameState} from "@/enums/enums";

const gameStateStore = useGameStateStore();
const playerStore = usePlayerStore();

// 商店商品列表 (包含一個 'sold' 標記來處理售出狀態)
const itemList = ref<((ItemType | PotionType | EquipmentType) & { sold?: boolean; price?: number })[]>([]);
const isRun = ref(false)
/**
 * 根據品質計算價格的簡單公式
 */
const potionPrices = [25, 50, 150, 300, 1000, 3000]
const calculatePrice = (quality: number) => {
  const basePrice = [20, 100, 500, 2000, 10000, 5000][quality] || 50;
  // 加入一點隨機波動 (±10%)
  return Math.floor(basePrice * (0.9 + Math.random() * 0.2));
};

const activeTab = ref<'buy' | 'sell'>('buy'); // 控制目前是買還是賣

/**
 * 賣價計算：假設為買價的 40%
 */
const getSellPrice = (item: any) => {
  // 如果物品原本就有 price 屬性則用它計算，否則根據品質估算
  const base = calculatePrice(item.quality || 0);
  return Math.floor(base * 0.4);
};

/**
 * 販賣邏輯
 */
const sellItem = (item: any, index: number, bagType: 'items' | 'equipments' | 'consumeItems') => {
  const price = getSellPrice(item);

  // 1. 玩家獲得金幣
  playerStore.addGold(price);

  // 2. 從背包移除 (使用我們之前寫好的方法)
  // 因為我們有索引，直接用 splice 更精準
  playerStore.info[bagType].splice(index, 1);

  ElMessage.success(`賣出了 ${item.name}，獲得了 ${price} G`);
};

const init = () => {
  itemList.value = []
  const randomEquips = getRandomItemsByQuality(
      5,
      QualityEnum.Tattered.value,
      Armor, Head, Offhand, Weapon
  );
  const randomPotion = getRandomItemsByQuality(
      3,
      QualityEnum.Tattered.value,
      Potions
  );
  // 初始化商品，加入價格與售出狀態
  itemList.value = randomEquips.map(item => ({
    ...item,
    price: calculatePrice(item.quality ?? 0),
    sold: false
  })).concat(
      randomPotion.map(item => ({
        ...item,
        price: potionPrices[item.quality ?? 0],
        sold: false
      }))
  )
};
/**
 * 點擊邏輯
 */
const isShowDetail = ref(false);
const selectedItem = ref<ItemType | PotionType | EquipmentType | undefined>()
const onClickItem = (item: ItemType | PotionType | EquipmentType) => {
  if (playerStore.info.gold < (item as any).price) {
    ElMessage.error("錢不夠啊，窮光蛋！");
    return;
  }
  isShowDetail.value = true;
  selectedItem.value = item
}
/**
 * 購買邏輯
 */
const buyItem = () => {
  // 注意：這裡直接拿選中的 selectedItem 來操作
  const item = selectedItem.value as any;
  if (!item || item.sold) return;

  if (playerStore.info.gold < item.price) {
    ElMessage.error("錢不夠啊，窮光蛋！");
    return;
  }

  // 執行購買邏輯
  playerStore.addGold(-item.price);
  item.sold = true; // 因為 selectedItem 是對 itemList 元素的引用，這會同步更新列表

  // 關閉彈窗
  isShowDetail.value = false;
  ElMessage.success(`成功購買 ${item.name}!`);
  const {sold, price, ...cleanItem} = item;
  playerStore.gainItem(cleanItem);
};

// 進入房間時初始化
onMounted(() => {
  init();
  if (gameStateStore.stateIs(GameState.EVENT_PHASE)) {
    gameStateStore.transitionToNextState()
  } else {
    isRun.value = true
  }
});
</script>

<template>
  <div class="shop-room">
    <template v-if="!isRun">
      <div>
        <h2 style="display: flex;align-items: center">
          🧌 神秘商人
          <el-radio-group
              v-model="activeTab"
              style="padding-left: 1rem"
              :fill="activeTab === 'sell'?'var(--el-color-danger)':''">
            <el-radio-button label="buy">購買</el-radio-button>
            <el-radio-button label="sell">販賣</el-radio-button>
          </el-radio-group>
        </h2>

      </div>

      <div v-if="activeTab === 'buy'" class="shop-container">
        <div
            v-for="(item, index) in itemList"
            :key="'buy-'+index"
            class="item-card"
            :style="{ borderColor: getEnumColumn(QualityEnum, item?.quality, 'color', 'white'), color: getEnumColumn(QualityEnum, item?.quality, 'color', 'white') }"
            :class="{ 'is-sold': item.sold }"
            @click="onClickItem(item)"
        >
          <div class="item-icon">{{ item.icon }}</div>
          <div class="item-name">{{ item.name }}</div>
          <div class="item-price" v-if="!item.sold">💰 {{ item.price }} G</div>
          <div class="item-sold-text" v-else>售出</div>
        </div>
      </div>

      <div v-else class="sell-container">
        <p class="gold-hint">我的金幣: 💰 {{ playerStore.info.gold }}</p>

        <div v-for="bagType in (['consumeItems', 'items', 'equipments'] as const)" :key="bagType" class="bag-section">
          <h4 v-if="playerStore.info[bagType]?.length">
            {{ bagType === 'consumeItems' ? '消耗品' : bagType === 'equipments' ? '裝備' : '一般道具' }}</h4>
          <div class="shop-container">
            <div
                v-for="(item, index) in playerStore.info[bagType]"
                :key="'sell-' + bagType + index"
                class="item-card sell-card"
                @click="sellItem(item, index, bagType)"
            >
              <div class="item-icon">{{ item.icon }}</div>
              <div class="item-name">{{ item.name }}</div>
              <div class="sell-price-tag">回收價: {{ getSellPrice(item) }} G</div>
              <div class="sell-action-overlay">點擊販賣</div>
            </div>
          </div>
        </div>

        <div
            v-if="!playerStore.info.items?.length && !playerStore.info.equipments?.length && !playerStore.info.consumeItems?.length"
            class="empty-bag">
          背包空空如也...
        </div>
      </div>

    </template>

    <span v-else class="run-text">因為你刷新了頁面<br/>商人覺得你不想買就跑了...</span>
  </div>
</template>

<style scoped>
.shop-room {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 12px;
}


.shop-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: .5rem;
}

.item-card {
  width: 8rem;
  background: var(--el-card-bg-color);
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: .5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

@media (max-width: 767px) {
  .item-card {
    width: 5rem;
  }
}

.item-card:hover:not(.is-sold) {
  transform: translateY(-5px);
  border-color: #4CAF50;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.item-card.is-sold {
  opacity: 0.5;
  filter: grayscale(1);
  cursor: not-allowed;
}

.item-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.item-name {
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.item-desc {
  font-size: 0.8rem;
  color: #666;
  height: 2.5rem;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.item-price {
  color: #e6a23c;
  font-weight: bold;
}

.item-sold-text {
  color: #f56c6c;
  font-weight: bold;
  text-decoration: line-through;
}

.detail-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.detail-icon {
  font-size: 3rem;
}

.detail-desc {
  color: #888;
  font-size: 0.9rem;
}

.detail-stats {
  width: 100%;
  margin-bottom: 1.5rem;
}

.run-text {
  font-size: 1.5rem;
  text-align: center
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.05);
  margin-bottom: 4px;
  border-radius: 4px;
  font-size: 1rem;
}

.stat-label {
  color: #aaa;
}

.stat-value.plus {
  color: #67c23a;
}

.stat-value.minus {
  color: #f56c6c;
}

.sell-container {
  width: 100%;
  max-width: 600px;
}

.bag-section {
  margin-bottom: 1.5rem;
}

.bag-section h4 {
  border-left: 4px solid #e6a23c;
  padding-left: 10px;
  margin-bottom: 0.5rem;
  color: #ccc;
}

.sell-card {
  position: relative;
  border-color: #555;
  overflow: hidden;
}

.sell-price-tag {
  color: #67c23a;
  font-size: 0.85rem;
  margin-top: 5px;
}

/* 販賣時的遮罩效果 */
.sell-action-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(245, 108, 108, 0.9);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  opacity: 0;
  transition: opacity 0.2s;
}

.sell-card:hover .sell-action-overlay {
  opacity: 1;
}

.gold-hint {
  text-align: center;
  color: #ffca28;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.empty-bag {
  text-align: center;
  color: #666;
  padding: 2rem;
}
</style>