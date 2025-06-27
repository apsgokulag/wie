// D:\DEVELOP\wie\wie_creator\services\auth-service\client\src\pages\auth\OrganisationSignup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignupSelection.css';

const OrganisationSignup = () => {
  const [formData, setFormData] = useState({
    email: '',    
    contact_no: '',
    organization_name: '',
    organization_type: '',
    address: '',
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
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/auth/organisationsignup', {
        email: formData.email,
        password: formData.password,
        contact_no: formData.contact_no,
        organization_name: formData.organization_name,
        organization_type: formData.organization_type,
        address: formData.address
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      if (response.data) {
        setSuccess('Organisation account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Organisation signup error:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Organisation signup failed. Please try again.');
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
          <div className="signup-type-badge organization">
            <span>🏢</span>
            <span>Organisation Account</span>
          </div>
          <h1>Create Organisation Account</h1>
          <p>Join WIE Creator as an organisation</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="organization_name">Organization Name</label>
            <input
              type="text"
              id="organization_name"
              name="organization_name"
              value={formData.organization_name}
              onChange={handleChange}
              required
              placeholder="Enter your organization name"
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
              placeholder="Enter organisation email"
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
              placeholder="Enter organisation contact number"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="organization_type">Organization Type</label>
            <select
              id="organization_type"
              name="organization_type"
              value={formData.organization_type}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Select organization type</option>
              <option value="Private">Private Company</option>
              <option value="Government">Government</option>
              <option value="NGO">NGO</option>
              <option value="Educational">Educational Institution</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Non-profit">Non-profit</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="address">Organisation Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter your organization address"
              disabled={loading}
              rows="3"
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
            className="signup-btn organization-btn" 
            disabled={loading}
          >
            {loading ? 'Creating Organisation Account...' : 'Create Organisation Account'}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <button type="button" className="link-btn" onClick={handleGoToLogin}>
              Sign in here
            </button>
          </p>
          <button type="button" className="back-btn" onClick={handleBackToSignup}>
            ← Back to Signup Options
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganisationSignup;