import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleBasedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.role === role ? children : <Navigate to="/home" />;
};

export default RoleBasedRoute;