const express = require('express');
const router = express.Router();
const { getDashboardMetrics } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
router.get('/', auth, rbac('Admin', 'Commander', 'Logistics'), getDashboardMetrics);
module.exports = router;
