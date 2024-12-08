const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 注册路由
router.post('/register', userController.register);

// 登录路由
router.post('/login', userController.login);

// 用户管理路由
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router; 