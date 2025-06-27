// D:\DEVELOP\wie\wie_creator\services\auth-service\src\services\tokenService.js
const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 * @param {Object} payload - Token payload
 * @returns {string} - JWT token
 */
const generateToken = (payload) => {
  try {
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      {
        expiresIn: process.env.JWT_EXPIRE || '7d'
      }
    );
    return token;
  } catch (error) {
    throw new Error('Error generating token');
  }
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} - Decoded token payload
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Generate refresh token
 * @param {Object} payload - Token payload
 * @returns {string} - Refresh token
 */
const generateRefreshToken = (payload) => {
  try {
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      {
        expiresIn: '30d' // Refresh token expires in 30 days
      }
    );
    return refreshToken;
  } catch (error) {
    throw new Error('Error generating refresh token');
  }
};

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken
};