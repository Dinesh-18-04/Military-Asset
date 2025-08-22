const express = require('express');
const router = express.Router();
const controller = require('../controllers/baseController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const audit = require('../middleware/audit');

router.get('/', auth, controller.getBases);
router.post('/', auth, rbac('Admin'), audit('Create Base'), controller.createBase);

module.exports = router;
