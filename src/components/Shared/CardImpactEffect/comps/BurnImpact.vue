<template>
  <div class="impact-burn">
    <!-- Fire Flames Fumes -->
    <div class="flame flame-1"></div>
    <div class="flame flame-2"></div>
    <!-- Rising Sparks -->
    <div class="spark s-1">🔥</div>
    <div class="spark s-2">💥</div>
    <div class="spark s-3">🔥</div>
    <div class="spark s-4">☄️</div>
  </div>
</template>

<style scoped>
.impact-burn {
  position: absolute;
  inset: 0;
  background: rgba(235, 59, 90, 0.15); /* Red/orange overlay */
  overflow: hidden;
}

.flame {
  position: absolute;
  width: 150%;
  height: 150%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(250, 130, 49, 0.5) 0%, rgba(235, 59, 90, 0) 70%);
  filter: blur(8px);
  pointer-events: none;
  opacity: 0;
}

.flame-1 {
  left: -25%;
  top: -25%;
  animation: flame-expand 0.9s ease-out forwards;
}

.flame-2 {
  left: 10%;
  top: 10%;
  animation: flame-expand 0.8s ease-out 0.1s forwards;
}

.spark {
  position: absolute;
  font-size: 1.4rem;
  opacity: 0;
}

.s-1 {
  left: 15%;
  animation: spark-rise 0.8s ease-out 0.05s forwards;
}

.s-2 {
  left: 45%;
  font-size: 1.6rem;
  animation: spark-rise 0.9s cubic-bezier(0.1, 0.8, 0.3, 1) 0.15s forwards;
}

.s-3 {
  left: 75%;
  animation: spark-rise 0.75s ease-out 0.1s forwards;
}

.s-4 {
  left: 30%;
  animation: spark-rise 0.85s ease-out 0.25s forwards;
}

@keyframes flame-expand {
  0% {
    transform: scale(0.6);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.1);
    opacity: 0;
  }
}

@keyframes spark-rise {
  0% {
    transform: translateY(60px) scale(0.6) rotate(0deg);
    opacity: 0;
  }
  30% {
    opacity: 0.9;
  }
  70% {
    opacity: 0.9;
    transform: translateY(-10px) scale(1) rotate(15deg);
  }
  100% {
    transform: translateY(-40px) scale(1.2) rotate(-15deg);
    opacity: 0;
  }
}
</style>
