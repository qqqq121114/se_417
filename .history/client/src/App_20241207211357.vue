<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-menu mode="horizontal" router>
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.el-header {
  padding: 0;
}

.el-main {
  padding: 20px;
}
</style>
