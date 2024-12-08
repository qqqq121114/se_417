const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../../uploads/avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Multer destination:', uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 使用时间戳和原始文件扩展名创建唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = uniqueSuffix + ext;
    console.log('Multer filename:', filename);
    cb(null, filename);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  console.log('Multer file filter:', file.mimetype);
  // 只允许上传图片
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件！'), false);
  }
};

// 创建 multer 实例
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 限制文件大小为 5MB
  }
});

// 导出一个处理单个文件上传的中间件
module.exports = {
  uploadSingle: upload.single('avatar'),
  handleMulterError: (err, req, res, next) => {
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
  }
}; 