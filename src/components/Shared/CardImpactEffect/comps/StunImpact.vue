<template>
  <div class="impact-stun">
    <!-- Swirling Dizzy Rings -->
    <div class="swirl swirl-1"></div>
    <div class="swirl swirl-2"></div>
    <!-- Dizzy Stars & Swirl Emojis -->
    <div class="star s-1">💫</div>
    <div class="star s-2">🌀</div>
    <div class="star s-3">⭐</div>
    <div class="star s-4">😵‍💫</div>
  </div>
</template>

<style scoped>
.impact-stun {
  position: absolute;
  inset: 0;
  background: rgba(241, 196, 15, 0.08); /* Subtle yellow overlay */
  overflow: hidden;
}

.swirl {
  position: absolute;
  width: 120%;
  height: 120%;
  border-radius: 50%;
  border: 2px dashed rgba(241, 196, 15, 0.4);
  pointer-events: none;
  opacity: 0;
}

.swirl-1 {
  left: -10%;
  top: -10%;
  animation: swirl-rotate 0.9s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
}

.swirl-2 {
  left: -10%;
  top: -10%;
  animation: swirl-rotate-reverse 0.9s cubic-bezier(0.1, 0.8, 0.3, 1) 0.1s forwards;
}

.star {
  position: absolute;
  font-size: 1.4rem;
  opacity: 0;
  transform-origin: center;
}

.s-1 {
  left: 20%;
  top: 15%;
  animation: star-swirl 0.85s ease-out forwards;
}

.s-2 {
  left: 55%;
  top: 35%;
  font-size: 1.6rem;
  animation: star-swirl 0.9s ease-out 0.05s forwards;
}

.s-3 {
  left: 35%;
  top: 60%;
  animation: star-swirl 0.8s ease-out 0.1s forwards;
}

.s-4 {
  left: 70%;
  top: 20%;
  animation: star-swirl 0.95s ease-out 0.15s forwards;
}

@keyframes swirl-rotate {
  0% {
    transform: scale(0.4) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(180deg);
    opacity: 0;
  }
}

@keyframes swirl-rotate-reverse {
  0% {
    transform: scale(0.6) rotate(360deg);
    opacity: 0;
  }
  20% {
    opacity: 0.6;
  }
  100% {
    transform: scale(1.1) rotate(0deg);
    opacity: 0;
  }
}

@keyframes star-swirl {
  0% {
    transform: translate(0, 40px) scale(0.5) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
    transform: translate(15px, -20px) scale(1.1) rotate(180deg);
  }
  100% {
    transform: translate(25px, -40px) scale(1.3) rotate(360deg);
    opacity: 0;
  }
}
</style>
