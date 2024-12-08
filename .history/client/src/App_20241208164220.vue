<template>
  <div class="app">
    <NavBar />
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
</script>

<style>
:root {
  --cyber-text: #ffb800;
  --cyber-glow: rgba(255, 184, 0, 0.5);
  --cyber-border: rgba(255, 184, 0, 0.3);
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Share Tech Mono', monospace;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  color: var(--cyber-text);
  min-height: 100vh;
}

.app {
  min-height: 100vh;
}

.main-content {
  padding-top: 60px;
  min-height: calc(100vh - 60px);
}

/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

::-webkit-scrollbar-thumb {
  background: var(--cyber-text);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--cyber-border);
}
</style>
