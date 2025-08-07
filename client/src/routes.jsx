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
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyUser from './pages/auth/VerifyUser';
import ResetPassword from './pages/auth/ResetPassword';
import CreateGroup from './pages/ticket/CreateGroup';
import ViewGroups from './pages/ticket/ViewGroups';
import CreateTicket from './pages/ticket/CreateTicket';
import UpdateTicketMedia from './pages/ticket/UpdateTicketMedia';
import GroupSelectionModal from './components/modals/GroupSelectionModal'; // Import the modal
import ViewEvents from './pages/ticket/ViewEvents';
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
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-user/:input" element={<VerifyUser />} />
      <Route path="/reset-password/:input" element={<ResetPassword />} />
      <Route path="/ticket/create-event/:groupId" element={<CreateTicket />} />
      <Route path="/ticket/update-ticket-media/:ticketId" element={<UpdateTicketMedia />} />
      <Route path="/select-group" element={<GroupSelectionModal />} />
      <Route path="/ticket/create-group" element={<CreateGroup />} />
      <Route path="/ticket/view-events" element={<ViewEvents />} />
      {/* Protected Routes */}
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
