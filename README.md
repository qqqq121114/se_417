# Vue + Node.js + MongoDB 全栈项目

这是一个使用Vue.js作为前端框架、Node.js作为后端服务器、MongoDB作为数据库的全栈Web应用项目。项目使用Docker进行环境管理和部署。

## 项目结构

```
.
├── client/                 # Vue.js前端项目
│   ├── src/               # 源代码目录
│   │   ├── views/         # 页面组件
│   │   ├── router/        # 路由配置
│   │   ├── App.vue        # 根组件
│   │   └── main.js        # 入口文件
│   ├── package.json       # 前端依赖配置
│   └── vite.config.js     # Vite配置文件
├── server/                 # Node.js后端项目
│   ├── src/               # 源代码目录
│   │   ├── controllers/   # 控制器
│   │   ├── models/        # 数据模型
│   │   ├── routes/        # 路由配置
│   │   └── index.js       # 入口文件
│   └── package.json       # 后端依赖配置
├── docker/                 # Docker相关配置文件
│   ├── dev/               # 开发环境Docker配��
│   └── prod/              # 生产环境Docker配置
├── docker-compose.dev.yml  # 开发环境Docker Compose配置
├── docker-compose.yml      # 生产环境Docker Compose配置
└── README.md              # 项目说明文档
```

## 技术栈

- 前端：Vue 3 + Vite + Vue Router + Pinia + Element Plus
- 后端：Node.js + Express + Mongoose
- 数据库：MongoDB
- 环境管理：Docker + Docker Compose

## 开发环境设置

1. 确保已安装Docker和Docker Compose
2. 克隆项目到本地
3. 在项目根目录运行:
```bash
docker-compose -f docker-compose.dev.yml up --build
```

这将启动:
- 前端开发服务器 (http://localhost:5173)
- 后端API服务器 (http://localhost:3000)
- MongoDB数据库 (localhost:27017)

### 热重载配置
1
项目已配置了开发环境的热重载功能，支持代码修改后自动更新。主要配置包括：

1. Docker卷映射（docker-compose.dev.yml）:
```yaml
volumes:
  - ./client:/app        # 本地代码同步到容器
  - /app/node_modules    # 保护容器内的node_modules
```

2. Vite配置（client/vite.config.js）:
```javascript
server: {
  watch: {
    usePolling: true,    // 使用轮询监听文件变化
    interval: 100        // 轮询间隔
  },
  host: '0.0.0.0',      // 允许外部访问
  port: 5173,           // 指定端口
  hmr: {
    overlay: true       // 显示热重载错误
  }
}
```

### 常见问题解决

1. 如果修改代码后页面没有更新：
   - 检查Docker容器是否正常运行
   - 在浏览器中强制刷新（Ctrl+F5）
   - 检查浏览器控制台是否有错误信息
   - 重启前端容器：`docker-compose -f docker-compose.dev.yml restart frontend`

2. 如果需要完全重建环境：
```bash
# 停止所有容器
docker-compose -f docker-compose.dev.yml down

# 删除旧的镜像
docker rmi linuxproject-frontend linuxproject-backend

# 重新构建并启动
docker-compose -f docker-compose.dev.yml up --build
```

3. 如果遇到端口占用：
   - 检查并关闭占用端口的程序
   - 或修改docker-compose.dev.yml中的端口映射

## 生产环境部署

1. 在Linux服务器上安装Docker和Docker Compose
2. 将项目文件复制到服务器
3. 在项目根目录运行:
```bash
docker-compose up --build -d
```

## 开发指南

### 前端开发
- 前端代码位于`client`目录
- 使用Vue 3的组合式API
- 使用Vite作为构建工具
- 使用Pinia进行状态管理
- 使用Vue Router进行路由管理
- 使用Element Plus组件库

### 后端开发
- 后端代码位于`server`目录
- 使用Express框架处理HTTP请求
- 使用Mongoose操作MongoDB数据库
- 实现RESTful API接口

### 数据库
- 使用MongoDB存储数据
- 通过Docker容器运行,无需本地安装
- 数据持久化存储在Docker volume中

## 注意事项

1. 开发时修改代码会自动热重载
2. 容器内的MongoDB数据会持久化保存
3. 生产环境部署时请修改相关环境变量和配置
4. 建议在开发时打开浏览器的开发者工具，方便调试
5. 定期备份MongoDB数据

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

# 项目开发经验总结

## Docker 环境配置经验

### 1. MongoDB 连接配置
在 Docker 环境中，服务之间的通信需要使用服务名而不是 localhost：
```javascript
// ❌ 错误的配置
mongoose.connect('mongodb://127.0.0.1:27017/myapp')

// ✅ 正确的配置
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/myapp';
mongoose.connect(MONGODB_URI)
```

### 2. Docker 容器管理命令
```bash
# 查看所有运行中的容器
docker ps

# 查看所有容器（包括已停止的）
docker ps -a

# 查看容器日志
docker-compose -f docker-compose.dev.yml logs
docker-compose -f docker-compose.dev.yml logs backend  # 查看特定服务的日志
docker-compose -f docker-compose.dev.yml logs --tail=50 backend  # 查看最后50行日志

# 停止所有容器
docker-compose -f docker-compose.dev.yml down

# 启动所有容器
docker-compose -f docker-compose.dev.yml up -d

# 重新构建并启动容器
docker-compose -f docker-compose.dev.yml up --build -d
```

## API 开发经验

### 1. CORS 配置
在跨域请求中，需要正确配置 CORS：
```javascript
app.use(cors({
  origin: 'http://localhost:5173', // 前端开发服务器地址
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] // 明确允许的方法
}));
```

### 2. 请求日志记录
为了方便调试，添加详细的请求日志：
```javascript
// 请求日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.body) console.log('Body:', req.body);
  next();
});

// API 路由日志
app.use('/api/users', (req, res, next) => {
  console.log('API Request:', {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers
  });
  next();
}, userRoutes);
```

### 3. 错误处理
实现统一的错误处理中间件：
```javascript
// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Server Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
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
    method: req.method
  });
  
  res.status(404).json({ 
    message: '请求的资源不存在',
    path: req.path,
    method: req.method
  });
});
```

## 调试技巧

1. **日志分层**：
   - 请求层：记录所有进入的HTTP请求
   - 路由层：记录具体API路由的访问
   - 业务层：记录具体业务逻辑的执行
   - 数据库层：记录数据库操作

2. **环境变量使用**：
   - 使用 dotenv 管理环境变量
   - 为不同环境（开发、测试、生产）设置不同的配置

3. **错误处理**：
   - 实现统一的错误处理中间件
   - 区分开发环境和生产环境的错误信息
   - 记录详细的错误堆栈信息

4. **API 设计**：
   - 使用 RESTful 风格的API设计
   - 实现统一的响应格式
   - 添加适当的请求验证

## 最佳实践

1. **代码组织**：
   - 路由和控制器分离
   - 中间件模块化
   - 统一的错误处理

2. **安全性**：
   - 使用 CORS 控制跨域访问
   - 实现身份验证中间件
   - 敏感信息使用环境变量

3. **可维护性**：
   - 添加详细的日志记录
   - 使用统一的代码风格
   - 保持代码的模块化和可测试性