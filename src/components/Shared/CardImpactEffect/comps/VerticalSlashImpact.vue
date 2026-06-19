<template>
  <div class="impact-vertical-slash">
    <div class="vertical-glow"></div>
    <div class="vertical-line"></div>
  </div>
</template>

<style scoped>
.impact-vertical-slash {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  //background: rgba(255, 71, 87, 0.08);
  animation: card-shake-vertical 0.35s ease-out;
}

.vertical-line {
  position: absolute;
  top: -20%;
  bottom: -20%;
  left: 50%;
  width: 6px;
  background: linear-gradient(180deg, transparent, #ffffff 30%, #ff3838 50%, #ffffff 70%, transparent);
  box-shadow: 0 0 12px #ff3838, 0 0 24px #ff3838;
  transform: translateX(-50%) scaleY(0);
  opacity: 0;
  animation: play-vertical 0.3s cubic-bezier(0.1, 0.8, 0.1, 1) forwards;
}

.vertical-glow {
  position: absolute;
  left: 50%;
  top: 10%;
  bottom: 10%;
  width: 40px;
  background: radial-gradient(ellipse at center, rgba(255, 56, 56, 0.4) 0%, transparent 70%);
  transform: translateX(-50%) scaleX(0);
  opacity: 0;
  animation: play-glow-vertical 0.3s cubic-bezier(0.1, 0.8, 0.1, 1) forwards;
}

@keyframes play-vertical {
  0% {
    transform: translateX(-50%) scaleY(0);
    opacity: 0;
  }
  20% {
    transform: translateX(-50%) scaleY(1.2);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) scaleY(1.5) scaleX(0.2);
    opacity: 0;
  }
}

@keyframes play-glow-vertical {
  0% {
    transform: translateX(-50%) scaleX(0);
    opacity: 0;
  }
  20% {
    transform: translateX(-50%) scaleX(1);
    opacity: 0.8;
  }
  100% {
    transform: translateX(-50%) scaleX(2);
    opacity: 0;
  }
}

@keyframes card-shake-vertical {
  0%, 100% { transform: translateY(0); }
  15% { transform: translateY(-8px); }
  30% { transform: translateY(8px); }
  45% { transform: translateY(-5px); }
  60% { transform: translateY(5px); }
  75% { transform: translateY(-2px); }
  90% { transform: translateY(2px); }
}
</style>
