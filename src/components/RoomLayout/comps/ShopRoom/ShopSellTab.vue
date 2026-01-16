<script setup lang="ts">
import './shop.css'
import {computed} from 'vue';
import {usePlayerStore} from "@/store/player-store";
import {ElMessage, ElMessageBox} from "element-plus";
import {EQUIP_BASE_PRICE} from "@/components/RoomLayout/comps/ShopRoom/useShopLogic";
import {createDoubleTapHandler} from "@/utils/touch";
import {getEnumColumn} from "@/utils/enum";
import {QualityEnum} from "@/enums/quality-enum";

const playerStore = usePlayerStore();

// 定義顯示用的統一型別
type ShopDisplayItem = {
  item: any;
  count: number;
  bagType: 'items' | 'equipments' | 'consumeItems';
};

// 🌟 修正：針對不同結構的背包進行聚合
const stackedBags = computed(() => {
  const bags: Record<string, ShopDisplayItem[]> = {items: [], equipments: [], consumeItems: []};

  // 1. 處理堆疊背包 (items, consumeItems) -> 直接取出
  const stackedKeys = ['items', 'consumeItems'] as const;
  stackedKeys.forEach(key => {
    bags[key] = (playerStore.info[key] || [])
        .filter(entry => !entry.item.unsellable)
        .map(entry => ({
          item: entry.item,
          count: entry.count,
          bagType: key
        }));
  });

  // 2. 處理不堆疊背包 (equipments) -> 組件內暫時聚合顯示
  const equipMap = new Map<string, ShopDisplayItem>();
  (playerStore.info.equipments || []).forEach((item) => {
    if (item.unsellable) return;
    if (equipMap.has(item.name)) {
      equipMap.get(item.name)!.count++;
    } else {
      equipMap.set(item.name, {item, count: 1, bagType: 'equipments'});
    }
  });
  bags.equipments = Array.from(equipMap.values());

  // 最後統一排序
  Object.keys(bags).forEach(key => {
    bags[key].sort((a, b) => (b.item.quality || 0) - (a.item.quality || 0));
  });

  return bags;
});

const getSellPrice = (item: any) => {
  // 如果是裝備（有部位設定）
  if (item.position) {
    return Math.floor((EQUIP_BASE_PRICE[item.quality] || 50) * 0.25);
  }
  // 否則使用物品預設價格
  return Math.floor(item?.price || 1);
};

const handleSell = (entry: ShopDisplayItem) => {
  const price = getSellPrice(entry.item);

  // 呼叫 store 的通用移除方法，這會處理堆疊 count 或陣列 splice
  const success = playerStore.removeItem(entry.item.name, 1);

  if (success) {
    playerStore.addGold(price);
    ElMessage.success(`賣出了 ${entry.item.name}，獲得了 💰 ${price}`);
  }
};

const onTouchHandleSell = createDoubleTapHandler((entry: ShopDisplayItem) => {
  handleSell(entry);
}, 350)

const handleSellAll = (type: 'items' | 'equipments') => {
  const list = stackedBags.value[type];
  if (!list || list.length === 0) return;

  // 計算總收益：遍歷聚合後的清單，價格 * 數量
  let totalGold = 0;
  list.forEach(entry => {
    totalGold += getSellPrice(entry.item) * entry.count;
  });

  const typeName = type === 'equipments' ? '所有裝備' : '所有雜物';

  ElMessageBox.confirm(
      `確定要賣出背包內「${typeName}」嗎？<br/>共可獲得 💰 ${totalGold} G`,
      '一鍵清倉',
      {
        confirmButtonText: '全部賣掉',
        cancelButtonText: '再想想',
        dangerouslyUseHTMLString: true,
        type: 'warning',
        center: true,
      }
  ).then(() => {
    playerStore.addGold(totalGold);

    // 執行清空邏輯
    if (type === 'equipments') {
      // 裝備：保留不可販賣的
      playerStore.info.equipments = playerStore.info.equipments.filter(i => i.unsellable);
    } else {
      // items：保留不可販賣的
      playerStore.info.items = playerStore.info.items.filter(entry => entry.item.unsellable);
    }

    ElMessage.success(`清倉完畢！收穫了 ${totalGold} G`);
  }).catch(() => {
  });
};

const handleSellStack = (entry: ShopDisplayItem) => {
  const singlePrice = getSellPrice(entry.item);
  const totalPrice = singlePrice * entry.count;

  // 呼叫 removeItem，數量傳入 entry.count 即可整組移除
  const success = playerStore.removeItem(entry.item.name, entry.count);

  if (success) {
    playerStore.addGold(totalPrice);
    ElMessage.success(`賣出了全部 ${entry.item.name} x${entry.count}，獲得了 💰 ${totalPrice}`);
  }
};
</script>

<template>
  <div class="sell-container">
    <div v-for="type in (['items', 'equipments'] as const)" :key="type" class="bag-section">
      <template v-if="stackedBags[type].length">
        <h4>
          {{ type === 'equipments' ? '裝備' : '素材' }}
          <el-button
              size="small"
              type="danger"
              style="margin-left: 10px"
              plain
              @click="handleSellAll(type)"
          >
            一鍵清倉
          </el-button>
        </h4>
        <div class="shop-grid">
          <div v-for="entry in stackedBags[type]"
               :key="entry.item.name"
               class="item-card sell-card"
               @dblclick="handleSell(entry)"
               @touchend="onTouchHandleSell(entry)"
          >
            <div class="item-badge" v-if="entry.count > 1">x{{ entry.count }}</div>
            <div class="item-icon">{{ entry.item.icon }}</div>
            <div class="item-name" :style="{color:getEnumColumn(QualityEnum, entry.item.quality, 'color')}">
              {{ entry.item.name }}
            </div>
            <div class="price-tag">回收價:💰 {{ getSellPrice(entry.item) }}</div>
            <div class="sell-action-overlay">
              <div class="overlay-text">雙擊販賣</div>
              <el-button
                  v-if="entry.count > 1"
                  class="sell-stack-btn"
                  size="small"
                  type="warning"
                  @click.stop="handleSellStack(entry)"
              >
                整組賣掉
              </el-button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.sell-container {
  width: 100%;
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
  touch-action: none;
}

.item-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.75rem;
  border: 1px solid #e6a23c;
  z-index: 2;
}

/* 販賣時的遮罩效果 */
.sell-action-overlay {
  background: rgba(245, 108, 108, 0.95);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  //background: rgba(0, 0, 0, 0.6); /* 稍微調暗背景，讓按鈕更明顯 */
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none; /* 預設穿透 */
}

.overlay-text {
  font-size: 0.8rem;
  font-weight: bold;
  pointer-events: none; /* 讓文字不影響雙擊 */
}

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
  pointer-events: auto;
}

.sell-stack-btn {
  position: absolute;
  top: 5px;
  left: 5px;
  padding: 2px 6px !important;
  font-size: 0.75rem;
  height: 1.3rem;
  z-index: 10;
}

/* 避免按鈕太醜，稍微修飾一下 */
.sell-stack-btn:hover {
  transform: scale(1.05);
}

</style>