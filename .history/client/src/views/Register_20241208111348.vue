<template>
  <div class="register">
    <h1 class="cyber-title">Register</h1>
    <div class="register-form">
      <el-form>
        <el-form-item>
          <el-input v-model="username" placeholder="Username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="password" type="password" placeholder="Password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="cyber-button" type="primary">Register</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')
</script>

<style scoped>
.register {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

.cyber-title {
  font-size: 3em;
  color: var(--cyber-text);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 40px;
  text-shadow: 0 0 20px var(--cyber-glow);
  user-select: none;
}

.register-form {
  width: 100%;
  max-width: 400px;
}

.el-form-item {
  margin-bottom: 20px;
}
</style> 