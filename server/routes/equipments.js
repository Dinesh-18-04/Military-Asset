const express = require('express');
const router = express.Router();
const controller = require('../controllers/equipmentController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const audit = require('../middleware/audit');

router.get('/', auth, controller.getEquipment);
router.post('/', auth, rbac('Admin'), audit('Create Equipment'),controller.createEquipment);

module.exports = router;
