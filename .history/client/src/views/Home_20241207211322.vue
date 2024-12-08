<template>
  <div class="home">
    <h1>Welcome to Your Vue.js App</h1>
    <el-button type="primary" @click="testBackend">Test Backend Connection</el-button>
    <p v-if="message">{{ message }}</p>
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
</style> 