<template>
  <div class="login" :key="Date.now()">
    <h1 class="cyber-title">Enter The Game</h1>
    <div class="login-form">
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="formRef" 
        label-position="top"
        status-icon
      >
        <el-form-item prop="username" label="Username">
          <el-input 
            v-model="form.username" 
            placeholder="Enter your username"
            class="cyber-input"
          >
            <template #prefix>
              <div class="input-icon">👤</div>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label="Password">
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="Enter your password"
            show-password
            class="cyber-input"
          >
            <template #prefix>
              <div class="input-icon">🔒</div>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="cyber-button" type="primary" @click="submitForm">LOGIN</el-button>
          <div class="form-footer">
            <span>Don't have an account?</span>
            <el-button 
              class="register-link" 
              type="text" 
              @click="$router.push('/register')"
            >
              Register Now
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const formRef = ref(null)

// 表单数据
const form = reactive({
  username: '',
  password: ''
})

// 验证规则
const rules = {
  username: [
    { required: true, message: 'Please enter your username', trigger: 'blur' },
    { min: 3, max: 20, message: 'Length should be 3 to 20 characters', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please enter your password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ]
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    console.log('Starting form validation...')
    await formRef.value.validate()
    console.log('Form validation passed')
    
    // 发送登录请求
    console.log('Sending login request...')
    const response = await axios.post('http://localhost:3000/api/users/login', {
      username: form.username,
      password: form.password
    })

    console.log('Login successful:', response.data)
    ElMessage.success('Login successful!')
    
    // 登录成功后跳转到首页
    setTimeout(() => {
      router.push('/')
    }, 1500)
  } catch (error) {
    console.error('Full error object:', error)
    
    if (error.response) {
      // 服务器返回的错误信息
      console.error('Server error:', error.response.data)
      ElMessage.error(error.response.data.message || 'Login failed')
    } else if (error.message) {
      // 表单验证错误
      console.error('Validation error:', error.message)
      ElMessage.error(error.message)
    } else {
      console.error('Unknown error:', error)
      ElMessage.error('Login failed')
    }
  }
}
</script>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  min-height: calc(100vh - 60px);
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
  user-select: none;
  text-align: center;
  line-height: 1.2;
  white-space: normal;
  word-wrap: break-word;
  padding: 0 20px;
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

.login-form {
  width: 100%;
  max-width: 500px;
  background: rgba(0, 0, 0, 0.4);
  padding: 40px;
  border-radius: 15px;
  border: 1px solid var(--cyber-border);
  box-shadow: 0 0 30px rgba(255, 184, 0, 0.15);
  backdrop-filter: blur(10px);
  animation: formGlow 4s ease-in-out infinite;
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

.el-form-item {
  margin-bottom: 30px;
}

:deep(.el-form-item__label) {
  color: var(--cyber-text) !important;
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.2em;
  padding-bottom: 12px;
  text-shadow: 0 0 10px var(--cyber-glow);
}

:deep(.el-input__wrapper) {
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
}

:deep(.el-input__inner) {
  background: rgba(0, 0, 0, 0.5) !important;
  border: 1px solid var(--cyber-border) !important;
  color: var(--cyber-text) !important;
  font-family: 'Share Tech Mono', monospace;
  height: 50px;
  padding: 0 20px 0 45px !important;
  font-size: 1.1em;
  transition: all 0.3s ease;
  letter-spacing: 0.05em;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2em;
  color: var(--cyber-text);
  opacity: 0.8;
  z-index: 2;
}

:deep(.el-input__inner:hover) {
  border-color: var(--cyber-text) !important;
  box-shadow: 0 0 15px var(--cyber-glow) !important;
}

:deep(.el-input__inner:focus) {
  border-color: var(--cyber-text) !important;
  box-shadow: 0 0 25px var(--cyber-glow) !important;
}

:deep(.el-input__suffix) {
  right: 15px;
}

:deep(.el-form-item__error) {
  color: #ff4757 !important;
  font-family: 'Share Tech Mono', monospace;
  font-size: 1em;
  margin-top: 8px;
  text-shadow: 0 0 8px rgba(255, 71, 87, 0.4);
}

:deep(.el-form-item.is-error .el-input__inner) {
  border-color: #ff4757 !important;
  box-shadow: 0 0 15px rgba(255, 71, 87, 0.4) !important;
}

.cyber-button {
  width: 100%;
  margin-top: 30px;
  height: 55px;
  font-size: 1.3em;
  letter-spacing: 0.15em;
  background: transparent !important;
  border: 1px solid var(--cyber-text) !important;
  color: var(--cyber-text) !important;
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.cyber-button:hover {
  background: var(--cyber-text) !important;
  color: var(--cyber-bg) !important;
  box-shadow: 0 0 30px var(--cyber-glow);
  transform: translateY(-2px);
}

.form-footer {
  margin-top: 20px;
  text-align: center;
  color: var(--cyber-text);
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.9em;
}

.register-link {
  color: var(--cyber-text) !important;
  text-decoration: none;
  margin-left: 10px;
  font-family: 'Share Tech Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
  font-size: 0.9em !important;
  padding: 0 !important;
  height: auto !important;
  font-weight: normal !important;
}

.register-link:hover {
  text-shadow: 0 0 10px var(--cyber-glow);
  transform: translateY(-1px);
  opacity: 0.9;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cyber-title {
    font-size: 8vw;
    width: 90vw;
    padding: 0 10px;
  }

  .login-form {
    padding: 25px;
  }

  :deep(.el-form-item__label) {
    font-size: 1.1em;
  }

  :deep(.el-input__inner) {
    height: 45px;
    font-size: 1em;
  }

  .cyber-button {
    height: 50px;
    font-size: 1.2em;
  }

  .form-footer {
    font-size: 0.8em;
  }

  .register-link {
    font-size: 0.8em !important;
  }
}
</style> 