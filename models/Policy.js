const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
  policy_number: String,
  policy_start_date: Date,
  policy_end_date: Date,
  user_id: mongoose.Schema.Types.ObjectId, // Link to user
  company_id: mongoose.Schema.Types.ObjectId,
  category_id: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model('Policy', PolicySchema);
