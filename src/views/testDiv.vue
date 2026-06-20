<script setup lang="ts">
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {ref} from "vue";
import {Accessory2} from "@/constants/items/equipment/accessories-info";
import {RoomEnum} from "@/enums/room-enum";
import {useSaveStore} from "@/store/save-store";
import {useTrackerStore} from "@/store/track-store";
import {Weapon} from "@/constants/items/equipment/weapon-info";
import {Offhand} from "@/constants/items/equipment/offhand-info";
import {Potions} from "@/constants/items/usalbe-item/potion-info";
import {Usable} from "@/constants/items/usalbe-item/usable-info";

const gameStateStore = useGameStateStore()
const playerStore = usePlayerStore()
const trackerStore = useTrackerStore()
const saveStore = useSaveStore()
const isClose = ref(true);

const onTest = () => {
  playerStore.gainExp({amount: 100})
  // playerStore.addSkill(Skills.FireBall.id)
  // playerStore.addSkill(Skills.MagicDefend.id)
  // playerStore.addSkillProficiency(Skills.MagicDefend.id, 100)
}
const give = () => {
  // playerStore.addGold(1000)

  // playerStore.gainItem(Head.HpHead2)
  // playerStore.gainItem(Armor.Armor2)
  // playerStore.gainItem(Offhand.Shield0)
  playerStore.gainItem(Weapon.Sword0)
  playerStore.gainItem(Accessory2.SoulAnchor)
  // playerStore.gainItem(Accessory1.SoulAnchor)

  // playerStore.gainItem(Potions.BurningPotion, 10)
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
      <el-button @click="onSave">存檔</el-button>
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
        <el-collapse-item title="統計追蹤">
          <h3>當前階段</h3>
          <div>
            {{ trackerStore.currentKills }}
          </div>
          <h3>本場遊戲</h3>
          <div>
            {{ trackerStore.totalKills }}
          </div>
          <h3>其他</h3>
          <p v-for="key in Object.keys(trackerStore.achievementsCount)">-->
            {{ key }}: {{ trackerStore.achievementsCount[key] }}
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