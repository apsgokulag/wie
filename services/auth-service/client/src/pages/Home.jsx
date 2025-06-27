// D:\DEVELOP\wie\wie_creator\services\auth-service\client\src\pages\Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to WIE Creators</h1>
        <p className="hero-subtitle">Your creative platform for amazing content</p>
        
        <div className="auth-buttons">
          <button className="btn btn-primary" onClick={handleLogin}>
            Login
          </button>
          <button className="btn btn-secondary" onClick={handleSignup}>
            Sign Up
          </button>
        </div>
      </div>
      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🎨 Creative Tools</h3>
            <p>Access powerful creative tools for content creation</p>
          </div>
          <div className="feature-card">
            <h3>📊 Analytics</h3>
            <p>Track your content performance with detailed analytics</p>
          </div>
          <div className="feature-card">
            <h3>🤝 Collaboration</h3>
            <p>Work together with your team seamlessly</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;