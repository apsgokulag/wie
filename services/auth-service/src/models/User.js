// D:\DEVELOP\wie\wie_creator\services\auth-service\src\models\User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  name: {
    type: String,
    required: function() {
      return this.role === 'admin';
    },
    trim: true,
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  contact_no: {
    type: String,
    trim: true
  },
  otp: {
    type: String
  },
  otp_expiry: {
    type: Date
  },
  otp_status: {
    type: String,
    enum: ['pending', 'verified', 'expired'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  verification_token: {
    type: String
  },
  auth_token: {
    type: String
  },
  // Add auth_key field to match the database index
  auth_key: {
    type: String,
    sparse: true // This allows multiple null values and prevents the duplicate key error
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['organisation', 'admin'],
    default: 'admin'
  },
  organization_name: {
    type: String,
    required: function() {
      return this.role === 'organisation';
    },
    trim: true
  },
  organization_type: {
    type: String,
    required: function() {
      return this.role === 'organisation';
    },
    enum: ['Private', 'Government', 'NGO', 'Educational', 'Healthcare', 'Non-profit', 'Other']
  },
  address: {
    type: String,
    required: function() {
      return this.role === 'organisation';
    },
    trim: true
  },
  profile_pic: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.auth_key;
  delete user.auth_token;
  delete user.otp;
  delete user.verification_token;
  return user;
};
module.exports = mongoose.model('User', userSchema);