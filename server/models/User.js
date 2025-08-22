const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['Admin', 'Commander', 'Logistics'], required: true },
  base: String
});
module.exports = mongoose.model('User', userSchema);

