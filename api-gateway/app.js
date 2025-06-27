const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const appRoutes = require('./src/routes/app');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log('Loaded AUTH_SERVICE_URL:', process.env.AUTH_SERVICE_URL);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'API Gateway is running',
    timestamp: new Date().toISOString(),
    services: {
      auth: process.env.AUTH_SERVICE_URL,
      events: process.env.EVENT_SERVICE_URL,
      chatbot: process.env.CHATBOT_SERVICE_URL,
      messages: process.env.MESSAGE_SERVICE_URL,
      settings: process.env.SETTING_SERVICE_URL,
      bank: process.env.BANK_SERVICE_URL
    }
  });
});

// Routes
app.use('/', appRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Gateway Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}`);
  console.log(`Auth service proxied at: http://localhost:${PORT}/api/auth`);
});

module.exports = app;