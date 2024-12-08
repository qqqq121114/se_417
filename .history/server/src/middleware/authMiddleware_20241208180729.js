const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // 从请求头获取 token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: '未提供认证令牌' });
    }

    // 验证 token 格式
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '令牌格式错误' });
    }

    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // 将用户信息添加到请求对象
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('认证错误:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '令牌已过期' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: '无效的令牌' });
    }
    res.status(401).json({ message: '认证失败' });
  }
};

module.exports = authMiddleware; 