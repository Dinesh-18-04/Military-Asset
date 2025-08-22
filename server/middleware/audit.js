

const AuditLog = require('../models/AuditLog');


module.exports = (action) => async (req, res, next) => {
  res.on('finish', async () => {
    if (res.statusCode < 400 && req.user) {
      try {
        await AuditLog.create({
          user: req.user.username,
          action: action,
          details: JSON.stringify({
            method: req.method,
            route: req.originalUrl,
            body: req.body,
            resultId: res.locals?.resultId 
          }),
          timestamp: new Date()
        });
      } catch (err) {
        console.error('Failed to write audit log:', err);
      }
    }
  });

  next();
};
