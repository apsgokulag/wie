// D:\DEVELOP\wie\wie_creator\services\auth-service\client\src\pages\auth\Signup.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();

  const handleAdminSignup = () => {
    navigate('/adminsignup');
  };

  const handleOrganisationSignup = () => {
    navigate('/organisationsignup');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="signup-selection-container">
      <div className="signup-selection-card">
        <div className="signup-selection-header">
          <h1>Join WIE Creator</h1>
          <p>Choose your account type to get started</p>
        </div>

        <div className="signup-options">
          <div className="signup-option" onClick={handleAdminSignup}>
            <div className="option-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="option-content">
              <h3>Admin Account</h3>
              <p>For individual administrators and system managers</p>
              <ul>
                <li>Full system access</li>
                <li>User management</li>
                <li>System configuration</li>
              </ul>
            </div>
            <div className="option-arrow">→</div>
          </div>

          <div className="signup-option" onClick={handleOrganisationSignup}>
            <div className="option-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="option-content">
              <h3>Organisation Account</h3>
              <p>For companies, institutions, and organizations</p>
              <ul>
                <li>Organization management</li>
                <li>Team collaboration</li>
                <li>Multi-user access</li>
              </ul>
            </div>
            <div className="option-arrow">→</div>
          </div>
        </div>

        <div className="signup-selection-footer">
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
            onClick={handleBackToHome}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;