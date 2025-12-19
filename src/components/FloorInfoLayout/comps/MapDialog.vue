<script setup lang="ts">
import {computed, nextTick, ref, watch} from 'vue';
import {getEnumColumn} from "@/utils/enum";
import {RoomEnum} from "@/enums/room-enum";
import {useGameStateStore} from "@/store/game-state-store";

const model = defineModel({type: Boolean, default: false});
const gameStateStore = useGameStateStore();
// 1. 定義一個 ref 陣列來存儲所有 room-cell 的 DOM 實例
// 由於房間是巢狀迴圈生成的，我們需要一個二維陣列來存儲 refs
const roomRefs = ref<HTMLElement[][]>([]);

// 2. 定義一個函數來設置 ref (這是 Vue 3 處理 v-for refs 的標準寫法)
const setRoomRef = (el: any, layerIndex: number, roomIndex: number) => {
  if (!el) return;

  // 確保外層陣列 (layer) 存在
  if (!roomRefs.value[layerIndex]) {
    roomRefs.value[layerIndex] = [];
  }
  // 設置內層元素
  roomRefs.value[layerIndex][roomIndex] = el;
};


// 3. 監聽 Dialog 的狀態，在打開後觸發滾動
watch(model, (isOpened) => {
  if (isOpened) {
    nextTick(() => {
      const [layer, index] = gameStateStore.getCurrentRoom;
      const targetLayerIndex = layer - 1;
      let targetRoomInstance = roomRefs.value[targetLayerIndex]?.[index];
      let finalElement: HTMLElement | undefined;

      if (targetRoomInstance) {
        // ⭐️ 修正點 1：獲取 Element Plus 組件實例的 $el 屬性（原生 DOM 元素）
        const element = ('$el' in targetRoomInstance) ? targetRoomInstance.$el : targetRoomInstance;

        // ⭐️ 修正點 2：類型防護 (Type Guard)
        // 確保 element 確實是 HTMLElement 類型，具有 classList 屬性
        if (element instanceof HTMLElement) {
          finalElement = element;
        }
      }

      if (finalElement) {
        // 這裡 TypeScript 已經確定 finalElement 是 HTMLElement

        // 使用 scrollIntoView 滾動到目標元素
        finalElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });

        // ⭐️ 修正點 3：安全地操作 classList
        finalElement.classList.add('is-focused'); // ✅ 這裡不再報錯
      } else {
        console.warn(`滾動失敗：未找到對應的房間元素。`);
      }
    });
  } else {
    // ⭐️ 修正點 4：Dialog 關閉時的 classList 清理 (也需 Type Guard)
    roomRefs.value.flat().forEach(instance => {
      const el = ('$el' in instance) ? instance.$el : instance;

      // 確保它是 HTMLElement 才能操作 classList
      if (el instanceof HTMLElement) {
        el.classList.remove('is-focused');
      }
    });
  }
}, {immediate: true});

const isDisabled = (layerIndex: number) => {
  return layerIndex < gameStateStore.getCurrentRoom[0]
}

/** 操作 **/
const selectRoom = (layerIndex: number, roomIndex: number, value: number) => {
  console.log(`選擇房間: 第 ${layerIndex + 1} 層 (0-based: ${layerIndex}), 索引 ${roomIndex}, 數值 ${value}`);

  // 更新當前房間位置 (這裡假設您會將 roomIndex 存儲為 0-based)
  gameStateStore.setRoom([layerIndex + 1, roomIndex])
};

// 獲取總層數
const totalLayers = computed(() => gameStateStore.getCurrentStageRooms.length);

// 判斷是否為倒數兩層的邏輯
const isLastTwoLayers = (layerIndex: number) => {
  return layerIndex >= totalLayers.value - 2;
};
</script>

<template>
  <el-dialog v-model="model" top="5vh" width="90%">
    <el-scrollbar max-height="60vh" style="width: 100%; overflow-x: auto;">
      <div class="trapezoid-container">
        <div
            v-for="(layer, layerIndex) in gameStateStore.getCurrentStageRooms"
            :key="layerIndex"
            class="grid-layer"
        >
          <el-button
              v-for="(roomValue, roomIndex) in layer"
              type="default"
              :key="roomIndex"
              :color="getEnumColumn(RoomEnum, roomValue, 'color')"
              class="room-cell"
              :class="{'full':isLastTwoLayers(layerIndex)}"
              :aria-disabled="true"
              :ref="el => setRoomRef(el, layerIndex, roomIndex)"
              @click="selectRoom(layerIndex,roomIndex,roomValue)"
              :disabled="isDisabled(layerIndex)"
          >
            <div style="display: flex;flex-direction: column">
              <span style="font-size: 1.5rem;padding-bottom: 0.5rem">
                {{ getEnumColumn(RoomEnum, roomValue, 'icon') }}
              </span>
              <span style="font-size: 1.1rem">
                {{ getEnumColumn(RoomEnum, roomValue, 'label') }}
              </span>
            </div>
          </el-button>
        </div>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<style scoped>
.trapezoid-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  /* ... 其他樣式 ... */

  /* ⭐️ 新增/修改：確保容器能夠水平滾動 */
  /* 讓容器的最小寬度足夠容納最寬的一層 (L19 有 37 個房間，約 18.5rem 寬度 + 間距) */
  min-width: fit-content; /* 讓容器寬度根據內容決定 */

  /* 確保滾動條的父元素可以處理水平溢出 */
  width: auto;
}

/* 每一層容器：水平排列房間並保持置中 */
.grid-layer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: .1rem; /* 層與層之間的間距 */
  padding: 0 1rem;
}

/* 房間單元格 */
.room-cell {
  width: 5rem;
  height: 7rem;
  margin: .2rem;
}

.room-cell:hover {
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(120, 255, 255, 0.7);
}

.room-cell:hover {
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(120, 255, 255, 0.7);
}

/* ⭐️ 新增：當前焦點房間的樣式 */
.room-cell.is-focused {
  /* 例如：更亮的邊框或特殊的陰影 */
  box-shadow: 0 0 15px 5px rgba(255, 215, 0, 0.8); /* 金色高亮 */
  border: 2px solid gold;
  z-index: 10; /* 確保它在最上層 */
}

.room-cell.is-disabled {
  background-color: var(--el-color-info) !important;
}

.full {
  width: 91.63rem;
}
</style>