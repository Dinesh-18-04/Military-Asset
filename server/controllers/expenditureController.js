const Expenditure = require('../models/Expenditure');
const Purchase = require('../models/Purchase');
const Transfer = require('../models/Transfer');
const Assignment = require('../models/Assignment');
const mongoose = require('mongoose');
const Base = require('../models/Base');

async function getCurrentStock(baseId, equipmentId) {
  const baseObjectId = new mongoose.Types.ObjectId(baseId);
  const equipmentObjectId = new mongoose.Types.ObjectId(equipmentId);

  const purchaseAgg = await Purchase.aggregate([
    { $match: { base: baseObjectId, equipment: equipmentObjectId } },
    { $group: { _id: null, totalQty: { $sum: '$quantity' } } }
  ]);
  const transfersInAgg = await Transfer.aggregate([
    { $match: { toBase: baseObjectId, equipment: equipmentObjectId } },
    { $group: { _id: null, totalQty: { $sum: '$quantity' } } }
  ]);
  const transfersOutAgg = await Transfer.aggregate([
    { $match: { fromBase: baseObjectId, equipment: equipmentObjectId } },
    { $group: { _id: null, totalQty: { $sum: '$quantity' } } }
  ]);
  const assignmentAgg = await Assignment.aggregate([
    { $match: { base: baseObjectId, equipment: equipmentObjectId } },
    { $group: { _id: null, totalQty: { $sum: '$quantity' } } }
  ]);
  const expenditureAgg = await Expenditure.aggregate([
    { $match: { base: baseObjectId, equipment: equipmentObjectId } },
    { $group: { _id: null, totalQty: { $sum: '$quantity' } } }
  ]);

  const purchased = purchaseAgg[0]?.totalQty || 0;
  const transferredIn = transfersInAgg[0]?.totalQty || 0;
  const transferredOut = transfersOutAgg[0]?.totalQty || 0;
  const assigned = assignmentAgg[0]?.totalQty || 0;
  const expended = expenditureAgg[0]?.totalQty || 0;

  console.log(purchased + " " + transferredIn + " " + transferredOut + " " + assigned + " " + expended);
  return purchased + transferredIn - transferredOut - assigned - expended;
}

exports.addExpenditure = async (req, res) => {
  try {
    const { base: baseName, equipment, quantity } = req.body;

    if (!baseName || !equipment || !quantity) {
      return res.status(400).json({ error: 'Missing required fields: base, equipment, quantity' });
    }

    const baseDoc = await Base.findOne({ name: baseName });
    if (!baseDoc) {
      return res.status(400).json({ error: 'Base not found' });
    }
    const baseId = baseDoc._id;

    if (!mongoose.Types.ObjectId.isValid(equipment)) {
      return res.status(400).json({ error: 'Invalid equipment id' });
    }

    const currentStock = await getCurrentStock(baseId, equipment);

    if (currentStock < quantity) {
      return res.status(400).json({ error: 'Insufficient quantity in base for expenditure' });
    }

    const expenditureData = { ...req.body, base: baseId };
    const expenditure = await Expenditure.create(expenditureData);
    res.status(201).json(expenditure);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getExpenditures = async (req, res) => {
  try {
    const expenditures = await Expenditure.find()
      .populate('base', 'name')
      .populate('equipment', 'name');

    const formatted = expenditures.map(e => ({
      _id: e._id,
      base: e.base?.name || null,
      equipment: e.equipment?.name || null,
      quantity: e.quantity,
      expenditureDate: e.expenditureDate,
      reason: e.reason,
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
