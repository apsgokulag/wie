// D:\DEVELOP\wie\wie_creator\services\auth-service\client\src\pages\auth\AdminSignup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignupSelection.css';

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact_no: '',
    password: '',
    confirmPassword: ''
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Use API Gateway URL for admin signup
      const response = await axios.post('http://localhost:3001/api/auth/adminsignup', {
        name: formData.name,
        email: formData.email,
        contact_no: formData.contact_no,
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      if (response.data) {
        setSuccess('Admin account created successfully! Redirecting to login...');
        
        // Redirect to login after successful signup
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Admin signup error:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Admin signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSignup = () => {
    navigate('/signup');
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <div className="signup-type-badge admin">
            <span>👤</span>
            <span>Admin Account</span>
          </div>
          <h1>Create Admin Account</h1>
          <p>Join WIE Creator as an administrator</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

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
            <label htmlFor="contact_no">Contact Number</label>
            <input
              type="tel"
              id="contact_no"
              name="contact_no"
              value={formData.contact_no}
              onChange={handleChange}
              required
              placeholder="Enter your contact number"
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
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              disabled={loading}
              minLength={6}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button 
            type="submit" 
            className="signup-btn admin-btn"
            disabled={loading}
          >
            {loading ? 'Creating Admin Account...' : 'Create Admin Account'}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <button 
              type="button" 
              className="link-btn" 
              onClick={handleGoToLogin}
            >
              Sign in here
            </button>
          </p>
          <button 
            type="button" 
            className="back-btn" 
            onClick={handleBackToSignup}
          >
            ← Back to Signup Options
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;