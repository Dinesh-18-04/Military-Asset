const Transfer = require('../models/Transfer');
const Purchase = require('../models/Purchase');
const Assignment = require('../models/Assignment');
const Expenditure = require('../models/Expenditure');
const Base = require('../models/Base');
const Equipment = require('../models/Equipment');

const mongoose = require('mongoose');

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
  const transferredIn = transfersInAgg?.totalQty || 0;
  const transferredOut = transfersOutAgg?.totalQty || 0;
  const assigned = assignmentAgg?.totalQty || 0;
  const expended = expenditureAgg?.totalQty || 0;
  console.log(purchased + " " + transferredIn + " " + transferredOut + " " + assigned + " " + expended);
  return purchased + transferredIn - transferredOut - assigned - expended;
}


exports.recordTransfer = async (req, res) => {
  try {
    const { fromBase, toBase, equipment, quantity, transferDate } = req.body;
    const currentStock = await getCurrentStock(fromBase, equipment);
    console.log('Current stock:', currentStock);
    if (currentStock < quantity) {
      return res.status(400).json({ error: 'Insufficient quantity in fromBase for transfer' });
    }
    console.log(1);
    const transfer = await Transfer.create({ fromBase, toBase, equipment, quantity, transferDate });
    res.status(201).json(transfer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find()
      .populate('fromBase', 'name')
      .populate('toBase', 'name')
      .populate('equipment', 'name');
    res.json(transfers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
