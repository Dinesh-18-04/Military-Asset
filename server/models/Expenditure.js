const mongoose = require('mongoose');

const expenditureSchema = new mongoose.Schema({
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  quantity: { type: Number, required: true },
  expenditureDate: { type: Date, required: true },
  reason: { type: String, required: true }
});

module.exports = mongoose.model('Expenditure', expenditureSchema);
