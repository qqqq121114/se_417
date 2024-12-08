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
    const response = await fetch('http://localhost:3000/api/users/profile', {
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
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  padding: 20px;
  background-color: #f5f5f5;
}

.profile-card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.info-item {
  margin-bottom: 20px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.info-item label {
  font-weight: bold;
  color: #666;
  margin-right: 10px;
}

.info-item span {
  color: #333;
}
</style> 