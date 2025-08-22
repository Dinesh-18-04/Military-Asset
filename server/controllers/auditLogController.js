const AuditLog = require('../models/AuditLog');
exports.getAuditLogs = async (req, res) => {
  const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
  res.json(logs);
};
