<script setup lang="ts">
import './shop.css'
import {ref} from 'vue';
import {usePlayerStore} from "@/store/player-store";
import {ElMessage} from "element-plus";
import {ItemType, UsableType, EquipmentType, statLabels} from "@/types";
import {QualityEnum} from "@/enums/quality-enum";
import {getEnumColumn} from "@/utils/enum";
import {ItemInfo} from "@/components/Shared/itemInfo";

// 接收來自父組件的商品列表
type ShopItemType = (ItemType | UsableType | EquipmentType) & { sold?: boolean; price: number }
const props = defineProps<{
  items: ShopItemType[]
}>();

const playerStore = usePlayerStore();

// 控制詳情彈窗
const isShowDetail = ref(false);
const selectedItem = ref<ShopItemType>(null);

const onClickItem = (item: ShopItemType) => {
  if (item.sold) {
    return;
  }
  selectedItem.value = item;
  isShowDetail.value = true;
};

const handleBuy = () => {
  const item = selectedItem.value;
  if (!item || item.sold) return;

  if (playerStore.info.gold < item.price) {
    ElMessage.error("金幣不足！");
    return;
  }

  // 1. 扣款
  playerStore.addGold(-item.price);

  // 2. 標記售出 (引用傳遞，會同步更新 props.items)
  item.sold = true;

  // 3. 獲得物品 (清除掉商店專用的屬性)
  const {sold, price, ...cleanItem} = item;
  playerStore.gainItem(cleanItem);

  isShowDetail.value = false;
  ElMessage.success(`成功購買 ${item.name}!`);
};
</script>

<template>
  <div class="buy-tab">
    <div class="shop-grid">
      <div
          v-for="(item, index) in props.items"
          :key="index"
          class="item-card"
          :class="{ 'is-sold': item.sold }"
          :style="{ borderColor: getEnumColumn(QualityEnum, item.quality, 'color', '#fff') }"
          @click="onClickItem(item)"
      >
        <div class="item-icon">{{ item.icon }}</div>
        <div class="item-name" :style="{ color: getEnumColumn(QualityEnum, item.quality, 'color', '#fff') }">
          {{ item.name }}
        </div>
        <div class="item-price" v-if="!item.sold">💰 {{ item.price }}</div>
        <div class="item-sold-text" v-else>SOLD OUT</div>
      </div>
    </div>

    <el-dialog
        top="5vh"
        v-model="isShowDetail"
        :title="`物品資訊  (價格: 💰${selectedItem?.price} G)`"
        width="35rem"
        align-center
        destroy-on-close
    >
      <ItemInfo v-if="selectedItem" :item="selectedItem"></ItemInfo>
      <span class="my-gold">持有金幣: 💰 {{ playerStore.info.gold }}</span>
      <template #footer>
        <div class="dialog-footer">

          <div>
            <el-button @click="isShowDetail = false">取消</el-button>
            <el-button
                type="primary"
                :disabled="selectedItem?.sold || playerStore.info.gold < selectedItem?.price"
                @click="handleBuy"
            >
              {{ selectedItem?.sold ? '已售出' : '確認購買' }}
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.item-price {
  color: #e6a23c;
  font-weight: bold;
}

.item-sold-text {
  font-weight: bold;
  text-decoration: line-through;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
</style>