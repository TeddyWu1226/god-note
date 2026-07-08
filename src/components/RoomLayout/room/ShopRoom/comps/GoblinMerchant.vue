<script setup lang="ts">
import {ref, computed, watch, onMounted} from "vue";
import {ItemInfo} from "@/components/Shared/itemInfo";
import {usePlayerStore} from "@/store/player-store";
import {QualityEnum} from "@/enums/quality-enum";
import {getEnumColumn} from "@/utils/enum";
import {ElMessage, ElMessageBox} from "element-plus";
import {EQUIP_BASE_PRICE} from "../useShopLogic";
import {createDoubleTapHandler} from "@/utils/touch";

// Props:接收父元件產生的商品清單
const props = defineProps<{
  itemList: any[]
}>();

const playerStore = usePlayerStore();
const activeTab = ref<'buy' | 'sell'>('buy');
const selectedItem = ref<any>(null);

// 控制詳情彈窗
const isShowDetail = ref(false);
const isMobile = ref(false);

onMounted(() => {
  const media = window.matchMedia('(max-width: 767px)');
  isMobile.value = media.matches;
  const listener = (e: MediaQueryListEvent) => {
    isMobile.value = e.matches;
  };
  media.addEventListener('change', listener);
});

// 切換頁籤時重置選擇項目，避免明細錯誤
watch(activeTab, () => {
  selectedItem.value = null;
});

// 整理背包販賣物
type ShopDisplayItem = {
  item: any;
  count: number;
  bagType: 'items' | 'equipments';
};

const stackedBags = computed(() => {
  const bags: Record<string, ShopDisplayItem[]> = {items: [], equipments: []};

  // 1. 處理堆疊素材
  bags.items = (playerStore.info.items || [])
      .filter(entry => !entry.item.unsellable)
      .map(entry => ({
        item: entry.item,
        count: entry.count,
        bagType: 'items' as const
      }));

  // 2. 處理裝備 (在前端進行聚合，區分強化等級)
  const equipMap: Record<string, ShopDisplayItem> = {};
  (playerStore.info.equipments || []).forEach((item) => {
    if (item.unsellable) return;
    const key = `${item.name}_${item.enhanceLevel || 0}`;
    if (equipMap[key]) {
      equipMap[key].count++;
    } else {
      equipMap[key] = {item, count: 1, bagType: 'equipments'};
    }
  });
  bags.equipments = Object.values(equipMap);

  // 排序品質高的在前面
  Object.keys(bags).forEach(key => {
    bags[key].sort((a, b) => (b.item.quality || 0) - (a.item.quality || 0));
  });

  return bags;
});

const getSellPrice = (item: any) => {
  if (!item) return 0;
  if (item.position) {
    return Math.floor((EQUIP_BASE_PRICE[item.quality ?? 0] || 50) * 0.25);
  }
  return Math.floor(item.price || 1);
};


// 彈窗與觸發二次確認
const triggerDetail = (item: any) => {
  selectedItem.value = item;
  isShowDetail.value = true;
};

const handleDoubleClick = (item: any) => {
  if (item.sold) return;
  triggerDetail(item);
};

const onTouchItem = createDoubleTapHandler((item: any) => {
  if (item.sold) return;
  triggerDetail(item);
}, 350);

const triggerSellDetail = (entry: any) => {
  selectedItem.value = entry;
  isShowDetail.value = true;
};

const handleSellDoubleClick = (entry: any) => {
  triggerSellDetail(entry);
};

const onTouchSellItem = createDoubleTapHandler((entry: any) => {
  triggerSellDetail(entry);
}, 350);

// 購買邏輯
const handleBuy = () => {
  const item = selectedItem.value;
  if (!item || item.sold) return;

  if (playerStore.info.gold < item.price) {
    ElMessage.error("金幣不足！");
    return;
  }

  // 1. 扣款
  playerStore.addGold(-item.price);
  // 2. 標記售出
  item.sold = true;
  // 3. 獲取物品
  const {sold, price, ...cleanItem} = item;
  playerStore.gainItem(cleanItem);

  selectedItem.value = null;
  ElMessage.success(`成功購買 ${item.name}!`);
};

const handleBuyConfirm = () => {
  handleBuy();
  isShowDetail.value = false;
};

// 單個販賣邏輯
const handleSell = (entry: any) => {
  if (!entry) return;
  const price = getSellPrice(entry.item);
  const success = playerStore.removeItem(entry.item, 1);

  if (success) {
    playerStore.addGold(price);
    ElMessage.success(`賣出了 ${entry.item.name}${entry.item.enhanceLevel ? ' +' + entry.item.enhanceLevel : ''}，獲得了 💰 ${price} G`);

    if (entry.count > 1) {
      entry.count--;
    } else {
      selectedItem.value = null;
    }
  }
};

const handleSellConfirmOne = () => {
  const entry = selectedItem.value;
  handleSell(entry);
  if (!selectedItem.value) {
    isShowDetail.value = false;
  }
};

// 整組販賣邏輯
const handleSellStack = (entry: any) => {
  if (!entry) return;
  const singlePrice = getSellPrice(entry.item);
  const count = entry.count;
  const totalPrice = singlePrice * count;

  let success = true;
  if (entry.bagType === 'equipments') {
    // 裝備依強化等級與 ID 逐一精準移除
    const targets = (playerStore.info.equipments || []).filter(
      (eq: any) => eq.name === entry.item.name && (eq.enhanceLevel || 0) === (entry.item.enhanceLevel || 0)
    ).slice(0, count);

    targets.forEach(target => {
      const ok = playerStore.removeItem(target, 1);
      if (!ok) success = false;
    });
  } else {
    // 普通材料維持原品名移除
    success = playerStore.removeItem(entry.item.name, count);
  }

  if (success) {
    playerStore.addGold(totalPrice);
    ElMessage.success(`賣出了全部 ${entry.item.name}${entry.item.enhanceLevel ? ' +' + entry.item.enhanceLevel : ''} x${count}，獲得了 💰 ${totalPrice} G`);
    selectedItem.value = null;
  }
};

const handleSellConfirmAll = () => {
  const entry = selectedItem.value;
  handleSellStack(entry);
  isShowDetail.value = false;
};

// 一鍵清倉邏輯
const handleSellAll = (type: 'items' | 'equipments') => {
  const list = stackedBags.value[type];
  if (!list || list.length === 0) return;

  let totalGold = 0;
  list.forEach(entry => {
    totalGold += getSellPrice(entry.item) * entry.count;
  });

  const typeName = type === 'equipments' ? '所有裝備' : '所有雜物與素材';

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
    if (type === 'equipments') {
      playerStore.info.equipments = playerStore.info.equipments.filter(i => i.unsellable);
    } else {
      playerStore.info.items = playerStore.info.items.filter(entry => entry.item.unsellable);
    }
    selectedItem.value = null;
    ElMessage.success(`清倉完畢！收穫了 ${totalGold} G`);
  }).catch(() => {
  });
};
</script>

<template>
  <div style="width: 100%; display: flex; flex-direction: column; height: 80%;">
    <!-- 商人頂部導覽列 -->
    <div class="merchant-header-bar">
      <el-radio-group v-model="activeTab" size="small">
        <el-radio-button label="buy">🛒 購買</el-radio-button>
        <el-radio-button label="sell">💰 販賣</el-radio-button>
      </el-radio-group>
    </div>
    <div class="merchant-table">
      <el-scrollbar class="merchant-scroll">
        <div v-if="activeTab === 'buy'" class="shop-grid">
          <div
              v-for="(item, index) in props.itemList"
              :key="index"
              class="item-card"
              :class="{
                  'is-sold': item.sold,
                  'is-active': selectedItem === item
                }"
              :style="{ borderColor: getEnumColumn(QualityEnum, item.quality, 'color', '#fff') }"
              @click="handleSellDoubleClick(item)"
              @touchend="onTouchItem(item)"
          >
            <div class="item-enhance-badge" v-if="item.enhanceLevel">+{{ item.enhanceLevel }}</div>
            <div class="item-icon">{{ item.icon }}</div>
            <div class="item-name" :style="{ color: getEnumColumn(QualityEnum, item.quality, 'color', '#fff') }">
              {{ item.name }}
            </div>
            <div class="item-price" v-if="!item.sold">💰 {{ item.price }}</div>
            <div class="item-sold-text" v-else>SOLD OUT</div>
          </div>
        </div>

        <!-- 販賣物資清單 -->
        <div v-else class="sell-container">
          <div v-for="type in (['items', 'equipments'] as const)" :key="type" class="bag-section">
            <template v-if="stackedBags[type].length">
              <div class="bag-section-header">
                <span class="bag-section-title">{{ type === 'equipments' ? '背包裝備' : '雜物素材' }}</span>
                <el-button
                    size="small"
                    type="danger"
                    plain
                    @click="handleSellAll(type)"
                >
                  一鍵清倉
                </el-button>
              </div>
              <div class="shop-grid">
                <div v-for="entry in stackedBags[type]"
                     :key="entry.item.name + '_' + (entry.item.enhanceLevel || 0)"
                     class="item-card"
                     :class="{ 'is-active': selectedItem?.item?.name === entry.item.name && selectedItem?.item?.enhanceLevel === entry.item.enhanceLevel && selectedItem?.bagType === entry.bagType }"
                     @click="handleSellDoubleClick(entry)"
                     @touchend="onTouchSellItem(entry)"
                >
                  <div class="item-badge" v-if="entry.count > 1">x{{ entry.count }}</div>
                  <div class="item-enhance-badge" v-if="entry.item.enhanceLevel">+{{ entry.item.enhanceLevel }}</div>
                  <div class="item-icon">{{ entry.item.icon }}</div>
                  <div class="item-name" :style="{color:getEnumColumn(QualityEnum, entry.item.quality, 'color')}">
                    {{ entry.item.name }}{{ entry.item.enhanceLevel ? ' +' + entry.item.enhanceLevel : '' }}
                  </div>
                  <div class="price-tag">💰 {{ getSellPrice(entry.item) }}</div>
                </div>
              </div>
            </template>
          </div>
          <div v-if="stackedBags.items.length === 0 && stackedBags.equipments.length === 0" class="empty-bag-text">
            你的背包空空如也，沒有可以售出的物資。
          </div>
        </div>
      </el-scrollbar>
    </div>

    <!-- 商品詳細資訊二次確認彈窗 -->
    <el-dialog
        v-model="isShowDetail"
        :title="activeTab === 'buy' ? '確認購買商品' : '確認販賣商品'"
        :width="isMobile ? '92%' : '30rem'"
        align-center
        destroy-on-close
    >
      <div v-if="selectedItem" class="detail-dialog-body">
        <!-- 顯示物品詳細資訊（不包含玩家擁有的金錢） -->
        <ItemInfo :item="activeTab === 'buy' ? selectedItem : selectedItem.item"/>
        <!-- 金額顯示區 -->
        <div class="item-detail-info">
          <span v-if="activeTab === 'buy'" style="color: #67c23a;">
            購買售價: 💰 {{ selectedItem.price }} G
          </span>
          <span v-else style="color: #f56c6c;">
            回收價格: 💰 {{ getSellPrice(selectedItem.item) }} G 
            <span v-if="selectedItem.count > 1"
                  style="font-size: 0.9rem; color: #909399; font-weight: normal; margin-left: 0.5rem;">
              (整組價格: 💰 {{ getSellPrice(selectedItem.item) * selectedItem.count }} G)
            </span>
          </span>
        </div>
      </div>

      <template #footer>
        <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
          <el-button @click="isShowDetail = false">取消</el-button>

          <!-- 購買確認按鈕 -->
          <el-button
              v-if="activeTab === 'buy' && selectedItem"
              type="success"
              :disabled="selectedItem.sold || playerStore.info.gold < selectedItem.price"
              @click="handleBuyConfirm"
          >
            {{ selectedItem.sold ? '已售出' : '確認購買' }}
          </el-button>

          <!-- 販賣確認按鈕 -->
          <template v-else-if="activeTab === 'sell' && selectedItem">
            <el-button
                type="danger"
                @click="handleSellConfirmOne"
            >
              販賣 1 個
            </el-button>
            <el-button
                v-if="selectedItem.count > 1"
                type="warning"
                @click="handleSellConfirmAll"
            >
              整組販賣 (x{{ selectedItem.count }})
            </el-button>
          </template>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.merchant-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 0.8rem;
  flex-shrink: 0;
  width: 100%;
}

.merchant-table {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.merchant-scroll {
  flex: 1;
  min-height: 0;
}

.bag-section {
  margin-bottom: 1.5rem;
}

.bag-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid #ff9800;
  padding-left: 8px;
  margin-bottom: 0.6rem;
}

.bag-section-title {
  font-weight: bold;
  color: #e0e0e0;
  font-size: 0.9rem;
}

.price-tag {
  font-size: 0.75rem;
  color: #e28f35;
  margin-top: auto;
}

.item-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: #ff9800;
  padding: 1px 5px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: bold;
  border: 1px solid rgba(255, 152, 0, 0.3);
  z-index: 5;
}

.empty-bag-text {
  text-align: center;
  color: #78909c;
  padding: 2rem;
  font-size: 0.9rem;
}

.detail-dialog-body {
  padding: 0.5rem 1rem;
}

.item-detail-info {
  margin-top: 1.2rem;
  padding-top: 0.8rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
  font-weight: bold;
  font-size: 1.05rem
}

/* 手機板樣式適配微調 */
@media (max-width: 767px) {
  .merchant-header-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.6rem;
  }
}
</style>
