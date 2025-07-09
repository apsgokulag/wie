import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess, setUser } from '../../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom'; // ✅ make sure Link is imported
import { loginUser } from '../../services/authService';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginUser(formData);
      console.log("API Response:", res);

      dispatch(loginSuccess(res.token));
      dispatch(setUser(res.user));
      navigate('/home');
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>
        {error && <div className="text-red-600 text-sm mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-blue-400"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* ✅ Register Button here */}
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600 mr-2">Don't have an account?</span>
          <Link
            to="/register"
            className="text-sm text-green-600 hover:underline"
          >
            Signup
          </Link>
        </div>
        <div className="mt-4 text-center">
          <Link
            to="/forgot-password"
            className="text-sm text-green-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
