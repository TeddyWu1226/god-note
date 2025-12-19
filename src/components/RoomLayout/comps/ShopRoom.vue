<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useGameStateStore} from "@/store/game-state-store";
import {EquipmentType, ItemType, PotionType, statLabels} from "@/types";
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

/**
 * 根據品質計算價格的簡單公式
 */
const potionPrices = [50, 100, 200, 400, 1000, 3000]
const calculatePrice = (quality: number) => {
  const basePrice = [20, 100, 500, 2000, 10000, 5000][quality] || 50;
  // 加入一點隨機波動 (±10%)
  return Math.floor(basePrice * (0.9 + Math.random() * 0.2));
};

const init = () => {
  itemList.value = []
  const randomEquips = getRandomItemsByQuality(
      4,
      QualityEnum.Tattered.value,
      Armor, Head, Offhand, Weapon
  );
  const randomPotion = getRandomItemsByQuality(
      2,
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
  // if (UserInfo.value.gold < (item as any).price) {
  //   ElMessage.error("錢不夠啊，窮光蛋！");
  //   return;
  // }
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
  }
});
</script>

<template>
  <div class="shop-room">
    <div class="shop-header">
      <h2>🧌 神秘商人</h2>
      <p>「我這裡有些好貨，看看吧!」</p>
    </div>

    <div class="shop-container">
      <div
          v-for="(item, index) in itemList"
          :key="index"
          class="item-card"
          :style="{
            borderColor: getEnumColumn(QualityEnum,item?.quality,'color','white'),
            color:getEnumColumn(QualityEnum,item?.quality,'color','white')
          }"
          :class="{ 'is-sold': item.sold }"
          @click="onClickItem(item)"
      >
        <div class="item-icon">{{ item.icon }}</div>
        <div class="item-info">
          <div class="item-name">{{ item.name }}</div>
          <div class="item-desc">{{ item.description }}</div>
          <div class="item-price" v-if="!item.sold">
            💰 {{ item.price }} G
          </div>
          <div class="item-sold-text" v-else>售出</div>
        </div>
      </div>
    </div>
    <el-dialog
        v-model="isShowDetail"
        :title="`物品詳情 💰 ${ (selectedItem as any)?.price } G`"
        align-center
    >
      <div v-if="selectedItem" class="detail-container">
        <div class="detail-icon">{{ selectedItem.icon }}</div>
        <h3 :style="{ color: getEnumColumn(QualityEnum, selectedItem.quality, 'color', '#fff') }">
          {{ selectedItem.name }}
        </h3>

        <p class="detail-desc">{{ selectedItem.description }}</p>

        <el-divider content-position="left">屬性</el-divider>

        <div class="detail-stats">
          <template v-for="(val, key) in selectedItem" :key="key">
            <div v-if="statLabels[key] && val" class="stat-row">
              <span class="stat-label">{{ statLabels[key] }}</span>
              <span class="stat-value" :class="{ 'plus': (val as number) > 0, 'minus': (val as number) < 0 }">
                {{ (val as number) > 0 ? '+' : '' }}{{ val }}
              </span>
            </div>
          </template>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isShowDetail = false">取消</el-button>
          <el-button
              type="warning"
              :disabled="(selectedItem as any)?.sold"
              @click="buyItem"
          >
            {{ (selectedItem as any)?.sold ? '已售出' : '確認購買' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.shop-room {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 12px;
}

.shop-header {
  text-align: center;
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

.detail-price {
  font-size: 1.2rem;
  font-weight: bold;
}

.detail-price span {
  color: #e6a23c;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
</style>