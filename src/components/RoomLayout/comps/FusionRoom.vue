<script setup lang="ts">
import '../event/event-room.css'
import {ref, computed} from "vue";
import {usePlayerStore} from "@/store/player-store";
import {ExtraFusionUsableItem, FusionUsableList} from "@/constants/items/fusion-list/fusion-usable-list";
import {FusionEquipList} from "@/constants/items/fusion-list/fusion-equip-list";
import {getEnumColumn} from "@/utils/enum";
import {QualityEnum} from "@/enums/quality-enum";
import {FusionListType} from "@/types";
import {ElMessage} from "element-plus";
import {FusionOtherList} from "@/constants/items/fusion-list/fusion-other-list";
import {ItemInfo} from "@/components/Shared/itemInfo";
import {SpecialEventEnum} from "@/enums/enums";
import {useGameStateStore} from "@/store/game-state-store";

const playerStore = usePlayerStore();
const gameStateStore = useGameStateStore();
const onlyShowAvailable = ref(true);
// 當前選中的類別: 0 為消耗品, 1 為裝備, 2 為其他
const activeCategory = ref(0);

// 先取得當前分頁的原始列表
const currentRawList = computed(() => {
  let list: FusionListType[] = [];

  switch (activeCategory.value) {
    case 0: // 消耗品
      list = [...FusionUsableList];

      // 條件：狩獵沙漠巨獸進度 >= 1
      if (gameStateStore.getEventProcess(SpecialEventEnum.HuntDuneBeast) >= 1) {
        list.push(ExtraFusionUsableItem.DuneBeastBomb);
      }
      break;

    case 1: // 裝備
      list = [...FusionEquipList];
      // 這裡也可以留空，未來有特殊解鎖裝備時使用
      break;

    case 2: // 其他
      list = [...FusionOtherList];
      break;
  }

  return list;
});

// 2. 實作篩選邏輯：根據分類後的列表再進行「可合成」篩選
const filteredList = computed(() => {
  let list = currentRawList.value;

  if (onlyShowAvailable.value) {
    // 只保留 canCraft 回傳為 true 的配方
    list = list.filter(recipe => canCraft(recipe));
  }

  return list;
});

// 檢查玩家背包是否滿足「所有」素材需求
const canCraft = (recipe: FusionListType): boolean => {
  return recipe.requirements.every((req) => {
    return playerStore.hasItem(req.item.name, req.count)[0];
  });
};

// 取得玩家當前擁有該素材的數量
const getOwnedCount = (itemName: string) => {
  return playerStore.hasItem(itemName)[1];
};

const onCraft = (recipe: FusionListType) => {
  if (!canCraft(recipe)) return;

  recipe.requirements.forEach((req) => {
    playerStore.removeItem(req.item.name, req.count);
  });

  playerStore.gainItem(recipe.target);
  ElMessage.success(`合成「${recipe.target.name}」成功！`);
};
</script>

<template>
  <div class="craft-room">
    <div class="category-tabs">
      <div
          class="tab-item"
          :class="{ active: activeCategory === 0 }"
          @click="activeCategory = 0"
      >
        消耗品
      </div>
      <div
          class="tab-item"
          :class="{ active: activeCategory === 1 }"
          @click="activeCategory = 1"
      >
        裝備
      </div>
      <div
          class="tab-item"
          :class="{ active: activeCategory === 2 }"
          @click="activeCategory = 2"
      >
        其他
      </div>
      <el-checkbox v-model="onlyShowAvailable" border>
        可合成
      </el-checkbox>
    </div>
    <el-scrollbar max-height="24vh">
      <div class="recipe-container">

        <div v-if="filteredList.length === 0" class="empty-hint">
          目前沒有可用的配方...
        </div>

        <el-row v-for="(recipe, index) in filteredList" :key="index" class="recipe-row">
          <el-tooltip effect="light" trigger="click">
            <template #content>
              <ItemInfo :item="recipe.target" style="max-width: 20rem"/>
            </template>
            <el-col :span="18" class="target-block">
              <div class="target-icon">{{ recipe.target.icon }}</div>
              <div
                  class="target-name"
                  :style="{ color: getEnumColumn(QualityEnum, recipe.target.quality, 'color') }"
              >
                {{ recipe.target.name }}
              </div>
            </el-col>
          </el-tooltip>
          <el-col :span="6">
            <el-button
                type="primary"
                style="width: 100%"
                plain
                :disabled="!canCraft(recipe)"
                @click="onCraft(recipe)"
            >
              合成
            </el-button>
          </el-col>
          <el-col :span="24" class="materials-block">
            <div v-for="(req, idx) in recipe.requirements" :key="idx" class="material-tag">
              <span class="m-icon">{{ req.item.icon }}</span>
              <span
                  class="m-name"
                  :style="{ color: getEnumColumn(QualityEnum, req.item.quality, 'color') }"
              >
                {{ req.item.name }}
              </span>
              <span class="m-count" :class="{ 'insufficient': getOwnedCount(req.item.name) < req.count }">
                {{ getOwnedCount(req.item.name) }}/{{ req.count }}
              </span>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.craft-room {
  height: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 類別分頁樣式 */
.category-tabs {
  display: flex;
  background: rgba(0, 0, 0, 0.3);
  align-items: center;
  padding: 4px;
  border-radius: 8px;
  gap: 4px;
  margin-bottom: 10px;
}

.tab-item {
  padding: 6px 16px;
  font-size: 0.85rem;
  color: #888;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.tab-item:hover {
  color: #ccc;
}

.tab-item.active {
  background: rgba(255, 255, 255, 0.1);
  color: #f1c40f;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.recipe-container {
  display: flex;
  min-width: 33rem;
  flex-wrap: wrap;
  gap: 1rem;
  overflow-y: auto;
  padding-right: 1.5rem;
  padding-left: 1.5rem;
  margin-top: 0.5rem;
}


.recipe-row {
  width: calc(50% - 0.5rem);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid #333;
  border-radius: 12px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0.5rem;
}

@media (max-width: 480px) {
  .recipe-row {
    width: 100%;
  }
}

.empty-hint {
  text-align: center;
  color: #555;
  padding: 20px;
  font-size: 0.9rem;
}

.target-block {
  display: flex;
  text-align: center;
  align-items: center;
  padding: 0.2rem;
  gap: 1rem;
  cursor: help;
}

.target-icon {
  font-size: 1.5rem;
}

.target-name {
  font-size: 0.8rem;

}

.materials-block {
  padding-right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.material-tag {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
  width: 97%;
}

.m-icon {
  margin-right: 6px;
}

.m-name {
  flex: 1;
}

.m-count {
  font-family: monospace;
  color: #2ecc71;
}

.m-count.insufficient {
  color: #ff4d4f;
}
</style>