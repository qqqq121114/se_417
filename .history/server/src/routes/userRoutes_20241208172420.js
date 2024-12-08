const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { uploadSingle, handleMulterError } = require('../middleware/upload');

// 路由错误处理中间件
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 公开路由
router.post('/register', asyncHandler(userController.register));
router.post('/login', asyncHandler(userController.login));

// 需要认证的路由
router.get('/profile', auth, asyncHandler(userController.getProfile));
router.put('/profile', auth, asyncHandler(userController.updateProfile));
router.put('/settings', auth, asyncHandler(userController.updateSettings));

// 头像上传路由
router.post('/avatar', 
  auth, 
  uploadSingle,
  handleMulterError,
  asyncHandler(userController.uploadAvatar)
);

// 笔记相关路由
router.post('/notes', auth, asyncHandler(userController.createNote));
router.get('/notes', auth, asyncHandler(userController.getNotes));
router.put('/notes/:noteId', auth, asyncHandler(userController.updateNote));
router.delete('/notes/:noteId', auth, asyncHandler(userController.deleteNote));

// 路由错误处理
router.use((err, req, res, next) => {
  console.error('Router Error:', err);
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: '文件上传错误', error: err.message });
  }
  next(err);
});

module.exports = router; 