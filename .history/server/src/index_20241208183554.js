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

// CORS配置
app.use(cors({
  origin: 'http://localhost:5173', // Vue开发服务器地址
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] // 明确允许的方法
}));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.body) console.log('Body:', req.body);
  next();
});

// 基础中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API 路由
app.use('/api/users', (req, res, next) => {
  console.log('API Request:', {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers
  });
  next();
}, userRoutes);

// 根路由
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Server Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    headers: req.headers
  });
  
  res.status(err.status || 500).json({ 
    message: err.message || '服务器错误',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404处理
app.use((req, res) => {
  console.log('404 Not Found:', {
    path: req.path,
    method: req.method,
    body: req.body,
    headers: req.headers
  });
  
  res.status(404).json({ 
    message: '请求的资源不存在',
    path: req.path,
    method: req.method
  });
});

// 数据库连接和服务器启动
mongoose.connect('mongodb://127.0.0.1:27017/myapp')
.then(() => {
  console.log('MongoDB connected successfully');
  
  // 启动服务器
  const PORT = process.env.PORT || 3001;
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('CORS enabled for:', 'http://localhost:5173');
    
    // 打印所有注册的路由
    console.log('\nRegistered routes:');
    app._router.stack.forEach(r => {
      if (r.route && r.route.path) {
        console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
      }
    });
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}); 