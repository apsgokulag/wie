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
import Index from './pages/index';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyUser from './pages/auth/VerifyUser';
import ResetPassword from './pages/auth/ResetPassword';
import CreateGroup from './pages/ticket/CreateGroup';
import ViewGroups from './pages/ticket/ViewGroups';
import CreateTicket from './pages/ticket/CreateTicket';
import UpdateTicketMedia from './pages/ticket/UpdateTicketMedia';
import GroupSelectionModal from './components/modals/GroupSelectionModal';
import ViewEvents from './pages/ticket/ViewEvents';

// Protected Route - Only for authenticated users
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

// Public Route - Only for non-authenticated users (reverse protection)
const PublicRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);

  // If user is logged in, redirect to home
  if (token && user) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

// Mixed Route - Can be accessed by both authenticated and non-authenticated users
const MixedRoute = ({ children }) => {
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Mixed Routes - Accessible to everyone */}
      <Route path="/blocked" element={<div className="p-10 text-center text-red-600 text-xl font-semibold">You are blocked.</div>} />
      <Route path="/ticket/view-events" element={<ViewEvents />} />
      
      {/* Public Routes - Only for non-authenticated users */}
      <Route 
        path="/" 
        element={
          <PublicRoute>
            <Index />
          </PublicRoute>
        } 
      />
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/adminsignup" 
        element={
          <PublicRoute>
            <AdminSignup />
          </PublicRoute>
        } 
      />
      <Route 
        path="/organisationsignup" 
        element={
          <PublicRoute>
            <OrganisationSignup />
          </PublicRoute>
        } 
      />
      <Route 
        path="/forgot-password" 
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } 
      />
      <Route 
        path="/otp" 
        element={
          <PublicRoute>
            <OtpPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/verify-user/:input" 
        element={
          <PublicRoute>
            <VerifyUser />
          </PublicRoute>
        } 
      />
      <Route 
        path="/reset-password/:input" 
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        } 
      />

      {/* Protected Routes - Only for authenticated users */}
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
        path="/ticket/create-group"
        element={
          <ProtectedRoute allowedRoles={['organisation', 'admin']}>
            <CreateGroup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ticket/groups"
        element={
          <ProtectedRoute allowedRoles={['organisation', 'admin']}>
            <ViewGroups />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ticket/create-event/:groupId"
        element={
          <ProtectedRoute allowedRoles={['organisation', 'admin']}>
            <CreateTicket />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ticket/update-ticket-media/:ticketId"
        element={
          <ProtectedRoute allowedRoles={['organisation', 'admin']}>
            <UpdateTicketMedia />
          </ProtectedRoute>
        }
      />
      <Route
        path="/select-group"
        element={
          <ProtectedRoute allowedRoles={['organisation', 'admin']}>
            <GroupSelectionModal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin', 'organisation']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      {/* Catch-all route - redirect to appropriate page based on auth status */}
      <Route 
        path="*" 
        element={
          <Navigate to="/" replace />
        } 
      />
    </Routes>
  );
};
export default AppRoutes;
