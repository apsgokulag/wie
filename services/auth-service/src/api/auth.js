// D:\DEVELOP\wie\wie_creator\services\auth-service\src\api\auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // <-- real MongoDB model

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'cf49e2e64af9b3cdc764c3fd5a3eba3b8da371f928d27324d5c9b70a343f9102d05894e84457e953ec118033dadf6cb99bb138a562dd70b9ff2f75fec7491ae0';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required',
      success: false 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        error: 'Invalid or expired token',
        success: false 
      });
    }
    req.user = user;
    next();
  });
};

// Test endpoints
router.get('/home', (req, res) => {
  res.json({ message: 'Home API is working well' });
});

router.get('/login', (req, res) => {
  res.json({ message: 'Login API is working' });
});

router.get('/signup', (req, res) => {
  res.json({ message: 'Signup API is working well' });
});

// Admin Signup with MongoDB - FIXED: Single hashing only
router.post('/adminsignup', async (req, res) => {
  const { name, email, contact_no, password } = req.body;
  
  if (!email || !password || !name || !contact_no) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    // FIXED: Only hash once with consistent salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ 
      name, 
      email: email.toLowerCase(), // Ensure consistent case
      contact_no,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Admin created successfully:', { email: newUser.email, id: newUser._id });

    res.status(201).json({
      message: 'Admin account created successfully',
      user: { 
        id: newUser._id, 
        name: newUser.name, 
        email: newUser.email,
        contact_no: newUser.contact_no,
        role: newUser.role
      },
    });
  } catch (err) {
    console.error('Admin signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Organisation Signup with MongoDB - FIXED: Single hashing only
router.post('/organisationsignup', async (req, res) => {
  const { email, contact_no, organization_name, organization_type, address, password } = req.body;
  
  if (!email || !password || !contact_no || !organization_name || !organization_type || !address) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'Organisation already exists with this email' });
    }

    // FIXED: Only hash once with consistent salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ 
      email: email.toLowerCase(), // Ensure consistent case
      contact_no,
      organization_name,
      organization_type,
      address,
      password: hashedPassword,
      role: 'organisation'
    });

    console.log('Organisation created successfully:', { email: newUser.email, id: newUser._id });

    res.status(201).json({
      message: 'Organisation account created successfully',
      user: { 
        id: newUser._id, 
        email: newUser.email,
        contact_no: newUser.contact_no,
        organization_name: newUser.organization_name,
        organization_type: newUser.organization_type,
        address: newUser.address,
        role: newUser.role
      },
    });
  } catch (err) {
    console.error('Organisation signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login with MongoDB - FIXED: Enhanced debugging and consistent comparison
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Input validation
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email and password are required',
      success: false 
    });
  }
  
  // Basic email format validation
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Please enter a valid email address',
      success: false 
    });
  }
  
  try {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', email);
    console.log('Password length:', password.length);
    
    // FIXED: Consistent email case handling
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(401).json({ 
        error: 'Invalid email or password',
        success: false 
      });
    }

    console.log('✅ User found:', { 
      id: user._id, 
      email: user.email, 
      role: user.role,
      hashedPasswordLength: user.password.length,
      hashedPasswordStart: user.password.substring(0, 10)
    });

    // Check if user is active
    if (!user.isActive || user.status !== 'active') {
      console.log('❌ User account inactive');
      return res.status(401).json({ 
        error: 'Account is inactive. Please contact support.',
        success: false 
      });
    }

    // FIXED: Enhanced password comparison with debugging
    console.log('🔐 Comparing passwords...');
    console.log('Plain password:', password);
    console.log('Hashed password:', user.password);
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password mismatch for user:', email);
      return res.status(401).json({ 
        error: 'Invalid email or password',
        success: false 
      });
    }

    console.log('✅ Password matched successfully');

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Return different user data based on role
    let userData;
    if (user.role === 'admin') {
      userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        contact_no: user.contact_no,
        role: user.role
      };
    } else if (user.role === 'organisation') {
      userData = {
        id: user._id,
        email: user.email,
        contact_no: user.contact_no,
        organization_name: user.organization_name,
        organization_type: user.organization_type,
        address: user.address,
        role: user.role
      };
    }

    console.log('✅ Login successful for user:', userData);

    res.json({
      message: 'Login successful',
      success: true,
      token,
      user: userData,
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      success: false 
    });
  }
});

// Enhanced Logout API with token verification and user tracking
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    console.log('=== LOGOUT ATTEMPT ===');
    console.log('User ID:', req.user.id);
    console.log('User Email:', req.user.email);
    console.log('User Role:', req.user.role);

    // Find the user in database
    const user = await User.findById(req.user.id);
    if (user) {
      // Update last logout time
      user.lastLogout = new Date();
      await user.save();
      console.log('✅ User logout time updated');
    }

    // Log successful logout
    console.log('✅ Logout successful for user:', {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      timestamp: new Date().toISOString()
    });

    res.json({
      message: 'Logout successful',
      success: true,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('❌ Logout error:', err);
    // Even if there's an error, we should allow logout
    res.json({
      message: 'Logout completed',
      success: true,
      timestamp: new Date().toISOString()
    });
  }
});

// Public logout route (for cases where token might be expired)
router.post('/logout-public', (req, res) => {
  console.log('=== PUBLIC LOGOUT ===');
  console.log('Timestamp:', new Date().toISOString());
  
  res.json({
    message: 'Logout successful',
    success: true,
    timestamp: new Date().toISOString()
  });
});

// Get current user info (protected route)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        success: false 
      });
    }

    let userData;
    if (user.role === 'admin') {
      userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        contact_no: user.contact_no,
        role: user.role,
        lastLogin: user.lastLogin,
        lastLogout: user.lastLogout
      };
    } else if (user.role === 'organisation') {
      userData = {
        id: user._id,
        email: user.email,
        contact_no: user.contact_no,
        organization_name: user.organization_name,
        organization_type: user.organization_type,
        address: user.address,
        role: user.role,
        lastLogin: user.lastLogin,
        lastLogout: user.lastLogout
      };
    }

    res.json({
      success: true,
      user: userData
    });
  } catch (err) {
    console.error('Get user info error:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      success: false 
    });
  }
});

module.exports = router;