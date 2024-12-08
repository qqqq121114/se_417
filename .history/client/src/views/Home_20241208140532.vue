<template>
  <div class="home">
    <header class="cyber-header">
      <h1 class="welcome-text">Welcome Back, {{ username }}</h1>
      <el-button class="cyber-button logout-btn" @click="handleLogout">
        Logout
      </el-button>
    </header>

    <div class="main-content">
      <div class="stats-panel">
        <div class="stat-card">
          <h3>Player Level</h3>
          <div class="stat-value">{{ playerStats.level }}</div>
        </div>
        <div class="stat-card">
          <h3>Experience</h3>
          <div class="stat-value">{{ playerStats.exp }}/{{ playerStats.nextLevel }}</div>
        </div>
        <div class="stat-card">
          <h3>Credits</h3>
          <div class="stat-value">{{ playerStats.credits }}</div>
        </div>
      </div>

      <div class="action-panel">
        <el-button class="cyber-button action-btn" @click="startMission">
          Start Mission
        </el-button>
        <el-button class="cyber-button action-btn" @click="openInventory">
          Inventory
        </el-button>
        <el-button class="cyber-button action-btn" @click="openShop">
          Shop
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const username = ref('Cyberpunk') // 这里应该从用户状态获取

// 模拟的玩家数据
const playerStats = ref({
  level: 1,
  exp: 750,
  nextLevel: 1000,
  credits: 5000
})

// 登出处理
const handleLogout = () => {
  // 这里添加登出逻辑
  ElMessage.success('Logged out successfully')
  router.push('/login')
}

// 功能按钮处理函数
const startMission = () => {
  ElMessage.info('Mission system coming soon...')
}

const openInventory = () => {
  ElMessage.info('Inventory system coming soon...')
}

const openShop = () => {
  ElMessage.info('Shop system coming soon...')
}

onMounted(() => {
  // 这里可以添加页面加载时的初始化逻辑
  console.log('Home page mounted')
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  padding: 40px;
  background: var(--cyber-bg);
  color: var(--cyber-text);
}

.cyber-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--cyber-border);
  border-radius: 15px;
  box-shadow: 0 0 30px rgba(255, 184, 0, 0.15);
}

.welcome-text {
  font-size: 2.5em;
  color: var(--cyber-text);
  text-shadow: 0 0 20px var(--cyber-glow);
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 0.1em;
  margin: 0;
  animation: textPulse 3s infinite;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.stats-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.stat-card {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--cyber-border);
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 0 30px rgba(255, 184, 0, 0.15);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 40px rgba(255, 184, 0, 0.25);
}

.stat-card h3 {
  color: var(--cyber-text);
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.2em;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow: 0 0 10px var(--cyber-glow);
}

.stat-value {
  font-size: 2em;
  color: #ffb800;
  font-family: 'Share Tech Mono', monospace;
  text-shadow: 0 0 15px rgba(255, 184, 0, 0.5);
  animation: valuePulse 2s infinite;
}

.action-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.cyber-button {
  background: transparent !important;
  border: 2px solid var(--cyber-text) !important;
  color: var(--cyber-text) !important;
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.2em;
  letter-spacing: 0.1em;
  padding: 20px !important;
  transition: all 0.3s ease;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
}

.cyber-button:hover {
  background: var(--cyber-text) !important;
  color: var(--cyber-bg) !important;
  box-shadow: 0 0 30px var(--cyber-glow);
  transform: translateY(-2px);
}

.logout-btn {
  padding: 10px 30px !important;
  font-size: 1em;
}

@keyframes textPulse {
  0% {
    text-shadow: 0 0 20px var(--cyber-glow);
  }
  50% {
    text-shadow: 0 0 40px var(--cyber-glow);
  }
  100% {
    text-shadow: 0 0 20px var(--cyber-glow);
  }
}

@keyframes valuePulse {
  0% {
    text-shadow: 0 0 15px rgba(255, 184, 0, 0.5);
  }
  50% {
    text-shadow: 0 0 25px rgba(255, 184, 0, 0.7);
  }
  100% {
    text-shadow: 0 0 15px rgba(255, 184, 0, 0.5);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home {
    padding: 20px;
  }

  .welcome-text {
    font-size: 1.8em;
  }

  .cyber-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .stats-panel {
    grid-template-columns: 1fr;
  }

  .action-panel {
    grid-template-columns: 1fr;
  }
}
</style> 