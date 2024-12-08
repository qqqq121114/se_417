<template>
  <div id="app" class="cyber-theme">
    <nav class="cyber-nav">
      <router-link to="/" class="nav-brand">CyberGame</router-link>
      <div class="nav-links">
        <router-link to="/register" class="cyber-button">Register</router-link>
        <router-link to="/login" class="cyber-button">Login</router-link>
      </div>
    </nav>
    <el-main>
      <router-view></router-view>
    </el-main>
  </div>
</template>

<script setup>
import { ElMain } from 'element-plus'
import 'element-plus/dist/index.css'
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

/* 重置默认样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --cyber-text: #ffb800;
  --cyber-glow: rgba(255, 184, 0, 0.5);
  --cyber-border: rgba(255, 184, 0, 0.3);
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  font-family: 'Share Tech Mono', monospace;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  color: var(--cyber-text);
}

#app {
  height: 100vh;
  overflow: hidden;
}

.main-content {
  height: calc(100vh - 60px);
  margin-top: 60px;
  overflow: hidden;
}

.cyber-theme {
  background: var(--cyber-bg);
  min-height: 100vh;
  width: 100%;
}

.el-main {
  padding: 20px;
  background: var(--cyber-bg);
  margin: 0;
  margin-top: 60px;
}

/* 导航栏样式 */
.cyber-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--cyber-text);
  box-shadow: 0 0 20px rgba(255, 184, 0, 0.15);
  z-index: 1000;
}

.nav-brand {
  font-size: 1.8em;
  color: var(--cyber-text);
  text-decoration: none;
  font-family: 'Share Tech Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow: 0 0 10px var(--cyber-glow);
  transition: all 0.3s ease;
}

.nav-brand:hover {
  text-shadow: 0 0 20px var(--cyber-glow);
  transform: scale(1.05);
}

.nav-links {
  display: flex;
  gap: 20px;
}

.cyber-button {
  padding: 8px 20px;
  background: rgba(255, 184, 0, 0.1);
  border: 1px solid var(--cyber-text);
  color: var(--cyber-text);
  text-decoration: none;
  font-family: 'Share Tech Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.9em;
  transition: all 0.3s ease;
  border-radius: 4px;
  backdrop-filter: blur(5px);
  position: relative;
  overflow: hidden;
}

.cyber-button::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 184, 0, 0.1),
    transparent
  );
  transform: rotate(45deg);
  transition: all 0.3s ease;
  opacity: 0;
}

.cyber-button:hover {
  background: rgba(255, 184, 0, 0.2);
  box-shadow: 0 0 20px rgba(255, 184, 0, 0.3);
  transform: translateY(-2px);
}

.cyber-button:hover::before {
  animation: shine 1s;
  opacity: 1;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

/* Element Plus 全局样式 */
.el-button {
  background: transparent !important;
  border: 1px solid var(--cyber-text) !important;
  color: var(--cyber-text) !important;
  font-family: 'Share Tech Mono', monospace !important;
  transition: all 0.3s ease;
}

.el-button:hover {
  background: var(--cyber-glow) !important;
  color: #fff !important;
  box-shadow: 0 0 10px var(--cyber-glow);
}

/* 卡片样式 */
.el-card {
  background: rgba(0, 0, 0, 0.2) !important;
  border: 1px solid var(--cyber-border) !important;
  backdrop-filter: blur(5px);
}

.el-card__header {
  border-bottom: 1px solid var(--cyber-border) !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cyber-nav {
    padding: 0 15px;
  }

  .nav-brand {
    font-size: 1.4em;
  }

  .cyber-button {
    padding: 6px 15px;
    font-size: 0.8em;
  }
}
</style>
