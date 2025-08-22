const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

router.get('/', auth, purchaseController.getPurchases);
router.post('/', auth, rbac('Admin', 'Logistics'), purchaseController.addPurchase);

module.exports = router;
