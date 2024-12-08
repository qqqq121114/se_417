<template>
  <div class="home">
    <!-- 背景动画元素 -->
    <div class="cyber-grid"></div>
    <div class="cyber-lines"></div>
    <div class="cyber-glow"></div>
    
    <!-- 主要内容 -->
    <div class="content">
      <h1 class="cyber-glitch-2">Welcome to CyberGame</h1>
      <p class="cyber-text">Enter the virtual realm</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home {
  height: calc(100vh - 60px);
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--cyber-text);
}

/* 网格背景 */
.cyber-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(var(--cyber-text) 1px, transparent 1px),
    linear-gradient(90deg, var(--cyber-text) 1px, transparent 1px);
  background-size: 50px 50px;
  background-position: center center;
  opacity: 0.1;
  animation: gridMove 20s linear infinite;
}

/* 动态线条 */
.cyber-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.cyber-lines::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 184, 0, 0.1) 1%,
    transparent 2%,
    transparent 3%
  );
  animation: linesMove 10s linear infinite;
}

/* 发光效果 */
.cyber-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200vw;
  height: 200vh;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle at center,
    rgba(255, 184, 0, 0.1) 0%,
    transparent 60%
  );
  animation: glowPulse 4s ease-in-out infinite;
}

/* 内容样式 */
.content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 20px;
}

.cyber-glitch-2 {
  font-size: 4em;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 20px;
  position: relative;
  text-shadow: 
    2px 2px 0px #ff0000,
    -2px -2px 0px #00ff00;
  animation: glitch 3s infinite;
}

.cyber-text {
  font-size: 1.5em;
  letter-spacing: 0.2em;
  opacity: 0.8;
  text-shadow: 0 0 10px var(--cyber-glow);
  animation: breathe 3s ease-in-out infinite;
}

/* 动画定义 */
@keyframes gridMove {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(50px);
  }
}

@keyframes linesMove {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes glitch {
  0% {
    text-shadow: 
      2px 2px 0px #ff0000,
      -2px -2px 0px #00ff00;
  }
  25% {
    text-shadow: 
      -2px 2px 0px #ff0000,
      2px -2px 0px #00ff00;
  }
  50% {
    text-shadow: 
      2px -2px 0px #ff0000,
      -2px 2px 0px #00ff00;
  }
  75% {
    text-shadow: 
      -2px -2px 0px #ff0000,
      2px 2px 0px #00ff00;
  }
  100% {
    text-shadow: 
      2px 2px 0px #ff0000,
      -2px -2px 0px #00ff00;
  }
}

@keyframes breathe {
  0%, 100% {
    text-shadow: 0 0 10px var(--cyber-glow);
    transform: scale(1);
  }
  50% {
    text-shadow: 0 0 20px var(--cyber-glow), 0 0 30px var(--cyber-glow);
    transform: scale(1.02);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cyber-glitch-2 {
    font-size: 2.5em;
  }

  .cyber-text {
    font-size: 1.2em;
  }
}
</style> 