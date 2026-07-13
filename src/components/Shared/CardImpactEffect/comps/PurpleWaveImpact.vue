<template>
  <div class="impact-purple-wave">
    <div class="purple-wave-ring ring-1"></div>
    <div class="purple-wave-ring ring-2"></div>
  </div>
</template>

<style scoped>
.impact-purple-wave {
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  pointer-events: none;
}

.purple-wave-ring {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 2.5px solid #a855f7; /* Bright purple */
  box-shadow: 0 0 12px #a855f7,
              inset 0 0 6px #a855f7;
  opacity: 0;
  pointer-events: none;
}

.purple-wave-ring.ring-1 {
  animation: purple-wave-expand 0.9s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
}

.purple-wave-ring.ring-2 {
  animation: purple-wave-expand 0.9s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
  animation-delay: 250ms;
}

@keyframes purple-wave-expand {
  0% {
    transform: scale(0.98);
    opacity: 0;
  }
  10% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    transform: scale(1.22);
    opacity: 0;
    border-width: 1px;
    box-shadow: 0 0 16px #a855f7,
                inset 0 0 8px #a855f7;
  }
}
</style>
