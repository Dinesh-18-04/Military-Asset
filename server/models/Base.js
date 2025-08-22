const mongoose = require('mongoose');
const baseSchema = new mongoose.Schema({
  name: String,
  location: String
});
module.exports = mongoose.model('Base', baseSchema);
