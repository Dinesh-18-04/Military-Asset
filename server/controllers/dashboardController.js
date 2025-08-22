const Purchase = require('../models/Purchase');
const Transfer = require('../models/Transfer');
const Assignment = require('../models/Assignment');
const Expenditure = require('../models/Expenditure');
const mongoose = require('mongoose');
const Base = require('../models/Base');
exports.getDashboardMetrics = async (req, res) => {
  try {
    const { base, equipment, fromDate, toDate } = req.query;
    const baseid = await Base.findOne({ name: base });
    if (!baseid || !equipment || !fromDate || !toDate) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }

    let baseObjectId, equipmentObjectId;
    try {
      baseObjectId = new mongoose.Types.ObjectId(baseid);
      equipmentObjectId =new mongoose.Types.ObjectId(equipment);
    } catch {
      return res.status(400).json({ error: 'Invalid base or equipment id' });
    }

    const purchaseFilter = { base: baseObjectId, equipment: equipmentObjectId };
    const transferInFilter = { toBase: baseObjectId, equipment: equipmentObjectId };
    const transferOutFilter = { fromBase: baseObjectId, equipment: equipmentObjectId };
    const assignmentFilter = { base: baseObjectId, equipment: equipmentObjectId };
    const expenditureFilter = { base: baseObjectId, equipment: equipmentObjectId };

    const openingDateFilter = (dateField, date) =>
      date ? { [dateField]: { $lt: new Date(date) } } : {};

    const betweenDatesFilter = (dateField, from, to) => {
      const filter = {};
      if (from) filter.$gte = new Date(from);
      if (to) {
        const toDateObj = new Date(to);
        toDateObj.setHours(23, 59, 59, 999);
        filter.$lte = toDateObj;
      }
      return Object.keys(filter).length ? { [dateField]: filter } : {};
    };

    const sumQuantity = (arr) => (arr[0] ? arr[0].qty : 0);

    const openingPurchases = await Purchase.aggregate([
      { $match: { ...purchaseFilter, ...openingDateFilter('purchaseDate', fromDate) } },
      { $group: { _id: null, qty: { $sum: '$quantity' } } },
    ]);
    const openingTransfersIn = await Transfer.aggregate([
      { $match: { ...transferInFilter, ...openingDateFilter('transferDate', fromDate) } },
      { $group: { _id: null, qty: { $sum: '$quantity' } } },
    ]);
    const openingTransfersOut = await Transfer.aggregate([
      { $match: { ...transferOutFilter, ...openingDateFilter('transferDate', fromDate) } },
      { $group: { _id: null, qty: { $sum: '$quantity' } } },
    ]);
    const openingAssignments = await Assignment.aggregate([
      { $match: { ...assignmentFilter, ...openingDateFilter('assignmentDate', fromDate) } },
      { $group: { _id: null, qty: { $sum: '$quantity' } } },
    ]);
    const openingExpenditures = await Expenditure.aggregate([
      { $match: { ...expenditureFilter, ...openingDateFilter('expenditureDate', fromDate) } },
      { $group: { _id: null, qty: { $sum: '$quantity' } } },
    ]);

    const openingBalance =
      sumQuantity(openingPurchases) +
      sumQuantity(openingTransfersIn) -
      sumQuantity(openingTransfersOut) -
      sumQuantity(openingAssignments) -
      sumQuantity(openingExpenditures);

    const periodPurchases = await Purchase.aggregate([
      { $match: { ...purchaseFilter, ...betweenDatesFilter('purchaseDate', fromDate, toDate) } },
      { $group: { _id: null, qty: { $sum: '$quantity' } } },
    ]);
    const periodTransfersIn = await Transfer.aggregate([
      { $match: { ...transferInFilter, ...betweenDatesFilter('transferDate', fromDate, toDate) } },
      { $group: { _id: null, qty: { $sum: '$quantity' } } },
    ]);
    const periodTransfersOut = await Transfer.aggregate([
      { $match: { ...transferOutFilter, ...betweenDatesFilter('transferDate', fromDate, toDate) } },
      { $group: { _id: null, qty: { $sum: '$quantity' } } },
    ]);
    const periodAssignments = await Assignment.aggregate([
      { $match: { ...assignmentFilter, ...betweenDatesFilter('assignmentDate', fromDate, toDate) } },
      { $group: { _id: null, qty: { $sum: '$quantity' } } },
    ]);
    const periodExpenditures = await Expenditure.aggregate([
      { $match: { ...expenditureFilter, ...betweenDatesFilter('expenditureDate', fromDate, toDate) } },
      { $group: { _id: null, qty: { $sum: '$quantity' } } },
    ]);

    const purchases = sumQuantity(periodPurchases);
    const transfersIn = sumQuantity(periodTransfersIn);
    const transfersOut = sumQuantity(periodTransfersOut);
    const assignments = sumQuantity(periodAssignments);
    const expended = sumQuantity(periodExpenditures);

    const netMovement = purchases + transfersIn - transfersOut;
    const closingBalance = openingBalance + netMovement - assignments - expended;

    res.json({
      openingBalance,
      netMovement,
      purchases,
      transfersIn,
      transfersOut,
      assignments,
      expended,
      closingBalance,
    });
    console.log("FINISHED");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
