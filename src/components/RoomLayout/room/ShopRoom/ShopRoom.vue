<script setup lang="ts">
import './shop.css'
import {ref, onMounted, computed, watch} from "vue";
import {useGameStateStore} from "@/store/game-state-store";
import {useShopLogic} from "./useShopLogic";
import {GameState} from "@/enums/enums";
import RoomTemplate from "@/components/RoomLayout/comps/RoomTemplate.vue";

// 匯入分開管理的子組件
import GoblinMerchant from "./comps/GoblinMerchant.vue";
import DwarfBlacksmith from "./comps/DwarfBlacksmith.vue";
// 在此處可匯入其他人員，例如：
// import BardPanel from "./comps/BardPanel.vue";

const gameStateStore = useGameStateStore();
const {generateGoods} = useShopLogic(gameStateStore.currentStage, gameStateStore.days);

const itemList = ref([]);
const currentView = ref<string>('camp'); // 'camp' 或 staffList 內定義的人員 ID
const isExited = ref(false);

// 🎪 旅團人員配置清單（在此擴充其他人員，例如吟遊詩人，畫面即可自動適配）
const staffList = [
  {
    id: 'merchant',
    name: '地精商人',
    icon: '🧌',
    btnType: 'success' as const,
    component: GoblinMerchant,
    title: '地精商人'
  },
  {
    id: 'blacksmith',
    name: '矮人鐵匠',
    icon: '🧔🏽‍♂️',
    btnType: 'warning' as const,
    component: DwarfBlacksmith,
    title: '矮人鐵匠'
  },
  /* 
  未來擴充範例：
  {
    id: 'bard',
    name: '吟遊詩人',
    icon: '🪕',
    btnType: 'primary' as const,
    component: BardPanel,
    title: '旅團樂手'
  }
  */
];

// 當前拜訪的人員
const activeStaff = computed(() => staffList.find(staff => staff.id === currentView.value));

onMounted(() => {
  // 只有第一次進入 EventPhase 會初始化商品
  if (gameStateStore.stateIs(GameState.EVENT_PHASE)) {
    itemList.value = generateGoods();
  } else {
    isExited.value = true;
  }
});

const emit = defineEmits(['cancel']);
const cancel = (): void => {
  emit('cancel');
}
</script>

<template>
  <RoomTemplate :title="currentView === 'camp' ? '行商旅團' : (activeStaff?.title || '旅團營地')">
    <template #default>
      <div v-if="isExited" class="run-text" style="padding: 3rem; text-align: center;">
        旅團已經拔營離開了...
      </div>
      <div v-else-if="currentView === 'camp'" class="general-event">
        <div class="event-icon">🎪</div>
        <div class="dialog-box">
          <p>行商旅團正在道路旁安營紮帳。</p>
          <p>爐火熊熊，商人們的吆喝聲與鐵錘敲擊鐵砧的聲音在空中迴盪。</p>
          <p>你可以找地精商人交易物資，或尋找鐵匠強化你的裝備。</p>
        </div>
      </div>
      <div v-else-if="activeStaff" style="width: 100%; height: 100%; display: flex; flex-direction: column;">
        <component :is="activeStaff.component" :item-list="itemList"/>
      </div>
    </template>
    <!-- 按鈕控制區域 (動態適配人員清單) -->
    <template #button>
      <template v-if="!isExited">
        <el-button
            v-for="staff in staffList"
            :key="staff.id"
            :type="staff.btnType"
            @click="currentView = staff.id"
        >
          {{ staff.icon }} 拜訪{{ staff.name }}
        </el-button>
        <el-button type="info" @click="cancel">離開旅團</el-button>
      </template>
      <template v-else>
        <el-button type="info" @click="cancel">離開</el-button>
      </template>
    </template>
  </RoomTemplate>
</template>

<style scoped>
.run-text {
  font-size: 1.2rem;
  text-align: center;
  color: #909399;
}
</style>
