<template>
  <div class="impact-assassinate">
    <!-- 暗影突襲背景 -->
    <div class="shadow-overlay"></div>
    
    <!-- 斬擊軌跡 -->
    <svg class="slash-svg" viewBox="0 0 100 150" preserveAspectRatio="none">
      <!-- 第一道斜向斬擊 -->
      <path d="M 15 25 L 85 125" class="slash-line line-1" />
    </svg>
    
    <!-- 核心發光點 -->
    <div class="glow-core"></div>
    <!-- 刺擊衝擊波 -->
    <div class="impact-ring"></div>
  </div>
</template>

<style scoped>
.impact-assassinate {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 25;
  animation: card-assassinate-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

/* 暗影背景特效 */
.shadow-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(15, 0, 30, 0.8) 0%, rgba(0, 0, 0, 0.95) 100%);
  mix-blend-mode: multiply;
  opacity: 0;
  animation: shadow-flash 0.5s ease-out forwards;
}

/* SVG 斬擊樣式 */
.slash-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.slash-line {
  fill: none;
  stroke-linecap: round;
  filter: drop-shadow(0 0 6px #ff1e56) drop-shadow(0 0 12px #7a00ff);
}

.line-1 {
  stroke: #ffffff;
  stroke-width: 5;
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: slash-draw 0.35s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
}

/* 核心發光爆破 */
.glow-core {
  position: absolute;
  width: 30px;
  height: 30px;
  background: radial-gradient(circle, #ffffff 10%, #7a00ff 50%, transparent 75%);
  border-radius: 50%;
  transform: scale(0);
  opacity: 0;
  mix-blend-mode: screen;
  animation: core-flash 0.4s ease-out 0.08s forwards;
}

/* 衝擊波圓環 */
.impact-ring {
  position: absolute;
  width: 40px;
  height: 40px;
  border: 2px solid #ff1e56;
  border-radius: 50%;
  box-shadow: 0 0 10px #7a00ff;
  transform: scale(0);
  opacity: 0;
  animation: ring-expand 0.45s ease-out 0.1s forwards;
}

/* --- 動畫 Keyframes --- */
@keyframes shadow-flash {
  0% {
    opacity: 0;
  }
  15% {
    opacity: 0.9;
  }
  85% {
    opacity: 0.8;
  }
  100% {
    opacity: 0;
  }
}

@keyframes slash-draw {
  0% {
    stroke-dashoffset: 200;
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  70% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  100% {
    stroke-dashoffset: -200;
    opacity: 0;
  }
}

@keyframes core-flash {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  30% {
    transform: scale(2.2);
    opacity: 1;
  }
  100% {
    transform: scale(3.5);
    opacity: 0;
  }
}

@keyframes ring-expand {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  20% {
    opacity: 0.9;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}

/* 卡片受擊位移與縮放動畫，增強打擊感 */
@keyframes card-assassinate-pop {
  0% {
    transform: scale(1) translate(0, 0);
  }
  10% {
    transform: scale(1.08) translate(-10px, -12px) rotate(-4deg);
  }
  25% {
    transform: scale(0.92) translate(12px, 10px) rotate(4deg);
  }
  40% {
    transform: scale(1.04) translate(-6px, 6px) rotate(-2deg);
  }
  60% {
    transform: scale(0.97) translate(4px, -4px) rotate(1deg);
  }
  80% {
    transform: scale(1.01) translate(-1px, 1px) rotate(-0.5deg);
  }
  100% {
    transform: scale(1) translate(0, 0);
  }
}
</style>
