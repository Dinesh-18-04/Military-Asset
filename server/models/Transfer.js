const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  fromBase: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  toBase: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  quantity: { type: Number, required: true },
  transferDate: { type: Date, required: true },
});

module.exports = mongoose.model('Transfer', transferSchema);
