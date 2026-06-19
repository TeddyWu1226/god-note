<template>
  <div class="impact-heal">
    <div class="sparkle sp-1">+</div>
    <div class="sparkle sp-2">✨</div>
    <div class="sparkle sp-3">+</div>
    <div class="sparkle sp-4">✨</div>
    <div class="sparkle sp-5">❤️</div>
  </div>
</template>

<style scoped>
.impact-heal {
  position: absolute;
  inset: 0;
  background: rgba(46, 213, 115, 0.06);
}

.sparkle {
  position: absolute;
  font-size: 1.4rem;
  font-weight: bold;
  opacity: 0;
  transform: translateY(20px);
}

.sp-1 {
  left: 15%;
  color: #2ed573;
  animation: float-up 0.85s ease-out forwards;
}

.sp-2 {
  left: 45%;
  font-size: 1.6rem;
  color: #ffa502;
  animation: float-up 0.85s ease-out 0.15s forwards;
}

.sp-3 {
  left: 75%;
  color: #2ed573;
  animation: float-up 0.85s ease-out 0.05s forwards;
}

.sp-4 {
  left: 30%;
  color: #ffa502;
  animation: float-up 0.85s ease-out 0.22s forwards;
}

.sp-5 {
  left: 60%;
  color: #ff4757;
  animation: float-up 0.85s ease-out 0.08s forwards;
}

@keyframes float-up {
  0% {
    transform: translateY(35px) scale(0.5);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: translateY(-45px) scale(1.2);
    opacity: 0;
  }
}
</style>
