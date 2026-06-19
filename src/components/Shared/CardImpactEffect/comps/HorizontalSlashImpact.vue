<template>
  <div class="impact-horizontal-slash">
    <div class="horizontal-glow"></div>
    <div class="horizontal-line"></div>
  </div>
</template>

<style scoped>
.impact-horizontal-slash {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  //background: rgba(255, 71, 87, 0.08);
  animation: card-shake-horizontal 0.35s ease-out;
}

.horizontal-line {
  position: absolute;
  left: -20%;
  right: -20%;
  top: 50%;
  height: 6px;
  background: linear-gradient(90deg, transparent, #ffffff 30%, #ff3838 50%, #ffffff 70%, transparent);
  box-shadow: 0 0 12px #ff3838, 0 0 24px #ff3838;
  transform: translateY(-50%) scaleX(0);
  opacity: 0;
  animation: play-horizontal 0.3s cubic-bezier(0.1, 0.8, 0.1, 1) forwards;
}

.horizontal-glow {
  position: absolute;
  top: 50%;
  left: 10%;
  right: 10%;
  height: 40px;
  background: radial-gradient(ellipse at center, rgba(255, 56, 56, 0.4) 0%, transparent 70%);
  transform: translateY(-50%) scaleY(0);
  opacity: 0;
  animation: play-glow-horizontal 0.3s cubic-bezier(0.1, 0.8, 0.1, 1) forwards;
}

@keyframes play-horizontal {
  0% {
    transform: translateY(-50%) scaleX(0);
    opacity: 0;
  }
  20% {
    transform: translateY(-50%) scaleX(1.2);
    opacity: 1;
  }
  100% {
    transform: translateY(-50%) scaleX(1.5) scaleY(0.2);
    opacity: 0;
  }
}

@keyframes play-glow-horizontal {
  0% {
    transform: translateY(-50%) scaleY(0);
    opacity: 0;
  }
  20% {
    transform: translateY(-50%) scaleY(1);
    opacity: 0.8;
  }
  100% {
    transform: translateY(-50%) scaleY(2);
    opacity: 0;
  }
}

@keyframes card-shake-horizontal {
  0%, 100% { transform: translateX(0); }
  15% { transform: translateX(-8px); }
  30% { transform: translateX(8px); }
  45% { transform: translateX(-5px); }
  60% { transform: translateX(5px); }
  75% { transform: translateX(-2px); }
  90% { transform: translateX(2px); }
}
</style>
