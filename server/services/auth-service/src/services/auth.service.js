import User from '../models/user.model.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateToken,verifyResetToken } from '../utils/jwt.js';
import otpService from '../reposetory/otp.js';
import { generateOtp } from '../utils/otp.js';
import { sendEmail } from '../utils/sendMail.js';
import { sendSMSOTP } from '../utils/sendSMS.js';
export const index = (req, res) => {
  res.json({ message: 'Welcome to the authentication service' }); 
};
export const adminSignup = async (req, res) => {
  try {
    console.log("hiiii")
    const { name, email, contact_no, password } = req.body;
    if (!name || !email || !contact_no || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const contactExist = await User.findOne({ contact_no });
    if (contactExist) {
      return res.status(400).json({ message: 'Contact number already in use' });
    }
    const hashed = await hashPassword(password);
    const image = req.file ? req.file.filename : '';
    const user = await User.create({ name, email, contact_no, password: hashed, image });
    // Generate OTP (e.g., 6 digit)
    const otp = generateOtp(); // => '123456'
    // Save OTP to DB
    await otpService.insertOTP(user._id, otp, 10); // 10 minutes expiry
    // Send OTP via Email
    await sendEmail(user.email, otp);
    // Send OTP via SMS
    await sendSMSOTP(user.contact_no, otp); // Assuming contact_no is a valid phone number
    res.status(201).json({ message: 'Signup successfully. OTP sent to email and SMS.' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed' });
  }
};
export const organisationSignup = async (req, res) => {
  try {
    const { name, email, contact_no, organisation_type, address, password } = req.body;
    if (!name || !email || !contact_no || !organisation_type || !address || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: 'Email already in use' }); 
    }
    const contactExist = await User.findOne({ contact_no });
    if (contactExist) {
      return res.status(400).json({ message: 'Contact number already in use' });
    }
    const hashed = await hashPassword(password);

    const image = req.file ? req.file.filename : '';
    const user = await User.create({
      name,
      email,
      contact_no,
      organisation_type,
      address,
      password: hashed,
      image,
      role: 'organisation', // Set role to organisation
    });
    // Generate OTP (e.g., 6 digit)
    const otp = generateOtp(); // =>
    // Save OTP to DB
    await otpService.insertOTP(user._id, otp, 10); // 10 minutes
    // Send OTP via Email
    await sendEmail(user.email, otp);
    // Send OTP via SMS
    await sendSMSOTP(user.contact_no, otp); // Assuming contact_no is a valid phone number
    res.status(201).json({ message: 'Signup successfully. OTP sent to email and SMS.' });
  } catch (err) {
    console.error('Organisation signup error:', err);
    res.status(500).json({ message: 'Organisation signup failed' });
  }
};
export const login = async (req, res) => {
  try {
    console.log("hiiii")
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email'});
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid email or password' });
    if (user.isBlocked) return res.status(403).json({ message: 'User is blocked' });
    const token = generateToken(user);
    const { password: _, ...userData } = user.toObject();
    res.json({ token, user: userData });
    await sendEmail(user.email, token);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    // Validate ID format
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await User.findById(userId).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error in getUserById:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, contact_no, otp } = req.body;
    console.log(email, contact_no, otp)
  try {
    const user = await User.findOne({ email, contact_no });
     console.log(user)
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isValid = await otpService.verifyOtp(user._id, otp); // Pass user._id, not email
     console.log(isValid)
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
};
export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    if (user) {
      user.lastLogout = new Date();
      await user.save();
      console.log('User logout time updated');
    }
    res.json({
      message: 'Logout successful',
      success: true,
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Server error during logout' });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const input = req.body;
    // Add debug log to check if body is being parsed
    console.log('Request body:', input);
    // Validate input
    if (!input || (!input.email && !input.contact_no)) {
      return res.status(400).json({ 
        message: 'Please provide either email or contact number' 
      });
    }
    // Find user by either email or contact_no (single query)
    let user;
    if (input.email) {
      user = await User.findOne({ email: input.email });
    } else if (input.contact_no) {
      user = await User.findOne({ contact_no: input.contact_no });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP (e.g., 6 digit)
    const otp = generateOtp(); // e.g., '123456'

    // Save OTP to DB with expiry
    await otpService.insertOTP(user.id, otp, 10); // 10 minutes expiry

    // Send OTP only to the provided input (email or contact_no)
    if (input.email) {
      await sendEmail(input.email, otp);
    } else if (input.contact_no) {
      await sendSMSOTP(input.contact_no, otp);
    }

    res.status(200).json({ message: 'OTP sent for password reset' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error during forgot password' });
  }
};
export const verifyUser = async (req, res) => {
  try {
    const { input, otp } = req.body;
    if (!input || (!input.email && !input.contact_no)) {
      return res.status(400).json({ 
        message: 'Please provide either email or contact number' 
      });
    }
    // Find user by either email or contact_no (single query)
    let user;
    if (input.email) {
      user = await User.findOne({ email: input.email });
    } else if (input.contact_no) {
      user = await User.findOne({ contact_no: input.contact_no });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Verify OTP
    const isValid = await otpService.verifyOtp(user.id, otp);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    const token = generateToken(user.id);
    res.status(200).json({ 
      message: 'User verified successfully', 
      token: token,
      userId: user._id // For debugging
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error during password reset'});
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    if (!userId || !newPassword) {
      return res.status(400).json({ message: 'User ID and new password are required' });
    }
    if (!userId) {
      return res.status(400).json({ message: 'Invalid userId: user ID not found' });
    }
    // Find user by ID
    const user = await User.findById(userId);
    console.log('User found:', user ? 'Yes' : 'No');
    console.log('User ID type:', typeof userId);
    if (!user) {
      // Try to find user with different ID formats
      const userByString = await User.findById(userId.toString());
      console.log('User found by string ID:', userByString ? 'Yes' : 'No');
      
      if (!userByString) {
        return res.status(404).json({ message: 'User not found' });
      }
      user = userByString;
    }

    // Hash and update password
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
    console.log('Password updated successfully for user:', user._id);
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

