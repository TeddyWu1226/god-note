<template>
  <div class="impact-magic">
    <div class="magic-circle"></div>
    <div class="magic-burst"></div>
  </div>
</template>

<style scoped>
.impact-magic {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 242, 254, 0.06);
}

.magic-circle {
  position: absolute;
  width: 80px;
  height: 80px;
  border: 2px dashed #00f2fe;
  border-radius: 50%;
  box-shadow: 0 0 15px #00f2fe;
  transform: scale(0) rotate(0deg);
  opacity: 0;
  animation: magic-circle-spin 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.magic-burst {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 25px 12px #7f00ff, 0 0 45px 22px #00f2fe;
  transform: scale(0);
  opacity: 0;
  animation: magic-burst-explode 0.6s ease-out 0.25s forwards;
}

@keyframes magic-circle-spin {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    transform: scale(1.15) rotate(180deg);
    opacity: 0;
  }
}

@keyframes magic-burst-explode {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: scale(14);
    opacity: 0;
  }
}
</style>
