const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  personnel: { type: String, required: true },
  quantity: { type: Number, required: true },
  assignmentDate: { type: Date, required: true }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
