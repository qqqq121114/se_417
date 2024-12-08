<template>
  <div class="home">
    <div class="welcome-container">
      <h1 class="cyber-title">Welcome!</h1>
      <div class="button-group">
        <el-button class="cyber-button" size="large">REGISTER</el-button>
        <el-button class="cyber-button" size="large">LOGIN</el-button>
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
  min-height: calc(100vh - 60px);
  padding: 20px;
}

.welcome-container {
  text-align: center;
  width: 70vw;
}

.cyber-title {
  font-size: 10vw;
  color: var(--cyber-text);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 5vh;
  text-shadow: 0 0 20px var(--cyber-glow);
  animation: glow 1.5s ease-in-out infinite alternate;
  line-height: 1.2;
  font-family: 'Share Tech Mono', monospace;
}

.button-group {
  display: flex;
  gap: 3vw;
  justify-content: center;
}

.cyber-button {
  font-size: 2vw !important;
  padding: 2vh 3vw !important;
  min-width: 15vw !important;
  font-family: 'Share Tech Mono', monospace !important;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  height: auto !important;
  line-height: 1.5 !important;
}

@keyframes glow {
  from {
    text-shadow: 0 0 20px var(--cyber-glow), 0 0 40px var(--cyber-glow);
  }
  to {
    text-shadow: 0 0 40px var(--cyber-glow), 0 0 60px var(--cyber-glow);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cyber-title {
    font-size: 15vw;
  }

  .button-group {
    flex-direction: column;
    align-items: center;
    gap: 3vh;
  }

  .cyber-button {
    width: 60vw !important;
    font-size: 5vw !important;
    padding: 2vh 4vw !important;
  }
}
</style> 