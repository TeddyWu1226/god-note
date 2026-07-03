<template>
  <div class="impact-poison">
    <!-- Poison Gas Fumes -->
    <div class="gas gas-1"></div>
    <div class="gas gas-2"></div>
    <!-- Toxic Bubbles -->
    <div class="bubble b-1">🤢</div>
    <div class="bubble b-2">☠️</div>
    <div class="bubble b-3">🤢</div>
    <div class="bubble b-4">🤢</div>
  </div>
</template>

<style scoped>
.impact-poison {
  position: absolute;
  inset: 0;
  background: rgba(46, 204, 113, 0.12); /* Subtle green overlay */
  overflow: hidden;
}

.gas {
  position: absolute;
  width: 150%;
  height: 150%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(39, 174, 96, 0.4) 0%, rgba(46, 204, 113, 0) 70%);
  filter: blur(10px);
  pointer-events: none;
  opacity: 0;
}

.gas-1 {
  left: -25%;
  top: -25%;
  animation: gas-expand 0.9s ease-out forwards;
}

.gas-2 {
  left: 10%;
  top: 10%;
  animation: gas-expand 0.8s ease-out 0.1s forwards;
}

.bubble {
  position: absolute;
  font-size: 1.4rem;
  opacity: 0;
}

.b-1 {
  left: 15%;
  animation: bubble-rise 0.8s ease-out 0.05s forwards;
}

.b-2 {
  left: 45%;
  font-size: 1.6rem;
  animation: bubble-rise 0.9s cubic-bezier(0.1, 0.8, 0.3, 1) 0.15s forwards;
}

.b-3 {
  left: 75%;
  animation: bubble-rise 0.75s ease-out 0.1s forwards;
}

.b-4 {
  left: 30%;
  animation: bubble-rise 0.85s ease-out 0.25s forwards;
}

@keyframes gas-expand {
  0% {
    transform: scale(0.6);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.1);
    opacity: 0;
  }
}

@keyframes bubble-rise {
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
