import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import LoginPage from './pages/auth/LoginPage';
import HomePage from './pages/auth/HomePage';
import ProfilePage from './pages/auth/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import RegisterPage from './pages/auth/RegisterPage';
import AdminSignup from './pages/auth/AdminSignup';
import OrganisationSignup from './pages/auth/OrganisationSignup';
import OtpPage from './pages/auth/OtpPage';
import Index from './pages/index'; // Assuming this is the main landing page
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, user } = useSelector((state) => state.auth);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user?.isBlocked) {
    return <Navigate to="/blocked" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/blocked" element={<div className="p-10 text-center text-red-600 text-xl font-semibold">You are blocked.</div>} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/adminsignup" element={<AdminSignup />} />
      <Route path="/organisationsignup" element={<OrganisationSignup />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute allowedRoles={['organisation', 'admin']}>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['admin', 'organisation']}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin','organisation']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
