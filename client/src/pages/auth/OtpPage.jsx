// pages/OtpPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOtp } from '../../services/authService'; // You will implement this

const OtpPage = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const contact_no = location.state?.contact_no;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await verifyOtp({ email, contact_no, otp });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center text-blue-600">Verify OTP</h2>
        {error && <div className="text-red-600 text-sm mb-4 text-center">{error}</div>}
        <p className="text-sm text-gray-600 mb-4 text-center">Enter the OTP sent to <strong>{email}</strong></p>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full border rounded px-3 py-2 mb-4 focus:outline-blue-400"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default OtpPage;
