<template>
  <div class="register">
    <h1 class="cyber-title">Register</h1>
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
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" label="Password">
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="Enter your password (min 6 characters)"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword" label="Confirm Password">
          <el-input 
            v-model="form.confirmPassword" 
            type="password" 
            placeholder="Confirm your password"
            show-password
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

// 表单引用
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
    ElMessage.success('Validation passed!')
    console.log('Form validated successfully:', form)
  } catch (error) {
    ElMessage.error('Please check your input!')
    console.error('Validation failed')
  }
}
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

:deep(.el-form-item__label) {
  color: var(--cyber-text) !important;
  font-family: 'Share Tech Mono', monospace;
}

:deep(.el-input__inner) {
  background-color: rgba(0, 0, 0, 0.2) !important;
  border: 1px solid var(--cyber-border) !important;
  color: var(--cyber-text) !important;
  font-family: 'Share Tech Mono', monospace;
}

:deep(.el-input__inner:focus) {
  border-color: var(--cyber-text) !important;
  box-shadow: 0 0 10px var(--cyber-glow);
}

:deep(.el-form-item__error) {
  color: #ff4757 !important;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.9em;
  margin-top: 5px;
  text-shadow: 0 0 5px rgba(255, 71, 87, 0.3);
}

:deep(.el-form-item.is-error .el-input__inner) {
  border-color: #ff4757 !important;
  box-shadow: 0 0 10px rgba(255, 71, 87, 0.3);
}

.cyber-button {
  width: 100%;
  margin-top: 20px;
}
</style> 