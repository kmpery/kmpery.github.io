const express = require('express');
const router = express.Router();
const Comment = require('../models/comment'); // Impor model Comment untuk berinteraksi dengan MongoDB

// Rute untuk mendapatkan semua komentar
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil komentar' });
  }
});

// Rute untuk menambahkan komentar baru
router.post('/', async (req, res) => {
  const { name, message } = req.body;
  try {
    const newComment = new Comment({ name, message });
    await newComment.save();
    res.status(201).json(newComment); // Mengirimkan komentar yang baru ditambahkan
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambahkan komentar' });
  }
});

module.exports = router; // Mengekspor router agar bisa digunakan di file utama (app.js)
