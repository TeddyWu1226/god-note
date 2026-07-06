<template>
  <div class="impact-frozen">
    <!-- Ice Frost expansion waves -->
    <div class="frost frost-1"></div>
    <div class="frost frost-2"></div>
    <!-- Rising Ice Shards -->
    <div class="shard s-1">❄️</div>
    <div class="shard s-2">🧊</div>
    <div class="shard s-3">❄️</div>
    <div class="shard s-4">💎</div>
  </div>
</template>

<style scoped>
.impact-frozen {
  position: absolute;
  inset: 0;
  background: rgba(116, 185, 255, 0.2); /* Light icy blue overlay */
  overflow: hidden;
}

.frost {
  position: absolute;
  width: 150%;
  height: 150%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 210, 211, 0.45) 0%, rgba(9, 132, 227, 0) 70%);
  filter: blur(8px);
  pointer-events: none;
  opacity: 0;
}

.frost-1 {
  left: -25%;
  top: -25%;
  animation: frost-expand 0.95s ease-out forwards;
}

.frost-2 {
  left: 10%;
  top: 10%;
  animation: frost-expand 0.85s ease-out 0.1s forwards;
}

.shard {
  position: absolute;
  font-size: 1.4rem;
  opacity: 0;
}

.s-1 {
  left: 15%;
  animation: shard-rise 0.85s ease-out 0.05s forwards;
}

.s-2 {
  left: 45%;
  font-size: 1.6rem;
  animation: shard-rise 0.95s cubic-bezier(0.1, 0.8, 0.3, 1) 0.12s forwards;
}

.s-3 {
  left: 75%;
  animation: shard-rise 0.8s ease-out 0.08s forwards;
}

.s-4 {
  left: 30%;
  animation: shard-rise 0.9s ease-out 0.2s forwards;
}

@keyframes frost-expand {
  0% {
    transform: scale(0.5);
    opacity: 0.85;
  }
  100% {
    transform: scale(1.15);
    opacity: 0;
  }
}

@keyframes shard-rise {
  0% {
    transform: translateY(60px) scale(0.6) rotate(0deg);
    opacity: 0;
  }
  25% {
    opacity: 0.95;
  }
  75% {
    opacity: 0.95;
    transform: translateY(-15px) scale(1) rotate(-15deg);
  }
  100% {
    transform: translateY(-45px) scale(1.25) rotate(15deg);
    opacity: 0;
  }
}
</style>
