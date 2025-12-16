<script setup lang="ts">
import {ref, watch, computed} from 'vue';
import {HpProgress, ValueProgress} from "@/components/Shared/Progress";
import {UserInfo} from "@/storage/userinfo-storage";
import {useFloatingMessage} from "@/components/Shared/FloatingMessage/useFloatingMessage";
import type {CSSProperties} from 'vue';
import {ElCard} from "element-plus"; // 引入 CSSProperties 類型

// 創建一個 Template Ref 來指向 el-card 元素，作為浮動訊息的目標
const cardRef = ref<typeof ElCard>(null);

// 計算 HP 上限，用於計算大規模傷害或治療的閾值
const hpLimit = computed(() => UserInfo.value.hpLimit);

watch(
    () => UserInfo.value.hp,
    (newValue, oldValue) => {
      // 確保 HP 發生變化，且卡片元素已經掛載
      if (newValue === oldValue || !cardRef.value) {
        return;
      }

      const changeAmount = newValue - oldValue;

      // --- 根據變化量決定訊息、顏色和特效 ---

      let messageText: string;
      let messageColor: string;
      let messageClass = '';
      let customStyle: CSSProperties = {};

      const threshold = hpLimit.value * 0.2; // 定義大規模變化的閾值 (HP 上限的 20%)

      if (changeAmount < 0) {
        // HP 減少 (傷害)
        const damage = Math.abs(changeAmount);
        messageText = `- ${damage} HP`;
        messageColor = '#FF0000'; // 紅色

        if (damage >= threshold) {
          // 大額傷害特效
          messageColor = '#B22222'; // 磚紅色
          messageClass = 'massive-damage-font'; // 自定義 CSS class，用於額外動畫或陰影
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

      // --- 觸發浮動訊息 ---
      useFloatingMessage(
          messageText,
          cardRef.value.$el,
          {
            duration: 1000, // 略微延長動畫時間以強調變化
            color: messageColor,
            messageClass: messageClass
          }
      );
    },
    {immediate: false} // 首次渲染不執行
);
</script>

<template>
  <el-card ref="cardRef">
    <el-form label-width="3rem">
      <el-form-item label="HP">
        <HpProgress
            class="value-progress"
            :current-value="UserInfo.hp"
            :total-value="UserInfo.hpLimit"
        />
      </el-form-item>
      <el-form-item label="MP">
        <ValueProgress
            class="value-progress"
            :current-value="UserInfo.sp"
            :total-value="UserInfo.spLimit"
        />
      </el-form-item>
      <el-form-item label="狀態">
        <span>
          無
        </span>
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

/* ---------------------------------------------------- */
/* ⭐️ 新增特效 CSS Class (需要在 Global 或 FloatingMessage 組件的 CSS 中定義) */
/* ---------------------------------------------------- */

/* 如果您在 FloatingMessage 組件中使用了 :deep() 或 global style，可以在那裡定義 */
/* 這裡僅提供範例，您可能需要將這些樣式複製到 FloatingMessage.vue 的 <style> 標籤中 */

/* 大額傷害/治療的字體效果 */
.massive-damage-font, .massive-heal-font {
  /* 增加字體描邊，使其更突出 */
  text-shadow: 0 0 5px rgba(255, 0, 0, 0.8), /* 紅色發光 */ 0 0 10px rgba(255, 0, 0, 0.5);
  animation-duration: 1.5s !important; /* 延長動畫時間 */
}

.massive-heal-font {
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.8), /* 綠色發光 */ 0 0 10px rgba(0, 255, 0, 0.5);
}

</style>