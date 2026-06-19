<script setup lang="ts">

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
/** 戰鬥房間 **/
const FightRoomRef = ref()

const onSkill = (skillKey: string) => {
  FightRoomRef.value.onSkill(skillKey)
}

const onItemSkill = ({skillKey, callback, el}) => {
  const specifySkill = [
    Usable.Campfire.skill,
    Usable.GodNotePage.skill,
    Usable.ShabbyTent.skill,
    Potions.UnPoisonPotion.skill
  ]
  if (specifySkill.includes(skillKey)) {
    ItemSkill[skillKey](
        {
          playerStore: playerStore,
          gameStateStore: gameStateStore,
          callback: callback
        }
    )
  } else {
    FightRoomRef.value?.onItemSkill({skillKey, callback, el})
  }
}



/** 綜合取消 **/
const onCancel = () => {
  switch (currentRoomValue.value) {
    default:
      gameStateStore.transitionToNextState();
  }
}

defineExpose({
  onSkill,
  onItemSkill
})

/** 初始化刷新 **/
const logStore = useLogStore();
watch(() => gameStateStore.roomId,
    () => {
      logStore.logger.clear()
    },
    {
      immediate: true,
      deep: true
    }) // 確保在組件第一次加載時也能觸發計數

</script>

<template>
  <EventRoomCard v-if="currentRoomValue === RoomEnum.Event.value" :key="gameStateStore.roomId"/>
  <BlessRoom v-else-if="currentRoomValue === RoomEnum.Bless.value" :key="gameStateStore.roomId"/>
  <FightRoom
      ref="FightRoomRef"
      v-else-if="currentRoomValue === RoomEnum.Fight.value ||
        currentRoomValue === RoomEnum.EliteFight.value ||
        currentRoomValue === RoomEnum.Boss.value"
      :key="gameStateStore.roomId"
  />
  <RestRoom
      v-else-if="currentRoomValue === RoomEnum.Rest.value"
      :key="gameStateStore.roomId"
      @cancel="onCancel"
  />
  <ShopRoom
      v-else-if="currentRoomValue === RoomEnum.Shop.value"
      :key="gameStateStore.roomId"
      @cancel="onCancel"
  />
  <FusionRoom
      v-else-if="currentRoomValue === RoomEnum.Fusion.value"
      :key="gameStateStore.roomId"
      @cancel="onCancel"
  />
</template>

<style scoped>
.room-layout :deep(.el-card__body) {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
</style>