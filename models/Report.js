const mongoose = require('mongoose');

const { Schema } = mongoose;

const ReportSchema = new Schema({
  server_id: {
    type: Schema.ObjectId,
    ref: 'Server',
    required: true,
  },
  request_number: {
    type: Number,
    default: 0,
  },
  response_time: {
    type: Number,
    default: 0,
  },
  error_number: {
    type: Number,
    default: 0,
  },
  connection_number: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Report', ReportSchema);
