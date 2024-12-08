<template>
  <div class="register">
    <h1 class="cyber-title">Start The Game Journey！</h1>
    <div class="register-form">
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
            placeholder="Enter your username (3-20 characters)"
            class="cyber-input"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" label="Password">
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="Enter your password (min 6 characters)"
            show-password
            class="cyber-input"
          ></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword" label="Confirm Password">
          <el-input 
            v-model="form.confirmPassword" 
            type="password" 
            placeholder="Confirm your password"
            show-password
            class="cyber-input"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="cyber-button" type="primary" @click="submitForm">Register</el-button>
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
  password: '',
  confirmPassword: ''
})

// 验证规则
const rules = {
  username: [
    { required: true, message: 'Please enter your username', trigger: 'blur' },
    { min: 3, max: 20, message: 'Length should be 3 to 20 characters', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: 'Only letters, numbers and underscore allowed', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please enter your password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' },
    { 
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
      message: 'Password must contain both letters and numbers',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm your password', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error('Passwords do not match!'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    // 发送注册请求
    const response = await axios.post('http://localhost:3000/api/users/register', {
      username: form.username,
      password: form.password
    })

    ElMessage.success('Registration successful!')
    console.log('User registered:', response.data)
    
    // 注册成功后跳转到首页
    setTimeout(() => {
      router.push('/')
    }, 1500)
  } catch (error) {
    if (error.response) {
      // 服务器返回的错误信息
      ElMessage.error(error.response.data.message || 'Registration failed')
    } else if (error.message) {
      // 表单验证错误
      ElMessage.error('Please check your input!')
    } else {
      ElMessage.error('Registration failed')
    }
    console.error('Registration error:', error)
  }
}
</script>

<style scoped>
.register {
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  overflow: hidden;
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

.register-form {
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
  border: none !important;
}

:deep(.el-input__inner) {
  background: rgba(18, 18, 18, 0.95) !important;
  border: 1px solid var(--cyber-text) !important;
  color: var(--cyber-text) !important;
  font-family: 'Share Tech Mono', monospace;
  height: 50px;
  padding: 0 20px !important;
  font-size: 1.1em;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
  border-radius: 4px;
  caret-color: var(--cyber-text);
  text-shadow: 0 0 10px rgba(255, 184, 0, 0.3);
}

:deep(.el-input__inner::placeholder) {
  color: rgba(255, 184, 0, 0.3) !important;
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 0.05em;
}

:deep(.el-input__inner:hover) {
  border-color: var(--cyber-text) !important;
  box-shadow: 0 0 15px var(--cyber-glow) !important;
  background: rgba(26, 26, 26, 0.95) !important;
}

:deep(.el-input__inner:focus) {
  border-color: var(--cyber-text) !important;
  box-shadow: 0 0 25px var(--cyber-glow) !important;
  background: rgba(26, 26, 26, 0.95) !important;
  animation: inputPulse 1.5s infinite;
}

@keyframes inputPulse {
  0% {
    box-shadow: 0 0 25px var(--cyber-glow);
  }
  50% {
    box-shadow: 0 0 35px var(--cyber-glow);
  }
  100% {
    box-shadow: 0 0 25px var(--cyber-glow);
  }
}

:deep(.el-input__suffix) {
  right: 15px !important;
}

:deep(.el-input__suffix-inner) {
  color: var(--cyber-text) !important;
  opacity: 0.8;
  transition: all 0.3s ease;
}

:deep(.el-input__suffix-inner:hover) {
  opacity: 1;
  text-shadow: 0 0 10px var(--cyber-glow);
}

:deep(.el-input.is-focus .el-input__wrapper) {
  box-shadow: none !important;
}

:deep(.el-form-item.is-error .el-input__inner) {
  border-color: #ff4757 !important;
  box-shadow: 0 0 15px rgba(255, 71, 87, 0.4) !important;
  animation: errorPulse 1.5s infinite;
}

@keyframes errorPulse {
  0% {
    box-shadow: 0 0 15px rgba(255, 71, 87, 0.4);
  }
  50% {
    box-shadow: 0 0 25px rgba(255, 71, 87, 0.6);
  }
  100% {
    box-shadow: 0 0 15px rgba(255, 71, 87, 0.4);
  }
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

/* 响应式设计 */
@media (max-width: 768px) {
  .cyber-title {
    font-size: 8vw;
    width: 90vw;
    padding: 0 10px;
  }

  .register-form {
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
}
</style> 