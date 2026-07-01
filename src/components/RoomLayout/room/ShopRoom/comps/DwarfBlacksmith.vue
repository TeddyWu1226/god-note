<script setup lang="ts">
import {ref, computed} from "vue";
import {usePlayerStore} from "@/store/player-store";
import {statLabels, EquipmentType} from "@/types";
import {ElMessage} from "element-plus";
import {MonsterCrystals} from "@/constants/items/material/material-info";
import ForgeOverlay from "./ForgeOverlay.vue";

const playerStore = usePlayerStore();
const selectedKey = ref<string>(""); // Format: 'equip:slotKey' or 'bag:index'
const isForging = ref(false);
const showEffect = ref(false);
const forgeResult = ref<'success' | 'fail' | 'break' | null>(null);

// 強化核心機率參數配置 (可在此自由調整)
const SUCCESS_RATE = ref(60);         // 強化成功機率 (%)
const BREAK_RATE_ON_FAIL = ref(40);   // 強化失敗時，裝備爆裂損毀的機率 (%)

// 強化過程狀態記錄
const prevLevel = ref(0);
const nextLevel = ref(0);
const upgradedStatKey = ref("");
const lastForgedItem = ref<any>(null);
const isFlashWhite = ref(false);

// 1. 取得對應質量的魔物晶石配置
const getCrystalForQuality = (quality: number) => {
  const crystalList = [
    MonsterCrystals.BadNormal,
    MonsterCrystals.LowerNormal,
    MonsterCrystals.MediumNormal,
    MonsterCrystals.MediumUpperNormal,
    MonsterCrystals.MediumSuperiorNormal,
    MonsterCrystals.TopNormal
  ];
  return crystalList[quality] || MonsterCrystals.DemonJewelry;
};


// 3. 取得部位中文名稱
const getSlotName = (slot: string): string => {
  const slots: Record<string, string> = {
    weapon: '武器',
    body: '防具',
    head: '頭盔',
    offhand: '副手',
    accessory1: '飾品一',
    accessory2: '飾品二',
  };
  return slots[slot] || '裝備';
};

// 4. 取得裝備屬性（過濾出大於 0 且在 statLabels 定義中的屬性）
const getEligibleStats = (item: any): string[] => {
  const keys = Object.keys(statLabels);
  return keys.filter(key => typeof item[key] === 'number' && item[key] > 0);
};

// 5. 整合已裝備與未裝備的列表
interface DisplayEquip {
  key: string; // 'equip:weapon', 'bag:0' etc.
  source: 'equip' | 'bag';
  slotKey?: string;
  index?: number;
  item: EquipmentType;
}

const allEquipments = computed<DisplayEquip[]>(() => {
  const list: DisplayEquip[] = [];

  // 已裝備
  if (playerStore.info.equips) {
    Object.entries(playerStore.info.equips).forEach(([slotKey, item]) => {
      if (item) {
        list.push({
          key: `equip:${slotKey}`,
          source: 'equip',
          slotKey,
          item: item as EquipmentType
        });
      }
    });
  }

  // 背包中未裝備
  if (playerStore.info.equipments) {
    playerStore.info.equipments.forEach((item, index) => {
      list.push({
        key: `bag:${index}`,
        source: 'bag',
        index,
        item
      });
    });
  }

  return list;
});

// 當前選擇的裝備包裝對象
const selectedEquip = computed<DisplayEquip | undefined>(() => {
  return allEquipments.value.find(eq => eq.key === selectedKey.value);
});

// 計算強化晶石消耗
const crystalCost = computed(() => {
  if (!selectedEquip.value) return {name: '', count: 0, available: 0, hasEnough: false, emoji: ''};
  const item = selectedEquip.value.item;
  const currentLvl = item.enhanceLevel || 0;
  const costCount = Math.pow(2, currentLvl); // 1, 2, 4, 8, 16
  const crystal = getCrystalForQuality(item.quality || 0);
  const [hasEnough, availableCount] = playerStore.hasItem(crystal.name, costCount);
  return {
    name: crystal.name,
    count: costCount,
    available: availableCount,
    hasEnough,
    emoji: crystal.icon
  };
});

// 關閉結果特效面板
const closeResultOverlay = () => {
  showEffect.value = false;
  forgeResult.value = null;
  lastForgedItem.value = null;
};

// 進行熔煉強化
const startForge = () => {
  if (!selectedEquip.value || isForging.value) return;
  const {item, source, slotKey, index} = selectedEquip.value;
  const currentLvl = item.enhanceLevel || 0;

  if (currentLvl >= 5) {
    ElMessage.warning('此裝備已強化至最大極限 (+5)！');
    return;
  }

  const cost = crystalCost.value;
  if (!cost.hasEnough) {
    ElMessage.warning(`晶石不足！需要 ${cost.count} 顆 ${cost.name}`);
    return;
  }

  // 1. 記錄強化前的資訊
  prevLevel.value = currentLvl;
  nextLevel.value = currentLvl;
  upgradedStatKey.value = "";
  lastForgedItem.value = null;
  isFlashWhite.value = false;

  isForging.value = true;
  forgeResult.value = null;
  showEffect.value = true;

  // 2. 模擬打鐵擊打序列（用力敲三下 -> 蓄力抖動 -> 奮力敲下閃白光）
  // 2.6 秒時敲到底，瞬間閃出白光
  setTimeout(() => {
    isFlashWhite.value = true;
  }, 2600);

  // 2.8 秒時白光退去，結算結果並顯示
  setTimeout(() => {
    isFlashWhite.value = false;

    try {
      // 扣除材料
      playerStore.removeItem(cost.name, cost.count);

      // 隨機判定
      const successRoll = Math.random() * 100;
      if (successRoll < SUCCESS_RATE.value) {
        // 強化成功
        forgeResult.value = 'success';

        // 初始化基礎數據備份（如果尚未備份過）
        if (!item.baseStats) {
          item.enhanceLevel = item.enhanceLevel || 0;
          item.baseStats = {};
          item.enhancements = {};

          const eligibleStats = getEligibleStats(item);
          eligibleStats.forEach(stat => {
            item.baseStats![stat] = item[stat as keyof EquipmentType] as number;
            item.enhancements![stat] = 0;
          });
        }

        // 隨機挑選一項屬性加成
        const eligibleStats = Object.keys(item.baseStats!);
        if (eligibleStats.length > 0) {
          const selectedStat = eligibleStats[Math.floor(Math.random() * eligibleStats.length)];
          item.enhancements![selectedStat] = (item.enhancements![selectedStat] || 0) + 1;

          // 計算強化後的屬性值
          const baseVal = item.baseStats![selectedStat];
          const upgradeCount = item.enhancements![selectedStat];
          (item as any)[selectedStat] = Math.round(baseVal * (1 + 0.2 * upgradeCount));

          item.enhanceLevel!++;
          nextLevel.value = item.enhanceLevel;
          upgradedStatKey.value = selectedStat;
          lastForgedItem.value = item;
        } else {
          ElMessage.error('此裝備沒有可強化的屬性！');
        }
      } else {
        // 強化失敗：依設定機率爆裝，其餘保留
        const breakRoll = Math.random() * 100;
        if (breakRoll < BREAK_RATE_ON_FAIL.value) {
          forgeResult.value = 'break';

          // 移除裝備
          if (source === 'equip') {
            playerStore.info.equips[slotKey!] = null;
          } else {
            playerStore._removeItemFromBag('equipments', index!);
          }
          selectedKey.value = ""; // 重置選擇
        } else {
          forgeResult.value = 'fail';
        }
      }
    } catch (err) {
      console.error(err);
      ElMessage.error('強化過程發生錯誤！');
      forgeResult.value = 'fail';
    } finally {
      isForging.value = false;
    }
  }, 2800);
};

// 屬性變更預覽
const getStatPreview = (statKey: string) => {
  if (!selectedEquip.value) return null;
  const item = selectedEquip.value.item;
  const baseVal = item.baseStats ? item.baseStats[statKey] : (item as any)[statKey];
  const count = item.enhancements ? (item.enhancements[statKey] || 0) : 0;

  // 計算如果是這項屬性被隨機選到，下一個強化的數值預估
  const nextCount = count + 1;
  const nextVal = Math.round(baseVal * (1 + 0.2 * nextCount));
  return {
    current: (item as any)[statKey],
    next: nextVal,
    label: statLabels[statKey as keyof typeof statLabels]
  };
};
</script>

<template>
  <el-row>
    <!-- 1. 裝備選擇列表 (左側) -->
    <el-col :span="8" class="equip-selector">
      <el-card class="selection-list">
        <div class="panel-header">🔨 選擇強化裝備</div>
        <div class="equip-list-container">
          <div
              v-for="eq in allEquipments"
              :key="eq.key"
              class="equip-item-row"
              :class="{ active: selectedKey === eq.key }"
              @click="selectedKey = eq.key"
          >
            <div class="equip-icon">{{ eq.item.icon }}</div>
            <div class="equip-name-info">
              <div class="equip-title">
                {{ eq.item.name }}
                <span v-if="eq.item.enhanceLevel" class="lvl-badge">+{{ eq.item.enhanceLevel }}</span>
              </div>
              <div class="equip-meta">
                <span class="slot">{{ getSlotName(eq.source === 'equip' ? eq.slotKey! : eq.item.position) }}</span>
                <span class="dot">|</span>
                <span class="source-tag" :class="eq.source">
                {{ eq.source === 'equip' ? '已裝備' : '背包' }}
              </span>
              </div>
            </div>
          </div>
          <div v-if="allEquipments.length === 0" class="no-items">
            目前身上和背包中沒有可強化的裝備...
          </div>
        </div>
      </el-card>

    </el-col>

    <!-- 2. 強化熔煉控制台 (右側) -->
    <el-col :span="16" class="forge-panel">
      <div v-if="selectedEquip" class="forge-area-content">
        <!-- 強化材料與判定區域 -->
        <div class="forge-actions-card">
          <div v-if="selectedEquip.item.enhanceLevel! >= 5" class="max-level-box">
            🌟 該裝備已熔煉至最高強化上限 (+5)！
          </div>
          <div v-else class="forge-requirements">
            <div class="req-title">
              +{{ selectedEquip.item.enhanceLevel || 0 }} ➡
              +{{ (selectedEquip.item.enhanceLevel || 0) + 1 }} 強化所需材料：
            </div>
            <div class="material-row">
              <span class="mat-emoji">{{ crystalCost.emoji }}</span>
              <span class="mat-name">{{ crystalCost.name }}</span>
              <span
                  class="mat-count"
                  :class="{ 'not-enough': !crystalCost.hasEnough }"
              >
                {{ crystalCost.available }} / {{ crystalCost.count }} 顆
              </span>
            </div>

            <!-- 機率標示 -->
            <div class="probability-box">
              <div class="prob-row">成功率：<span class="success">{{ SUCCESS_RATE }}%</span></div>
              <div class="prob-row">失敗且裝備爆裂率：<span class="danger">{{ BREAK_RATE_ON_FAIL }}%</span></div>
            </div>
            <div class="helper-text">* 每次強化會隨機挑選「一項」武器正值屬性進行升級 (+20%)</div>

            <!-- 按鈕 -->
            <el-button
                type="danger"
                size="large"
                class="forge-btn"
                :loading="isForging"
                :disabled="!crystalCost.hasEnough"
                @click="startForge"
            >
              強化!
            </el-button>
          </div>
        </div>
      </div>

      <!-- 未選擇裝備提示 -->
      <div v-else class="no-selection-box">
        <div class="anvil-icon">🔨</div>
        <p class="title">矮人鐵匠鋪</p>
        <p class="subtitle">請在左側選擇一件裝備以進行熔煉強化</p>
      </div>
    </el-col>

    <!-- 3. 全螢幕打鐵敲擊動畫/結果特效組件 -->
    <ForgeOverlay
        :show="showEffect"
        :is-forging="isForging"
        :is-flash-white="isFlashWhite"
        :forge-result="forgeResult"
        :prev-level="prevLevel"
        :next-level="nextLevel"
        :last-forged-item="lastForgedItem"
        :upgraded-stat-key="upgradedStatKey"
        :equip-icon="selectedEquip?.item.icon || '🔥'"
        @close="closeResultOverlay"
    />
  </el-row>
</template>

<style scoped>
.el-row {
  height: 100%;
  width: 100%;
  margin: 0;
  display: flex;
  overflow: hidden;
}

.equip-selector {
  height: 100%;
}

.selection-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.selection-list:deep(.el-card__body) {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.panel-header {
  padding: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  background-color: #20222a;
  border-bottom: 1px solid #2d2e38;
  color: #ff7675;
}

.equip-list-container {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0.5rem;
}

.equip-item-row {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  background-color: #232530;
  border: 1px solid #2e313e;
  cursor: pointer;
  transition: all 0.25s ease;
}

.equip-item-row:hover {
  background-color: #2b2e3c;
  border-color: #4a5068;
}

.equip-item-row.active {
  background-color: #3b302c;
  border-color: #e74c3c;
  box-shadow: inset 0 0 6px rgba(231, 76, 60, 0.2);
}

.equip-icon {
  font-size: 1.2rem;
  margin-right: 0.75rem;
}

.equip-name-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.equip-title {
  font-weight: bold;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 6px;
}

.lvl-badge {
  background-color: #9C27B0;
  color: #fff;
  font-size: 0.8rem;
  padding: 1px 6px;
  border-radius: 10px;
  font-weight: bold;
}

.equip-meta {
  font-size: 0.8rem;
  color: #909399;
  display: flex;
  align-items: center;
  margin-top: 4px;
}

.equip-meta .dot {
  margin: 0 6px;
  color: #4a4d5e;
}

.source-tag {
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 0.75rem;
}

.source-tag.equip {
  background-color: rgba(231, 76, 60, 0.15);
  color: #e74c3c;
}

.source-tag.bag {
  background-color: rgba(52, 152, 219, 0.15);
  color: #3498db;
}

.no-items {
  padding: 2rem;
  text-align: center;
  color: #636e72;
  font-size: 0.9rem;
}

/* 2. 強化控制面板 (右側) */
.forge-panel {
  padding-left: 0.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.forge-area-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 580px;
  margin: 0 auto;
  width: 100%;
}


.helper-text {
  font-size: 0.8rem;
  color: #747d8c;
}

/* 強化控制區 */
.forge-actions-card {
  background-color: #1d1e26;
  border: 1px solid #2d2e38;
  border-radius: 8px;
  padding: 1.25rem;
}

.max-level-box {
  background-color: rgba(46, 204, 113, 0.1);
  border: 1px solid #2ecc71;
  color: #2ecc71;
  text-align: center;
  padding: 1rem;
  border-radius: 6px;
  font-weight: bold;
}

.forge-requirements {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.req-title {
  font-size: 0.9rem;
  color: #a4b0be;
  font-weight: bold;
}

.material-row {
  display: flex;
  align-items: center;
  background-color: #16171c;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #2d2e38;
}

.mat-emoji {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.mat-name {
  flex: 1;
  font-weight: bold;
  color: #ffffff;
}

.mat-count {
  font-weight: bold;
  color: #2ecc71;
}

.mat-count.not-enough {
  color: #ff7675;
}

.probability-box {
  display: flex;
  gap: 2rem;
  font-size: 0.85rem;
  background-color: rgba(0, 0, 0, 0.15);
  padding: 0.5rem;
  border-radius: 4px;
  justify-content: center;
}

.prob-row .success {
  color: #2ecc71;
  font-weight: bold;
}

.prob-row .danger {
  color: #ff7675;
  font-weight: bold;
}

.forge-btn {
  width: 100%;
  height: 46px !important;
  font-size: 1.05rem !important;
  font-weight: bold !important;
}

/* 未選擇提示 */
.no-selection-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #57606f;
  text-align: center;
}

.anvil-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
}

.no-selection-box .title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #a4b0be;
  margin: 0 0 0.5rem 0;
}

.no-selection-box .subtitle {
  font-size: 0.9rem;
  color: #747d8c;
  margin: 0;
}


</style>
