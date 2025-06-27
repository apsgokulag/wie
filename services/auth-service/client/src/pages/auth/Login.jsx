// D:\DEVELOP\wie\wie_creator\services\auth-service\client\src\pages\auth\Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('=== FRONTEND LOGIN ATTEMPT ===');
      console.log('Email:', formData.email);
      console.log('Password length:', formData.password.length);

      // FIXED: Use consistent port 3001 for all auth operations
      const response = await axios.post('http://localhost:3001/api/auth/login', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      console.log('✅ Login response:', response.data);

      if (response.data.token && response.data.user) {
        setSuccess('Login successful! Redirecting...');
        
        // Store token and user data
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        
        // Role-based navigation
        const userRole = response.data.user.role;
        
        setTimeout(() => {
          if (userRole === 'admin') {
            console.log('Redirecting admin to dashboard...');
            navigate('/dashboard'); // FIXED: More specific route for admin
          } else if (userRole === 'organisation') {
            console.log('Redirecting organisation to dashboard...');
            navigate('/dashboard'); // FIXED: More specific route for organisation
          } else {
            // Fallback
            console.log('Redirecting to general dashboard...');
            navigate('/home');
          }
        }, 1500);
      } else {
        setError('Login response missing required data');
      }
    } catch (err) {
      console.error('❌ Frontend login error:', err);
      
      // Enhanced error handling
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.status === 400) {
        setError('Please fill in all required fields');
      } else if (err.code === 'ECONNREFUSED') {
        setError('Cannot connect to server. Please check if the server is running on port 3001.');
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleGoToSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Please login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <button 
              type="button" 
              className="link-btn" 
              onClick={handleGoToSignup}
            >
              Sign up here
            </button>
          </p>
          <button 
            type="button" 
            className="back-btn" 
            onClick={handleBackToHome}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;