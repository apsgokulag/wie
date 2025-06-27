// D:\DEVELOP\wie\wie_creator\services\auth-service\client\src\App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupSelection from './pages/auth/Signup';
import AdminSignup from './pages/auth/AdminSignup';
import OrganisationSignup from './pages/auth/OrganisationSignup';
import Login from './pages/auth/Login'; 
import Home from './pages/Home';
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignupSelection />} />
          <Route path="/adminsignup" element={<AdminSignup />} />
          <Route path="/organisationsignup" element={<OrganisationSignup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;