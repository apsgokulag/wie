// Path: services/auth-service/client/src/routes/AppRouter.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import UserDashboard from '../pages/dashboard/UserDashboard';
import ProfilePage from '../pages/profile/ProfilePage';
import SettingsPage from '../pages/profile/SettingsPage';
import PrivateRoute from './PrivateRoute';
import RoleBasedRoute from './RoleBasedRoute';

const AppRouter = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/admin" element={<RoleBasedRoute role="admin"><AdminDashboard /></RoleBasedRoute>} />
    <Route path="/home" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
    <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
    <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
  </Routes>
);

export default AppRouter;
