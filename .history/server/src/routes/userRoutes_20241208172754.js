const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { uploadSingle, handleMulterError } = require('../middleware/upload');

// 路由日志中间件
const routeLogger = (req, res, next) => {
  console.log(`[Route] ${req.method} ${req.baseUrl}${req.path}`);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  next();
};

// 路由错误处理中间件
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 公开路由
router.post('/register', routeLogger, asyncHandler(userController.register));
router.post('/login', routeLogger, asyncHandler(userController.login));

// 需要认证的路由
router.get('/profile', routeLogger, auth, asyncHandler(userController.getProfile));
router.put('/profile', routeLogger, auth, asyncHandler(userController.updateProfile));
router.put('/settings', routeLogger, auth, asyncHandler(userController.updateSettings));

// 头像上传路由
router.post('/avatar', 
  routeLogger,
  auth, 
  (req, res, next) => {
    console.log('Processing avatar upload request');
    next();
  },
  uploadSingle,
  handleMulterError,
  asyncHandler(userController.uploadAvatar)
);

// 笔记相关路由
router.post('/notes', routeLogger, auth, asyncHandler(userController.createNote));
router.get('/notes', routeLogger, auth, asyncHandler(userController.getNotes));
router.put('/notes/:noteId', routeLogger, auth, asyncHandler(userController.updateNote));
router.delete('/notes/:noteId', routeLogger, auth, asyncHandler(userController.deleteNote));

// 打印所有注册的路由
console.log('\nRegistered user routes:');
router.stack.forEach(r => {
  if (r.route && r.route.path) {
    console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
  }
});

module.exports = router; 