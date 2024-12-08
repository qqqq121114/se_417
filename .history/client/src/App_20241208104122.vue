<template>
  <div id="app" class="cyber-theme">
    <el-container>
      <el-header>
        <el-menu mode="horizontal" router class="cyber-menu">
          <el-menu-item index="/">Home</el-menu-item>
          <el-menu-item index="/about">About</el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ElContainer, ElHeader, ElMain, ElMenu, ElMenuItem } from 'element-plus'
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

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  background-color: var(--cyber-bg);
}

:root {
  --cyber-bg: #1a1a1a;
  --cyber-text: #FFB800;
  --cyber-glow: #FFB80033;
  --cyber-border: #333333;
}

#app {
  font-family: 'Share Tech Mono', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--cyber-text);
  background-color: var(--cyber-bg);
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
}

.cyber-theme {
  background: var(--cyber-bg);
  min-height: 100vh;
  width: 100%;
}

.el-container {
  min-height: 100vh;
  margin: 0;
  padding: 0;
}

.el-header {
  padding: 0;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid var(--cyber-border);
  margin: 0;
}

.el-main {
  padding: 20px;
  background: var(--cyber-bg);
  margin: 0;
}

.cyber-menu {
  background: transparent !important;
  border: none !important;
  margin: 0;
  padding: 0;
}

.el-menu--horizontal > .el-menu-item {
  color: var(--cyber-text) !important;
  font-family: 'Share Tech Mono', monospace !important;
  border: none !important;
}

.el-menu--horizontal > .el-menu-item:hover,
.el-menu--horizontal > .el-menu-item:focus,
.el-menu--horizontal > .el-menu-item.is-active {
  color: #fff !important;
  background: var(--cyber-glow) !important;
  border: none !important;
}

/* 全局按钮样式 */
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
</style>
