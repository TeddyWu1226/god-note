<script setup lang="ts">
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {ref} from "vue";
import {Accessory2, SpecialAccessory} from "@/constants/items/equipment/accessories-info";
import {RoomEnum} from "@/enums/room-enum";
import {useSaveStore} from "@/store/save-store";
import {useTrackerStore} from "@/store/track-store";
import {Weapon} from "@/constants/items/equipment/weapon-info";
import {Offhand} from "@/constants/items/equipment/offhand-info";
import {Potions} from "@/constants/items/usalbe-item/potion-info";
import {Usable} from "@/constants/items/usalbe-item/usable-info";
import {Head} from "@/constants/items/equipment/head-info";
import {Armor} from "@/constants/items/equipment/armor-info";
import {Material} from "@/constants/items/material/material-info";

const gameStateStore = useGameStateStore()
const playerStore = usePlayerStore()
const trackerStore = useTrackerStore()
const saveStore = useSaveStore()
const isClose = ref(true);

// 跳關
const selectStage = (stageVal: number) => {
  playerStore.healFull()

  // 更新最高通關進度
  gameStateStore.maxClearedStage = Math.max(gameStateStore.maxClearedStage, gameStateStore.currentStage + 1)

  gameStateStore.currentStage = stageVal
  gameStateStore.stageDays = 0
  gameStateStore.isBattleWon = false
  gameStateStore.setRoom(RoomEnum.Rest.value)
  gameStateStore.nextRooms = []
}
const onLevelUp = () => {
  playerStore.gainExp({amount: 900})
}

const onLeve2Test = () => {
  selectStage(2)
  // 第一大關破完大概 11 等
  playerStore.gainExp({amount: 750})
  playerStore.addGold(300)
  // 第一大關破完大概 裝備
  // playerStore.equipItem(Weapon.Sword0)
  playerStore.equipItem(Head.HpHead0)
  playerStore.equipItem(Armor.DefendArmor0)
  playerStore.equipItem(Offhand.Shield0)
}

const onLeve3Test = () => {
  selectStage(3)
  // 第二大關破完大概 25 等
  playerStore.gainExp({amount: 3000})
  // 第一大關破完大概 裝備
  playerStore.equipItem(Head.HpHead1)
  playerStore.equipItem(Armor.DefendArmor1)
  playerStore.equipItem(Weapon.Sword1)
  playerStore.equipItem(Offhand.Shield1)
}
const onTest = () => {
  onLeve2Test()
  // onLeve3Test()
  // playerStore.gainExp({amount: 1000})
}
const give = () => {
  // playerStore.addGold(1000)

  // playerStore.gainItem(Material.BadNormal, 100)
  // playerStore.gainItem(Offhand.Book5)
  // playerStore.gainItem(Weapon.Sword0)
  // playerStore.gainItem(SpecialAccessory.SoulAnchor)

  playerStore.gainItem(Usable.BurningPotion, 3)
  // playerStore.gainItem(Potions.Heal0, 10)
  // playerStore.gainItem(Usable.SmokeBomb)
}
const heal = () => {
  playerStore.healFull()
}

const setRoom = () => {
  gameStateStore.nextRooms = [RoomEnum.Fight.value, RoomEnum.EliteFight.value,
    RoomEnum.Shop.value, RoomEnum.Rest.value, RoomEnum.Event.value]
}
const onSave = () => {
  saveStore.saveAll()
}
</script>

<template>
  <el-card class="test">
    <el-button @click="isClose = !isClose" style="width: 100% ">縮放</el-button>
    <div style="padding-top: 5px" v-if="!isClose">
      <el-button @click="give">給道具</el-button>
      <el-button @click="heal">回血</el-button>
      <el-button @click="setRoom">房間</el-button>
      <el-button @click="onTest">作弊</el-button>
      <el-button @click="onLevelUp">升等</el-button>
      <el-button @click="onSave">存檔</el-button>
      <el-collapse>
        <el-collapse-item title="回合環境參數">
          <el-scrollbar max-height="200px">
            <p v-for="key in Object.keys(gameStateStore.$state)">
              {{ key }}: {{ gameStateStore.$state[key] }}
            </p>
          </el-scrollbar>
        </el-collapse-item>
        <el-collapse-item title="玩家資訊">
          <el-scrollbar max-height="200px">
            <p v-for="key in Object.keys(playerStore.info)">-->
              {{ key }}: {{ playerStore.info[key] }}
            </p>
            <p>
              status: {{ playerStore.statusEffects }}
            </p>
          </el-scrollbar>
        </el-collapse-item>
        <el-collapse-item title="統計追蹤">
          <el-scrollbar max-height="200px">
            <h3>當前階段</h3>
            <div>
              {{ trackerStore.currentKills }}
            </div>
            <h3>本場遊戲</h3>

            <h3>其他</h3>
            <p v-for="key in Object.keys(trackerStore.achievementsCount)">-->
              {{ key }}: {{ trackerStore.achievementsCount[key] }}
            </p>
          </el-scrollbar>
        </el-collapse-item>
        <el-collapse-item title="裝備+狀態的加成效果">
          <el-scrollbar max-height="200px">
            <p v-for="key in Object.keys(playerStore.totalBonus)">
              {{ key }}: {{ playerStore.totalBonus[key] }}
            </p>
          </el-scrollbar>
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