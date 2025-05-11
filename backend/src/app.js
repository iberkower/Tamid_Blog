const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

console.log('Env:', {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
  NODE_ENV: process.env.NODE_ENV
});

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://tamid-blog.vercel.app/',
    process.env.FRONTEND_ORIGIN
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

const FRONTEND_BUILD = path.join(__dirname, '../../frontend/build');
app.use(express.static(FRONTEND_BUILD));
app.get('*', (_req, res) => {
  res.sendFile(path.join(FRONTEND_BUILD, 'index.html'));
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(e => console.error('Mongo error:', e));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

module.exports = app;
