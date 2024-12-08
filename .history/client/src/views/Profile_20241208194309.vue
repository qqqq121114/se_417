<template>
  <div class="profile-container">
    <!-- 左侧个人信息面板 -->
    <div class="profile-panel">
      <div class="avatar-section">
        <img :src="defaultAvatar" alt="avatar" class="avatar" />
      </div>

      <div class="info-section">
        <h2>{{ userInfo.username }}</h2>
        <p class="join-date">加入时间：{{ formatDate(userInfo.createdAt) }}</p>
        
        <el-form ref="profileForm" :model="form" label-position="top">
          <el-form-item label="邮箱">
            <el-input 
              v-model="form.email" 
              placeholder="请输入邮箱"
              clearable
            />
          </el-form-item>
          
          <el-form-item label="个人简介">
            <el-input
              v-model="form.bio"
              type="textarea"
              :rows="4"
              placeholder="写点什么介绍自己..."
              maxlength="200"
              show-word-limit
              resize="none"
            />
          </el-form-item>

          <el-button type="primary" @click="updateProfile" :loading="updating">保存修改</el-button>
        </el-form>
      </div>

      <div class="settings-section">
        <h3>个性化设置</h3>
        <el-form :model="settingsForm" label-position="top" >
          <el-form-item label="主题">
            <el-select v-model="settingsForm.theme" @change="updateSettings">
              <el-option label="赛博朋克" value="cyberpunk" />
              <el-option label="明亮" value="light" />
              <el-option label="暗黑" value="dark" />
            </el-select>
          </el-form-item>

          <el-form-item label="通知">
            <el-switch
              v-model="settingsForm.notifications"
              @change="updateSettings"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 右侧笔记面板 -->
    <div class="notes-panel">
      <div class="notes-header">
        <h2>我的笔记</h2>
        <el-button type="primary" @click="showCreateNoteDialog">新建笔记</el-button>
      </div>

      <div class="notes-list">
        <el-card v-for="note in notes" :key="note._id" class="note-card">
          <template #header>
            <div class="note-header">
              <h3>{{ note.title }}</h3>
              <div class="note-actions">
                <el-button type="text" @click="editNote(note)">编辑</el-button>
                <el-button type="text" class="delete-btn" @click="deleteNote(note._id)">删除</el-button>
              </div>
            </div>
          </template>
          <div class="note-content">
            {{ note.content }}
          </div>
          <div class="note-footer">
            <span>更新于：{{ formatDate(note.updatedAt) }}</span>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 新建/编辑笔记对话框 -->
    <el-dialog
      :title="noteDialog.isEdit ? '编辑笔记' : '新建笔记'"
      v-model="noteDialog.visible"
      width="50%"
    >
      <el-form ref="noteForm" :model="noteDialog.form" label-position="top">
        <el-form-item label="标题" :rules="[{ required: true, message: '请输入标题' }]">
          <el-input v-model="noteDialog.form.title" placeholder="请输入标题" />
        </el-form-item>
        
        <el-form-item label="内容" :rules="[{ required: true, message: '请输入内容' }]">
          <el-input
            v-model="noteDialog.form.content"
            type="textarea"
            :rows="6"
            placeholder="写下你的想法..."
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="noteDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="saveNote">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加请求拦截器
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

const router = useRouter()
const userInfo = ref({})
const notes = ref([])

const updating = ref(false)

// 使用 reactive 来管理表单数据
const form = reactive({
  email: '',
  bio: ''
})

const settingsForm = ref({
  theme: 'cyberpunk',
  notifications: true
})

const noteDialog = ref({
  visible: false,
  isEdit: false,
  form: {
    title: '',
    content: '',
    noteId: null
  }
})

// 使用 base64 编码的默认头像
const defaultAvatar = ref('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzk5OSIgZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MyLjY3IDAgNC41NCAyLjU4IDQuNSA1LjQ1IDAgMi45NS0xLjgzIDUuNDUtNC41IDUuNDVzLTQuNS0yLjUtNC41LTUuNDVjLS4wMy0yLjg3IDEuODMtNS40NSA0LjUtNS40NXptNS43MiAxMy41M2MtLjMyLS44NC0yLjE5LTEuNDQtNS43Mi0xLjQ0cy01LjQxLjYtNS43MiAxLjQ0QTcuOTggNy45OCAwIDAgMCAxMiAyMGE3Ljk4IDcuOTggMCAwIDAgNS43Mi0xLjQ3eiIvPjwvc3ZnPg==')

// 表单验证规则
const profileRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  bio: [
    { max: 200, message: '个人简介不能超过200个字符', trigger: 'blur' }
  ]
}

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    console.log('开始获取用户信息...')
    const response = await api.get('/api/users/profile')
    console.log('获取到的用户信息:', response.data)

    if (response.data) {
      userInfo.value = response.data
      form.email = response.data.email || ''
      form.bio = response.data.bio || ''
    } else {
      throw new Error('获取用户信息失败')
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    console.error('错误详情:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })

    if (error.response?.status === 401) {
      ElMessage.error('登录已过期，请重新登录')
      router.push('/login')
    } else {
      ElMessage.error(
        error.response?.data?.message || 
        error.message || 
        '获取用户信息失败'
      )
    }
  }
}

// 获取笔记列表
const fetchNotes = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    console.log('Fetching notes...')
    const response = await axios.get('http://localhost:3001/api/users/notes', {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log('Notes response:', response.data)
    notes.value = response.data
  } catch (error) {
    console.error('Error fetching notes:', error)
    if (error.response?.status === 401) {
      ElMessage.error('登录已过期，请重新登录')
      router.push('/login')
    } else {
      ElMessage.error('获取笔记失败')
    }
  }
}

// 更新个人信息
const updateProfile = async () => {
  try {
    console.log('开始更新用户信息');
    console.log('准备发送的数据:', {
      email: form.email,
      bio: form.bio
    });

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('未找到认证令牌');
    }

    const response = await axios.put(
      'http://localhost:3001/api/users/profile',
      {
        email: form.email,
        bio: form.bio
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );

    console.log('更新成功，服务器响应:', response.data);
    ElMessage.success('个人信息更新成功');
    
    // 更新本地状态
    userInfo.value = response.data.user;
  } catch (error) {
    console.error('更新失败:', error);
    console.error('错误详情:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    let errorMessage = '更新失败';
    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    }
    
    ElMessage.error(errorMessage);
  }
}

// 更新设置
const updateSettings = async () => {
  try {
    const token = localStorage.getItem('token')
    await axios.put(
      'http://localhost:3001/api/users/settings',
      settingsForm.value,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    ElMessage.success('设置更新成功')
  } catch (error) {
    console.error('Error updating settings:', error)
    ElMessage.error('更新设置失败')
  }
}

// 显示创建笔记对话框
const showCreateNoteDialog = () => {
  noteDialog.value.isEdit = false
  noteDialog.value.form = {
    title: '',
    content: '',
    noteId: null
  }
  noteDialog.value.visible = true
}

// 编辑笔记
const editNote = (note) => {
  noteDialog.value.isEdit = true
  noteDialog.value.form = {
    title: note.title,
    content: note.content,
    noteId: note._id
  }
  noteDialog.value.visible = true
}

// 保存笔记
const saveNote = async () => {
  try {
    const token = localStorage.getItem('token')
    const { title, content, noteId } = noteDialog.value.form
    
    if (noteDialog.value.isEdit) {
      await axios.put(
        `http://localhost:3001/api/users/notes/${noteId}`,
        { title, content },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
    } else {
      await axios.post(
        'http://localhost:3001/api/users/notes',
        { title, content },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
    }
    
    noteDialog.value.visible = false
    await fetchNotes()
    ElMessage.success(noteDialog.value.isEdit ? '笔记更新成功' : '笔记创建成功')
  } catch (error) {
    console.error('Error saving note:', error)
    ElMessage.error(noteDialog.value.isEdit ? '更新笔记失败' : '创建笔记失败')
  }
}

// 删除笔记
const deleteNote = async (noteId) => {
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`http://localhost:3001/api/users/notes/${noteId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    await fetchNotes()
    ElMessage.success('笔记删除成功')
  } catch (error) {
    console.error('Error deleting note:', error)
    ElMessage.error('删除笔记失败')
  }
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  console.log('组件已挂载，开始获取用户信息')
  fetchUserInfo()
  fetchNotes()
})
</script>

<style scoped>
.profile-container {
  display: flex;
  padding: 2rem;
  gap: 2rem;
  min-height: calc(100vh - 60px);
  background: #1a1a1a;
  color: #fff;
  font-size: 18px;
}

.profile-panel {
  flex: 1;
  background: #2a2a2a;
  border-radius: 10px;
  padding: 3rem;
  box-shadow: 0 0 20px rgba(7, 207, 222, 0.902);
  border: 1px solid rgba(0, 255, 255, 0.1);
}

/* 输入框和文本框的基础样式 */
:deep(.el-input__wrapper),
:deep(.el-textarea__wrapper) {
  background-color: #1a1a1a !important;
  border: 1px solid #00ffff !important;
  box-shadow: none !important;
}

/* 输入框文字样式 */
:deep(.el-input__inner) {
  color: #00ffff !important;
  caret-color: #00ffff !important;
  background-color: transparent !important;
  font-size: 18px !important;
}

/* 文本框文字样式 */
:deep(.el-textarea__inner) {
  color: #00ffff !important;
  caret-color: #00ffff !important;
  background-color: #1a1a1a !important;
  border: none !important;
  resize: none !important;
  font-size: 18px !important;
}

/* 输入框和文本框焦点状态 */
:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__wrapper.is-focus) {
  border-color: #ff00ff !important;
  box-shadow: 0 0 15px rgba(255, 0, 255, 0.3) !important;
}

/* 输入框和文本框悬停状态 */
:deep(.el-input__wrapper:hover),
:deep(.el-textarea__wrapper:hover) {
  border-color: #ff00ff !important;
}

/* 文本计数器样式 */
:deep(.el-input__count-inner),
:deep(.el-textarea__count) {
  background: transparent !important;
  color: #00ffff !important;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
}

/* 占位符文字样式 */
:deep(.el-input__inner::placeholder),
:deep(.el-textarea__inner::placeholder) {
  color: rgba(0, 255, 255, 0.5) !important;
}

/* 标签样式 */
:deep(.el-form-item__label) {
  color: #00ffff !important;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
  font-size: 18px !important;
}

/* 按钮样式 */
:deep(.el-button--primary) {
  background: linear-gradient(45deg, #00ffff, #ff00ff) !important;
  border: none !important;
  color: #1a1a1a !important;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  font-size: 18px !important;
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.4) !important;
}

.avatar-section {
  text-align: center;
  margin-bottom: 1rem;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 1rem;
  border: 3px solid #00ffff;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  object-fit: cover;
  background-color: #1a1a1a;
}

.info-section {
  margin-bottom: 2rem;
}

.info-section h2 {
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  margin-bottom: 1rem;
}

.join-date {
  color: #ff00ff;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  text-shadow: 0 0 5px rgba(255, 0, 255, 0.5);
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #ff00ff, #00ffff);
}

.notes-panel {
  flex: 2;
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.notes-list {
  display: grid;
  gap: 1rem;
}

.note-card {
  margin-bottom: 1rem;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note-content {
  white-space: pre-wrap;
  margin: 1rem 0;
  font-size: 18px !important;
}

.note-footer {
  color: var(--el-text-color-secondary);
  font-size: 0.9em;
}

.delete-btn {
  color: var(--el-color-danger);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
  }

  .profile-panel {
    max-width: 100%;
  }
}

/* Select 下拉框样式 */
:deep(.el-select) {
  width: 100%;
}

:deep(.el-select .el-input__wrapper) {
  background-color: #1a1a1a !important;
  border: 1px solid #00ffff !important;
  box-shadow: none !important;
}

:deep(.el-select:hover .el-input__wrapper) {
  border-color: #00ffff !important;
}

:deep(.el-select .el-input__inner) {
  color: #00ffff !important;
  background-color: #1a1a1a !important;
}

:deep(.el-select .el-input .el-select__caret) {
  color: #00ffff !important;
}

/* 下拉菜单样式 */
:deep(.el-popper.el-select__popper),
:deep(.el-select__popper.el-popper),
:deep(.el-select-dropdown.el-popper) {
  background-color: #1a1a1a !important;
  border: 1px solid #00ffff !important;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3) !important;
}

:deep(.el-select-dropdown__item) {
  color: #00ffff !important;
  background: #1a1a1a !important;
  font-size: 18px !important;
}

:deep(.el-select-dropdown__item.hover),
:deep(.el-select-dropdown__item:hover) {
  background-color: rgba(0, 255, 255, 0.1) !important;
  color: #ff00ff !important;
}

:deep(.el-select-dropdown__item.selected) {
  color: #ff00ff !important;
  background-color: rgba(0, 255, 255, 0.2) !important;
}

/* 修复下拉框头和背景 */
:deep(.el-popper.is-light),
:deep(.el-select-dropdown) {
  background-color: #1a1a1a !important;
  border-color: #00ffff !important;
}

:deep(.el-popper.is-light .el-popper__arrow::before) {
  background: #1a1a1a !important;
  border-color: #00ffff !important;
}

:deep(.el-scrollbar),
:deep(.el-select-dropdown .el-scrollbar__wrap) {
  background-color: #1a1a1a !important;
}

:deep(.el-select-dropdown .el-scrollbar__view) {
  background-color: #1a1a1a !important;
}

/* 确保下拉框在所有状态下保持样式 */
:deep(.el-select .el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3) !important;
}

/* 添加保存按钮的加载状态样式 */
:deep(.el-button--primary.is-loading) {
  background: linear-gradient(45deg, #003333, #330033) !important;
  opacity: 0.8;
}

/* 表单验证错误提示样式 */
:deep(.el-form-item__error) {
  color: #ff4444 !important;
  text-shadow: 0 0 5px rgba(255, 0, 0, 0.3);
}

/* 文本框字数统计器的赛博朋克风格 */
:deep(.el-input-count),
:deep(.el-input__count),
:deep(.el-textarea__count) {
  background: transparent !important;
  color: #00ffff !important;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
}

:deep(.el-input-count-inner),
:deep(.el-input__count-inner),
:deep(.el-textarea__wordcount) {
  background: transparent !important;
  color: #00ffff !important;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
}

/* 确保文本框本身的样式 */
:deep(.el-textarea__inner) {
  background-color: #1a1a1a !important;
  border: 1px solid #00ffff !important;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.2) !important;
  color: #00ffff !important;
  resize: none !important;
}

:deep(.el-textarea__inner:focus) {
  border-color: #ff00ff !important;
  box-shadow: 0 0 15px rgba(255, 0, 255, 0.3) !important;
}

/* 覆盖所有可能的白色背景 */
:deep(.el-textarea) {
  --el-input-count-color: #00ffff !important;
  --el-input-count-background: transparent !important;
}

:deep(.el-textarea .el-input__count) {
  background: transparent !important;
  color: #00ffff !important;
}

/* 标题字体大小 */
.profile-panel h3 {
  font-size: 30px !important;
  background: #2a2a2a;
  color: #00ffff !important;
  text-shadow: 0 0 10px rgba(184, 14, 231, 0.5),
               0 0 20px rgba(202, 17, 234, 0.3),
               0 0 30px rgba(0, 255, 255, 0.2);
  background: linear-gradient(45deg, #ce10cb, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: textPulse 2s infinite;
}

/* 添加呼吸动画 */
@keyframes textPulse {
  0% { text-shadow: 0 0 10px rgba(200, 15, 225, 0.5); }
  50% { text-shadow: 0 0 20px rgba(247, 10, 219, 0.8); }
  100% { text-shadow: 0 0 10px rgba(220, 10, 235, 0.5); }
}

/* 笔记标题字体大小 */
.note-header h3 {
  font-size: 20px !important;
}

/* 笔记内容字体大小 */
.note-content {
  font-size: 18px !important;
}
</style> 