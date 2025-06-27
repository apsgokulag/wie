const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const router = express.Router();

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

router.use('/home', createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth/home': '/auth/home'
  }
}));


// Proxy for /api/auth/signup → /auth/signup
router.use('/signup', createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth/signup': '/auth/signup'
  }
}));

// Proxy for /api/auth/login → /auth/login
router.use('/login', createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth/login': '/auth/login'
  }
}));

module.exports = router;
