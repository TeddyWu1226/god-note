<script setup lang="ts">
import './shop.css'
import {computed} from 'vue';
import {usePlayerStore} from "@/store/player-store";
import {ElMessage, ElMessageBox} from "element-plus";
import {UsableType, EquipmentType, ItemType} from "@/types";
import {EQUIP_BASE_PRICE, MATERIAL_BASE_PRICE} from "@/components/RoomLayout/comps/ShopRoom/useShopLogic";
import {createDoubleTapHandler} from "@/utils/touch";

const playerStore = usePlayerStore();

type StackedItem = (EquipmentType | UsableType) & {
  count: number;
  originalIndices: number[];
  bagType: 'items' | 'equipments' | 'consumeItems';
};

// 聚合計算移到這裡
const stackedBags = computed(() => {
  const bags: Record<string, StackedItem[]> = {items: [], equipments: [], consumeItems: []};
  const bagTypes = ['items', 'equipments', 'consumeItems'] as const;

  bagTypes.forEach(type => {
    const map = new Map<string, StackedItem>();
    (playerStore.info[type] || []).forEach((item, index) => {
      if (!item) return;
      if (item.unsellable) return;
      if (map.has(item.name)) {
        const existing = map.get(item.name)!;
        existing.count++;
        existing.originalIndices.push(index);
      } else {
        map.set(item.name, {...item, count: 1, originalIndices: [index], bagType: type});
      }
    });
    bags[type] = Array.from(map.values());
  });
  return bags;
});

const getSellPrice = (item: StackedItem) => {
  if (item['position']) {
    return Math.floor((EQUIP_BASE_PRICE[item.quality] || 50) * 0.25);
  }
  return Math.floor((MATERIAL_BASE_PRICE[item.quality] || 1));
};

const handleSell = (item: StackedItem) => {
  const price = getSellPrice(item);
  playerStore.addGold(price);
  const realIndex = item.originalIndices.pop();
  if (realIndex !== undefined) {
    playerStore.info[item.bagType].splice(realIndex, 1);
    ElMessage.success(`賣出了 ${item.name}，獲得了 ${price} G`);
  }
};
const onTouchHandleSell = createDoubleTapHandler((slotKey: StackedItem) => {
  handleSell(slotKey);
}, 350)

const handleSellAll = (type: 'items' | 'equipments') => {
  const bag = playerStore.info[type];
  if (!bag || bag.length === 0) return;

  // 計算預計收益
  let totalGold = 0;
  bag.forEach((item: StackedItem) => {
    if (item.unsellable) {
      return
    }
    if (item) {
      // 複用你寫好的 getSellPrice
      totalGold += getSellPrice(item as StackedItem);
    }
  });

  const typeName = type === 'equipments' ? '所有裝備' : '所有道具';

  // 使用 ElMessageBox 代替原生 confirm
  ElMessageBox.confirm(
      `確定要賣出背包內「${typeName}」嗎？<br/>共可獲得 💰 ${totalGold} G`,
      '一鍵販賣確認',
      {
        confirmButtonText: '確認販賣',
        cancelButtonText: '再想想',
        dangerouslyUseHTMLString: true,
        type: 'warning',
        buttonSize: 'default',
        center: true,
      }
  ).then(() => {
    // 使用者點擊確認
    playerStore.addGold(totalGold);
    playerStore.info[type] = playerStore.info[type].filter(item => item.unsellable) as EquipmentType[];

    ElMessage({
      type: 'success',
      message: `清倉完畢！收穫了 ${totalGold} G`,
      duration: 2000
    });
  }).catch(() => {
    // 使用者點擊取消或關閉視窗，不做處理
  });
};
</script>

<template>
  <div class="sell-container">
    <div v-for="type in (['items', 'equipments'] as const)" :key="type" class="bag-section">
      <h4 v-if="stackedBags[type].length">
        {{ type === 'equipments' ? '裝備' : '道具' }}
        <el-button
            size="small"
            type="danger"
            style="margin-left: 5px"
            plain
            @click="handleSellAll(type)"
        >
          一鍵販賣
        </el-button>
      </h4>
      <div class="shop-grid">
        <div v-for="item in stackedBags[type]"
             :key="item.name"
             class="item-card sell-card"
             @dblclick="handleSell(item)"
             @touchend="onTouchHandleSell(item)"
        >
          <div class="item-badge" v-if="item.count > 1">x{{ item.count }}</div>
          <div class="item-icon">{{ item.icon }}</div>
          <div class="item-name">{{ item.name }}</div>
          <div class="price-tag">回收價:💰 {{ getSellPrice(item) }}</div>
          <div class="sell-action-overlay">雙擊販賣</div>
        </div>
      </div>
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
  font-size: 0.9rem;
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
}


</style>