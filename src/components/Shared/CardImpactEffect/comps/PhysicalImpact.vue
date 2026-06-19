<template>
  <div class="impact-physical">
    <div class="slash slash-1"></div>
    <div class="slash slash-2"></div>
    <div class="slash slash-3"></div>
  </div>
</template>

<style scoped>
.impact-physical {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 71, 87, 0.06);
  animation: card-shake 0.35s ease-out;
}

.slash {
  position: absolute;
  width: 150%;
  height: 6px;
  background: linear-gradient(90deg, transparent, #ffffff 40%, #ff4757 60%, transparent);
  box-shadow: 0 0 10px #ff4757, 0 0 20px #ff4757;
  transform: rotate(-30deg) scaleX(0);
  opacity: 0;
}

.slash-1 {
  top: 25%;
  animation: play-slash 0.25s cubic-bezier(0.15, 0.85, 0.35, 1) forwards;
}

.slash-2 {
  top: 50%;
  animation: play-slash 0.25s cubic-bezier(0.15, 0.85, 0.35, 1) 0.08s forwards;
}

.slash-3 {
  top: 75%;
  animation: play-slash 0.25s cubic-bezier(0.15, 0.85, 0.35, 1) 0.16s forwards;
}

@keyframes play-slash {
  0% {
    transform: rotate(-30deg) scaleX(0) translateX(-30%);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: rotate(-30deg) scaleX(1) translateX(30%);
    opacity: 0;
  }
}

@keyframes card-shake {
  0%, 100% { transform: translate(0, 0) scale(1); }
  20% { transform: translate(-3px, 3px) scale(0.97); }
  40% { transform: translate(3px, -3px) scale(1.02); }
  60% { transform: translate(-3px, -3px) scale(0.98); }
  80% { transform: translate(3px, 3px) scale(1.01); }
}
</style>
