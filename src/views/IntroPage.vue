<script setup lang="ts">
import {useGameStateStore} from "@/store/game-state-store";
import {usePlayerStore} from "@/store/player-store";
import {RoomEnum} from "@/enums/room-enum";

const gameStateStore = useGameStateStore()
const playerStore = usePlayerStore()

const initAll = async () => {
  // 初始化角色
  playerStore.init()
  // 初始化
  gameStateStore.init()
  // 前往第一層
  gameStateStore.setRoom(RoomEnum.Bless.value)
}


const startGame = async () => {
  await initAll()

}


</script>

<template>
  <el-card class="start-view">
    <div class="content-wrapper">
      <h1 class="game-title">神之筆記</h1>
      <h2 class="game-subtitle">~無盡之塔~</h2>

      <div class="story-box">
        <p class="typewriter">傳說，高塔之巔棲息著能實現一切願望的神明</p>
        <p class="typewriter delay-1">千年來，無數勇者化作枯骨，卻無人能觸及雲端</p>
        <p class="typewriter delay-2">陌生的登塔者啊，你是命運的第幾次輪迴？</p>
      </div>

      <div class="action-zone">
        <el-button class="start-btn" @click="startGame">
          登上旅途
        </el-button>
      </div>
    </div>
  </el-card>
</template>


<style scoped>


/* 首頁背景與佈局 */
.start-view {
  height: 90vh;
  background: radial-gradient(circle at center, #1a1a1a 0%, #000000 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #444;
  position: relative;
  overflow: hidden;
}

/* 裝飾性光暈 */
.start-view::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  background: rgba(255, 215, 0, 0.05);
  filter: blur(80px);
  transform: translate(-50%, -50%);
}

.content-wrapper {
  text-align: center;
  z-index: 1;
}

/* 標題特效 */
.game-title {
  font-size: 3.5rem;
  font-family: "serif";
  letter-spacing: 0.5rem;
  background: linear-gradient(to bottom, #ffffff 0%, #888888 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
  margin-bottom: 0.5rem;
}

.game-subtitle {
  color: #ffd700;
  font-size: 1.2rem;
  letter-spacing: 0.8rem;
  margin-bottom: 3rem;
  opacity: 0.8;
}

/* 故事文字與打字機動畫 */
.story-box {
  margin-bottom: 4rem;
  min-height: 120px;
}

.typewriter {
  color: #ccc;
  font-size: 1rem;
  margin: 0.8rem 0;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid transparent;
  animation: typing 0.5s steps(40, end), fade-in 2s forwards;
}

.delay-1 {
  animation-delay: 0.5s;
  opacity: 0;
}

.delay-2 {
  animation-delay: 1s;
  opacity: 0;
}

/* 按鈕美化 */
.start-btn {
  background: transparent !important;
  border: 1px solid #ffd700 !important;
  color: #ffd700 !important;
  font-size: 1.5rem !important;
  padding: 2.5rem 4rem !important;
  transition: all 0.3s !important;
  position: relative;
}

.start-btn:hover {
  background: #ffd700 !important;
  color: #000 !important;
  box-shadow: 0 0 20px rgba(255, 214, 0, 0.6);
}


/* 動畫定義 */
@keyframes typing {
  from {
    width: 0
  }
  to {
    width: 100%
  }
}

@keyframes fade-in {
  to {
    opacity: 1;
  }
}
</style>
