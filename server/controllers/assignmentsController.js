const Assignment = require('../models/Assignment');
const Purchase = require('../models/Purchase');
const Transfer = require('../models/Transfer');
const Expenditure = require('../models/Expenditure');
const mongoose = require('mongoose');
const Base = require("../models/Base");

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

exports.assignAsset = async (req, res) => {
  try {
    const { base: baseName, equipment, quantity } = req.body;

    if (!baseName || !equipment || !quantity) {
      return res.status(400).json({ error: 'Missing required fields: base, equipment, quantity' });
    }

    // Find base document by name
    const baseDoc = await Base.findOne({ name: baseName });
    if (!baseDoc) {
      return res.status(400).json({ error: 'Base not found' });
    }
    const baseId = baseDoc._id;

    // Validate equipment id
    if (!mongoose.Types.ObjectId.isValid(equipment)) {
      return res.status(400).json({ error: 'Invalid equipment id' });
    }

    const currentStock = await getCurrentStock(baseId, equipment);
    if (currentStock < quantity) {
      return res.status(400).json({ error: 'Insufficient quantity in base for assignment' });
    }

    // Prepare assignment data with base as ObjectId
    const assignmentData = { ...req.body, base: baseId };

    const assignment = await Assignment.create(assignmentData);
    res.status(201).json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('base', 'name')
      .populate('equipment', 'name');

    // Map to format base and equipment as just names (or any other shape)
    const formatted = assignments.map((a) => ({
      _id: a._id,
      base: a.base?.name || null,
      equipment: a.equipment?.name || null,
      personnel: a.personnel,
      quantity: a.quantity,
      assignmentDate: a.assignmentDate,
      // include any other fields as needed
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
