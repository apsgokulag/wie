const mongoose = require('mongoose');
module.exports = async function connectDB(uri) {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Database connected');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};