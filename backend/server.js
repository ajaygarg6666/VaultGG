require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/games', require('./routes/games'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/stats', require('./routes/stats'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🎮 VaultGG API is running',
    timestamp: new Date().toISOString(),
    database: 'mongodb://localhost:27017/vaultgg'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.url} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 VaultGG Server running on http://localhost:${PORT}`);
  console.log(`📊 API Endpoints:`);
  console.log(`   Auth:     http://localhost:${PORT}/api/auth`);
  console.log(`   Games:    http://localhost:${PORT}/api/games`);
  console.log(`   Reviews:  http://localhost:${PORT}/api/reviews`);
  console.log(`   Sessions: http://localhost:${PORT}/api/sessions`);
  console.log(`   Stats:    http://localhost:${PORT}/api/stats`);
  console.log(`   Health:   http://localhost:${PORT}/api/health\n`);
});
