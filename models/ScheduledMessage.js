const mongoose = require('mongoose');

const ScheduledMessageSchema = new mongoose.Schema({
  message: String,
  scheduleTime: Date
});

module.exports = mongoose.model('ScheduledMessage', ScheduledMessageSchema);