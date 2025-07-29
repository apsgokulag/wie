import React, { useState } from 'react';

// --- SVG Icon Imports ---
// Changed the import syntax to be compatible with different build tools like Vite.
// This imports the SVGs as URLs instead of React components.
import UserTopIcon from '../../assets/user_top.svg';
import UserInputIcon from '../../assets/user.svg';
import Logo from '../../assets/wie_logo.svg';
import PasswordInputIcon from '../../assets/password.svg';
import { FaFacebookF,FaXTwitter } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";


import bg from "../../assets/background.png";


// --- Mock Implementations for Standalone Demo ---
// In your actual app, you would use the imports from react-redux and react-router-dom.
const useDispatch = () => (action) => console.log('Dispatching Action:', action.type, action.payload || '');
const useNavigate = () => (path) => console.log(`Navigating to: ${path}`);
const Link = ({ to, children, className }) => <a href={to} className={className}>{children}</a>;

// Mock service function to simulate an API call
const loginUser = async (formData) => {
  console.log("Attempting to log in with:", formData);
  await new Promise(resolve => setTimeout(resolve, 500));
  if (formData.email === "test@example.com" && formData.password === "password") {
    console.log("Login successful");
    return { token: "xyz-fake-token-123", user: { id: 1, name: "Test User", email: "test@example.com" } };
  } else {
    console.error("Login failed: Invalid credentials");
    const error = new Error("Invalid credentials provided.");
    error.response = { data: { message: "Login failed. Please check your email and password." } };
    throw error;
  }
};

// Mock Redux actions
const loginSuccess = (token) => ({ type: 'auth/loginSuccess', payload: token });
const setUser = (user) => ({ type: 'auth/setUser', payload: user });

// --- Social Icons (Kept as inline for demo purposes) ---
const SocialIcon = ({ type, ...props }) => {
  const icons = {
    x: <path d="M18 6 6 18M6 6l12 12" />,
    facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
    instagram: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>{icons[type]}</svg>;
};


const LoginPage = () => {
  // --- Original State and Logic (preserved) ---
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await loginUser(formData);
      dispatch(loginSuccess(res.token));
      dispatch(setUser(res.user));
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({ email: '', password: '' });
    setError('');
  }

  // --- New JSX Structure based on the design ---
  return (
    <div className="min-h-screen w-full font-sans text-white bg-cover "      style={{
            backgroundImage: `url(${bg})`,
          }}>
      <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 bg-black/60">
        
        <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center md:px-12">
          <div>
            <img src={Logo} alt="" className="text-3xl font-bold tracking-wider"/>
          </div>
           
            <Link to="/login" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Login</Link>
        </header>

        <main className="w-full max-w-lg bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="inline-block  p-3 rounded-full mb-4 0">
                {/* Using imported icon as an image src */}
                <img src={UserTopIcon} alt="User" className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold">Login</h2>
              <p className="text-white/60 mt-2 text-sm">
                Log in to continue managing your events, your team, and your success.
              </p>
            </div>

            {error && (
              <div className="text-red-300 bg-red-500/20 border border-red-500/30 p-3 rounded-lg mb-4 text-center text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="relative flex items-center">
                {/* Using imported icon as an image src */}
                <img src={UserInputIcon} alt="User Icon" className="w-4 h-4 absolute right-4 pointer-events-none"/>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Username, Email or Contact"
                  className="w-full bg-white/5 border border-white/20 rounded-lg py-3 pl-4 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-white/40"
                />
              </div>

              {/* Password Input */}
              <div className="relative flex items-center">
                 <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Password"
                  className="w-full bg-white/5 border border-white/20 rounded-lg py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-white/40"
                />
                {/* Using imported icon as an image src */}
                <img src={PasswordInputIcon} alt="Password Icon" className="w-4 h-4 absolute right-4 pointer-events-none"/>
              </div>

              <div className="flex justify-between items-center text-xs sm:text-sm text-white/60">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" className="h-4 w-4 bg-transparent border-white/30 rounded text-purple-500 focus:ring-purple-500 focus:ring-offset-0" />
                  Remember mee
                </label>
                <Link to="/forgot-password" className="hover:underline hover:text-white">Forgot password?</Link>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="w-full bg-black/20 border border-white/20 rounded-3xl py-3 font-semibold hover:bg-black/40 transition-colors duration-300 disabled:opacity-50"
                  disabled={isLoading}
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="w-full bg-[#5E5CE6] rounded-3xl py-3 font-semibold hover:bg-[#5844d1] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Login'
                  )}
                </button>
              </div>
            </form>
          </div>
          <div className=" py-4 px-8 text-center text-sm">
            <p className="text-white/60">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-purple-400 hover:text-purple-300 hover:underline">
                Signup
              </Link>
            </p>
          </div>
        </main>
        
        <footer className="absolute bottom-0 left-0 w-full p-6 flex justify-center md:justify-start md:px-12 items-center gap-4 text-white/80">
            <span className="text-sm">Follow us on:</span>
            <div className="flex gap-3">
                 <Link to="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#5E5CE6] hover:bg-[$5E5CE6]/20 text-white transition-colors"><FaXTwitter/></Link>
                 <Link to="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#5E5CE6] hover:bg-[$5E5CE6]/20 text-white transition-colors"><FaFacebookF/></Link>
                 <Link to="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#5E5CE6] hover:bg-[$5E5CE6]/20 text-white transition-colors"><RiInstagramFill/></Link>
            </div>
        </footer>
      </div>
    </div>
  );
};
export default LoginPage;