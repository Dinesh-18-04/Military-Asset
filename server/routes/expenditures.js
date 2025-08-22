const express = require('express');
const router = express.Router();
const controller = require('../controllers/expenditureController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const audit = require('../middleware/audit');

router.get('/', auth, controller.getExpenditures);
router.post('/', auth, rbac('Admin', 'Commander'), audit('Add Expenditure'), controller.addExpenditure);

module.exports = router;
