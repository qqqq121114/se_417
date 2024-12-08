const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../../uploads/avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置 multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Multer destination:', uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = uniqueSuffix + ext;
    console.log('Multer filename:', filename);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  console.log('Multer file filter:', file.mimetype);
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件！'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// 路由日志中间件
const routeLogger = (req, res, next) => {
  console.log(`[Route] ${req.method} ${req.baseUrl}${req.path}`);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('Request files:', req.files);
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
  upload.single('avatar'),
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({
        message: '文件上传错误',
        error: err.message
      });
    } else if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({
        message: '文件上传失败',
        error: err.message
      });
    }
    next();
  },
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