const Equipment = require('../models/Equipment');
exports.createEquipment = async (req, res) => {
  const equipment = await Equipment.create(req.body);
  res.status(201).json(equipment);
};
exports.getEquipment = async (req, res) => {
  const equipment = await Equipment.find();
  res.json(equipment);
};
