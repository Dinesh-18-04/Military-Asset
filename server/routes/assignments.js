const express = require('express');
const router = express.Router();
const controller = require('../controllers/assignmentsController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const audit = require('../middleware/audit');

router.get('/', auth, controller.getAssignments);
router.post('/', auth, rbac('Admin', 'Commander'), audit('Assign Asset'), controller.assignAsset);

module.exports = router;
