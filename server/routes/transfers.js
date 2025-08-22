const express = require('express');
const router = express.Router();
const controller = require('../controllers/transferController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const audit = require('../middleware/audit');

router.get('/', auth, controller.getTransfers);
router.post('/', auth, rbac('Admin', 'Logistics'), audit('Record Transfer'), controller.recordTransfer);

module.exports = router;
