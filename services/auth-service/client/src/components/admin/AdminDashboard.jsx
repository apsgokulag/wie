// D:\DEVELOP\wie\wie_creator\services\auth-service\client\src\components\admin\AdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const handleLogout = async () => {
    try {
      // Call logout API
      const response = await fetch('http://localhost:3001/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Show success message (optional)
        alert('Logged out successfully!');
        
        // Navigate to login page
        navigate('/login');
      } else {
        console.error('Logout failed:', data.error);
        // Even if API fails, clear local storage and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Clear localStorage and redirect even on error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>
              {user.role === 'admin' ? 'Admin Dashboard' : 'Organisation Dashboard'}
            </h1>
            <p>
              Welcome {user.role === 'admin' ? user.name : user.organization_name}!
            </p>
          </div>
          <button 
            className="logout-btn" 
            onClick={handleLogout}
            title="Logout"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="auth-section">
        <h2>
          This is {user.role === 'admin' ? 'Admin' : 'Organisation'} Home
        </h2>
        <div className="user-info">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          {user.role === 'admin' && (
            <p><strong>Contact:</strong> {user.contact_no}</p>
          )}
          {user.role === 'organisation' && (
            <>
              <p><strong>Organization:</strong> {user.organization_name}</p>
              <p><strong>Type:</strong> {user.organization_type}</p>
              <p><strong>Contact:</strong> {user.contact_no}</p>
            </>
          )}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>📊 Analytics</h3>
          <p>View system analytics and user statistics</p>
          <button className="card-btn">View Analytics</button>
        </div>
        <div className="dashboard-card">
          <h3>👥 User Management</h3>
          <p>Manage users, roles, and permissions</p>
          <button className="card-btn">Manage Users</button>
        </div>
        <div className="dashboard-card">
          <h3>⚙️ Settings</h3>
          <p>Configure system settings and preferences</p>
          <button className="card-btn">System Settings</button>
        </div>
        <div className="dashboard-card">
          <h3>📝 Content</h3>
          <p>Manage content, posts, and media</p>
          <button className="card-btn">Content Management</button>
        </div>
        <div className="dashboard-card">
          <h3>🔒 Security</h3>
          <p>Security settings and access control</p>
          <button className="card-btn">Security Panel</button>
        </div>
        <div className="dashboard-card">
          <h3>📈 Reports</h3>
          <p>Generate and view system reports</p>
          <button className="card-btn">View Reports</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;