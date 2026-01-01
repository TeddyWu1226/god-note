<script setup lang="ts">
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {ref} from "vue";
import {UnitStatus} from "@/constants/status/unit-status";
import {Potions} from "@/constants/items/usalbe-item/potion-info";
import {Accessory1} from "@/constants/items/equipment/accessories-info";
import {Usable} from "@/constants/items/usalbe-item/usable-info";
import {Skills} from "@/constants/skill/skill";
import {SpecialEventEnum} from "@/enums/enums";
import {RoomEnum} from "@/enums/room-enum";
import {Weapon} from "@/constants/items/equipment/weapon-info";
import {Head} from "@/constants/items/equipment/head-info";
import {Armor} from "@/constants/items/equipment/armor-info";
import {Offhand} from "@/constants/items/equipment/offhand-info";

const gameStateStore = useGameStateStore()
const playerStore = usePlayerStore()
const isClose = ref(true);

const onTest = () => {

  playerStore.addGold(1000)
  playerStore.gainItem(Potions.Heal1)
  playerStore.gainItem(Potions.Heal1)
  playerStore.gainItem(Potions.Heal1)
  playerStore.gainItem(Potions.Heal1)
  playerStore.gainItem(Potions.Heal1)


  gameStateStore.currentStage = 5
}
const addEquipment = () => {
  playerStore.gainItem(Accessory1.SoulAnchor)
  // playerStore.gainItem(Usable.GodLuckLeaf)
  playerStore.gainItem(Weapon.Sword0)
  playerStore.gainItem(Head.HpHead1)
  playerStore.gainItem(Armor.Armor1)
  playerStore.gainItem(Offhand.Shield1)
}
const heal = () => {
  playerStore.healFull()
}

const setRoom = () => {
  gameStateStore.nextRooms = [RoomEnum.Fight.value, RoomEnum.EliteFight.value,
    RoomEnum.Shop.value, RoomEnum.Rest.value, RoomEnum.Event.value]
}
</script>

<template>
  <el-card class="test">
    <el-button @click="isClose = !isClose" style="width: 100% ">縮放</el-button>
    <div style="padding-top: 5px" v-if="!isClose">
      <el-button @click="addEquipment">給裝備</el-button>
      <el-button @click="heal">回滿血</el-button>
      <el-button @click="onTest">測試</el-button>
      <el-button @click="setRoom">房間設定</el-button>
      <el-collapse>
        <el-collapse-item title="回合環境參數">
          <p v-for="key in Object.keys(gameStateStore.$state)">
            {{ key }}: {{ gameStateStore.$state[key] }}
          </p>
        </el-collapse-item>
        <el-collapse-item title="玩家資訊">
          <p v-for="key in Object.keys(playerStore.info)">-->
            {{ key }}: {{ playerStore.info[key] }}
          </p>
          <p>
            status: {{ playerStore.statusEffects }}
          </p>
        </el-collapse-item>
        <el-collapse-item title="裝備+狀態的加成效果">
          <p v-for="key in Object.keys(playerStore.totalBonus)">
            {{ key }}: {{ playerStore.totalBonus[key] }}
          </p>
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-card>
</template>

<style scoped>
.test {
  position: absolute;
  right: 50px;
  z-index: 6000;
  max-width: 30%;
}
</style>