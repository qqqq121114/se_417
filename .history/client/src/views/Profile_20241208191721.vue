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
  padding: 1rem;
  gap: 1rem;
  min-height: calc(100vh - 60px);
  background: #1a1a1a;
  color: #fff;
  font-size: 16px;
}

.profile-panel {
  flex: 1;
  background: #2a2a2a;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 255, 0.1);
}

.profile-panel h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #00ffff;
}

/* 输入框和文本框的基础样式 */
:deep(.el-input__wrapper),
:deep(.el-textarea__wrapper) {
  background-color: #1a1a1a !important;
  border: 1px solid #00ffff !important;
  box-shadow: none !important;
  font-size: 1.1rem !important;
}

/* 输入框文字样式 */
:deep(.el-input__inner) {
  color: #00ffff !important;
  caret-color: #00ffff !important;
  background-color: transparent !important;
  font-size: 1.1rem !important;
}

/* 表单项样式 */
:deep(.el-form-item__label) {
  font-size: 1.1rem !important;
  color: #fff !important;
  margin-bottom: 0.5rem !important;
}

/* 笔记面板样式 */
.notes-panel {
  flex: 2;
  padding: 0 1rem;
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.notes-header h2 {
  font-size: 1.8rem;
  color: #00ffff;
  margin: 0;
}

.notes-list {
  display: grid;
  gap: 1rem;
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  padding-right: 0.5rem;
}

.note-card {
  background: #2a2a2a !important;
  border: 1px solid rgba(0, 255, 255, 0.2) !important;
  margin-bottom: 0.5rem !important;
}

.note-card :deep(.el-card__header) {
  padding: 1rem !important;
  border-bottom: 1px solid rgba(0, 255, 255, 0.1) !important;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note-header h3 {
  font-size: 1.3rem;
  margin: 0;
  color: #00ffff;
}

.note-content {
  font-size: 1.1rem;
  white-space: pre-wrap;
  margin: 0.5rem 0;
  line-height: 1.4;
}

.note-footer {
  color: #888;
  font-size: 0.9rem;
}

/* 按钮样式 */
:deep(.el-button) {
  font-size: 1.1rem !important;
  padding: 0.5rem 1rem !important;
}

/* 对话框样式 */
:deep(.el-dialog) {
  background: #2a2a2a !important;
  border: 1px solid rgba(0, 255, 255, 0.2) !important;
}

:deep(.el-dialog__title) {
  color: #00ffff !important;
  font-size: 1.5rem !important;
}

:deep(.el-dialog__body) {
  color: #fff !important;
  font-size: 1.1rem !important;
}

/* 滚动条样式 */
.notes-list::-webkit-scrollbar {
  width: 6px;
}

.notes-list::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.notes-list::-webkit-scrollbar-thumb {
  background: #00ffff;
  border-radius: 3px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
    padding: 0.5rem;
  }

  .profile-panel, .notes-panel {
    width: 100%;
  }

  .notes-list {
    max-height: none;
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

:deep(.el-select-dropdown__item) {
  font-size: 1.1rem !important;
  padding: 0.5rem 1rem !important;
}

:deep(.el-select-dropdown__item.selected) {
  color: #00ffff !important;
  font-weight: bold !important;
}

/* 表单验证消息 */
:deep(.el-form-item__error) {
  font-size: 0.9rem !important;
  color: #ff4444 !important;
}

/* 笔记操作按钮 */
.note-actions {
  display: flex;
  gap: 0.5rem;
}

.note-actions :deep(.el-button) {
  padding: 0.3rem 0.8rem !important;
  font-size: 1rem !important;
}

.delete-btn {
  color: #ff4444 !important;
}

/* 确保所有文本输入都是白色 */
:deep(.el-input__inner),
:deep(.el-textarea__inner) {
  color: #fff !important;
}

/* 下拉菜单选项 */
:deep(.el-select-dropdown__item) {
  color: #fff !important;
}

:deep(.el-select-dropdown__item.hover),
:deep(.el-select-dropdown__item:hover) {
  background-color: rgba(0, 255, 255, 0.1) !important;
}

:deep(.el-select-dropdown) {
  background-color: #2a2a2a !important;
  border: 1px solid rgba(0, 255, 255, 0.2) !important;
}

/* 表单项间距 */
:deep(.el-form-item) {
  margin-bottom: 1rem !important;
}

/* 对话框内容区域 */
:deep(.el-dialog__body) {
  padding: 1rem !important;
}

/* 对话框按钮 */
:deep(.el-dialog__footer) {
  padding: 1rem !important;
  border-top: 1px solid rgba(0, 255, 255, 0.1) !important;
}
</style> 