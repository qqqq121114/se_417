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

// 请求日志中间件 - 放在最前面
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

// 静态文件服务 - 必须在路由之前
app.use('/uploads', express.static(uploadsPath));

// API 路由
app.use('/api/users', (req, res, next) => {
  console.log('User route accessed:', req.method, req.url);
  console.log('Request body:', req.body);
  console.log('Request files:', req.files);
  next();
}, userRoutes);

// 根路由
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// 数据库连接
mongoose.connect('mongodb://mongodb:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected successfully');
  console.log('Database URL:', mongoose.connection.host);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  if (err.name === 'MulterError') {
    return res.status(400).json({
      message: '文件上传错误',
      error: err.message
    });
  }
  res.status(500).json({ 
    message: '服务器错误', 
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404处理 - 必须放在所有路由之后
app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.url);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  res.status(404).json({ 
    message: '请求的资源不存在',
    path: req.url,
    method: req.method,
    headers: req.headers,
    body: req.body
  });
});

// 启动服务器
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Static files are served from: ${uploadsPath}`);
  console.log(`Avatar files are served from: ${avatarsPath}`);
  
  // 打印所有注册的路由
  console.log('\nRegistered routes:');
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          console.log(`${Object.keys(handler.route.methods)} ${handler.route.path}`);
        }
      });
    }
  });
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
}); 