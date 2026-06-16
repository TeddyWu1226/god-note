<script setup lang="ts">

import {getEnumColumn} from "@/utils/enum";
import {RoomEnum} from "@/enums/room-enum";
import {computed, ref, watch} from "vue";
import {useGameStateStore} from "@/store/game-state-store";
import RestRoom from "@/components/RoomLayout/room/RestRoom/RestRoom.vue";
import FightRoom from "@/components/RoomLayout/room/FightRoom/FightRoom.vue";
import EventRoomCard from "@/components/RoomLayout/comps/EventRoomCard.vue";
import {useLogStore} from "@/store/log-store";
import ShopRoom from "@/components/RoomLayout/room/ShopRoom/ShopRoom.vue";
import BlessRoom from "@/components/RoomLayout/room/BlessRoom/BlessRoom.vue";
import {ItemSkill} from "@/constants/skill/item-skill";
import {usePlayerStore} from "@/store/player-store";
import {Usable} from "@/constants/items/usalbe-item/usable-info";
import {Potions} from "@/constants/items/usalbe-item/potion-info";
import FusionRoom from "@/components/RoomLayout/room/FusionRoom/FusionRoom.vue";

const emit = defineEmits(['runFailed'])
const gameStateStore = useGameStateStore()
const playerStore = usePlayerStore()

const currentRoomValue = computed(() => {
      return gameStateStore.currentRoomValue
    }
)
const onRunFailed = () => {
  emit('runFailed', true)
}
/** 戰鬥房間 **/
const FightRoomRef = ref()
// 攻擊
const onAttack = () => {
  FightRoomRef.value.onAttack()
}

const onSkill = (skillKey: string) => {
  FightRoomRef.value.onSkill(skillKey)
}

const onRun = () => {
  FightRoomRef.value?.onRun()
}

const onEndTurn = () => {
  FightRoomRef.value?.onEndTurn()
}

const onItemSkill = ({skillKey, callback, el}) => {
  const specifySkill = [
    Usable.Campfire.skill, Usable.GodNotePage.skill, Usable.ShabbyTent.skill,
    Potions.UnPoisonPotion.skill
  ]
  if (specifySkill.includes(skillKey)) {
    ItemSkill[skillKey](
        {
          playerStore: playerStore,
          gameStateStore: gameStateStore,
          callback: callback,
          targetElement: el
        }
    )
  } else {
    FightRoomRef.value?.onItemSkill({skillKey, callback, el})
  }
}

/** 合成房間 **/
const FusionRoomRef = ref()

/** 休息房間 **/
const RestRoomRef = ref()
const onRest = () => {
  RestRoomRef.value?.onRest()
}

/** 購物房間 **/
const ShopRoomRef = ref()


/** 綜合取消 **/
const onCancel = () => {
  switch (currentRoomValue.value) {
    default:
      gameStateStore.transitionToNextState();
  }
}

defineExpose({
  onAttack,
  onSkill,
  onRun,
  onRest,
  onCancel,
  onItemSkill,
  onEndTurn
})

/** 初始化刷新 **/
const roomKeyCounter = ref(0)
const logStore = useLogStore();
watch(() => gameStateStore.days,
    () => {
      roomKeyCounter.value++
      logStore.logger.clear()
    },
    {
      immediate: true,
      deep: true
    }) // 確保在組件第一次加載時也能觸發計數

const gainFirstPower = () => {
  playerStore.info.pendingSkillPoints = (playerStore.info.pendingSkillPoints || 0) + 1;
  gameStateStore.transitionToNextState();
};
</script>

<template>
  <EventRoomCard v-if="currentRoomValue === RoomEnum.Event.value" :key="roomKeyCounter"/>
  <BlessRoom v-else-if="currentRoomValue === RoomEnum.Bless.value" :key="roomKeyCounter"/>
  <FightRoom
      ref="FightRoomRef"
      v-else-if="currentRoomValue === RoomEnum.Fight.value ||
        currentRoomValue === RoomEnum.EliteFight.value ||
        currentRoomValue === RoomEnum.Boss.value||
        currentRoomValue === RoomEnum.SpecialBoss.value
"
      @run-failed="onRunFailed"
      :key="roomKeyCounter"
  />
  <RestRoom
      ref="RestRoomRef"
      v-else-if="currentRoomValue === RoomEnum.Rest.value"
      :key="roomKeyCounter"
      @cancel="onCancel"
  />
  <ShopRoom
      ref="ShopRoomRef"
      v-else-if="currentRoomValue === RoomEnum.Shop.value"
      :key="roomKeyCounter"
      @cancel="onCancel"
  />
  <FusionRoom
      ref="FusionRoomRef"
      v-else-if="currentRoomValue === RoomEnum.Fusion.value"
      :key="roomKeyCounter"
      @cancel="onCancel"
  />
</template>

<style scoped>
.title {
  font-size: 1.2rem;
}

.room-layout :deep(.el-card__body) {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
</style>