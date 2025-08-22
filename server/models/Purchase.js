const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const purchaseSchema = new Schema({
  base: { type: Schema.Types.ObjectId, ref: 'Base' },
  equipment: { type: Schema.Types.ObjectId, ref: 'Equipment' },
  quantity: Number,
  purchaseDate: Date,
  supplier: String
});
module.exports = mongoose.model('Purchase', purchaseSchema);
