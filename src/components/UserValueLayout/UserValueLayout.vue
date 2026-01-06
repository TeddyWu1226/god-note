<script setup lang="ts">
import {ref, watch, computed, nextTick} from 'vue';
import {HpProgress, ValueProgress} from "@/components/Shared/Progress";
import {useFloatingMessage} from "@/components/Shared/FloatingMessage/useFloatingMessage";
import {ElCard} from "element-plus";
import {usePlayerStore} from "@/store/player-store";
import {Usable} from "@/constants/items/usalbe-item/usable-info";
import {showEffect} from "@/components/Shared/FloatingEffect/EffectManager";
import {useGameStateStore} from "@/store/game-state-store";

const playerStore = usePlayerStore();
const gameStore = useGameStateStore();

// 創建一個 Template Ref 指向 el-card 實例
const cardRef = ref<typeof ElCard | null>(null);
// 控制震動狀態的響應式變數
const isShaking = ref(false);

// 計算 HP 上限，用於計算大規模傷害或治療的閾值
const hpLimit = computed(() => playerStore.finalStats.hpLimit);

// 震動動畫持續時間 (需與 CSS 中的 duration 匹配)
const SHAKE_DURATION_MS = 500;

watch(
    () => playerStore.info.hp,
    (newValue, oldValue) => {
      // 確保 HP 發生變化，且卡片元素已經掛載
      if (newValue === oldValue || !cardRef.value) {
        return;
      }
      if (oldValue > newValue && newValue === hpLimit.value) {
        return;
      }
      // 如果生命值歸零
      if (playerStore.info.hp <= 0) {
        if (playerStore.hasItem(Usable.GodStar.name)[0]) {
          playerStore.healFull()
          playerStore.removeItem(Usable.GodStar.name)
          showEffect(cardRef.value.$el, "🪽神聖光芒的庇護🪽", "fullscreen")
          return;
        }
        gameStore.isDead = true
      }

      // 如果停止動畫就不顯示
      if (playerStore.stopValueChangeAnimation) {
        return;
      }

      const changeAmount = newValue - oldValue;
      const threshold = hpLimit.value * 0.2; // 定義大規模變化的閾值 (HP 上限的 20%)

      // --- 浮動訊息邏輯 ---
      let messageText: string;
      let messageColor: string;
      let messageClass = '';
      let shouldShake = false; // 新增旗標控制是否震動

      if (changeAmount < 0) {
        // HP 減少 (傷害)
        const damage = Math.abs(changeAmount);
        messageText = `- ${damage} HP`;
        messageColor = '#FF0000'; // 紅色

        if (damage >= threshold) {
          // 大額傷害特效
          messageColor = '#B22222'; // 磚紅色
          messageClass = 'massive-damage-font';
          shouldShake = true; // 觸發震動
        }

      } else {
        // HP 增加 (治療)
        messageText = `+ ${changeAmount} HP`;
        messageColor = '#32CD32'; // 亮綠色

        if (changeAmount >= threshold) {
          // 大額治療特效
          messageColor = '#00FF00'; // 純綠色
          messageClass = 'massive-heal-font';
        }
      }

      // --- 震動控制邏輯 ---
      if (shouldShake) {
        // 1. 確保先移除，再添加，以觸發動畫重新播放
        isShaking.value = false;
        // 使用 nextTick 確保 DOM 已經更新（移除 class）
        nextTick(() => {
          isShaking.value = true;
          // 2. 定時移除震動 class，避免無限震動
          setTimeout(() => {
            isShaking.value = false;
          }, SHAKE_DURATION_MS);
        });
      }

      // --- 觸發浮動訊息 ---
      // 注意：對於 Vue 組件 (如 ElCard)，要獲取 DOM 元素需使用 $el
      useFloatingMessage(
          messageText,
          cardRef.value.$el,
          {
            duration: 1000,
            color: messageColor,
            messageClass: messageClass
          }
      );

    },
    {immediate: false}
);
</script>

<template>
  <el-card ref="cardRef" :class="{'shaking': isShaking}">
    <el-form label-width="3rem">
      <el-form-item label="HP">
        <HpProgress
            class="value-progress"
            :current-value="playerStore.finalStats.hp"
            :total-value="playerStore.finalStats.hpLimit"
        />
      </el-form-item>
      <el-form-item label="SP">
        <ValueProgress
            class="value-progress"
            :current-value="playerStore.finalStats.sp"
            :total-value="playerStore.finalStats.spLimit"
        />
      </el-form-item>
      <el-form-item>
        <div class="status-effects-container">
          <div
              v-for="effect in playerStore.statusEffects"
              :key="effect.name"
              class="status-icon-item"
          >
            <el-tooltip
                effect="light"
                placement="top"
            >
              <template #content>
                <div class="status-tooltip">
                  <div class="status-name">
                    <strong :style="{color:effect.isBuff?'var(--el-color-success)':'var(--el-color-danger)'}">
                      {{ effect.name }}
                    </strong>
                    <span class="duration-tag" v-if="effect.duration !== -1">
                      {{ effect.duration }} 回合
                    </span>
                    <span class="duration-tag permanent" v-else>永久</span>
                  </div>
                  <div class="status-desc">{{ effect.description }}</div>
                </div>
              </template>

              <div class="icon-badge-wrapper">
                <span class="effect-icon">{{ effect.icon }}</span>
                <span
                    v-if="effect.duration !== -1"
                    class="effect-duration-badge"
                >
                  {{ effect.duration }}
                </span>
              </div>
            </el-tooltip>
          </div>

          <span v-if="playerStore.statusEffects.length === 0" class="no-status">
            無
          </span>
        </div>
      </el-form-item>
    </el-form>
  </el-card>

</template>

<style scoped>
.value-progress {
  width: 100%
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-card__body) {
  padding: 0.5rem 1rem;
}


/* 大額傷害/治療的字體效果 */
.massive-damage-font, .massive-heal-font {
  /* 增加字體描邊，使其更突出 */
  text-shadow: 0 0 5px rgba(255, 0, 0, 0.8), /* 紅色發光 */ 0 0 10px rgba(255, 0, 0, 0.5);
  animation-duration: 1.5s !important; /* 延長動畫時間 */
}

.massive-heal-font {
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.8), /* 綠色發光 */ 0 0 10px rgba(0, 255, 0, 0.5);
}


/* 狀態容器佈局 */
.status-effects-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  min-height: 32px;
}

.status-icon-item {
  cursor: help;
  transition: transform 0.1s ease;
}

.status-icon-item:hover {
  transform: scale(1.1);
}

/* 圖示包裝層，用於定位右上角或右下角的回合數 */
.icon-badge-wrapper {
  position: relative;
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 1.2rem;
}

/* 回合數標籤樣式 */
.effect-duration-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background-color: #333;
  color: #fff;
  font-size: 10px;
  padding: 0 3px;
  border-radius: 3px;
  line-height: 12px;
  border: 1px solid #555;
  font-family: 'Courier New', Courier, monospace;
}

.no-status {
  color: #999;
  font-size: 0.9rem;
}

/* Tooltip 內部美化 */
.status-tooltip {
  max-width: 180px;
}

.status-name {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #555;
  padding-bottom: 4px;
  margin-bottom: 4px;
}

.duration-tag {
  font-size: 11px;
  background: #555;
  padding: 1px 4px;
  border-radius: 3px;
  margin-left: 8px;
}

.permanent {
  background: #67c23a; /* 綠色代表永久 */
}

.status-desc {
  font-size: 12px;
  line-height: 1.4;
  color: #ddd;
}

</style>
