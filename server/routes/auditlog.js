const express = require('express');
const router = express.Router();
const controller = require('../controllers/auditLogController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

router.get('/', auth, rbac('Admin'), controller.getAuditLogs);

module.exports = router;
