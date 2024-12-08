<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userInfo = ref({
  username: '',
  email: '',
  createdAt: ''
})

onMounted(async () => {
  // 检查是否有登录token
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/login')
    return
  }

  try {
    // 获取用户信息
    const response = await fetch('http://localhost:3001/api/users/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) {
      throw new Error('获取用户信息失败')
    }
    const data = await response.json()
    userInfo.value = data
  } catch (error) {
    console.error('获取用户信息失败:', error)
    router.push('/login')
  }
})
</script>

<template>
  <div class="profile-container">
    <div class="profile-card">
      <h2>个人信息</h2>
      <div class="info-item">
        <label>用户名：</label>
        <span>{{ userInfo.username }}</span>
      </div>
      <div class="info-item">
        <label>邮箱：</label>
        <span>{{ userInfo.email }}</span>
      </div>
      <div class="info-item">
        <label>注册时间：</label>
        <span>{{ new Date(userInfo.createdAt).toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  color: var(--cyber-text);
}

.cyber-title {
  font-size: 4vw;
  width: 60vw;
  color: var(--cyber-text);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 40px;
  text-shadow: 0 0 20px var(--cyber-glow);
  animation: breathe 3s ease-in-out infinite;
  text-align: center;
  line-height: 1.2;
}

.profile-card {
  background: rgba(0, 0, 0, 0.7);
  padding: 30px;
  border-radius: 15px;
  width: 100%;
  max-width: 800px;
  border: 1px solid var(--cyber-text);
  box-shadow: 0 0 30px rgba(255, 184, 0, 0.15);
  backdrop-filter: blur(10px);
  animation: formGlow 4s ease-in-out infinite;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 2px solid var(--cyber-text);
  padding-bottom: 20px;
}

.header-icon {
  width: 50px;
  height: 50px;
  background: var(--cyber-text);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  animation: pulse 2s infinite;
}

.icon {
  font-size: 24px;
  color: #000;
}

h2 {
  color: var(--cyber-text);
  font-size: 2em;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
  text-shadow: 0 0 10px var(--cyber-glow);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.info-item {
  position: relative;
  padding: 20px;
  background: rgba(255, 184, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.info-label {
  color: var(--cyber-text);
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 10px;
  opacity: 0.8;
}

.info-value {
  color: #fff;
  font-size: 1.2em;
  font-family: 'Share Tech Mono', monospace;
  text-shadow: 0 0 10px rgba(255, 184, 0, 0.5);
}

.info-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  background: var(--cyber-text);
  clip-path: polygon(100% 0, 0 0, 100% 100%);
}

.card-footer {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.cyber-button {
  width: 200px;
  height: 50px;
  font-size: 1.1em;
  letter-spacing: 0.15em;
  background: transparent;
  border: 1px solid #ff4757;
  color: #ff4757;
  text-transform: uppercase;
  font-family: 'Share Tech Mono', monospace;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.cyber-button:hover {
  background: #ff4757;
  color: #000;
  box-shadow: 0 0 30px rgba(255, 71, 87, 0.5);
  transform: translateY(-2px);
}

.cyber-button::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 71, 87, 0.1),
    transparent,
    transparent
  );
  transform: rotate(45deg);
  animation: shine 3s infinite;
}

@keyframes breathe {
  0% {
    text-shadow: 0 0 20px var(--cyber-glow);
    transform: scale(1);
  }
  50% {
    text-shadow: 0 0 40px var(--cyber-glow), 0 0 60px var(--cyber-glow);
    transform: scale(1.02);
  }
  100% {
    text-shadow: 0 0 20px var(--cyber-glow);
    transform: scale(1);
  }
}

@keyframes formGlow {
  0% {
    box-shadow: 0 0 30px rgba(255, 184, 0, 0.15);
  }
  50% {
    box-shadow: 0 0 50px rgba(255, 184, 0, 0.25);
  }
  100% {
    box-shadow: 0 0 30px rgba(255, 184, 0, 0.15);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 184, 0, 0.4);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(255, 184, 0, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 184, 0, 0);
  }
}

@keyframes shine {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cyber-title {
    font-size: 8vw;
    width: 90vw;
  }

  .profile-card {
    padding: 20px;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  h2 {
    font-size: 1.5em;
  }

  .header-icon {
    width: 40px;
    height: 40px;
  }

  .icon {
    font-size: 20px;
  }
}
</style> 