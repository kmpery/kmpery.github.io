const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const commentRoutes = require('./routes/comments');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Gunakan router untuk /comments
app.use('/comments', commentRoutes);

// Koneksi ke MongoDB
mongoose
  .connect('mongodb://localhost:27017/weddingDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Failed to connect to MongoDB', err));

// Jalankan server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
