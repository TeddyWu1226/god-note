<script setup lang="ts">
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {ref} from "vue";

const gameStateStore = useGameStateStore()
const playerInfo = usePlayerStore()
const isClose = ref(true);
</script>

<template>
  <el-card class="test">
    <el-button @click="isClose = !isClose" style="width: 100%">縮放</el-button>
    <template v-if="!isClose">
      <p v-for="key in Object.keys(gameStateStore.$state)">
        {{ key }}: {{ gameStateStore.$state[key] }}
      </p>
      <p>PLAYER</p>
      <p v-for="key in Object.keys(playerInfo.info)">
        {{ key }}: {{ playerInfo.info[key] }}
      </p>
    </template>
  </el-card>
</template>

<style scoped>
.test {
  position: absolute;
  right: 50px;
  z-index: 6000;
  max-width: 30%
}
</style>