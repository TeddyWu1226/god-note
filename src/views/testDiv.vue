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
import {SpecialItem} from "@/constants/items/special-item-info";
import {useSaveStore} from "@/store/save-store";
import {useTrackerStore} from "@/store/track-store";
import {MATERIAL} from "@/constants/items/material/material-info";
import {CharEnum} from "@/enums/char-enum";

const gameStateStore = useGameStateStore()
const playerStore = usePlayerStore()
const trackerStore = useTrackerStore()
const saveStore = useSaveStore()
const isClose = ref(true);

const onTest = () => {
  gameStateStore.currentStage = 6
  playerStore.gainExp({amount: 700})
  playerStore.addSkill(Skills.FireBall.id)
  playerStore.addSkill(Skills.CommonHeal.id)
  playerStore.addSkillProficiency(Skills.FireBall.id, 100)
}
const give = () => {
  playerStore.addGold(1000)

  playerStore.gainItem(Potions.Heal1)
  playerStore.gainItem(Potions.Heal1)
  playerStore.gainItem(Potions.Heal1)
  playerStore.gainItem(Potions.Heal1)
  playerStore.gainItem(Potions.Heal1)
  playerStore.gainItem(Potions.Magic1)
  playerStore.gainItem(Potions.Magic1)
  playerStore.gainItem(Potions.Magic1)
  playerStore.gainItem(Potions.UnPoisonPotion)
  playerStore.gainItem(Potions.UnPoisonPotion)

  playerStore.gainItem(Weapon.MagicStick1)
  playerStore.gainItem(Weapon.Sword1)
  playerStore.gainItem(Head.HpHead1)
  playerStore.gainItem(Armor.Armor1)
  playerStore.gainItem(Offhand.Shield1)
  playerStore.gainItem(Offhand.Book1)
  playerStore.info.hpLimit = 130

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
      <el-button @click="onTest">測試</el-button>
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