const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// 公开路由
router.post('/register', userController.register);
router.post('/login', userController.login);

// 需要认证的路由
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.put('/settings', auth, userController.updateSettings);

// 头像上传路由
router.post('/avatar', auth, upload.single('avatar'), userController.uploadAvatar);

// 笔记相关路由
router.post('/notes', auth, userController.createNote);
router.get('/notes', auth, userController.getNotes);
router.put('/notes/:noteId', auth, userController.updateNote);
router.delete('/notes/:noteId', auth, userController.deleteNote);

module.exports = router; 