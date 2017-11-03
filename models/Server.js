const mongoose = require('mongoose');

const { Schema } = mongoose;

const ServerSchema = new Schema({
  account_id: {
    type: Schema.ObjectId,
    ref: 'Account',
    required: true,
  },
  server_name: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
  },
  server_ip: {
    type: String,
  },
  port: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'deactive'],
    required: true,
    default: 'active',
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model('Server', ServerSchema);
