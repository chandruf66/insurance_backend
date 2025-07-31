const mongoose = require('mongoose');

const lobSchema = new mongoose.Schema({
  category_name: String
});

module.exports = mongoose.model('LOB', lobSchema);