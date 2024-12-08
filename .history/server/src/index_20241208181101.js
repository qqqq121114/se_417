const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const userRoutes = require('./routes/userRoutes');

// 加载环境变量
dotenv.config();

const app = express();

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.body) console.log('Body:', req.body);
  next();
});

// 基础中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 创建上传目录
const uploadsPath = path.join(__dirname, '../uploads');
const avatarsPath = path.join(uploadsPath, 'avatars');
console.log('Uploads directory path:', uploadsPath);
console.log('Avatars directory path:', avatarsPath);

// 确保上传目录存在
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('Created uploads directory');
}
if (!fs.existsSync(avatarsPath)) {
  fs.mkdirSync(avatarsPath, { recursive: true });
  console.log('Created avatars directory');
}

// 静态文件服务
app.use('/uploads', express.static(uploadsPath));

// API 路由
app.use('/api/users', userRoutes);

// 根路由
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    message: '服务器错误', 
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ 
    message: '请求的资源不存在',
    path: req.url
  });
});

// 数据库连接和服务器启动
mongoose.connect('mongodb://127.0.0.1:27017/myapp')
  .then(() => {
    console.log('MongoDB connected successfully');
    
    // 启动服务器
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Static files are served from: ${uploadsPath}`);
      console.log(`Avatar files are served from: ${avatarsPath}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 