const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const noteController = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');

// 路由日志中间件
const routeLogger = (req, res, next) => {
  console.log('Route accessed:', {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers,
    params: req.params,
    query: req.query
  });
  next();
};

// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error('Route error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  next(err);
};

// 用户注册
router.post('/register', routeLogger, userController.register);

// 用户登录
router.post('/login', routeLogger, userController.login);

// 获取用户信息
router.get('/profile', routeLogger, authMiddleware, userController.getProfile);

// 更新用户信息
router.put('/profile', routeLogger, authMiddleware, async (req, res, next) => {
  try {
    console.log('Processing profile update:', {
      userId: req.user.userId,
      body: req.body
    });
    await userController.updateProfile(req, res, next);
  } catch (error) {
    next(error);
  }
});

// 笔记相关路由
// 获取所有笔记
router.get('/notes', routeLogger, authMiddleware, noteController.getNotes);

// 创建笔记
router.post('/notes', routeLogger, authMiddleware, noteController.createNote);

// 更新笔记
router.put('/notes/:id', routeLogger, authMiddleware, noteController.updateNote);

// 删除笔记
router.delete('/notes/:id', routeLogger, authMiddleware, noteController.deleteNote);

// 添加错误处理
router.use(errorHandler);

module.exports = router; 