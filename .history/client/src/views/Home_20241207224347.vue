<template>
  <div class="home">
    <h1 class="title">欢迎来到1000我的Vue应用</h1>
    <div class="content">
      <el-card class="welcome-card">
        <template #header>
          <div class="card-header">
            <h3>测试功能区</h3>
          </div>
        </template>
        <el-button type="primary" @click="testBackend">测试后端连接</el-button>
        <p v-if="message" class="message">{{ message }}</p>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const message = ref('')

const testBackend = async () => {
  try {
    const response = await axios.get('http://localhost:3000')
    message.value = response.data.message
  } catch (error) {
    message.value = 'Error connecting to backend'
    console.error('Error:', error)
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
  text-align: center;
}

.title {
  color: #409EFF;
  font-size: 2.5em;
  margin-bottom: 30px;
}

.content {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.welcome-card {
  margin-top: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message {
  margin-top: 20px;
  padding: 10px;
  background-color: #f0f9eb;
  border-radius: 4px;
  color: #67c23a;
}
</style> 