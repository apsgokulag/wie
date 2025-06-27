// D:\DEVELOP\wie\wie_creator\services\auth-service\src\routes\authRoutes.js
const express = require('express');
const path = require('path');
const router = express.Router();

// Serve static files from the React build folder
router.use(express.static(path.join(__dirname, '../../client/dist')));

// Serve React app for frontend routes (SPA routing)
router.get([
  '/', 
  '/login', 
  '/signup', 
  '/adminsignup',
  '/organisationsignup', 
  '/dashboard', 
  '/home'
], (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

module.exports = router;