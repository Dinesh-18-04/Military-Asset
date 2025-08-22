const Purchase = require('../models/Purchase');
const Equipment = require('../models/Equipment');
const User = require('../models/User');
const Base = require('../models/Base');
exports.addPurchase = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const baseId = req.body.base || user.base;
    const equipmentId = req.body.equipment;

    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });

    const purchaseData = {
      ...req.body,
      base: baseId,
      equipment: equipmentId,
    };

    const purchase = await Purchase.create(purchaseData);
    res.status(201).json(purchase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getPurchases = async (req, res) => {
  const { base, equipment, fromDate, toDate } = req.query;
  const filter = {};
  if (base) filter.base = base;
  if (equipment) filter.equipment = equipment;
  if (fromDate || toDate) filter.purchaseDate = {};
  if (fromDate) filter.purchaseDate.$gte = new Date(fromDate);
  if (toDate) filter.purchaseDate.$lte = new Date(toDate);

  const purchases = await Purchase.find(filter)
    .populate('base', 'name')        
    .populate('equipment', 'name');  
  res.json(purchases);
};

