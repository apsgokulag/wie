// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    contact_no: {
      type: String,
      required: true,
    },
    organisation_type: {
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
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['organisation', 'admin'],
      default: 'admin',
    },
    lastLogout: {
      type: Date
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);

const User = mongoose.model('User', userSchema);

export default User;
