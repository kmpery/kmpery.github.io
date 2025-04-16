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

// Koneksi ke MongoDB Atlas
mongoose
  .connect(
    'mongodb+srv://perrikembali2:102938@kmpery.cg7knbu.mongodb.net/weddingDB?retryWrites=true&w=majority'
  )
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.log('Failed to connect to MongoDB Atlas', err));

// Jalankan server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
