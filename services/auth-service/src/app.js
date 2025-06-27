const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDatabase= require('./config/database');
const authApiRoutes = require('./api/auth');
const webAuthRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3011'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/api/auth', authApiRoutes);
app.use('/', webAuthRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error('Auth Service Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    service: 'auth-service'
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
    service: 'auth-service'
  });
});

// Connect DB and start server
connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Auth Service running on http://localhost:${PORT}`);
  });
});