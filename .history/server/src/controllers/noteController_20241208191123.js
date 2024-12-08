const Note = require('../models/Note');

// 获取用户的所有笔记
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId })
      .sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error('获取笔记失败:', error);
    res.status(500).json({ message: '获取笔记失败', error: error.message });
  }
};

// 创建新笔记
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: '标题和内容不能为空' });
    }

    const note = new Note({
      userId: req.user.userId,
      title,
      content
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.error('创建笔记失败:', error);
    res.status(500).json({ message: '创建笔记失败', error: error.message });
  }
};

// 更新笔记
exports.updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const noteId = req.params.id;

    if (!title || !content) {
      return res.status(400).json({ message: '标题和内容不能为空' });
    }

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId: req.user.userId },
      { title, content, updatedAt: new Date() },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: '笔记不存在或无权限修改' });
    }

    res.json(note);
  } catch (error) {
    console.error('更新笔记失败:', error);
    res.status(500).json({ message: '更新笔记失败', error: error.message });
  }
};

// 删除笔记
exports.deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findOneAndDelete({ 
      _id: noteId, 
      userId: req.user.userId 
    });

    if (!note) {
      return res.status(404).json({ message: '笔记不存在或无权限删除' });
    }

    res.json({ message: '笔记删除成功' });
  } catch (error) {
    console.error('删除笔记失败:', error);
    res.status(500).json({ message: '删除笔记失败', error: error.message });
  }
}; 