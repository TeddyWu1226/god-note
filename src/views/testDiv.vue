<script setup lang="ts">
import {useGameStateStore} from "@/store/game-state-store";

const gameStateStore = useGameStateStore()
</script>

<template>
<el-card class="test">
  {{gameStateStore.$state}}
</el-card>
</template>

<style scoped>
.test{
  position: absolute;
  right: 50px;
  z-index: 6000;
}
</style>