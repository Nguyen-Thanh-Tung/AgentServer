const mongoose = require('mongoose');

const { Schema } = mongoose;

const AccountSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  access_token: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'deactive'],
    required: true,
    default: 'active',
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  deleted_at: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('Account', AccountSchema);
