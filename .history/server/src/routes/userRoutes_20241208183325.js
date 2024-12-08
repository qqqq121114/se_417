const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// 路由日志中间件
const routeLogger = (req, res, next) => {
  console.log('Route accessed:', {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers
  });
  next();
};

// 用户注册
router.post('/register', routeLogger, userController.register);

// 用户登录
router.post('/login', routeLogger, userController.login);

// 获取用户信息
router.get('/profile', routeLogger, authMiddleware, userController.getProfile);

// 更新用户信息
router.put('/profile', routeLogger, authMiddleware, userController.updateProfile);

module.exports = router; 