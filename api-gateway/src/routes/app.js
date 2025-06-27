require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const router = express.Router();
const authRoutes = require('./auth');

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const EVENT_SERVICE_URL = process.env.EVENT_SERVICE_URL;
const CHATBOT_SERVICE_URL = process.env.CHATBOT_SERVICE_URL;
const MESSAGE_SERVICE_URL = process.env.MESSAGE_SERVICE_URL;
const SETTING_SERVICE_URL = process.env.SETTING_SERVICE_URL;
const BANK_SERVICE_URL = process.env.BANK_SERVICE_URL;

console.log("🔌 Service URLs:");
console.log("AUTH_SERVICE_URL:", AUTH_SERVICE_URL);
console.log("EVENT_SERVICE_URL:", EVENT_SERVICE_URL);
console.log("CHATBOT_SERVICE_URL:", CHATBOT_SERVICE_URL);
router.use('/api', authRoutes);
// Auth Service Routes - FIXED: Specify exact path matching
router.use('/api/auth', createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  logLevel: 'debug',
  timeout: 10000,
  // Don't rewrite the path - keep it as /api/auth
  pathRewrite: {},
  onError: (err, req, res) => {
    console.error('❌ Auth Service Proxy Error:');
    console.error('Error:', err.message);
    console.error('Error Code:', err.code);
    console.error('Target:', AUTH_SERVICE_URL);
    console.error('Original URL:', req.originalUrl);
    console.error('Path:', req.path);
    console.error('Method:', req.method);
    
    if (err.code === 'ECONNREFUSED') {
      console.error('🚨 AUTH SERVICE IS NOT RUNNING OR NOT ACCESSIBLE ON PORT 3001');
      console.error('🔍 Try: curl http://localhost:3001/api/auth');
    }
    
    if (!res.headersSent) {
      res.status(503).json({
        error: 'Auth service unavailable',
        message: err.message,
        code: err.code,
        target: AUTH_SERVICE_URL,
        originalUrl: req.originalUrl,
        suggestion: 'Make sure auth service is running on port 3001 and responding to /api/auth'
      });
    }
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`🔄 Proxying AUTH: ${req.method} ${req.originalUrl} -> ${AUTH_SERVICE_URL}${req.path}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`✅ Auth Service responded with status: ${proxyRes.statusCode} for ${req.originalUrl}`);
  }
}));

// Event Service Routes
router.use('/api/events', createProxyMiddleware({
  target: EVENT_SERVICE_URL,
  changeOrigin: true,
  logLevel: 'info',
  pathRewrite: {
    '^/api/events': '/api/v1/events'
  },
  onError: (err, req, res) => {
    console.error('Event Service Proxy Error:', err.message);
    if (!res.headersSent) {
      res.status(503).json({
        error: 'Event service unavailable',
        message: err.message
      });
    }
  }
}));

// Chatbot Service Routes
router.use('/api/chatbot', createProxyMiddleware({
  target: CHATBOT_SERVICE_URL,
  changeOrigin: true,
  logLevel: 'info',
  pathRewrite: {
    '^/api/chatbot': '/api/v1/chat'
  },
  onError: (err, req, res) => {
    console.error('Chatbot Service Proxy Error:', err.message);
    if (!res.headersSent) {
      res.status(503).json({
        error: 'Chatbot service unavailable',
        message: err.message
      });
    }
  }
}));

// Message Service Routes
router.use('/api/messages', createProxyMiddleware({
  target: MESSAGE_SERVICE_URL,
  changeOrigin: true,
  logLevel: 'info',
  pathRewrite: {
    '^/api/messages': '/api/v1/messages'
  },
  onError: (err, req, res) => {
    console.error('Message Service Proxy Error:', err.message);
    if (!res.headersSent) {
      res.status(503).json({
        error: 'Message service unavailable',
        message: err.message
      });
    }
  }
}));

// Setting Service Routes
router.use('/api/settings', createProxyMiddleware({
  target: SETTING_SERVICE_URL,
  changeOrigin: true,
  logLevel: 'info',
  pathRewrite: {
    '^/api/settings': '/api/v1/settings'
  },
  onError: (err, req, res) => {
    console.error('Setting Service Proxy Error:', err.message);
    if (!res.headersSent) {
      res.status(503).json({
        error: 'Setting service unavailable',
        message: err.message
      });
    }
  }
}));

// Bank Service Routes
router.use('/api/bank', createProxyMiddleware({
  target: BANK_SERVICE_URL,
  changeOrigin: true,
  logLevel: 'info',
  pathRewrite: {
    '^/api/bank': '/api/v1/bank'
  },
  onError: (err, req, res) => {
    console.error('Bank Service Proxy Error:', err.message);
    if (!res.headersSent) {
      res.status(503).json({
        error: 'Bank service unavailable',
        message: err.message
      });
    }
  }
}));

module.exports = router;