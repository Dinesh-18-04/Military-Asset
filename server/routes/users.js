const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const userController = require('../controllers/userController');

router.get('/', auth, rbac('Admin'), userController.getUsers);

router.post('/', auth, rbac('Admin'), userController.createUser);

module.exports = router;
