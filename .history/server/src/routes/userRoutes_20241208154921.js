const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// 注册路由
router.post('/register', userController.register);

// 登录路由
router.post('/login', userController.login);

// 获取个人信息路由（需要认证）
router.get('/profile', auth, userController.getProfile);

module.exports = router; 