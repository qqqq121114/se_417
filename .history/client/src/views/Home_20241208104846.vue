<template>
  <div class="home">
    <div class="welcome-container">
      <h1 class="cyber-title">Welcome!</h1>
      <div class="button-group">
        <el-button class="cyber-button" size="large">注册</el-button>
        <el-button class="cyber-button" size="large">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px); /* 减去头部导航的高度 */
  padding: 20px;
}

.welcome-container {
  text-align: center;
}

.cyber-title {
  font-size: 4em;
  color: var(--cyber-text);
  text-transform: uppercase;
  letter-spacing: 4px;
  margin-bottom: 40px;
  text-shadow: 0 0 20px var(--cyber-glow);
  animation: glow 1.5s ease-in-out infinite alternate;
}

.button-group {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.cyber-button {
  font-size: 1.2em;
  padding: 15px 40px;
  min-width: 150px;
}

@keyframes glow {
  from {
    text-shadow: 0 0 10px var(--cyber-glow), 0 0 20px var(--cyber-glow);
  }
  to {
    text-shadow: 0 0 20px var(--cyber-glow), 0 0 30px var(--cyber-glow);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cyber-title {
    font-size: 3em;
  }

  .button-group {
    flex-direction: column;
    align-items: center;
  }

  .cyber-button {
    width: 200px;
  }
}
</style> 