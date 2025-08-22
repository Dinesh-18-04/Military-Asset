const Base = require('../models/Base');
exports.createBase = async (req, res) => {
  const base = await Base.create(req.body);
  res.status(201).json(base);
};
exports.getBases = async (req, res) => {
  const bases = await Base.find();
  res.json(bases);
};
