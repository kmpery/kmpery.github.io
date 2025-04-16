const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');

// Ambil komentar terbaru dulu
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 }); // urutkan terbaru
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil komentar' });
  }
});

// Tambah komentar
router.post('/', async (req, res) => {
  const { name, message } = req.body;
  try {
    const newComment = new Comment({ name, message });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambahkan komentar' });
  }
});

module.exports = router;