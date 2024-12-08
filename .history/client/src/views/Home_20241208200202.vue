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
.home-container {
  min-height: 100vh;
  padding: 2rem;
  background: #1a1a1a;  /* 深色背景 */
  background-image: 
    linear-gradient(45deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(-45deg, rgba(255, 0, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  position: relative;
  overflow: hidden;
}

/* 添加动态光效 */
.home-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(255, 0, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
  animation: glowPulse 8s infinite alternate;
}

/* 网格线动画 */
@keyframes glowPulse {
  0% {
    opacity: 0.5;
    transform: scale(1);
  }
  100% {
    opacity: 1;
    transform: scale(1.1);
  }
}

/* 内容容器 */
.content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 可选：添加霓虹边框效果 */
.card {
  background: rgba(26, 26, 26, 0.8);
  border: 1px solid #00ffff;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(5px);
}

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
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.cyber-glitch-2 {
  font-size: 4em;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 20px;
  font-family: 'Orbitron', sans-serif;
}

.cyber-text {
  font-size: 1.5em;
  letter-spacing: 0.2em;
  opacity: 0.8;
  text-shadow: 0 0 10px var(--cyber-glow);
  font-family: 'Orbitron', sans-serif;
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