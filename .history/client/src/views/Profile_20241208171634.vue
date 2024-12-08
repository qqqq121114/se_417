<template>
  <div class="profile-container">
    <!-- 左侧个人信息面板 -->
    <div class="profile-panel">
      <div class="avatar-section">
        <img :src="userInfo.avatar || '/default-avatar.png'" alt="avatar" class="avatar" />
        <el-button type="primary" size="small" @click="handleAvatarUpload">更换头像</el-button>
      </div>

      <div class="info-section">
        <h2>{{ userInfo.username }}</h2>
        <p class="join-date">加入时间：{{ formatDate(userInfo.createdAt) }}</p>
        
        <el-form ref="profileForm" :model="profileForm" label-position="top">
          <el-form-item label="邮箱">
            <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
          </el-form-item>
          
          <el-form-item label="个人简介">
            <el-input
              v-model="profileForm.bio"
              type="textarea"
              :rows="4"
              placeholder="写点什么介绍自己..."
              maxlength="200"
              show-word-limit
            />
          </el-form-item>

          <el-button type="primary" @click="updateProfile">保存修改</el-button>
        </el-form>
      </div>

      <div class="settings-section">
        <h3>个性化设置</h3>
        <el-form :model="settingsForm" label-position="top">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const userInfo = ref({})
const notes = ref([])

const profileForm = ref({
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

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const response = await axios.get('http://localhost:3001/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    userInfo.value = response.data
    profileForm.value.email = response.data.email || ''
    profileForm.value.bio = response.data.bio || ''
    settingsForm.value = { ...response.data.settings }
  } catch (error) {
    console.error('Error fetching user info:', error)
    ElMessage.error('获取用户信息失败')
    router.push('/login')
  }
}

// 获取笔记列表
const fetchNotes = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:3001/api/users/notes', {
      headers: { Authorization: `Bearer ${token}` }
    })
    notes.value = response.data
  } catch (error) {
    console.error('Error fetching notes:', error)
    ElMessage.error('获取笔记失败')
  }
}

// 更新个人信息
const updateProfile = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.put(
      'http://localhost:3001/api/users/profile',
      profileForm.value,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    userInfo.value = { ...userInfo.value, ...response.data.user }
    ElMessage.success('个人信息更新成功')
  } catch (error) {
    console.error('Error updating profile:', error)
    ElMessage.error('更新个人信息失败')
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
    ElMessage.success(noteDialog.value.isEdit ? '笔记更新成���' : '笔记创建成功')
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

// 处理头像上传
const handleAvatarUpload = async (event) => {
  try {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // 检查文件大小
      if (file.size > 5 * 1024 * 1024) {
        ElMessage.error('图片大小不能超过5MB');
        return;
      }

      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        ElMessage.error('只能上传图片文件');
        return;
      }

      const formData = new FormData();
      formData.append('avatar', file);

      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3001/api/users/avatar',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      userInfo.value.avatar = response.data.avatar;
      ElMessage.success('头像上传成功');
    };

    fileInput.click();
  } catch (error) {
    console.error('Error uploading avatar:', error);
    ElMessage.error('头像上传失败');
  }
};

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
  fetchUserInfo()
  fetchNotes()
})
</script>

<style scoped>
.profile-container {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  min-height: calc(100vh - 60px);
  background: var(--el-bg-color);
}

.profile-panel {
  flex: 1;
  max-width: 400px;
}

.notes-panel {
  flex: 2;
}

.avatar-section {
  text-align: center;
  margin-bottom: 2rem;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 1rem;
  border: 3px solid var(--el-color-primary);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.info-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.settings-section {
  padding: 1.5rem;
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.join-date {
  color: var(--el-text-color-secondary);
  margin-bottom: 1.5rem;
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
</style> 