const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  token: String,
  createdAt: { type: Date, default: Date.now, expires: '7d' }
});
module.exports = mongoose.model('Session', sessionSchema);