const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// 注册新用户
exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // 验证输入
    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' });
    }

    // 检查用户是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 加密密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建新用户
    const user = new User({
      username,
      password: hashedPassword,
      email
    });

    // 保存用户到数据库
    await user.save();

    res.status(201).json({ 
      message: '注册成功',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: '注册失败，请稍后重试' });
  }
};

// 用户登录
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 验证输入
    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' });
    }

    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 生成JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ 
      message: '登录成功',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        settings: user.settings,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: '登录失败，请稍后重试' });
  }
};

// 获取用户个人信息
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: '获取个人信息失败' });
  }
};

// 更新用户个人信息
exports.updateProfile = async (req, res) => {
  try {
    const { email, bio, avatar } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    if (email) user.email = email;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;
    
    user.updatedAt = Date.now();
    await user.save();

    res.json({
      message: '个人信息更新成功',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: '更新个人信息失败' });
  }
};

// 更新用户设置
exports.updateSettings = async (req, res) => {
  try {
    const { theme, notifications } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    if (theme) user.settings.theme = theme;
    if (notifications !== undefined) user.settings.notifications = notifications;
    
    await user.save();

    res.json({
      message: '设置更新成功',
      settings: user.settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: '更新设置失败' });
  }
};

// 创建笔记
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    user.notes.push({ title, content });
    await user.save();

    res.status(201).json({
      message: '笔记创建成功',
      note: user.notes[user.notes.length - 1]
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: '创建笔记失败' });
  }
};

// 获取所有笔记
exports.getNotes = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json(user.notes);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: '获取笔记失败' });
  }
};

// 更新笔记
exports.updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, content } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    const note = user.notes.id(noteId);
    if (!note) {
      return res.status(404).json({ message: '笔记不存在' });
    }

    note.title = title || note.title;
    note.content = content || note.content;
    note.updatedAt = Date.now();

    await user.save();

    res.json({
      message: '笔记更新成功',
      note
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: '更新笔记失败' });
  }
};

// 删除笔记
exports.deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    const note = user.notes.id(noteId);
    if (!note) {
      return res.status(404).json({ message: '笔记不存在' });
    }

    note.remove();
    await user.save();

    res.json({
      message: '笔记删除成功'
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: '删除笔记失败' });
  }
};

// 上传头像
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '请选择要上传的图片' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 如果用户之前有头像，删除旧文件
    if (user.avatar) {
      const oldAvatarPath = path.join(__dirname, '../../uploads/avatars', path.basename(user.avatar));
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // 更新用户头像路径
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    user.avatar = avatarUrl;
    await user.save();

    res.json({
      message: '头像上传成功',
      avatar: avatarUrl
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ message: '头像上传失败' });
  }
}; 