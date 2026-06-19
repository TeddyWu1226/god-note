<template>
  <div class="impact-thrust">
    <div class="thrust-line t-line-top"></div>
    <div class="thrust-line t-line-bottom"></div>
    <div class="thrust-line t-line-left"></div>
    <div class="thrust-line t-line-right"></div>
    <div class="thrust-ring"></div>
    <div class="thrust-point"></div>
  </div>
</template>

<style scoped>
.impact-thrust {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  //background: rgba(255, 71, 87, 0.08);
  animation: card-thrust-pop 0.35s cubic-bezier(0.15, 0.85, 0.35, 1);
}

.thrust-point {
  position: absolute;
  width: 16px;
  height: 16px;
  background: #ffffff;
  transform: rotate(45deg) scale(0);
  box-shadow: 0 0 15px #ff4757, 0 0 30px #ffffff;
  animation: play-thrust-point 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.thrust-ring {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 3px solid #ff4757;
  border-radius: 50%;
  box-shadow: 0 0 15px #ff4757;
  transform: scale(0);
  opacity: 0;
  animation: play-thrust-ring 0.45s ease-out 0.05s forwards;
}

.thrust-line {
  position: absolute;
  width: 4px;
  height: 40px;
  background: linear-gradient(to top, transparent, #ffffff 50%, #ff4757 100%);
  opacity: 0;
}

/* 4 lines pointing inward */
.t-line-top {
  top: 10%;
  left: 50%;
  transform-origin: bottom center;
  transform: translateX(-50%);
  animation: play-thrust-line-top 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.t-line-bottom {
  bottom: 10%;
  left: 50%;
  transform-origin: top center;
  transform: translateX(-50%) rotate(180deg);
  animation: play-thrust-line-bottom 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.t-line-left {
  left: 10%;
  top: 50%;
  transform-origin: right center;
  transform: translateY(-50%) rotate(-90deg);
  animation: play-thrust-line-left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.t-line-right {
  right: 10%;
  top: 50%;
  transform-origin: left center;
  transform: translateY(-50%) rotate(90deg);
  animation: play-thrust-line-right 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes play-thrust-point {
  0% {
    transform: rotate(45deg) scale(0);
    opacity: 0;
  }
  30% {
    transform: rotate(45deg) scale(2.2);
    opacity: 1;
  }
  100% {
    transform: rotate(45deg) scale(0.2);
    opacity: 0;
  }
}

@keyframes play-thrust-ring {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: scale(8);
    opacity: 0;
  }
}

@keyframes play-thrust-line-top {
  0% {
    transform: translateX(-50%) scaleY(0);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) translateY(30px) scaleY(1.5);
    opacity: 0;
  }
}

@keyframes play-thrust-line-bottom {
  0% {
    transform: translateX(-50%) rotate(180deg) scaleY(0);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) rotate(180deg) translateY(30px) scaleY(1.5);
    opacity: 0;
  }
}

@keyframes play-thrust-line-left {
  0% {
    transform: translateY(-50%) rotate(-90deg) scaleY(0);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: translateY(-50%) rotate(-90deg) translateY(30px) scaleY(1.5);
    opacity: 0;
  }
}

@keyframes play-thrust-line-right {
  0% {
    transform: translateY(-50%) rotate(90deg) scaleY(0);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: translateY(-50%) rotate(90deg) translateY(30px) scaleY(1.5);
    opacity: 0;
  }
}

@keyframes card-thrust-pop {
  0%, 100% { transform: scale(1); }
  15% { transform: scale(0.93); }
  30% { transform: scale(1.06); }
  50% { transform: scale(0.98); }
  75% { transform: scale(1.02); }
}
</style>
