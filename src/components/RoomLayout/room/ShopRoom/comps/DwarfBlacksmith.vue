<script setup lang="ts">
import { ref, computed } from "vue";
import { usePlayerStore } from "@/store/player-store";
import { statLabels, EquipmentType } from "@/types";
import { ElMessage } from "element-plus";

const playerStore = usePlayerStore();
const selectedKey = ref<string>(""); // Format: 'equip:slotKey' or 'bag:index'
const isForging = ref(false);
const showEffect = ref(false);
const forgeResult = ref<'success' | 'fail' | 'break' | null>(null);

// 1. 取得魔物晶石名稱對照表
const getCrystalNameForQuality = (quality: number): string => {
  switch (quality) {
    case 0: return '劣質魔物晶石';
    case 1: return '下級魔物晶石';
    case 2: return '中級魔物晶石';
    case 3: return '上級魔物晶石';
    case 4: return '優級魔物晶石';
    case 5: return '頂級魔物晶石';
    default: return '下級魔物晶石';
  }
};

// 2. 獲取晶石對應的 Icon 顏色/Emoji
const getCrystalEmoji = (quality: number): string => {
  switch (quality) {
    case 0: return '🌫️';
    case 1: return '⬜';
    case 2: return '🟩';
    case 3: return '🟦';
    case 4: return '🟪';
    case 5: return '🟥';
    default: return '⬜';
  }
};

// 3. 取得部位中文名稱
const getSlotName = (slot: string): string => {
  const slots: Record<string, string> = {
    weapon: '武器',
    body: '身體防具',
    head: '頭盔',
    offhand: '副手',
    accessory1: '飾品一',
    accessory2: '飾品二',
  };
  return slots[slot] || '裝備';
};

// 4. 取得裝備屬性（過濾出不為 0 且在 statLabels 定義中的屬性）
const getEligibleStats = (item: any): string[] => {
  const keys = Object.keys(statLabels);
  return keys.filter(key => typeof item[key] === 'number' && item[key] !== 0);
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
  if (!selectedEquip.value) return { name: '', count: 0, available: 0, hasEnough: false, emoji: '' };
  const item = selectedEquip.value.item;
  const currentLvl = item.enhanceLevel || 0;
  const costCount = Math.pow(2, currentLvl); // 1, 2, 4, 8, 16
  const crystalName = getCrystalNameForQuality(item.quality || 0);
  const [hasEnough, availableCount] = playerStore.hasItem(crystalName, costCount);
  return {
    name: crystalName,
    count: costCount,
    available: availableCount,
    hasEnough,
    emoji: getCrystalEmoji(item.quality || 0)
  };
});

// 進行熔煉強化
const startForge = () => {
  if (!selectedEquip.value || isForging.value) return;
  const { item, source, slotKey, index } = selectedEquip.value;
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

  isForging.value = true;
  forgeResult.value = null;
  showEffect.value = true;

  // 模擬打鐵的敲擊動畫與停頓延遲 (約 2 秒)
  setTimeout(() => {
    // 扣除材料
    playerStore.removeItem(cost.name, cost.count);

    // 隨機判定：60% 成功
    const successRoll = Math.random() * 100;
    if (successRoll < 60) {
      // 強化成功
      forgeResult.value = 'success';

      // 初始化基礎數據備份（如果尚未備份過）
      if (item.enhanceLevel === undefined) {
        item.enhanceLevel = 0;
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
        if (baseVal > 0) {
          // 正值屬性：增加 20%
          (item as any)[selectedStat] = Math.round(baseVal * (1 + 0.2 * upgradeCount));
        } else {
          // 負值屬性：向 0 靠近 (例如 -10 變為 -8)
          (item as any)[selectedStat] = Math.round(baseVal * (1 - 0.2 * upgradeCount));
        }

        item.enhanceLevel!++;
        ElMessage.success(`🎉 熔煉成功！裝備已強化至 +${item.enhanceLevel}！[${statLabels[selectedStat as keyof typeof statLabels]}] 獲得了提升。`);
      } else {
        ElMessage.error('此裝備沒有可強化的屬性！');
      }
    } else {
      // 強化失敗：20% 機率爆裝，80% 保留
      const breakRoll = Math.random() * 100;
      if (breakRoll < 20) {
        forgeResult.value = 'break';
        ElMessage.error('💥 熔煉失敗！強大的能量不穩定，裝備在高熱中爆裂損毀了！');

        // 移除裝備
        if (source === 'equip') {
          playerStore.info.equips[slotKey!] = null;
        } else {
          playerStore._removeItemFromBag('equipments', index!);
        }
        selectedKey.value = ""; // 重置選擇
      } else {
        forgeResult.value = 'fail';
        ElMessage.warning('⚡ 熔煉失敗！還好鐵匠及時冷卻，裝備完好無損。');
      }
    }

    isForging.value = false;
    // 0.8秒後關閉結果特效面板
    setTimeout(() => {
      showEffect.value = false;
    }, 800);
  }, 1800);
};

// 屬性變更預覽
const getStatPreview = (statKey: string) => {
  if (!selectedEquip.value) return null;
  const item = selectedEquip.value.item;
  const baseVal = item.baseStats ? item.baseStats[statKey] : (item as any)[statKey];
  const count = item.enhancements ? (item.enhancements[statKey] || 0) : 0;
  
  // 計算如果是這項屬性被隨機選到，下一個強化的數值預估
  const nextCount = count + 1;
  let nextVal = 0;
  if (baseVal > 0) {
    nextVal = Math.round(baseVal * (1 + 0.2 * nextCount));
  } else {
    nextVal = Math.round(baseVal * (1 - 0.2 * nextCount));
  }
  return {
    current: (item as any)[statKey],
    next: nextVal,
    label: statLabels[statKey as keyof typeof statLabels]
  };
};
</script>

<template>
  <div class="blacksmith-workspace">
    <!-- 1. 裝備選擇列表 (左側) -->
    <div class="equip-selector">
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
    </div>

    <!-- 2. 強化熔煉控制台 (右側) -->
    <div class="forge-panel">
      <div v-if="selectedEquip" class="forge-area-content">
        <!-- 裝備精鍊卡與對應光暈 -->
        <div class="weapon-display-box" :class="`glow-lvl-${selectedEquip.item.enhanceLevel || 0}`">
          <!-- 背景火星與煙霧 -->
          <div class="sparkles"></div>
          <div class="selected-equip-icon">{{ selectedEquip.item.icon }}</div>
          <h4 class="selected-equip-title">
            {{ selectedEquip.item.name }}
            <span v-if="selectedEquip.item.enhanceLevel" class="lvl-title">+{{ selectedEquip.item.enhanceLevel }}</span>
          </h4>
          <p class="selected-equip-desc">{{ selectedEquip.item.description }}</p>
        </div>

        <!-- 屬性詳細與強化預覽 -->
        <div class="stats-preview-card">
          <div class="card-title">🔬 屬性熔煉變更預覽</div>
          <div class="stats-grid">
            <div
                v-for="statKey in getEligibleStats(selectedEquip.item)"
                :key="statKey"
                class="stat-preview-row"
            >
              <span class="stat-label">{{ statLabels[statKey as keyof typeof statLabels] }}</span>
              <span class="stat-current">{{ (selectedEquip.item as any)[statKey] }}</span>
              <span class="arrow">➡️</span>
              <span class="stat-next">
                {{ getStatPreview(statKey)?.next }}
                <span class="chance-tag">(20%機率)</span>
              </span>
            </div>
          </div>
          <div class="helper-text">* 每次強化會隨機挑選上述其中「一項」屬性進行升級 (＋20%)</div>
        </div>

        <!-- 強化材料與判定區域 -->
        <div class="forge-actions-card">
          <div v-if="selectedEquip.item.enhanceLevel! >= 5" class="max-level-box">
            🌟 該裝備已熔煉至最高強化上限 (+5)！
          </div>
          <div v-else class="forge-requirements">
            <div class="req-title">熔煉所需材料：</div>
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
              <div class="prob-row">成功率：<span class="success">60%</span></div>
              <div class="prob-row">失敗且裝備爆裂率：<span class="danger">20%</span></div>
            </div>

            <!-- 按鈕 -->
            <el-button
                type="danger"
                size="large"
                class="forge-btn"
                :loading="isForging"
                :disabled="!crystalCost.hasEnough"
                @click="startForge"
            >
              🔥 啟動熔煉鍛造 ({{ selectedEquip.item.enhanceLevel || 0 }} ➡️ {{ (selectedEquip.item.enhanceLevel || 0) + 1 }})
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
    </div>

    <!-- 3. 全螢幕打鐵敲擊動畫/結果特效 -->
    <Transition name="fade">
      <div v-if="showEffect" class="forge-overlay">
        <!-- 打鐵火星 -->
        <div class="forge-anim-area">
          <div v-if="isForging" class="forge-hammering">
            <div class="hammer">🔨</div>
            <div class="anvil">🔥</div>
            <div class="spark-particles"></div>
            <div class="status-msg">矮人鐵匠正在極力敲擊與熔煉...</div>
          </div>
          <div v-else class="forge-result-display" :class="forgeResult">
            <div class="result-icon">
              <span v-if="forgeResult === 'success'">✨</span>
              <span v-if="forgeResult === 'fail'">🛡️</span>
              <span v-if="forgeResult === 'break'">💥</span>
            </div>
            <div class="result-text">
              <span v-if="forgeResult === 'success'">熔煉強化成功！</span>
              <span v-if="forgeResult === 'fail'">強化失敗（裝備完好）</span>
              <span v-if="forgeResult === 'break'">裝備已爆裂損毀！</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.blacksmith-workspace {
  display: flex;
  flex: 1;
  width: 100%;
  height: 520px;
  background-color: #16171c;
  color: #e0e6ed;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

/* 1. 裝備選擇列表 (左側) */
.equip-selector {
  width: 320px;
  border-right: 1px solid #2d2e38;
  display: flex;
  flex-direction: column;
  background-color: #1a1b22;
}

.panel-header {
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  background-color: #20222a;
  border-bottom: 1px solid #2d2e38;
  color: #ff7675;
}

.equip-list-container {
  flex: 1;
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
  font-size: 1.8rem;
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
  flex: 1;
  background-color: #16171c;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.forge-area-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 580px;
  margin: 0 auto;
  width: 100%;
}

/* 裝備展示區 + 特效光暈 */
.weapon-display-box {
  background: radial-gradient(circle, #2d3043 0%, #1c1d27 100%);
  border: 1px solid #373a4e;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.5s ease;
}

.selected-equip-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  display: inline-block;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.1));
}

.selected-equip-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #ffffff;
  margin: 0.25rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.lvl-title {
  color: #e040fb;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(224, 64, 251, 0.6);
}

.selected-equip-desc {
  font-size: 0.85rem;
  color: #a4b0be;
  margin: 0;
}

/* 🧪 強化分級光暈效果 CSS 實作 */

/* +1: 柔和白光 */
.glow-lvl-1 {
  border-color: rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.25);
}

/* +2: 生機綠光 */
.glow-lvl-2 {
  border-color: rgba(46, 204, 113, 0.5) !important;
  box-shadow: 0 0 15px rgba(46, 204, 113, 0.35);
}

/* +3: 藍紫炫光 */
.glow-lvl-3 {
  border-color: rgba(52, 152, 219, 0.6) !important;
  animation: pulse-blue 2.5s infinite alternate;
}

/* +4: 紫紅魔光 */
.glow-lvl-4 {
  border-color: rgba(155, 89, 182, 0.7) !important;
  animation: flash-purple 1.8s infinite alternate;
}

/* +5: 金黃烈焰 */
.glow-lvl-5 {
  border-color: rgba(241, 196, 15, 0.8) !important;
  animation: gold-flame 1.2s infinite alternate;
}

@keyframes pulse-blue {
  0% { box-shadow: 0 0 8px rgba(52, 152, 219, 0.3); }
  100% { box-shadow: 0 0 20px rgba(52, 152, 219, 0.7); }
}

@keyframes flash-purple {
  0% { box-shadow: 0 0 10px rgba(155, 89, 182, 0.4); }
  100% { box-shadow: 0 0 25px rgba(232, 67, 147, 0.75); }
}

@keyframes gold-flame {
  0% {
    box-shadow: 0 0 15px rgba(241, 196, 15, 0.6), 0 0 25px rgba(230, 126, 34, 0.4);
  }
  100% {
    box-shadow: 0 0 30px rgba(241, 196, 15, 0.9), 0 0 45px rgba(230, 126, 34, 0.8), 0 0 60px rgba(231, 76, 60, 0.6);
  }
}

/* 屬性預覽卡 */
.stats-preview-card {
  background-color: #1d1e26;
  border: 1px solid #2d2e38;
  border-radius: 8px;
  padding: 1rem;
}

.card-title {
  font-size: 0.95rem;
  font-weight: bold;
  color: #ff9f43;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid #2d2e38;
  padding-bottom: 0.5rem;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.stat-preview-row {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.stat-label {
  width: 100px;
  color: #a4b0be;
}

.stat-current {
  width: 50px;
  font-weight: bold;
  text-align: right;
  color: #ffffff;
}

.arrow {
  margin: 0 1rem;
  font-size: 0.8rem;
  color: #636e72;
}

.stat-next {
  font-weight: bold;
  color: #2ecc71;
  display: flex;
  align-items: center;
  gap: 6px;
}

.chance-tag {
  font-size: 0.75rem;
  color: #747d8c;
  font-weight: normal;
}

.helper-text {
  font-size: 0.8rem;
  color: #747d8c;
  margin-top: 0.75rem;
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

/* 3. 打鐵敲擊動畫層 */
.forge-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(22, 23, 28, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.forge-anim-area {
  text-align: center;
}

.forge-hammering {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.forge-hammering .hammer {
  font-size: 4rem;
  animation: strike 0.4s infinite alternate;
  transform-origin: bottom right;
}

.forge-hammering .anvil {
  font-size: 4rem;
  margin-top: -10px;
}

.status-msg {
  margin-top: 1.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: #ff9f43;
}

@keyframes strike {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(-45deg); }
}

.forge-result-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: zoomIn 0.3s ease-out;
}

.result-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 15px currentColor);
}

.result-text {
  font-size: 1.5rem;
  font-weight: bold;
}

.forge-result-display.success {
  color: #2ecc71;
}

.forge-result-display.fail {
  color: #ff9f43;
}

.forge-result-display.break {
  color: #ff7675;
}

@keyframes zoomIn {
  0% { transform: scale(0.6); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
