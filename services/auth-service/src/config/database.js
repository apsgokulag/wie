// src/config/database.js
const mongoose = require('mongoose');

const connectDatabase = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/wie_creator_auth';
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'wie_creator_auth',
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDatabase;
