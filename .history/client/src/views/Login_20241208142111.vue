<template>
  <div class="login">
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
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" label="Password" class="password-item">
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="Enter your password"
            show-password
            class="cyber-input"
          ></el-input>
        </el-form-item>
        <el-form-item class="button-item">
          <el-button class="cyber-button" type="primary" @click="submitForm">Login</el-button>
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

.login-form {
  width: 100%;
  max-width: 500px;
  background: rgba(0, 0, 0, 0.4);
  padding: 50px;
  border-radius: 15px;
  border: 1px solid var(--cyber-border);
  box-shadow: 0 0 30px rgba(255, 184, 0, 0.15);
  backdrop-filter: blur(10px);
  animation: formGlow 4s ease-in-out infinite;
}

.el-form-item {
  margin-bottom: 35px;
}

.password-item {
  margin-bottom: 45px;
}

:deep(.el-form-item__label) {
  color: #ffb800 !important;
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.2em;
  padding-bottom: 15px;
  text-shadow: 0 0 10px rgba(255, 184, 0, 0.5);
  text-transform: capitalize;
  letter-spacing: 0.1em;
  margin-left: 5px;
}

:deep(.el-form-item__label::before) {
  content: '*';
  color: #ff4757;
  margin-right: 4px;
  text-shadow: 0 0 10px rgba(255, 71, 87, 0.6);
}

:deep(.el-input__wrapper) {
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
  border: none !important;
}

:deep(.el-input__inner) {
  background: rgba(18, 18, 18, 0.95) !important;
  border: 2px solid var(--cyber-text) !important;
  color: #ffb800 !important;
  font-family: 'Share Tech Mono', monospace;
  height: 55px;
  padding: 0 25px !important;
  font-size: 1.2em;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
  border-radius: 8px;
  caret-color: #ffb800;
  text-shadow: 0 0 10px rgba(255, 184, 0, 0.3);
  box-shadow: inset 0 0 15px rgba(255, 184, 0, 0.1);
}

:deep(.el-input__inner::placeholder) {
  color: rgba(255, 184, 0, 0.3) !important;
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

:deep(.el-input__inner:hover) {
  border-color: #ffb800 !important;
  box-shadow: inset 0 0 20px rgba(255, 184, 0, 0.2),
              0 0 15px rgba(255, 184, 0, 0.3) !important;
  background: rgba(28, 28, 28, 0.95) !important;
}

:deep(.el-input__inner:focus) {
  border-color: #ffb800 !important;
  box-shadow: inset 0 0 25px rgba(255, 184, 0, 0.3),
              0 0 25px rgba(255, 184, 0, 0.4) !important;
  background: rgba(22, 22, 22, 0.95) !important;
  animation: inputPulse 1.5s infinite;
}

@keyframes inputPulse {
  0% {
    box-shadow: inset 0 0 25px rgba(255, 184, 0, 0.2),
                0 0 25px rgba(255, 184, 0, 0.3);
  }
  50% {
    box-shadow: inset 0 0 35px rgba(255, 184, 0, 0.3),
                0 0 35px rgba(255, 184, 0, 0.4);
  }
  100% {
    box-shadow: inset 0 0 25px rgba(255, 184, 0, 0.2),
                0 0 25px rgba(255, 184, 0, 0.3);
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

.button-item {
  margin-top: 20px;
  margin-bottom: 0;
}

.cyber-button {
  width: 100%;
  height: 60px;
  font-size: 1.3em;
  letter-spacing: 0.15em;
  margin-bottom: 25px;
  background: transparent !important;
  border: 1px solid var(--cyber-text) !important;
  color: var(--cyber-text) !important;
  font-family: 'Share Tech Mono', monospace;
  transition: all 0.3s ease;
  text-transform: uppercase;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.cyber-button:hover {
  background: var(--cyber-text) !important;
  color: #1a1a1a !important;
  box-shadow: 0 0 30px var(--cyber-glow);
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
    rgba(255, 184, 0, 0.1),
    transparent,
    transparent
  );
  transform: rotate(45deg);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

.form-footer {
  margin-top: 20px;
  text-align: center;
  color: var(--cyber-text);
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.95em;
  opacity: 0.8;
}

.register-link {
  color: var(--cyber-text) !important;
  margin-left: 20px;
  font-family: 'Share Tech Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.95em !important;
  padding: 1 !important;
  height: auto !important;
  border: 1000 !important;
}

.register-link:hover {
  text-shadow: 0 0 10px var(--cyber-glow);
  opacity: 1;
}

:deep(.el-form-item__error) {
  color: #ff4757 !important;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.9em;
  margin-top: 8px;
  text-shadow: 0 0 8px rgba(255, 71, 87, 0.4);
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

/* 响应式设计 */
@media (max-width: 768px) {
  .cyber-title {
    font-size: 8vw;
    width: 90vw;
  }

  .login-form {
    padding: 30px;
    margin: 0 15px;
  }

  .label-text {
    font-size: 1em;
  }

  :deep(.el-input__inner) {
    height: 50px;
    font-size: 1.1em;
  }

  .cyber-button {
    height: 55px;
  }

  .form-footer {
    font-size: 0.75em;
  }

  .register-link {
    font-size: 0.75em !important;
  }
}
</style> 