<template>
  <div class="impact-buff">
    <div class="arrow ar-1">▲</div>
    <div class="arrow ar-2">▲</div>
    <div class="arrow ar-3">▲</div>
  </div>
</template>

<style scoped>
.impact-buff {
  position: absolute;
  inset: 0;
  background: rgba(255, 165, 0, 0.06);
}

.arrow {
  position: absolute;
  font-size: 1.5rem;
  color: #ffa502;
  text-shadow: 0 0 8px #ffa502;
  opacity: 0;
}

.ar-1 {
  left: 20%;
  animation: buff-rise 0.8s ease-out forwards;
}

.ar-2 {
  left: 50%;
  animation: buff-rise 0.8s ease-out 0.15s forwards;
}

.ar-3 {
  left: 80%;
  animation: buff-rise 0.8s ease-out 0.08s forwards;
}

@keyframes buff-rise {
  0% {
    transform: translateY(40px) scale(0.5);
    opacity: 0;
  }
  30% {
    opacity: 0.95;
  }
  100% {
    transform: translateY(-35px) scale(1.15);
    opacity: 0;
  }
}
</style>
